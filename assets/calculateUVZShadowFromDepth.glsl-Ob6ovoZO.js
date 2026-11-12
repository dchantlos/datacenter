import{t as e}from"./mat4f64-E_FXCKxO.js";import{A as t,_ as n}from"./mat4-Dqn0x3Z-.js";import{d as r}from"./floatBlendScale.glsl-BaQhFMcs.js";import{Y as i,kn as a}from"./VertexColor.glsl-nQ4npUUV.js";import{s as o}from"./ReceiveShadowsConfiguration-TZDqAUu3.js";import{t as s}from"./CameraSpace.glsl-DVm5WMCd.js";function c(e){e.fragment.include(o),e.fragment.include(i),e.include(s),e.fragment.uniforms.add(new a(`inverseViewMatrix`,({camera:e})=>t(l,n(l,e.viewMatrix,e.center)))).code.add(r`vec3 calculateUVZShadowAndPixelPosFromDepth(
in vec2 _uv,
ivec2 shadowMapSize,
in sampler2D _depthMap,
out vec4 currentPixelPos
) {
float depth = depthFromTexture(_depthMap, _uv);
if (depth >= 1.0 || depth <= 0.0) {
return invalidShadowmapUVZ;
}
float currentPixelDepth = linearizeDepth(depth);
currentPixelPos = vec4(reconstructPosition(gl_FragCoord.xy, currentPixelDepth), 1.0);
vec4 worldSpacePos = inverseViewMatrix * currentPixelPos;
float linearDepth = -currentPixelDepth;
return calculateUVZShadow(worldSpacePos.xyz, linearDepth, shadowMapSize);
}
vec3 calculateUVZShadowFromDepth(
in vec2 _uv,
ivec2 shadowMapSize,
in sampler2D _depthMap
) {
vec4 currentPixelPos;
return calculateUVZShadowAndPixelPosFromDepth(_uv, shadowMapSize, _depthMap, currentPixelPos);
}`)}var l=e();export{c as t};