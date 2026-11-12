import{r as e}from"./vec3f64-BCBDKjuM.js";import{r as t}from"./mat3-CeqJVotA.js";import{r as n,t as r}from"./mat3f64-B6tTkprt.js";import{x as i}from"./vec3-DG5QX2aJ.js";import{r as a}from"./mat4f64-E_FXCKxO.js";import{n as o}from"./vec4f64-DeczMt8m.js";import{n as s}from"./vec2f64-UJ3ILzaq.js";import{a as c,c as l,d as u,f as d,h as f,i as p,j as ee,o as m,r as h,s as g}from"./floatBlendScale.glsl-BaQhFMcs.js";import"./NoParameters-DoG40WO7.js";import{a as _,i as v}from"./getEmissions.glsl-CaJeEji7.js";import{$ as y,An as b,On as te,W as ne,_ as x,at as S,ct as C,dn as re,dt as w,et as ie,fn as T,ft as ae,gn as E,lt as oe,n as D,nt as O,pn as k,q as se,rn as A,t as ce,un as j,ut as M,v as le,wt as N,x as ue,yn as de,yt as fe}from"./VertexColor.glsl-nQ4npUUV.js";import{A as pe,_ as P,d as F,f as I,k as me,l as L,m as R,n as z,r as B,u as V,v as he,x as H,y as U}from"./ReceiveShadowsConfiguration-TZDqAUu3.js";import{a as W,n as ge,r as _e}from"./doublePrecisionUtils-BEDeI1Jm.js";import"./pbrUtils-KhzmWXbI.js";import{t as ve}from"./Float2DrawUniform-DY_6YAL-.js";function G(e,t){switch(e.fragment.code.add(u`vec3 screenDerivativeNormal(vec3 positionView) {
return normalize(cross(dFdx(positionView), dFdy(positionView)));
}`),t.normalType){case 1:e.attributes.add(`normalCompressed`,`vec2`),e.vertex.code.add(u`vec3 decompressNormal(vec2 normal) {
float z = 1.0 - abs(normal.x) - abs(normal.y);
return vec3(normal + sign(normal) * min(z, 0.0), z);
}
vec3 normalModel() {
return decompressNormal(normalCompressed);
}`);break;case 0:e.attributes.add(`normal`,`vec3`),e.vertex.code.add(u`vec3 normalModel() {
return normal;
}`);break;default:t.normalType;case 2:case 3:}}function K(e,t){let{vertex:n,varyings:r}=e;switch(t.normalType){case 0:case 1:e.include(G,t),r.add(`vNormalWorld`,`vec3`),r.add(`vNormalView`,`vec3`),n.uniforms.add(new S(`transformNormalViewFromGlobal`,e=>e.transformNormalViewFromGlobal)),n.code.add(u`void forwardNormal() {
vNormalWorld = normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case 2:e.vertex.code.add(u`void forwardNormal() {}`);break;default:t.normalType;case 3:}}var ye=class extends le{constructor(){super(...arguments),this.transformNormalViewFromGlobal=r()}},be=class extends x{constructor(){super(...arguments),this.toMapSpace=o()}};function q(e){e.vertex.code.add(u`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}var xe=r();function Se(e,n){let{hasModelTransformation:r,instancedDoublePrecision:o,instanced:s,output:c,hasVertexTangents:l}=n;r&&e.vertex.uniforms.add(new pe(`model`,e=>e.modelTransformation??a),new S(`normalLocalOriginFromModel`,e=>(t(xe,e.modelTransformation??a),xe))),s&&o&&(e.attributes.add(`instanceModelOriginHi`,`vec3`),e.attributes.add(`instanceModelOriginLo`,`vec3`),e.attributes.add(`instanceModel`,`mat3`),e.attributes.add(`instanceModelNormal`,`mat3`));let d=e.vertex;o&&(d.include(ue),d.uniforms.add(new E(`viewOriginHi`,e=>ge(i(J,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]),J)),new E(`viewOriginLo`,e=>_e(i(J,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]),J)))),d.code.add(u`
    vec3 getVertexInLocalOriginSpace() {
      return ${r?o?`(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz`:`(model * localPosition()).xyz`:o?`instanceModel * localPosition().xyz`:`localPosition().xyz`};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${o?u`
          // Issue: (should be resolved now with invariant position) https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -instanceModelOriginHi, -instanceModelOriginLo);
          return _pos - originDelta;`:`return vpos;`}
    }

    vec3 dpNormal(vec4 _normal) {
      return normalize(${r?o?`normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)`:`normalLocalOriginFromModel * _normal.xyz`:o?`instanceModelNormal * _normal.xyz`:`_normal.xyz`});
    }
  `),c===4&&d.uniforms.add(te).code.add(u`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${r?o?`vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)`:`vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)`:o?`vec4(instanceModelNormal * _normal.xyz, 1.0)`:`_normal`}).xyz);
    }
    `),l&&d.code.add(u`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${r?o?`return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);`:`return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);`:o?`return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);`:`return _tangent;`}
    }`)}var J=e();function Ce(e,t){t.instancedColor?(e.attributes.add(`instanceColor`,`vec4`),e.vertex.include(w),e.vertex.include(oe),e.vertex.include(M),e.vertex.code.add(u`
      MaskedColor applyInstanceColor(MaskedColor color) {
        return multiplyMaskedColors( color, createMaskedFromUInt8NaNColor(${`instanceColor`}));
      }
    `)):e.vertex.code.add(u`MaskedColor applyInstanceColor(MaskedColor color) {
return color;
}`)}function we(e,t){e.varyings.add(`colorMixMode`,`float`),e.varyings.add(`opacityMixMode`,`float`),e.vertex.uniforms.add(new y(`symbolColorMixMode`,e=>A[e.colorMixMode])),t.hasSymbolColors?(e.vertex.include(w),e.vertex.include(oe),e.vertex.include(M),e.attributes.add(`symbolColor`,`vec4`),e.vertex.code.add(u`
    MaskedColor applySymbolColor(MaskedColor color) {
      return multiplyMaskedColors(color, createMaskedFromUInt8NaNColor(${`symbolColor`}));
    }
  `)):e.vertex.code.add(u`MaskedColor applySymbolColor(MaskedColor color) {
return color;
}`),e.vertex.code.add(u`
    void forwardColorMixMode(bvec4 mask) {
      colorMixMode = float(mask.r ? ${u.int(A.ignore)} : symbolColorMixMode) + 0.5;
      opacityMixMode = float(mask.a ? ${u.int(A.ignore)} : symbolColorMixMode) + 0.5;
    }
  `)}function Y(e,t){let{vertex:n,fragment:r,varyings:i}=e;e.include(Ce,t),e.include(we,t),e.include(ce,t),n.include(w),n.include(C),n.include(se),n.uniforms.add(new re(`externalColor`,e=>e.externalColor,{supportsNaN:!0})),i.add(`vExternalColor`,`vec4`),n.code.add(u`
    void forwardDefaultMaterialExternalColor() {
      forwardVertexColor();

      MaskedColor maskedColor =
        applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

      vExternalColor = maskedColor.color;
      forwardColorMixMode(maskedColor.mask);
    }

    bool shouldCullByOpacity() {
      return int(opacityMixMode) != ${u.int(A.ignore)} && vExternalColor.a < alphaCutoff;
    }
  `),r.include(me),r.uniforms.add(new c(`opacity`,e=>e.opacity),new c(`layerOpacity`,e=>e.layerOpacity)),r.code.add(u`
    float getDefaultMaterialOpacity(float textureOpacity) {
      return layerOpacity * mixExternalOpacity(
        ${d(t.hasVertexColors,`vColor.a * `)} opacity,
        textureOpacity,
        vExternalColor.a,
        int(opacityMixMode)
      );
    }
  `)}function Te(e,t){switch(t.output){case 5:case 6:case 7:case 8:e.fragment.code.add(u`void outputDepth(float _linearDepth){
const float slope_scale = 2.0;
const float bias = 20.0 * .000015259;
float m = max(abs(dFdx(_linearDepth)), abs(dFdy(_linearDepth)));
gl_FragDepth = _linearDepth + slope_scale * m + bias;
}`)}}function X(e,t){De(e,t,new c(`textureAlphaCutoff`,e=>e.textureAlphaCutoff))}function Ee(e,t){De(e,t,new m(`textureAlphaCutoff`,e=>e.textureAlphaCutoff))}function De(e,t,n){let r=e.fragment;switch(r.code.add(`void discardOrAdjustAlpha(inout vec4 color) {`),t.alphaDiscardMode){case 1:r.code.add(`color.a = 1.0;`);break;case 0:t.output!==0&&(r.include(se),r.code.add(`if (color.a < alphaCutoff) discard;`));break;case 3:t.output!==0&&r.uniforms.add(n).code.add(`if (color.a < textureAlphaCutoff) discard;`);break;case 2:r.uniforms.add(n).code.add(`
        if (color.a < textureAlphaCutoff) discard;
        color.a = 1.0;
      `);break;case 4:break;default:t.alphaDiscardMode}r.code.add(`}`)}function Oe(e,t){let{vertex:n,fragment:r,varyings:i}=e,{hasColorTexture:a,alphaDiscardMode:o}=t,s=a&&o!==1,{output:c,normalType:l,hasColorTextureTransform:f}=t;switch(c){case 3:k(n,t),e.include(D),r.include(N,t),e.include(_,t),s&&r.uniforms.add(new h(`tex`,e=>e.texture)),n.main.add(u`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),e.include(X,t),r.main.add(u`
        discardBySlice(vpos);
        ${d(s,u`vec4 texColor = texture(tex, ${f?`colorUV`:`vuv0`});
                discardOrAdjustAlpha(texColor);`)}`);break;case 5:case 6:case 7:case 8:case 11:k(n,t),e.include(D),e.include(_,t),e.include(O,t),e.include(Te,t),r.include(N,t),e.include(fe,t),i.add(`depth`,`float`,{invariant:!0}),s&&r.uniforms.add(new h(`tex`,e=>e.texture)),n.uniforms.add(de).main.add(u`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();`),e.include(X,t),r.main.add(u`
        discardBySlice(vpos);
        ${d(s,u`vec4 texColor = texture(tex, ${f?`colorUV`:`vuv0`});
               discardOrAdjustAlpha(texColor);`)}
        ${c===11?u`outputObjectAndLayerIdColor();`:u`outputDepth(depth);`}`);break;case 4:{k(n,t),e.include(D),e.include(G,t),e.include(K,t),e.include(_,t),e.include(O,t),e.include(Y,t),s&&r.uniforms.add(new h(`tex`,e=>e.texture)),l===2&&i.add(`vPositionView`,`vec3`,{invariant:!0});let a=l===0||l===1;n.main.add(u`
        forwardDefaultMaterialExternalColor();

        if (shouldCullByOpacity()) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = getVertexInLocalOriginSpace();
        ${a?u`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:u`vPositionView = (view * vec4(vpos, 1.0)).xyz;`}
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();`),r.include(N,t),e.include(X,t),r.main.add(u`
        discardBySlice(vpos);
        ${d(s,u`vec4 texColor = texture(tex, ${f?`colorUV`:`vuv0`});
               discardOrAdjustAlpha(texColor);`,u`vec4 texColor = vec4(1.0);`)}
        float opacity = getDefaultMaterialOpacity(texColor.a);

        ${l===2?u`vec3 normal = screenDerivativeNormal(vPositionView);`:u`vec3 normal = normalize(vNormalWorld);
                    if (gl_FrontFacing == false){
                      normal = -normal;
                    }`}
        fragColor = vec4(0.5 + 0.5 * normal, opacity);`);break}case 10:k(n,t),e.include(D),e.include(_,t),e.include(O,t),s&&r.uniforms.add(new h(`tex`,e=>e.texture)),n.main.add(u`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),r.include(N,t),e.include(X,t),e.include(ae,t),r.main.add(u`
        discardBySlice(vpos);
        ${d(s,u`vec4 texColor = texture(tex, ${f?`colorUV`:`vuv0`});
                discardOrAdjustAlpha(texColor);`)}
        calculateOcclusionAndOutputHighlight();`)}}function ke(e,t){return je(e,t)}function Ae(e,t){return je(e,t)}function je(e,t){let r=e.fragment,{hasVertexTangents:i,doubleSidedMode:a,hasNormalTexture:o,textureCoordinateType:c,bindType:l,hasNormalTextureTransform:d}=t;i?(e.attributes.add(`tangent`,`vec4`),e.varyings.add(`vTangent`,`vec4`),a===2?r.code.add(u`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):r.code.add(u`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):r.code.add(u`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),o&&c!==0&&(e.include(v,t),r.uniforms.add(l===1?new h(`normalTexture`,e=>e.textureNormal):new p(`normalTexture`,e=>e.textureNormal)),d&&(r.uniforms.add(l===1?new ie(`scale`,e=>e.scale??s):new ve(`scale`,e=>e.scale??s)),r.uniforms.add(new S(`normalTextureTransformMatrix`,e=>e.normalTextureTransformMatrix??n))),r.code.add(u`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),d&&r.code.add(u`mat3 normalRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),r.code.add(u`return tangentSpace * rawNormal;
}`))}function Me(e,t){let n=e.fragment;switch(t.doubleSidedMode){case 0:n.code.add(`vec3 shadingNormal(vec3 normalView, vec3 viewDirection) { return normalize(normalView); }`);break;case 1:n.code.add(u`vec3 shadingNormal(vec3 normalView, vec3 viewDirection) {
return dot(normalView, viewDirection) > 0.0 ? normalize(-normalView) : normalize(normalView);
}`);break;case 2:n.code.add(u`vec3 shadingNormal(vec3 normalView, vec3 viewDirection) {
return gl_FrontFacing ? normalize(normalView) : normalize(-normalView);
}`);break;default:t.doubleSidedMode;case 3:}}var Ne=class extends f{constructor(){super(...arguments),this.pbrMode=0}};function Z(e,t){let n=t.pbrMode,r=e.fragment;switch(n){case 5:case 3:case 4:case 6:r.code.add(u`void applyPBRFactors() {}`);return;case 0:case 7:r.code.add(u`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);return;case 2:r.code.add(u`float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);return;case 1:{let{hasMetallicRoughnessTexture:n,hasMetallicRoughnessTextureTransform:i,hasOcclusionTexture:a,hasOcclusionTextureTransform:o,bindType:s}=t;(n||a)&&e.include(v,t),r.code.add(`float occlusion;`),n&&r.uniforms.add(s===1?new h(`texMetallicRoughness`,e=>e.textureMetallicRoughness):new p(`texMetallicRoughness`,e=>e.textureMetallicRoughness)),a&&r.uniforms.add(s===1?new h(`texOcclusion`,e=>e.textureOcclusion):new p(`texOcclusion`,e=>e.textureOcclusion)),r.uniforms.add(s===1?new g(`mrrFactors`,e=>e.mrrFactors):new l(`mrrFactors`,e=>e.mrrFactors)),r.include(P),n&&r.code.add(u`void applyMetallicRoughness(vec2 uv) {
vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
mrr[0] *= metallicRoughness.b;
mrr[1] *= metallicRoughness.g;
}`),a&&r.code.add(`void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }`),r.code.add(u`
          float getBakedOcclusion() {
            return ${a?`occlusion`:`1.0`};
          }

          void applyPBRFactors() {
            mrr = mrrFactors;
            occlusion = 1.0;

            ${d(n,`applyMetallicRoughness(${i?`metallicRoughnessUV`:`vuv0`});`)}
            ${d(a,`applyOcclusion(${o?`occlusionUV`:`vuv0`});`)}
          }`)}}}function Pe(e,t){t.hasColorTextureTransform?(e.varyings.add(`colorUV`,`vec2`),e.vertex.uniforms.add(new S(`colorTextureTransformMatrix`,e=>e.colorTextureTransformMatrix??n)).code.add(u`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(u`void forwardColorUV(){}`)}function Fe(e,t){t.hasNormalTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`normalUV`,`vec2`),e.vertex.uniforms.add(new S(`normalTextureTransformMatrix`,e=>e.normalTextureTransformMatrix??n)).code.add(u`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(u`void forwardNormalUV(){}`)}function Q(e,t){t.hasEmissionTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`emissiveUV`,`vec2`),e.vertex.uniforms.add(new S(`emissiveTextureTransformMatrix`,e=>e.emissiveTextureTransformMatrix??n)).code.add(u`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(u`void forwardEmissiveUV(){}`)}function Ie(e,t){t.hasOcclusionTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`occlusionUV`,`vec2`),e.vertex.uniforms.add(new S(`occlusionTextureTransformMatrix`,e=>e.occlusionTextureTransformMatrix??n)).code.add(u`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(u`void forwardOcclusionUV(){}`)}function Le(e,t){t.hasMetallicRoughnessTextureTransform&&t.textureCoordinateType!==0?(e.varyings.add(`metallicRoughnessUV`,`vec2`),e.vertex.uniforms.add(new S(`metallicRoughnessTextureTransformMatrix`,e=>e.metallicRoughnessTextureTransformMatrix??n)).code.add(u`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(u`void forwardMetallicRoughnessUV(){}`)}function $(e,t){t.snowCover&&(e.uniforms.add(new b(`snowCover`,e=>e.snowCover)).code.add(u`float getSnow(vec3 normal, vec3 groundNormal) {
return smoothstep(0.5, 0.55, dot(normal, groundNormal)) * snowCover;
}
float getRealisticTreeSnow(vec3 faceNormal, vec3 shadingNormal, vec3 groundNormal) {
float snow = min(1.0, smoothstep(0.5, 0.55, dot(faceNormal, groundNormal)) +
smoothstep(0.5, 0.55, dot(-faceNormal, groundNormal)) +
smoothstep(0.0, 0.1, dot(shadingNormal, groundNormal)));
return snow * snowCover;
}`),e.include(P),e.code.add(u`void applySnowToMRR(float snow) {
mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
}`))}function Re(e){let t=new W,{attributes:n,vertex:r,fragment:i,varyings:a}=t,{output:o,normalType:s,offsetBackfaces:c,snowCover:l,pbrMode:f,textureAlphaPremultiplied:p,instancedDoublePrecision:m,hasVertexColors:v,hasVertexTangents:y,hasColorTexture:b,hasNormalTexture:te,hasNormalTextureTransform:x,hasColorTextureTransform:S}=e;if(k(r,e),n.add(`position`,`vec3`),r.inputs.add(`position`,()=>`position`),a.add(`vpos`,`vec3`,{invariant:!0}),t.include(O,e),t.include(Se,e),t.include(j,e),t.include(Pe,e),!ee(o))return t.include(Oe,e),t;t.include(Fe,e),t.include(Q,e),t.include(Ie,e),t.include(Le,e),T(r,e),t.include(G,e),t.include(D);let C=s===0||s===1;return C&&c&&t.include(q),t.include(ke,e),t.include(K,e),a.add(`vPositionLocal`,`vec3`),t.include(_,e),t.include(Y,e),t.include(m?B:z,e),r.main.add(u`
    forwardDefaultMaterialExternalColor();

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${d(C,`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`)}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${d(y,`vTangent = dpTransformVertexTangent(tangent);`)}
    gl_Position = transformPosition(proj, view, vpos);
    ${d(C&&c,`gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);`)}

    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (shouldCullByOpacity()) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
    forwardLinearDepthToReadShadow();
  `),i.include(I,e),i.include(H,e),t.include(X,e),i.include(N,e),t.include(ne,e),T(i,e),i.uniforms.add(r.uniforms.get(`localOrigin`),new g(`ambient`,e=>e.ambient),new g(`diffuse`,e=>e.diffuse)),b&&i.uniforms.add(new h(`tex`,e=>e.texture)),t.include(Z,e),i.include(R,e),t.include(Me,e),i.include($,e),i.include(L,e),F(i),i.uniforms.add(V),i.uniforms.add(U).main.add(u`
    discardBySlice(vpos);
    ${b?u`
            vec4 texColor = texture(tex, ${S?`colorUV`:`vuv0`});
            ${d(p,`texColor.rgb /= texColor.a;`)}
            discardOrAdjustAlpha(texColor);`:`vec4 texColor = vec4(1.0);`}
    vec3 viewDirection = normalize(vpos - cameraPosition);
    vec3 posWorld = vpos + localOrigin;
    vec3 upNormal = getLocalUp(posWorld);
    ${s===2?`vec3 normal = screenDerivativeNormal(vPositionLocal);`:`vec3 normal = shadingNormal(vNormalWorld, viewDirection);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
    float shadow = readShadow(additionalAmbientScale, vpos);

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(
      ${d(v,`vColor.rgb *`)} matColor,
      texColor.rgb,
      vExternalColor.rgb,
      int(colorMixMode)
    );
    float opacity_ = getDefaultMaterialOpacity(texColor.a);

    ${te?`mat3 tangentSpace = computeTangentSpace(${y?`normal`:`normal, vpos, vuv0`});
           vec3 shadingNormal = computeTextureNormal(tangentSpace, ${x?`normalUV`:`vuv0`});`:`vec3 shadingNormal = normal;`}

    ${d(l,u`
          float snow = getSnow(normal, upNormal);
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
    ${d((f===1||f===2)&&l,`applySnowToMRR(snow);`)}

    vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, upNormal);
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${d(l,`, snow`)});
  `),t}var ze=Object.freeze(Object.defineProperty({__proto__:null,build:Re},Symbol.toStringTag,{value:`Module`}));function Be(e){let t=new W,{attributes:n,vertex:r,fragment:i,varyings:a}=t,{output:o,offsetBackfaces:s,pbrMode:c,snowCover:l}=e,f=c===1||c===2;if(k(r,e),n.add(`position`,`vec3`),r.inputs.add(`position`,()=>`position`),a.add(`vpos`,`vec3`,{invariant:!0}),t.include(O,e),t.include(Se,e),t.include(j,e),t.include(Pe,e),!ee(o))return t.include(Oe,e),t;t.include(Q,e),T(t.vertex,e),t.include(G,e),t.include(D),s&&t.include(q),a.add(`vNormalWorld`,`vec3`),a.add(`localvpos`,`vec3`,{invariant:!0}),t.include(_,e),t.include(Y,e),t.include(e.instancedDoublePrecision?B:z,e),r.main.add(u`
    forwardDefaultMaterialExternalColor();

    vpos = getVertexInLocalOriginSpace();

    localvpos = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
    vpos = addVerticalOffset(vpos, localOrigin);
    vec4 basePosition = transformPosition(proj, view, vpos);

    forwardTextureCoordinates();
    forwardColorUV();
    forwardEmissiveUV();
    forwardLinearDepthToReadShadow();

    gl_Position = shouldCullByOpacity() ? vec4(1e38, 1e38, 1e38, 1.0) :
    ${d(s,`offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);`,`basePosition;`)}
  `);let{hasColorTexture:p,hasColorTextureTransform:m}=e;return i.include(I,e),i.include(H,e),t.include(X,e),i.include(N,e),t.include(ne,e),T(i,e),F(i),i.uniforms.add(he,V,r.uniforms.get(`localOrigin`),r.uniforms.get(`view`),new g(`ambient`,e=>e.ambient),new g(`diffuse`,e=>e.diffuse)),p&&i.uniforms.add(new h(`tex`,e=>e.texture)),t.include(Z,e),i.include(R,e),i.include($,e),i.include(L,e),i.uniforms.add(U).main.add(u`
    discardBySlice(vpos);
    vec4 texColor = ${p?`texture(tex, ${m?`colorUV`:`vuv0`})`:` vec4(1.0)`};
    ${d(p,`${d(e.textureAlphaPremultiplied,`texColor.rgb /= texColor.a;`)}
      discardOrAdjustAlpha(texColor);`)}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse();
    ssao *= getBakedOcclusion();

    float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
    float shadow = readShadow(additionalAmbientScale, vpos);
    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(
      ${d(e.hasVertexColors,`vColor.rgb * `)} matColor,
      texColor.rgb,
      vExternalColor.rgb,
      int(colorMixMode)
    );
    float opacity_ = getDefaultMaterialOpacity(texColor.a);

    vec3 shadingNormal = normalize(vNormalWorld);
    vec3 viewDirection = normalize(vpos - cameraPosition);
    vec3 upNormal = getLocalUp(vpos, localOrigin);

    ${d(l,`vec3 faceNormal = screenDerivativeNormal(vpos);
        float snow = getRealisticTreeSnow(faceNormal, shadingNormal, upNormal);
        albedo = mix(albedo, vec3(1), snow);`)}

    ${u`albedo *= 1.2;
            vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
            float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
            float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
            float treeRadialFalloff = vColor.r;
            float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
            additionalLight += backLightFactor * mainLightIntensity;`}

    ${d(f&&l,`applySnowToMRR(snow);`)}

    vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, upNormal);
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${d(l,`, 1.0`)});
  `),t}var Ve=Object.freeze(Object.defineProperty({__proto__:null,build:Be},Symbol.toStringTag,{value:`Module`}));export{$ as a,Me as c,Te as d,q as f,G as g,K as h,ze as i,Ae as l,be as m,Be as n,Ne as o,ye as p,Re as r,Z as s,Ve as t,Ee as u};