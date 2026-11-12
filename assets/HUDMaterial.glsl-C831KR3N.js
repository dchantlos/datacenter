import{E as e,x as t}from"./vec2-C1aKXbzV.js";import{t as n}from"./vec4f64-DeczMt8m.js";import{r}from"./vec2f64-UJ3ILzaq.js";import{a as i,d as a,f as o,j as s,r as c}from"./floatBlendScale.glsl-BaQhFMcs.js";import{$ as l,Fn as u,Nn as d,Pn as f,Tt as p,W as m,_t as h,bn as g,dn as _,et as v,ft as y,mn as b,nt as x,pt as S,q as ee,tt as C,yt as w}from"./VertexColor.glsl-nQ4npUUV.js";import{E as T,O as E,T as D}from"./WebGLLayer-D_PC2mJl.js";import{a as O}from"./doublePrecisionUtils-BEDeI1Jm.js";import{n as k}from"./FocusArea-YamB2I-8.js";var A=e=>e?k[e]:0;function j(e){let r=new O;r.include(E,e),r.vertex.include(p,e);let{output:k,hasOcclusionTexture:j,signedDistanceFieldEnabled:F,pixelSnappingEnabled:L,hasEmission:R,hasScreenSizePerspective:z,debugDrawLabelBorder:B,hasVVSize:V,hasVVColor:H,hasRotation:U,occludedFragmentFade:W,sampleSignedDistanceFieldTexelCenter:G,hasVertexColor:K,hasVertexSize:q,hasVertexRotation:J,hasVertexUVi:Y}=e;r.include(f),r.include(x,e),r.include(w,e),r.include(m,e);let{vertex:X,fragment:Z}=r;Z.include(C),Z.code.add(a`
    vec4 applyFocusAreaStyle(vec4 color, int style) {
      const float factor = 0.46;
      const float factorBright = 0.32;

      if (style == ${a.int(0)}) {
        float luma = (color.r + color.g + color.b) / 3.0;
        float bright = luma * (1.0 - 0.6 * factorBright) + 0.6 * factorBright * color.a;
        float brightScaled = bright * factorBright;
        return vec4(brightScaled, brightScaled, brightScaled, color.a * factorBright);
      }

      float darkScaled = factor * factor;
      return vec4(color.rgb * darkScaled, color.a * factor);
    }
  `),r.varyings.add(`vcolor`,`vec4`),r.varyings.add(`vtc`,`vec2`),r.varyings.add(`vsize`,`vec2`);let Q=k===10;X.uniforms.add(g,new v(`screenOffset`,(e,n)=>t(P,e.screenOffset[0]*2*n.camera.pixelRatio,e.screenOffset[1]*2*n.camera.pixelRatio)),new v(`anchorPosition`,e=>N(e)),new _(`materialColor`,({color:e})=>e),new i(`materialRotation`,e=>e.rotation),new v(`materialSize`,e=>e.size),new c(`tex`,e=>e.texture)),b(X),F&&(X.uniforms.add(new _(`outlineColor`,e=>e.outlineColor)),Z.uniforms.add(new _(`outlineColor`,e=>M(e)?e.outlineColor:n),new i(`outlineSize`,e=>M(e)?e.outlineSize:0))),L&&X.include(T),z&&(d(X),u(X)),B&&r.varyings.add(`debugBorderCoords`,`vec4`),r.attributes.add(`uv0`,`vec2`),Y&&r.attributes.add(`uvi`,`vec4`),K&&r.attributes.add(`color`,`vec4`),q&&r.attributes.add(`size`,`vec2`),J&&r.attributes.add(`rotation`,`float`),(V||H)&&r.attributes.add(`featureAttribute`,`vec4`),X.main.add(a`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      gl_Position = ${D};
      return;
    }

    vec2 vertexSize = materialSize${o(q,` * size`)};
    vec2 inputSize;
    ${o(z,a`
        inputSize = screenSizePerspectiveScaleVec2(vertexSize, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,a`
        inputSize = vertexSize;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${o(V,a`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);
  `);let te=a`
  ${o(Y,a`
    vec2 texSize = vec2(textureSize(tex, 0));
    vec2 uv = mix(uvi.xy, uvi.zw, bvec2(uv0)) / texSize;
    `,a`
    vec2 uv = mix(vec2(0.), vec2(1.), bvec2(uv0));
    `)}

    quadOffset.xy = (uv0 - anchorPosition) * 2.0 * combinedSize;

    ${o(U,a`
        float angle = radians(materialRotation${o(J,` + rotation`)});
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

        quadOffset.xy = rotate * quadOffset.xy;
      `)}

    quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,ne=L?F?a`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:a`posProj += quadOffset;
if (inputSize.x == vertexSize.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:a`posProj += quadOffset;`;X.include(ee),X.main.add(a`
    ${te}
    ${H?`vcolor = interpolateVVColor(featureAttribute.y) * materialColor;`:K?`vcolor = color * materialColor;`:`vcolor = materialColor;`}

    ${o(k===11,a`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < alphaCutoff;
    ${o(F,`alphaDiscard = alphaDiscard && outlineColor.a < alphaCutoff;`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${ne}
      gl_Position = posProj;
    }

    vtc = uv;

    ${o(B,a`debugBorderCoords = vec4(uv0, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `);let $=s(k)&&e.hasFocusAreaStyle&&!e.draped;switch(Z.uniforms.add(new c(`tex`,e=>e.texture)),$&&Z.uniforms.add(new l(`focusAreaStyle`,e=>A(e.focusAreaStyle))),W&&!Q&&(Z.include(h),Z.uniforms.add(new S(`depthMap`,e=>e.mainDepth),new i(`occludedOpacity`,e=>e.occludedFragmentOpacity?.value??1))),j&&Z.uniforms.add(new S(`texOcclusion`,e=>e.hudOcclusion?.attachment)),B?Z.main.add(`
        float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));
        // don't discard fragments on debug border
        float textureAlphaCutoff = isBorder > 0.0 ? 0.0 : alphaCutoff;
      `):Z.main.add(`float textureAlphaCutoff = alphaCutoff;`),Z.main.add(`vec2 samplePos = vtc;`),G&&Z.main.add(a`float txSize = float(textureSize(tex, 0).x);
float texelSize = 1.0 / txSize;
vec2 scaleFactor = (vsize - txSize) * texelSize;
samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`),F?Z.main.add(a`
      vec4 fillPixelColor = vcolor;

      // Get distance in output units (i.e. pixels)

      float sdf = texture(tex, samplePos).r;
      float pixelDistance = sdf * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - pixelDistance, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(pixelDistance) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < textureAlphaCutoff ||
          fillPixelColor.a + outlinePixelColor.a < alphaCutoff
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
                              vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${o(!Q,a`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < textureAlphaCutoff) {
          discard;
        }

        ${o(!Q,a`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-pixelDistance/vsize.x*2.0, 0.0, 1.0), clamp(pixelDistance/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `):Z.main.add(a`
        vec4 texColor = texture(tex, samplePos, -0.5);
        if (texColor.a < textureAlphaCutoff) {
          discard;
        }
        ${o(!Q,a`fragColor = texColor * premultiplyAlpha(vcolor);`)}
      `),W&&!Q&&Z.main.add(a`
        float zSample = -linearizeDepth(texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x);
        float zFragment = -linearizeDepth(gl_FragCoord.z);
        if (zSample < ${a.float(1-I)} * zFragment) {
          fragColor *= occludedOpacity;
        }
      `),j&&Z.main.add(`fragColor *= texelFetch(texOcclusion, ivec2(gl_FragCoord.xy), 0).r;`),!Q&&B&&Z.main.add(`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`),k===2&&Z.main.add(a`if (fragColor.a < alphaCutoff) {
discard;
}`),$&&Z.main.add(a`fragColor = applyFocusAreaStyle(fragColor, focusAreaStyle);`),s(k)&&R&&Z.main.add(`fragEmission = vec4(0.0);`),k){case 1:Z.main.add(`
        fragColor = vec4(fragColor.rgb * floatBlendOutputScale, fragColor.a);
        fragAlpha = fragColor.a * floatBlendOutputScale;
      `);break;case 2:Z.main.add(`fragColor.rgb /= fragColor.a;`);break;case 11:Z.main.add(`outputObjectAndLayerIdColor();`);break;case 10:r.include(y,e),Z.main.add(`outputHighlight(false);`)}return r}function M(e){return e.outlineColor[3]>0&&e.outlineSize>0}function N(t){return t.textureIsSignedDistanceField?F(t.anchorPosition,t.distanceFieldBoundingBox,P):e(P,t.anchorPosition),P}var P=r();function F(e,n,r){t(r,e[0]*(n[2]-n[0])+n[0],e[1]*(n[3]-n[1])+n[1])}var I=.08,L=Object.freeze(Object.defineProperty({__proto__:null,anchorPosition:N,build:j},Symbol.toStringTag,{value:`Module`}));export{N as n,j as r,L as t};