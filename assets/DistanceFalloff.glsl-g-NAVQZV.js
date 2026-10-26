import{p as e,s as t}from"./oitResolution.glsl-CziGeqeq.js";import{t as n}from"./NoParameters-XZJ-8n06.js";import{Lt as r}from"./doublePrecisionUtils-CvPW6smK.js";import{t as i}from"./SphereIntersect.glsl-DoEmNSbP.js";var a=class extends n{constructor(){super(...arguments),this.atmosphereC=1}};function o(n){n.include(i),n.uniforms.add(new t(`atmosphereC`,e=>e.atmosphereC),new r(`cameraPosition`,e=>e.camera.eye)).code.add(e`float getDistanceFalloff(float dist, vec3 rayDir, float weight) {
if(dist == -1.0){
dist = 0.055 * sphereIntersect(cameraPosition, rayDir, atmosphereC).y;
}
return (1.0 - exp(-dist * weight));
}`)}export{o as n,a as t};