import{r as e}from"./vec3f64-BCBDKjuM.js";import{a as t,d as n,f as r,s as i}from"./floatBlendScale.glsl-BaQhFMcs.js";import{n as a}from"./NoParameters-DoG40WO7.js";import{Cn as o,Tn as s,_n as c,_t as l,et as u,vn as d,xt as f,yn as p}from"./VertexColor.glsl-nQ4npUUV.js";import{T as m}from"./WebGLLayer-D_PC2mJl.js";import{t as h}from"./Texture2DUintPassUniform-B09VlqcS.js";import{a as g,i as _}from"./GaussianSplatSortWorker-B7tmj7yl.js";var v=.25,y=.00122072;function b(e){e.code.add(n`vec3 computeProjectedGaussianCovariance2D(
vec3 pixelXGradient,
vec3 pixelYGradient,
vec3 scale,
mat3 rotation,
mat4 view
) {
mat3 viewToWorld = transpose(mat3(view));
vec3 scaledAxisX = scale * (rotation * (viewToWorld * pixelXGradient));
vec3 scaledAxisY = scale * (rotation * (viewToWorld * pixelYGradient));
return vec3(dot(scaledAxisX, scaledAxisX), dot(scaledAxisX, scaledAxisY), dot(scaledAxisY, scaledAxisY));
}
float regularizeGaussianCovariance(inout vec3 covariance2D) {
float originalDeterminant = covariance2D.x * covariance2D.z - covariance2D.y * covariance2D.y;
const float covarianceRegularization = 0.3;
covariance2D.x += covarianceRegularization;
covariance2D.z += covarianceRegularization;
float regularizedDeterminant = covariance2D.x * covariance2D.z - covariance2D.y * covariance2D.y;
return sqrt(max(0.0, originalDeterminant / regularizedDeterminant));
}
vec3 computeGaussianCovariance2D(
vec3 viewSpaceCenter,
float focalLength,
vec2 tanFov,
vec3 scale,
mat3 rotation,
mat4 view
) {
vec4 viewSpacePoint = vec4(viewSpaceCenter, 1);
vec2 clampLimit = 1.3 * tanFov;
vec2 normalized = viewSpacePoint.xy / viewSpacePoint.z;
viewSpacePoint.xy = clamp(normalized, -clampLimit, clampLimit) * viewSpacePoint.z;
float invZ = 1.0 / viewSpacePoint.z;
float invZSquared = invZ * invZ;
vec3 pixelXGradient = vec3(focalLength * invZ, 0.0, -(focalLength * viewSpacePoint.x) * invZSquared);
vec3 pixelYGradient = vec3(0.0, focalLength * invZ, -(focalLength * viewSpacePoint.y) * invZSquared);
return computeProjectedGaussianCovariance2D(pixelXGradient, pixelYGradient, scale, rotation, view);
}`)}function x(e){e.code.add(n`float computeGaussianCovarianceDeterminant(vec3 covariance2D) {
return covariance2D.x * covariance2D.z - covariance2D.y * covariance2D.y;
}
vec2 computeGaussianCovarianceEigenvalues(vec3 covariance2D) {
float mid = 0.5 * (covariance2D.x + covariance2D.z);
float radius = length(vec2((covariance2D.x - covariance2D.z) * 0.5, covariance2D.y));
return vec2(mid + radius, mid - radius);
}
float computeGaussianEllipseThreshold(float gaussianLogAlphaCutoff) {
return max(0.0, -2.0 * gaussianLogAlphaCutoff);
}
bool rejectGaussianByMinimumRadius(float maxRadius, float opacity, float minSplatRadius) {
return minSplatRadius > 0.0 && maxRadius * opacity < minSplatRadius;
}
vec2 computeGaussianScreenRadii(vec3 covariance2D, float gaussianEllipseThreshold) {
return ceil(sqrt(covariance2D.xz * gaussianEllipseThreshold));
}
bool rejectGaussianByScreenBounds(vec2 ndcPosition, vec2 screenRadii, vec2 clipSpacePixelScale) {
vec2 radiusNDC = screenRadii * clipSpacePixelScale;
return any(greaterThan(abs(ndcPosition) - radiusNDC, vec2(1.0)));
}
vec2 computeGaussianUnitQuadCorner(int vertexID) {
return vec2((vertexID << 1) & 2, vertexID & 2) - 1.0;
}
float evaluateGaussianExponent(vec2 canonicalCoordinates) {
return -0.5 * dot(canonicalCoordinates, canonicalCoordinates);
}`)}function S(e){e.code.add(n`
    uint fetchOrderedGaussianIndex(uint instanceID) {
      uint orderTextureWidth = uint(textureSize(splatOrderTexture, 0).x);
      uint x = instanceID % orderTextureWidth;
      uint y = instanceID / orderTextureWidth;

      return texelFetch(splatOrderTexture, ivec2(x, y), 0).r;
    }

    uvec4 fetchPackedGaussian(uint gaussianIndex) {
      uint gaussianIndexX = gaussianIndex & ${n.uint(C)};
      uint gaussianIndexY = gaussianIndex >> ${n.uint(w)};

      return texelFetch(splatAtlasTexture, ivec2(gaussianIndexX, gaussianIndexY), 0);
    }

    uint fetchGaussianPageIndex(uint gaussianIndex) {
      return gaussianIndex >> ${n.uint(T)};
    }

    uvec4 fetchPackedGaussianHeader(uint gaussianIndex) {
      uint pageIndex = fetchGaussianPageIndex(gaussianIndex);
      uint headerTextureWidth = uint(textureSize(splatHeaderTexture, 0).x);
      uint headerIndexX = pageIndex % headerTextureWidth;
      uint headerIndexY = pageIndex / headerTextureWidth;

      return texelFetch(splatHeaderTexture, ivec2(headerIndexX, headerIndexY), 0);
    }

    vec3 fetchGaussianCameraRelativePosition(uint gaussianIndex, uvec4 packedGaussian) {
      uvec4 packedHeader = fetchPackedGaussianHeader(gaussianIndex);
      vec3 tileOriginRelativePosition = unpackTileOriginRelativePosition(packedGaussian);

      return unpackCameraRelativeGaussianPosition(packedHeader, tileOriginRelativePosition);
    }
  `)}var C=_-1,w=Math.log2(_),T=Math.log2(g),E=class extends a{constructor(){super(...arguments),this.tileCameraPosition=e(),this.cameraDelta=e()}};function D(e){e.code.add(n`float unpackOpacity(uvec4 packedGaussian) {
return float((packedGaussian.w >> 24u) & 0xffu) / 255.0;
}
vec4 unpackColor(uvec4 packedGaussian) {
vec4 color;
color.r = float((packedGaussian.w >> 1u) & 0xfeu);
color.g = float((packedGaussian.w >> 9u) & 0xffu);
color.b = float((packedGaussian.w >> 16u) & 0xfeu);
color.a = float((packedGaussian.w >> 24u) & 0xffu);
return color / 255.0;
}`),e.code.add(n`vec3 unpackScale(uvec4 packedGaussian) {
uint sx = (packedGaussian.z >> 10u) & 0xffu;
uint sy = (packedGaussian.z >> 18u) & 0xffu;
uint szLow = (packedGaussian.z >> 26u) & 0x3fu;
uint szHigh = packedGaussian.a & 0x3u;
uint sz = szLow | (szHigh << 6u);
return exp(vec3(sx, sy, sz) / 16.0 - 10.0);
}`),e.code.add(n`const uint MASK_9_BITS = 0x1FFu;
const float SQRT_HALF = 0.7071067811865476;
vec4 unpackQuaternion(uvec4 packedGaussian) {
uint packedRotation = packedGaussian.x;
uint largestComponent = packedRotation >> 30u;
uvec3 bitfields = uvec3(packedRotation) >> uvec3(0u, 10u, 20u);
vec3 components = SQRT_HALF * vec3(bitfields & uvec3(MASK_9_BITS)) / float(MASK_9_BITS);
components = mix(components, -components, notEqual((bitfields >> 9u) & uvec3(1u), uvec3(0u)));
vec4 quaternion = vec4(components, sqrt(1.0 - dot(components, components)));
return largestComponent == 0u ? quaternion.wzyx :
largestComponent == 1u ? quaternion.zwyx :
largestComponent == 2u ? quaternion.zywx : quaternion.zyxw;
}`),e.code.add(n`vec3 unpackTileOriginRelativePosition(uvec4 packedGaussian) {
uint packedPositionLow = packedGaussian.y;
uint packedPositionHigh = packedGaussian.z;
uint x = packedPositionLow & 0x3FFFu;
uint y = (packedPositionLow >> 14u) & 0x3FFFu;
uint zLow = (packedPositionLow >> 28u) & 0xFu;
uint zHigh = packedPositionHigh & 0x3FFu;
uint z = zLow | (zHigh << 4u);
return vec3(float(x), float(y), float(z));
}`),e.uniforms.add(new i(`tileCameraPosition`,e=>e.tileCameraPosition),new i(`cameraDelta`,e=>e.cameraDelta)).code.add(n`vec3 unpackCameraRelativeGaussianPosition(uvec4 packedHeader, highp vec3 position) {
vec3 tileOrigin = uintBitsToFloat(packedHeader.xyz);
float invPosScale = 1.0 / exp2(float(packedHeader.w & 0xfu));
vec3 delta = tileOrigin.xyz - tileCameraPosition;
vec3 cameraRelativePosition = position * invPosScale + delta * 2.048 - cameraDelta;
return cameraRelativePosition;
}`)}function O(e){e.code.add(n`mat3 quaternionToRotationMatrix(vec4 q) {
float x2 = q.x + q.x;
float y2 = q.y + q.y;
float z2 = q.z + q.z;
float xx = x2 * q.x;
float yy = y2 * q.y;
float zz = z2 * q.z;
float xy = x2 * q.y;
float xz = x2 * q.z;
float yz = y2 * q.z;
float wx = x2 * q.w;
float wy = y2 * q.w;
float wz = z2 * q.w;
return mat3(
1.0 - (yy + zz), xy - wz, xz + wy,
xy + wz, 1.0 - (xx + zz), yz - wx,
xz - wy, yz + wx, 1.0 - (xx + yy)
);
}`)}function k(e,r){let{clippingEnabled:a}=r,{fragment:o,varyings:l,vertex:u}=e;l.add(`gaussianCoordinates`,`vec2`),l.add(`gaussianLogAlphaCutoff`,`float`),l.add(`fragmentPositionCameraRelative`,`vec3`),u.uniforms.add(new h(`splatOrderTexture`,e=>e.splatOrder),new h(`splatAtlasTexture`,e=>e.splatAtlas),new h(`splatHeaderTexture`,e=>e.splatHeader),new t(`minSplatRadius`,e=>e.minSplatRadius),c,d,s,p),a&&(u.uniforms.add(new i(`clipMin`,e=>e.clipMinCameraRelative),new i(`clipMax`,e=>e.clipMaxCameraRelative)),o.uniforms.add(new i(`clipMin`,e=>e.clipMinCameraRelative),new i(`clipMax`,e=>e.clipMaxCameraRelative))),u.include(D),u.include(S),u.include(O),u.include(b),u.include(x),u.include(f,r),o.include(x),o.include(f,r),o.main.add(n`
    ${z(r)}
  `)}function A(e,r){e.include(k,r),e.vertex.uniforms.add(new t(`focalLength`,e=>e.focalLength),new u(`tanFov`,e=>e.tanFov)),r.preciseDepth?(e.include(j),e.vertex.uniforms.add(o),e.fragment.include(l),e.fragment.code.add(n`float gaussianSplatDepth() {
float rayDepth = gaussianSplatRayDepth();
return delinearizeDepth(-rayDepth);
}`)):e.fragment.code.add(n`float gaussianSplatDepth() {
return gl_FragCoord.z;
}`)}function j(e){e.varyings.add(`rayGaussianFactor`,`vec4`),e.vertex.code.add(n`vec3 reconstructViewRay(vec2 clipPosition, mat4 inverseProjection) {
vec3 rayViewPoint = (inverseProjection * vec4(clipPosition, -1.0, 1.0)).xyz;
return vec3(-rayViewPoint.xy / rayViewPoint.z, -1.0);
}
vec4 computeGaussianRayFactor(
vec3 rayView,
vec3 cameraRelativePosition,
vec3 gaussianScale,
mat3 gaussianRotation,
mat3 viewRotation
) {
vec3 inverseGaussianScale = 1.0 / gaussianScale;
vec3 rayGaussianFactorCenter = (gaussianRotation * cameraRelativePosition) * inverseGaussianScale;
vec3 rayGaussianFactorRay = (gaussianRotation * (transpose(viewRotation) * rayView)) * inverseGaussianScale;
return vec4(rayGaussianFactorRay, dot(rayGaussianFactorCenter, rayGaussianFactorRay));
}`);let t=n`float gaussianSplatRayDepth() {
return rayGaussianFactor.w / dot(rayGaussianFactor.xyz, rayGaussianFactor.xyz);
}`;e.vertex.code.add(t),e.fragment.code.add(t)}function M(e){e.uniforms.add(new h(`splatFadingTexture`,e=>e.splatFading)),e.code.add(n`float applyGaussianSplatFading(float opacity, uint gaussianIndex) {
uint pageIndex = fetchGaussianPageIndex(gaussianIndex);
uint fadingTextureWidth = uint(textureSize(splatFadingTexture, 0).x);
uint fadeX = pageIndex % fadingTextureWidth;
uint fadeY = pageIndex / fadingTextureWidth;
uint opacityModifier = texelFetch(splatFadingTexture, ivec2(fadeX, fadeY), 0).r;
return opacity * float(opacityModifier) / 255.0;
}`)}function N(e,t){let{clippingEnabled:i,hasSlicePlane:a}=e;return n`
    gl_Position = ${m};

    if (opacity < ${t}) {
      return;
    }

    vec3 cameraRelativePosition = fetchGaussianCameraRelativePosition(gaussianIndex, packedGaussian);

    ${r(i,n`
        if (cameraRelativePosition.x < clipMin.x || cameraRelativePosition.y < clipMin.y || cameraRelativePosition.z < clipMin.z ||
          cameraRelativePosition.x > clipMax.x || cameraRelativePosition.y > clipMax.y || cameraRelativePosition.z > clipMax.z) {
          return;
        }
      `)}

    ${r(a,n`
        if (rejectBySlice(cameraRelativePosition)) {
          return;
        }
      `)}

    vec4 viewPos = vec4(mat3(view) * cameraRelativePosition, 1.0);

    if (viewPos.z > -nearFar.x || viewPos.z < -nearFar.y) {
      return;
    }
  `}var P=n`vec3 gaussianScale = unpackScale(packedGaussian);
mat3 gaussianRotation = quaternionToRotationMatrix(unpackQuaternion(packedGaussian));`;function F(e,t){return n`
    float determinant = computeGaussianCovarianceDeterminant(covariance2D);
    if (determinant <= 0.0) {
      return;
    }

    vec2 eigenvalues = computeGaussianCovarianceEigenvalues(covariance2D);
    gaussianLogAlphaCutoff = ${e};
    float gaussianEllipseThreshold = computeGaussianEllipseThreshold(gaussianLogAlphaCutoff);
    vec2 screenRadii = computeGaussianScreenRadii(covariance2D, gaussianEllipseThreshold);
    float maxRadius = ceil(sqrt(eigenvalues.x * gaussianEllipseThreshold));

    if (rejectGaussianByMinimumRadius(maxRadius, ${t}, minSplatRadius)) {
      return;
    }
  `}var I=n`vec2 clipSpacePixelScale = 2.0 * inverseScreenSize;
if (rejectGaussianByScreenBounds(ndcPos.xy, screenRadii, clipSpacePixelScale)) {
return;
}
vec2 quadCorner = computeGaussianUnitQuadCorner(gl_VertexID);
gaussianCoordinates = quadCorner * sqrt(gaussianEllipseThreshold);
float inverseRadiusX = inversesqrt(covariance2D.x);
vec2 choleskyAxisX = covariance2D.xy * inverseRadiusX;
vec2 choleskyAxisY = vec2(0.0, sqrt(determinant) * inverseRadiusX);
vec2 offsetFromCenter = gaussianCoordinates.x * choleskyAxisX + gaussianCoordinates.y * choleskyAxisY;`;function L(e,t){return n`
    ${N(e,n.float(t))}

    ${P}
    vec3 covariance2D = computeGaussianCovariance2D(viewPos.xyz, focalLength, tanFov, gaussianScale, gaussianRotation, view);
    float minimumRadiusOpacity = opacity;
    float opacityScale = regularizeGaussianCovariance(covariance2D);
    opacity *= opacityScale;
    if (opacity < ${n.float(t)}) {
      return;
    }

    ${F(`${n.float(Math.log(t))} - log(opacity)`,`minimumRadiusOpacity`)}
    ${R(e)}
  `}function R(e){return n`
    vec4 projPos = proj * viewPos;
    float invW = 1.0 / (projPos.w + 1e-7);
    vec3 ndcPos = projPos.xyz * invW;
    ${I}

    float viewSpacePixelScale = -viewPos.z / focalLength;
    vec3 fragmentViewOffset = vec3(offsetFromCenter * viewSpacePixelScale, 0.0);
    fragmentPositionCameraRelative = cameraRelativePosition + transpose(mat3(view)) * fragmentViewOffset;

    vec2 quadClipPosition = ndcPos.xy + offsetFromCenter * clipSpacePixelScale - inverseScreenSize;
    ${r(e.preciseDepth,n`
        vec3 rayView = reconstructViewRay(quadClipPosition, inverseProjectionMatrix);
        rayGaussianFactor = computeGaussianRayFactor(
          rayView, cameraRelativePosition, gaussianScale, gaussianRotation, mat3(view)
        );
      `)}
    gl_Position = vec4(quadClipPosition, ndcPos.z, 1.0);
  `}function z(e){let{clippingEnabled:t,hasSlicePlane:i}=e;return n`
    ${r(t,n`
        if (fragmentPositionCameraRelative.x < clipMin.x || fragmentPositionCameraRelative.y < clipMin.y || fragmentPositionCameraRelative.z < clipMin.z ||
          fragmentPositionCameraRelative.x > clipMax.x || fragmentPositionCameraRelative.y > clipMax.y || fragmentPositionCameraRelative.z > clipMax.z) {
          discard;
        }
      `)}
    ${r(i,n`if (rejectBySlice(fragmentPositionCameraRelative)) { discard; }`)}

    float gaussianExponent = evaluateGaussianExponent(gaussianCoordinates);
    if (gaussianExponent > 0.0 || gaussianExponent < gaussianLogAlphaCutoff) {
      discard;
    }
  `}export{F as a,j as c,v as d,y as f,M as i,k as l,L as n,A as o,I as r,P as s,N as t,E as u};