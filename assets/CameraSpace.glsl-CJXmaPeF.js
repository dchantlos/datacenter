import{N as e,o as t}from"./promiseUtils-DqimbNUr.js";import{D as n}from"./vec2-C5dJMieJ.js";import{l as r}from"./screenUtils-Bibd7Xdi.js";import{l as i}from"./vec4-B-G2J025.js";import{o as a}from"./vec4f64-CjgU5APJ.js";import{o}from"./vec2f64-IO40D2xB.js";import{p as s,u as c}from"./oitResolution.glsl-CziGeqeq.js";import{t as l}from"./NoParameters-XZJ-8n06.js";import{g as u,h as d,m as f}from"./ManagedTexture-CoIW9HsA.js";import{At as p,K as m,Ot as h,kt as g}from"./doublePrecisionUtils-BljtQ88P.js";var _=class{constructor(e){this.screenLength=r(e.screenLength),this.minWorldLength=e.minWorldLength??0,this.maxWorldLength=e.maxWorldLength??1/0}};function v(e,t){let n=e.vertex;t.hasVerticalOffset?(b(n),t.hasScreenSizePerspective&&(e.include(u),d(n),p(e.vertex,t)),n.code.add(s`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${t.spherical?s`vec3 worldNormal = normalize(worldPos + localOrigin);`:s`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${t.hasScreenSizePerspective?s`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:s`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):n.code.add(s`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}var y=a();function b(e){e.uniforms.add(new g(`verticalOffset`,(e,t)=>{let{minWorldLength:n,maxWorldLength:r,screenLength:a}=e.verticalOffset,o=Math.tan(.5*t.camera.fovY)/(.5*t.camera.fullViewport[3]),s=t.camera.pixelRatio||1;return i(y,a*s,o,n,r)}))}var x=class extends h{constructor(e){super(e),this._numLoading=0,this._disposed=!1,this._textures=e.textures,this.updateTexture(e.textureId),this._acquire(e.normalTextureId,e=>this._textureNormal=e),this._acquire(e.emissiveTextureId,e=>this._textureEmissive=e),this._acquire(e.occlusionTextureId,e=>this._textureOcclusion=e),this._acquire(e.metallicRoughnessTextureId,e=>this._textureMetallicRoughness=e)}dispose(){super.dispose(),this._texture=e(this._texture),this._textureNormal=e(this._textureNormal),this._textureEmissive=e(this._textureEmissive),this._textureOcclusion=e(this._textureOcclusion),this._textureMetallicRoughness=e(this._textureMetallicRoughness),this._disposed=!0}ensureResources(e){return this._numLoading===0?2:1}get textureBindParameters(){return new C(this._texture?.texture??null,this._textureNormal?.texture??null,this._textureEmissive?.texture??null,this._textureOcclusion?.texture??null,this._textureMetallicRoughness?.texture??null)}updateTexture(t){this._texture!=null&&t===this._texture.id||(this._texture=e(this._texture),this._acquire(t,e=>this._texture=e))}_acquire(n,r){if(n==null)return void r(null);let i=this._textures.acquire(n);if(t(i))return++this._numLoading,void i.then(t=>{if(this._disposed)return e(t),void r(null);r(t)}).finally(()=>--this._numLoading);r(i)}},S=class extends l{constructor(e=null){super(),this.textureEmissive=e}},C=class extends S{constructor(e,t,n,r,i,a,o){super(n),this.texture=e,this.textureNormal=t,this.textureOcclusion=r,this.textureMetallicRoughness=i,this.scale=a,this.normalTextureTransformMatrix=o}},w=class extends c{constructor(e,t){super(e,`bool`,0,(n,r)=>n.setUniform1b(e,t(r)))}};function T(e){e.uniforms.add(new m(`zProjectionMap`,e=>E(e.camera))),e.code.add(s`float linearizeDepth(float depth, vec2 zProjectionConstants) {
float depthNdc = depth * 2.0 - 1.0;
return -(zProjectionConstants[0] / (depthNdc + zProjectionConstants[1] + 1e-7));
}
float linearizeDepth(float depth) {
return linearizeDepth(depth, zProjectionMap);
}`),e.code.add(s`float delinearizeDepth(float linearDepth) {
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
float depthNdc = (-c1/linearDepth) - c2 - 1e-7;
float depthNonlinear01 = (depthNdc + 1.0 ) / 2.0;
return depthNonlinear01;
}`),e.code.add(s`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
return texelFetch(depthTexture, iuv, 0).r;
}`),e.code.add(s`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}function E(e){let t=e.projectionMatrix;return n(D,t[14],t[10])}var D=o(),O=class extends c{constructor(e,t,n){super(e,`mat4`,1,(r,i,a)=>r.setUniformMatrix4fv(e,t(i,a),n))}};function k(e){e.fragment.uniforms.add(new f(`projInfo`,e=>A(e.camera))),e.fragment.uniforms.add(new m(`zScale`,e=>M(e.camera))),e.fragment.code.add(s`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}function A(e){let t=e.projectionMatrix;return t[11]===0?i(j,2/(e.fullWidth*t[0]),2/(e.fullHeight*t[5]),(1+t[12])/t[0],(1+t[13])/t[5]):i(j,-2/(e.fullWidth*t[0]),-2/(e.fullHeight*t[5]),(1-t[8])/t[0],(1-t[9])/t[5])}var j=a();function M(e){return e.projectionMatrix[11]===0?n(N,0,1):n(N,1,0)}var N=o();export{w as a,_ as c,E as i,b as l,O as n,C as o,T as r,x as s,k as t,v as u};