import { Matrix4 } from "@math.gl/core";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import { version } from "@arcgis/core/kernel.js";
import type SceneView from "@arcgis/core/views/SceneView.js";
import RenderNode from "@arcgis/core/views/3d/webgl/RenderNode.js";
import { fromRenderCoordinates, renderCoordinateTransformAt } from "@arcgis/core/views/3d/webgl.js";
import { FLOATS_PER_VERTEX, type ExplodeBatch, type ExplodeGeometry, type Vec3 } from "./geometry";
import type { ExplodePose } from "./pose";

const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aColor;
layout(location=3) in vec3 aMotion;
uniform mat4 uModelView;
uniform mat4 uProjection;
uniform vec2 uAxes;
out vec3 vNormal;
out vec4 vColor;
void main() {
  vec3 p = aPosition + aMotion * vec3(uAxes.x, uAxes.x, uAxes.y);
  gl_Position = uProjection * uModelView * vec4(p, 1.0);
  vNormal = mat3(uModelView) * aNormal;
  vColor = aColor;
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec4 vColor;
layout(location=0) out vec4 color;
void main() {
  if (vColor.a < 0.005) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  float light = 0.38 + 0.62 * max(dot(n, normalize(vec3(0.3, 0.55, 0.8))), 0.0);
  color = vec4(vColor.rgb * light, vColor.a);
}`;

interface GpuBatch extends ExplodeBatch {
  vao: WebGLVertexArrayObject;
  buffer: WebGLBuffer;
}

interface Resources {
  program: WebGLProgram;
  batches: GpuBatch[];
  modelView: WebGLUniformLocation;
  projection: WebGLUniformLocation;
  axes: WebGLUniformLocation;
}

interface Options {
  view: SceneView;
  origins: Vec3[];
  geometry: ExplodeGeometry;
  onFrame: (pose: ExplodePose) => void;
  onError: (error: Error) => void;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not allocate an explode shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Explode shader compilation failed: ${message}`);
  }
  return shader;
}

function uniform(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
  const location = gl.getUniformLocation(program, name);
  if (!location) throw new Error(`The explode shader is missing ${name}.`);
  return location;
}

