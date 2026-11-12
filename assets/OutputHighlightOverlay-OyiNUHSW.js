import{B as e,L as t,z as n}from"./aaBoundingRect-B3dpiuzo.js";import{n as r}from"./vec4f64-DeczMt8m.js";import{a as i,d as a,j as o,l as s,r as c}from"./floatBlendScale.glsl-BaQhFMcs.js";import{ft as l}from"./VertexColor.glsl-DBvnzl1f.js";import{n as u}from"./emissions-BhZVvbcf.js";import{v as d,y as f}from"./ReceiveShadowsConfiguration-nADLd5TO.js";import{t as p}from"./Texture2DUintPassUniform-B09VlqcS.js";import{s as m}from"./blendEmission.glsl-CESWteoX.js";var h=class extends s{constructor(e,t,n){super(e,`vec4`,2,(r,i,a)=>r.setUniform4fv(e,t(i,a),n))}};function g(e,t){let{vertex:n,fragment:r}=e;n.uniforms.add(new h(`overlayTexOffset`,(e,n)=>w(t.spherical,e,n)),new h(`overlayTexScale`,(e,n)=>T(t.spherical,e,n))),r.uniforms.add(new h(`overlayTexOffset`,(e,n)=>w(t.spherical,e,n)),new h(`overlayTexScale`,(e,n)=>T(t.spherical,e,n))),r.constants.add(`overlayOpacity`,`float`,1),r.uniforms.add(new c(`ovColorTex`,(e,n)=>_(e,n,t.isGround===!0))),S(e,t)}function _(e,t,n){let r=v(e,t,n);return r==null?null:t.overlay?.getTexture(r)}function v(e,t,n){return e.identifier===0?o(t.output)?!e.occludedGround||t.overlay?.allSourcesOccluders?y(n):4:t.output===3||t.output===4?y(n):t.output===11?5:null:e.identifier===2?2:null}function y(e){return+!e}function b(e,t){let{vertex:n,fragment:r}=e;n.uniforms.add(new D(`overlayTexOffset`),new D(`overlayTexScale`)),r.uniforms.add(new i(`overlayOpacity`,e=>e.overlayOpacity)),t.output!==10&&r.uniforms.add(new c(`ovColorTex`,(e,t)=>t.overlay?.getTexture(e.overlayContent))),S(e,t)}function x(e,t){switch(e){case 0:case 1:case 2:return t.slot===9&&!t.overlay?.allSourcesOccluders?4:0;case 3:case 4:return 0;case 10:return 2;case 5:case 7:case 8:case 9:return null;case 11:return 5}return null}function S(e,t){let{hasWater:n,output:r}=t;n&&e.include(u,t);let{vertex:i,fragment:o,varyings:s}=e;s.add(`vtcOverlay`,`vec4`);let c=r===10;i.code.add(a`void setOverlayVTC(in vec2 uv) {
vtcOverlay = vec4(uv, uv) * overlayTexScale + overlayTexOffset;
}`),o.code.add(a`bool isValid(vec2 uv, vec2 dxdy) {
return (uv.x >= 0.0 + dxdy.x) && (uv.x <= 1.0 - dxdy.x) && (uv.y >= 0.0 + dxdy.y) && (uv.y <= 1.0 - dxdy.y);
}
vec4 getOverlayColor(sampler2D ov0Tex, vec4 texCoords) {
vec4 color0 = texture(ov0Tex, vec2(texCoords.x * 0.5, texCoords.y));
vec4 color1 = texture(ov0Tex, vec2(texCoords.z * 0.5 + 0.5, texCoords.w));
bool isValid0 = isValid(texCoords.xy, fwidth(texCoords.xy));
bool isValid1 = isValid(texCoords.zw, vec2(0.0, 0.0));
return mix(color1 * float(isValid1), color0, float(isValid0));
}`),c?o.uniforms.add(new p(`overlayHighlightTexture`,(e,t)=>t.overlay?.getTexture(2))).code.add(a`uvec2 getAllOverlayHighlightValuesEncoded(vec4 texCoords) {
vec2 uvInner = texCoords.xy;
vec2 uvOuter = texCoords.zw;
bool isValidInner = isValid(uvInner, fwidth(uvInner));
bool isValidOuter = isValid(uvOuter, vec2(0.0, 0.0));
vec2 texelCoordInner = uvInner * vec2(0.5, 1.0);
vec2 texelCoordOuter = uvOuter * vec2(0.5, 1.0) + vec2(0.5,0.0);
vec2 texDim =  vec2(textureSize(overlayHighlightTexture, 0));
uvec2 texelValueInner = texelFetch(overlayHighlightTexture, ivec2(texelCoordInner * texDim), 0).rg;
uvec2 texelValueOuter = texelFetch(overlayHighlightTexture, ivec2(texelCoordOuter * texDim), 0).rg;
return
isValidInner ? texelValueInner :
isValidOuter ? texelValueOuter :
uvec2(0);
}
uvec2 getAllOverlayHighlightValuesEncoded() {
return getAllOverlayHighlightValuesEncoded(vtcOverlay);
}`):(o.include(m),o.code.add(a`vec4 getCombinedOverlayColor(vec4 texCoords) {
return overlayOpacity * getOverlayColor(ovColorTex, texCoords);
}
vec4 getCombinedOverlayColor() {
return getCombinedOverlayColor(vtcOverlay);
}
vec4 compositeOverlayUnpremultiplied(vec4 baseColorUnpremultiplied, vec4 overlayColorPremultiplied) {
vec4 colorPremultiplied = blendColorsPremultiplied(
overlayColorPremultiplied,
vec4(baseColorUnpremultiplied.rgb * baseColorUnpremultiplied.a, baseColorUnpremultiplied.a)
);
return colorPremultiplied.a > 0.0
? vec4(colorPremultiplied.rgb / colorPremultiplied.a, colorPremultiplied.a)
: vec4(0.0);
}`),o.code.add(a`vec4 getOverlayColorTexel(vec4 texCoords) {
vec2 texDim =  vec2(textureSize(ovColorTex, 0));
vec4 color0 = texelFetch(ovColorTex, ivec2(vec2(texCoords.x * 0.5, texCoords.y) * texDim), 0);
vec4 color1 = texelFetch(ovColorTex, ivec2(vec2(texCoords.z * 0.5 + 0.5, texCoords.w) * texDim), 0);
bool isValid0 = isValid(texCoords.xy, fwidth(texCoords.xy));
bool isValid1 = isValid(texCoords.zw, vec2(0.0, 0.0));
return mix(color1 * float(isValid1), color0, float(isValid0));
}
vec4 getOverlayColorTexel() {
return getOverlayColorTexel(vtcOverlay);
}`)),n&&o.uniforms.add(d,f).code.add(a`vec4 getOverlayWaterColor(vec4 maskInput, vec4 colorInput, vec3 vposEyeDir,
float shadow, vec3 localUp, mat3 tbn, vec3 position, vec3 positionWorld) {
vec3 n = normalize(tbn *  (2.0 * maskInput.rgb - vec3(1.0)));
vec3 v = vposEyeDir;
vec3 final = getWaterColor(n, v, mainLightDirection, colorInput.rgb, mainLightIntensity, localUp, 1.0 - shadow, maskInput.w, position, positionWorld);
return vec4(final, colorInput.w);
}`)}function C(e,t){return e.overlay?.overlays[t]?.extent}function w(r,i,a){let o=E,s=r&&!i.useENUForGlobalOverlayUV,c=s?0:i.toMapSpace[0],l=s?0:i.toMapSpace[1],u=(r,i)=>{let s=C(a,i);n(s)&&(o[r+0]=(c-s[0])/t(s),o[r+1]=(l-s[1])/e(s))};return u(0,0),u(2,1),o}function T(r,i,a){let o=E,s=r&&!i.useENUForGlobalOverlayUV,c=s?1:i.toMapSpace[2],l=s?1:i.toMapSpace[3],u=(r,i)=>{let s=C(a,i);n(s)&&(o[r+0]=c/t(s),o[r+1]=l/e(s))};return u(0,0),u(2,1),o}var E=r(),D=class extends s{constructor(e){super(e,`vec4`)}};function O(e,t){t.output===10&&(e.include(l,t),e.fragment.code.add(a`
    void calculateOcclusionAndOutputHighlight(uvec2 highlightToAdd) {
      uint levelBits = readLevelBits(highlightToAdd, highlightLevel);
      if ((levelBits & 1u) == 0u) discard;
      outputHighlight(isHighlightOccluded());
    }
  `))}export{h as a,b as i,x as n,g as r,O as t};