/** ArcGIS 5.2 adapter: each building retains the same local vertex space as its native Mesh. */
export function createExplodeRenderer({ view, origins, geometry, onFrame, onError }: Options) {
  if (!/^5\.2(?:\.|$)/.test(version)) throw new Error("The Podium explode preview requires the tested ArcGIS Maps SDK 5.2 runtime.");
  const models = origins.map((origin) => {
    const matrix = renderCoordinateTransformAt(view, origin, SpatialReference.WGS84, new Float64Array(16));
    if (!matrix) throw new Error("Could not align the explode preview with this 3D view.");
    // Matrix4's constructor ignores typed arrays; copy preserves ArcGIS's Float64 transform.
    return new Matrix4().copy(matrix);
  });
  let resources: Resources | null = null;
  let lastGl: WebGL2RenderingContext | null = null;
  let enabled = false;
  let destroyed = false;
  let failed = false;
  let pose: ExplodePose = { vertical: 0, horizontal: 0 };
  let frames = 0;
  let uploads = 0;
  let canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  let resolveReady!: () => void;
  let rejectReady!: (error: Error) => void;
  const ready = new Promise<void>((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });

  function dispose() {
    if (!resources || !lastGl) return;
    for (const batch of resources.batches) {
      lastGl.deleteBuffer(batch.buffer);
      lastGl.deleteVertexArray(batch.vao);
    }
    lastGl.deleteProgram(resources.program);
    resources = null;
  }

  function upload(gl: WebGL2RenderingContext) {
    lastGl = gl;
    const shaders: WebGLShader[] = [];
    const buffers: GpuBatch[] = [];
    const program = gl.createProgram();
    if (!program) throw new Error("Could not allocate the explode shader program.");
    try {
      shaders.push(compile(gl, gl.VERTEX_SHADER, VERTEX));
      shaders.push(compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
      for (const shader of shaders) gl.attachShader(program, shader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Explode shader link failed: ${gl.getProgramInfoLog(program)}`);
      const result: Resources = {
        program, batches: buffers,
        modelView: uniform(gl, program, "uModelView"),
        projection: uniform(gl, program, "uProjection"),
        axes: uniform(gl, program, "uAxes"),
      };
      for (const batch of geometry.batches) {
        const vao = gl.createVertexArray();
        const buffer = gl.createBuffer();
        if (!vao || !buffer) {
          if (vao) gl.deleteVertexArray(vao);
          if (buffer) gl.deleteBuffer(buffer);
          throw new Error("Could not allocate the explode geometry buffers.");
        }
        buffers.push({ ...batch, vao, buffer });
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, batch.data, gl.STATIC_DRAW);
        uploads++;
        for (const [location, size, offset] of [[0, 3, 0], [1, 3, 12], [2, 4, 24], [3, 3, 40]]) {
          gl.enableVertexAttribArray(location);
          gl.vertexAttribPointer(location, size, gl.FLOAT, false, FLOATS_PER_VERTEX * 4, offset);
        }
      }
      const error = gl.getError();
      if (error !== gl.NO_ERROR) throw new Error(`Could not upload the explode geometry (WebGL ${error}).`);
      return result;
    } catch (error) {
      for (const batch of buffers) {
        gl.deleteBuffer(batch.buffer);
        gl.deleteVertexArray(batch.vao);
      }
      gl.deleteProgram(program);
      throw error;
    } finally {
      for (const shader of shaders) gl.deleteShader(shader);
      gl.bindVertexArray(null);
    }
  }

  const Node = RenderNode.createSubclass({
    initialize(this: RenderNode) {
      this.consumes.required.push("opaque-color");
      this.produces = "opaque-color";
    },
    render(this: RenderNode) {
      this.resetWebGLState();
      const output = this.bindRenderTarget();
      const gl = this.gl;
      if (destroyed || failed || gl.isContextLost()) return output;
      try {
        if (!canvas) {
          canvas = gl.canvas;
          canvas.addEventListener("webglcontextrestored", restored);
        }
        const gpu = resources ?? (resources = upload(gl));
        if (enabled) {
          const camera = this.camera;
          const modelViews = models.map((model) => new Matrix4().copy(camera.viewMatrix).multiplyRight(model));
          // bindRenderTarget owns the viewport, including the SceneView's padding.
          gl.enable(gl.DEPTH_TEST);
          gl.disable(gl.CULL_FACE);
          gl.useProgram(gpu.program);
          gl.uniformMatrix4fv(gpu.projection, false, new Matrix4().copy(camera.projectionMatrix));
          gl.uniform2f(gpu.axes, pose.horizontal, pose.vertical);
          const depth = (b: GpuBatch) => {
            const m = modelViews[b.building];
            return m[2] * b.center[0] + m[6] * b.center[1] + m[10] * b.center[2] + m[14];
          };
          const ordered = [...gpu.batches].sort((a, b) => Number(a.transparent) - Number(b.transparent) || (a.transparent ? depth(a) - depth(b) : 0));
          for (const batch of ordered) {
            if (batch.transparent) {
              gl.enable(gl.BLEND);
              gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              gl.depthMask(false);
            } else {
              gl.disable(gl.BLEND);
              gl.depthMask(true);
            }
            gl.uniformMatrix4fv(gpu.modelView, false, modelViews[batch.building]);
            gl.bindVertexArray(batch.vao);
            gl.drawArrays(gl.TRIANGLES, 0, batch.data.length / FLOATS_PER_VERTEX);
          }
          frames++;
          const rendered = { ...pose };
          queueMicrotask(() => { if (!destroyed) onFrame(rendered); });
        }
        resolveReady();
      } catch (error) {
        failed = true;
        dispose();
        const failure = error instanceof Error ? error : new Error(String(error));
        rejectReady(failure);
        queueMicrotask(() => { if (!destroyed) onError(failure); });
      } finally {
        gl.bindVertexArray(null);
        gl.depthMask(true);
        this.resetWebGLState();
      }
      return output;
    },
  });
  const node = new Node({ view });
  if (!(node instanceof RenderNode)) throw new Error("The ArcGIS runtime could not create the explode render node.");
  // The verified 5.2 immediate-input overload; ordinary requests are throttled under reduced motion.
  const request: (priority: 1) => void = node.requestRender.bind(node);
  const requestFrame = () => { if (!destroyed) request(1); };
  function restored() {
    resources = null;
    failed = false;
    requestFrame();
  }
  requestFrame();

  return {
    ready,
    setEnabled(value: boolean) { enabled = value; requestFrame(); },
    setAmounts(next: ExplodePose) {
      if (next.vertical === pose.vertical && next.horizontal === pose.horizontal) return;
      pose = { ...next };
      requestFrame();
    },
    mapPoint(building: number, point: Vec3): Vec3 {
      const model = models[building];
      const world = model.transformAsPoint(point);
      const out = new Float64Array(3);
      if (!fromRenderCoordinates(view, world, 0, out, 0, view.spatialReference, 1)) throw new Error("Could not locate the exploded design in the 3D view.");
      return [out[0], out[1], out[2]];
    },
    diagnostics() { return { enabled, frames, uploads, batches: geometry.batches.length, vertices: geometry.vertices, components: geometry.components.length, bytes: geometry.bytes }; },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      canvas?.removeEventListener("webglcontextrestored", restored);
      dispose();
      node.destroy();
      rejectReady(new DOMException("Explode preview removed.", "AbortError"));
    },
  };
}

export type ExplodeRenderer = ReturnType<typeof createExplodeRenderer>;
