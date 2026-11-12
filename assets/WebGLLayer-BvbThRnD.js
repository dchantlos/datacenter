import{n as e}from"./compilerUtils-v_b8Y8TS.js";import{r as t}from"./arrayUtils-Dh834WlC.js";import"./typedArrayUtil-CyeYh2x_.js";import"./string-BpVBm9CH.js";import{t as n}from"./signal--NCw-wsi.js";import{O as r,n as i,o as a,t as o}from"./decorators-B0Ozpuuo.js";import{F as s}from"./promiseUtils-De_zspLB.js";import{t as c}from"./uid-tFVEb1ZF.js";import{Y as l}from"./units-DBfZ3Tak.js";import{r as u}from"./tslib.es6-qUHyP9zl.js";import{n as d}from"./JSONSupport-B7yFOY-c.js";import{t as f}from"./Evented-BTX6JxCX.js";import{r as p}from"./vec3f64-BCBDKjuM.js";import{o as m}from"./Point-O9oiqzAj.js";import{p as h,v as g}from"./mathUtils-8B23-m-L.js";import{a as ee,x as _}from"./vec2-C1aKXbzV.js";import{a as te}from"./projectBuffer-Ci29Co_i.js";import{i as v}from"./uuid-xx6QWOZ-.js";import{B as y,M as b,O as x,f as S,s as ne,x as re}from"./vec3-DG5QX2aJ.js";import{r as ie,t as C}from"./mat4f64-E_FXCKxO.js";import{a as w}from"./DoubleArray-14icZjKU.js";import{J as T,S as ae,W as oe,a as se,l as ce}from"./aaBoundingBox-BHHFxtRx.js";import{O as le,T as ue,j as E}from"./mat4-Dqn0x3Z-.js";import{r as de}from"./vec4f64-DeczMt8m.js";import{r as D}from"./vec2f64-UJ3ILzaq.js";import{s as fe}from"./mathUtils-uo2NKNfo.js";import{r as pe}from"./sphere-BzsDOnYw.js";import{o as O}from"./orientedBoundingBox-CZbsfxtX.js";import{a as k,d as A,m as j,n as me,r as M,t as he}from"./floatBlendScale.glsl-BaQhFMcs.js";import{n as N}from"./NoParameters-DoG40WO7.js";import{$ as ge,A as _e,An as P,Fn as ve,J as ye,M as be,N as xe,On as Se,Pn as Ce,Q as we,Y as Te,bn as Ee,fn as De,gn as Oe,k as ke,ln as Ae,mn as je,pn as Me,pt as Ne,vt as Pe}from"./VertexColor.glsl-DBvnzl1f.js";import{i as Fe}from"./InterleavedLayout-D7evmH4O.js";import{a as Ie,t as Le}from"./doublePrecisionUtils-BEDeI1Jm.js";import{i as Re}from"./Indices-BBucF1Xu.js";import{t as ze}from"./Octree-9qj4MdoZ.js";var F,I=class extends d{static{F=this}constructor(e){super(e),this.type=`foggy`,this.fogStrength=.5}clone(){return new F({fogStrength:this.fogStrength})}get scattering(){return g(F.minScattering,F.maxScattering,this.fogStrength**3)}static{this.minScattering=3e-5}static{this.maxScattering=.005}};u([a({foggy:`foggy`}),o({json:{write:{isRequired:!0}}})],I.prototype,`type`,void 0),u([o({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],I.prototype,`fogStrength`,void 0),I=F=u([i(`esri.views.3d.environment.FoggyWeather`)],I);var L=I,Be=.5;function Ve(e,t){let n=e.vertex;e.include(Ce),e.attributes.add(`position`,`vec3`),e.vertex.inputs.add(`position`,()=>`position`),e.attributes.add(`normal`,`vec3`),t.hasVertexCenterOffset?e.attributes.add(`centerOffset`,`vec3`):n.constants.add(`centerOffset`,`vec3`,[0,0,0]),e.attributes.add(`groundDistance`,`float`),Me(n,t),De(n,t),n.uniforms.add(Ee,new k(`polygonOffset`,e=>e.shaderPolygonOffset),new P(`aboveGround`,e=>e.camera.aboveGround?1:-1)),t.hasVerticalOffset&&Ae(n),n.code.add(A`struct ProjectHUDAux {
vec3 posModel;
vec3 posView;
vec3 vnormal;
float distanceToCamera;
float absCosAngle;
};`),n.code.add(A`float applyHUDViewDependentPolygonOffset(float pointGroundDistance, float absCosAngle, inout vec3 posView) {
float pointGroundSign = sign(pointGroundDistance);
if (pointGroundSign == 0.0) {
pointGroundSign = aboveGround;
}
float groundRelative = aboveGround * pointGroundSign;
if (polygonOffset > .0) {
float cosAlpha = clamp(absCosAngle, 0.01, 1.0);
float tanAlpha = sqrt(1.0 - cosAlpha * cosAlpha) / cosAlpha;
float factor = (1.0 - tanAlpha / viewport[2]);
if (groundRelative > 0.0) {
posView *= factor;
}
else {
posView /= factor;
}
}
return groundRelative;
}`),(!t.draped||t.hasVerticalOffset)&&n.uniforms.add(Se),t.draped||(n.uniforms.add(new P(`hudPixelSizePerDistance`,e=>Math.tan(e.camera.fovY/2)/(e.camera.fullViewport[2]/2))),n.code.add(A`
      void applyHUDVerticalGroundOffset(vec3 normalModel, inout vec3 posModel, inout vec3 posView) {
        float distanceToCamera = length(posView);

        // Compute offset in world units for a half pixel shift
        float pixelOffset = distanceToCamera * hudPixelSizePerDistance * ${A.float(.5)};

        // Apply offset along normal in the direction away from the ground surface
        vec3 modelOffset = normalModel * aboveGround * pixelOffset;

        // Apply the same offset also on the view space position
        vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;

        posModel += modelOffset;
        posView += viewOffset;
      }
    `)),t.screenCenterOffsetUnitsEnabled&&je(n),t.hasScreenSizePerspective&&ve(n),n.code.add(A`
    vec4 projectPositionHUD(out ProjectHUDAux aux) {
      float pointGroundDistance = groundDistance;
      aux.posModel = position;
      aux.posView = (view * vec4(aux.posModel, 1.0)).xyz;
      aux.vnormal = normal;
      ${t.draped?``:`applyHUDVerticalGroundOffset(aux.vnormal, aux.posModel, aux.posView);`}

      // Screen sized offset in world space, used for example for line callouts
      // Note: keep this implementation in sync with the CPU implementation, see
      //   - MaterialUtil.verticalOffsetAtDistance
      //   - HUDMaterial.applyVerticalOffsetTransformation

      aux.distanceToCamera = length(aux.posView);

      vec3 viewDirObjSpace = normalize(cameraPosition - aux.posModel);
      float cosAngle = dot(aux.vnormal, viewDirObjSpace);

      aux.absCosAngle = abs(cosAngle);

      ${t.hasScreenSizePerspective&&(t.hasVerticalOffset||t.screenCenterOffsetUnitsEnabled)?`vec3 perspectiveFactor = screenSizePerspectiveScaleFactor(aux.absCosAngle, aux.distanceToCamera, screenSizePerspectiveAlignment);`:``}

      ${t.hasVerticalOffset?t.hasScreenSizePerspective?`float verticalOffsetScreenHeight = applyScreenSizePerspectiveScaleFactorFloat(verticalOffset.x, perspectiveFactor);`:`float verticalOffsetScreenHeight = verticalOffset.x;`:``}

      ${t.hasVerticalOffset?A`
            float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * aux.distanceToCamera, verticalOffset.z, verticalOffset.w);
            vec3 modelOffset = aux.vnormal * worldOffset;
            aux.posModel += modelOffset;
            vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;
            aux.posView += viewOffset;
            // Since we elevate the object, we need to take that into account
            // in the distance to ground
            pointGroundDistance += worldOffset;`:``}

      float groundRelative = applyHUDViewDependentPolygonOffset(pointGroundDistance, aux.absCosAngle, aux.posView);

      ${t.screenCenterOffsetUnitsEnabled?``:A`
            // Apply x/y in view space, but z in screen space (i.e. along posView direction)
            aux.posView += vec3(centerOffset.x, centerOffset.y, 0.0);

            // Same material all have same z != 0.0 condition so should not lead to
            // branch fragmentation and will save a normalization if it's not needed
            if (centerOffset.z != 0.0) {
              aux.posView -= normalize(aux.posView) * centerOffset.z;
            }
          `}

      vec4 posProj = proj * vec4(aux.posView, 1.0);

      ${t.screenCenterOffsetUnitsEnabled?t.hasScreenSizePerspective?`float centerOffsetY = applyScreenSizePerspectiveScaleFactorFloat(centerOffset.y, perspectiveFactor);`:`float centerOffsetY = centerOffset.y;`:``}

      ${t.screenCenterOffsetUnitsEnabled?`posProj.xy += vec2(centerOffset.x, centerOffsetY) * pixelRatio * 2.0 / viewport.zw * posProj.w;`:``}

      // constant part of polygon offset emulation
      posProj.z -= groundRelative * polygonOffset * posProj.w;
      return posProj;
    }
  `)}function He(e){e.uniforms.add(new Pe(`alignPixelEnabled`,e=>e.alignPixelEnabled)),e.code.add(A`vec4 alignToPixelCenter(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.500123) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = (floor(xy * widthHeight) + vec2(0.5)) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`),e.code.add(A`vec4 alignToPixelOrigin(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.5) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = floor((xy + 0.5 * pixelSz) * widthHeight) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`)}var Ue=A`vec4(0.0, 0.0, 2.0, 1.0)`,R=class extends N{constructor(){super(...arguments),this.effect=0,this.fadeFactor=n(1)}};function z(e){let t=new Ie;return t.include(we),t.outputs.add(`fragColor`,`vec4`,0),t.fragment.uniforms.add(new M(`colorTexture`,e=>e.color),new M(`emissionTexture`,e=>e.emission),new M(`focusArea`,e=>e.focusArea),new ge(`focusAreaEffectMode`,e=>e.effect),new k(`fadeFactor`,e=>e.fadeFactor.value)).constants.add(`EffectBright`,`int`,0).code.add(`float getLuminance(in vec4 color) { return color.r * 0.25 + color.g * 0.5 + color.b * 0.25; }`).main.add(`
      float mask = texture(focusArea, uv).r;
      
      if (focusAreaEffectMode == EffectBright) {
        vec4 color = texture(colorTexture, uv);
        float luminance = getLuminance(color);
        fragColor = mask > 0.0 ? color : mix(color, vec4(0.55 * luminance + 0.45), fadeFactor);
      } else {
        if(mask > 0.0) discard;
        fragColor = vec4(vec3(0.0), fadeFactor * 0.67);
      }
  `),e.hasEmissive&&(t.outputs.add(`fragEmission`,`vec4`,1),t.fragment.main.add(A`if (focusAreaEffectMode == EffectBright) {
vec4 color = texture(emissionTexture, uv);
float luminance = getLuminance(color);
fragEmission = mask > 0.0 ? color : mix(color, vec4(0.67 * luminance), fadeFactor);
} else
fragEmission = vec4(vec3(0.0), fadeFactor * 0.9);`)),t}var We=Object.freeze(Object.defineProperty({__proto__:null,FocusAreaPassParameters:R,build:z},Symbol.toStringTag,{value:`Module`}));function B(e){e.code.add(A`vec2 sphereIntersect(vec3 start, vec3 dir, float distance) {
float a = dot(dir, dir);
float b = 2.0 * dot(dir, start);
float d = (b * b) - 4.0 * a * distance;
if (d < 0.0) {
return vec2(1e5, -1e5);
}
return vec2((-b - sqrt(d)) / (2.0 * a), (-b + sqrt(d)) / (2.0 * a));
}`)}var Ge=class extends N{constructor(){super(...arguments),this.atmosphereC=1}};function V(e){e.include(B),e.uniforms.add(new k(`atmosphereC`,e=>e.atmosphereC),new Oe(`cameraPosition`,e=>e.camera.eye)).constants.add(`skyFalloffHeuristic`,`float`,.11).code.add(A`float getDistanceFalloff(float dist, vec3 rayDir, float weight) {
if(dist == -1.0){
dist = skyFalloffHeuristic * sphereIntersect(cameraPosition, rayDir, atmosphereC).y;
}
return (1.0 - exp(-dist * weight));
}`)}var Ke=class extends Ge{constructor(){super(...arguments),this.mipmapLevels=1,this.boost=1,this.scattering=1e-4}},H=class extends me{constructor(){super(...arguments),this.hasFog=!1}};u([j()],H.prototype,`hasFog`,void 0);function qe(e,t){e.include(he,t),e.include(V),e.include(Te),e.include(ye),e.uniforms.add(new M(`emissionTexture`,({emission:e})=>e?.attachment),new Ne(`depthTexture`,({mainDepth:e})=>e),new k(`scattering`,({scattering:e})=>e),new k(`boost`,({boost:e})=>1+e*.5),new k(`levels`,({mipmapLevels:e},{camera:t})=>e+1+Math.log2(t.pixelScale)),new P(`pixelRatioCorrection`,({camera:e})=>Math.log2(e.pixelScale)),new M(`mipmapTexture`,({mipmapTexture:e})=>e?.getTexture())).constants.add(`maxScattering`,`float`,L.maxScattering).constants.add(`maxDispersion`,`float`,t.hasFog?1:.1).code.add(A`vec3 readEmission(float level) {
level *= levels;
level = max(0.0, level - pixelRatioCorrection);
return level < 1.0 ?
texture(emissionTexture, uv).rgb * floatBlendInputScale * (1.0 - level) +
textureLod(mipmapTexture, uv, 0.0).rgb * level * 0.5 :
textureLod(mipmapTexture, uv, level - 1.0).rgb / pow(2.0, level);
}
float gauss(float x, float sigmaSq) {
float expon = -(pow(x, 2.0) / (2.0 * sigmaSq));
return exp(expon) / sqrt(6.283185307179586 * sigmaSq);
}
vec3 applyEmissiveGlow() {
float mainDepth = -1.0;
float depthSample = depthFromTexture(depthTexture, uv);
if(depthSample < 1.0 && depthSample > 0.0){
vec3 cameraSpaceRay = normalize(eyeDir);
cameraSpaceRay /= cameraSpaceRay.z;
cameraSpaceRay *= linearizeDepth(depthSample);
mainDepth = max(0.0, length(cameraSpaceRay));
}
vec3 rayDir = normalize(worldRay);
float dispersionPerPixel = getDistanceFalloff(mainDepth, rayDir, scattering * 0.5);
float mainPoint = pow(dispersionPerPixel, 4.0) * maxDispersion;
vec3 emission = vec3(0.0);
float weights = 0.0;
float baseSigmaSq = 0.003 + 0.03 * (boost - 1.0);
float sigmaSq = baseSigmaSq + 0.1 * scattering / maxScattering;
float minPoint = mainPoint - 0.5;
float fullPoint = (minPoint + mainPoint) * 0.5;
for(float level = 0.0; level < levels; ++level) {
float point = level / levels;
float dist = point - mainPoint;
float weight = gauss(dist, sigmaSq) * smoothstep(minPoint, fullPoint, point);
if(weight > 0.0) {
emission += readEmission(point) * weight;
weights += weight;
}
}
return emission * boost / weights;
}`)}var U=class extends H{constructor(){super(...arguments),this.hasEmissive=!1}};u([j()],U.prototype,`hasEmissive`,void 0);function W(e,t,n){e.push([`olidColor`,new O(t,n,4,!0)])}function G(e,t=!1){return e<=1024?t?Array(e).fill(0):Array(e):new Float16Array(e)}function K(e,t,n){let r=e.isGeographic&&t,{metersPerUnit:i}=e,a=0;return r?(i=1,a=h(n)):e.isGeographic?i=l(e).metersPerDegree:e.isWebMercator&&(a=m(n)),i*Math.max(.2,Math.cos(a))}var q={dash:[4,3],dot:[1,3],"long-dash":[8,3],"short-dash":[4,1],"short-dot":[1,1]},Je={dash:q.dash,"dash-dot":[...q.dash,...q.dot],dot:q.dot,"long-dash":q[`long-dash`],"long-dash-dot":[...q[`long-dash`],...q.dot],"long-dash-dot-dot":[...q[`long-dash`],...q.dot,...q.dot],none:null,"short-dash":q[`short-dash`],"short-dash-dot":[...q[`short-dash`],...q[`short-dot`]],"short-dash-dot-dot":[...q[`short-dash`],...q[`short-dot`],...q[`short-dot`]],"short-dot":q[`short-dot`],solid:null},Ye=class{constructor(e,t,n){this.image=e,this.width=t,this.length=n,this.uuid=v()}};function J(e){return e!=null&&`image`in e}function Xe(e,t){return e==null?e:{pattern:e.slice(),pixelRatio:t}}function Ze(e){return{pattern:[e,e],pixelRatio:2}}function Qe(e){switch(e?.type){case`style`:return $e(e.style);case`template`:return et(e.normalizedDashTemplate);case`image`:return new Ye(e.image,e.width,e.length);case void 0:case null:return null}return null}function $e(e){return e==null?null:Xe(Je[e],8)}function et({dashTemplate:e,hidesLine:t}){return Xe(t||e.length===0?null:e,8)}function tt(e){switch(e?.type){case`style`:return e.style===`none`;case`template`:return e.normalizedDashTemplate.hidesLine;case`image`:case void 0:case null:return!1}return!1}function nt(e,t,n=null){let r=[],i=t.mapPositions,a=rt(t,r),o=a.data,s=a.indices.length,c=Re(s);return it(t,r,c),st(t,r,c),at(t,r,c),ot(t,r,a.indices,c),ct(t,r,a.indices,c),lt(t,r),ut(t,r,a.indices,c),dt(e,t,r,o),n!=null&&W(r,n,c),new _e(e,r,i)}function rt(e,t){let{attributeData:{position:n},removeDuplicateStartEnd:r}=e,i=n.length/3,a=i>2&&ft(n)&&r,o=i-+!!a,s=Array(2*(o-1)),c=a?n.slice(0,-3):n,l=0;for(let e=0;e<o-1;e++)s[l++]=e,s[l++]=e+1;let u=new O(c,s,3,a);return t.push([`position`,u]),u}function it(e,t,n){if(e.attributeData.colorFeature!=null)return;let r=e.attributeData.color;t.push([`color`,new O(r??de,n,4)])}function at(e,t,n){e.attributeData.normal&&t.push([`normal`,new O(e.attributeData.normal,n,3)])}function ot(e,t,n,r){let i=e.attributeData.colorFeature;i!=null&&(typeof i==`number`?t.push([`colorFeatureAttribute`,new O([i],r,1,!0)]):t.push([`colorFeatureAttribute`,new O(i,n,1,!0)]))}function st(e,t,n){e.attributeData.sizeFeature??t.push([`size`,new O([e.attributeData.size??1],n,1,!0)])}function ct(e,t,n,r){let i=e.attributeData.sizeFeature;i!=null&&(typeof i==`number`?t.push([`sizeFeatureAttribute`,new O([i],r,1,!0)]):t.push([`sizeFeatureAttribute`,new O(i,n,1,!0)]))}function lt(e,t){let{attributeData:{position:n,timeStamps:r}}=e;if(!r)return;let i=n.length/3,a=Array(2*(i-1)),o=0;for(let e=0;e<i-1;e++)a[o++]=e,a[o++]=e+1;t.push([`timeStamps`,new O(r,a,4,!0)])}function ut(e,t,n,r){let i=e.attributeData.opacityFeature;i!=null&&(typeof i==`number`?t.push([`opacityFeatureAttribute`,new O([i],r,1,!0)]):t.push([`opacityFeatureAttribute`,new O(i,n,1,!0)]))}function dt(e,{overlayInfo:t},n,r){let i=e.parameters;if(t==null||!pt(i)||i.stipplePattern==null)return;let{renderCoordsHelper:a,spatialReference:o}=t,s=o.isGeographic&&a.viewingMode===1,c=i.worldSized||J(i.stipplePattern);if(!c&&!s)return;let u=r;if(s){let e=w(r.length),t=l(o);for(let n=0;n<e.length;n+=3)te(r,n,e,n,t);u=e}let d=r.length/3,f=ke(d+1),p=a.viewingMode===1,m=mt,h=ht,g=0,v=0,y=0;_(m,u[v++],u[v++]),v++,f[0]=0;for(let e=1;e<d+1;++e){e===d&&(v=0);let t=v;_(h,u[v++],u[v++]),v++;let n=(r[y+1]+r[t+1])/2,i=c?K(o,p,n):1;g+=ee(m,h)*i,f[e]=g,[m,h]=[h,m],y=t}n.push([`distanceToStart`,new O(f,n[0][1].indices,1,!0)])}function ft(e){let t=e.length;return e[0]===e[t-3]&&e[1]===e[t-2]&&e[2]===e[t-1]}function pt(e){return`stipplePattern`in e}var mt=D(),ht=D();function Y(e,t,n,r,i){if(e==null||e.length===0)return[];let a=[];return e.forEach((e,o)=>{let s=e.length,c=w(s*3);e.forEach((e,t)=>{c[t*3]=e[0],c[t*3+1]=e[1],c[t*3+2]=e[2]});let l={attributeData:{position:c,normal:t,colorFeature:n?.[o],opacityFeature:r?.[o],sizeFeature:i?.[o]},removeDuplicateStartEnd:!1};a.push(l)}),a}function gt(e,t,n,r,i,a){if(e==null||e.length===0)return[];let o=Y(e,t,r,i,a);return e.forEach((e,t)=>{let r=n?.[t],i=r==null?void 0:_t(r.timeStamps,r.stage);o[t].attributeData.timeStamps=i}),o}function _t(e,t){let n=G(e.length*4),r=e[0],i=e[e.length-1];for(let a=0;a<e.length;a++)n[a*4]=e[a],n[a*4+1]=r,n[a*4+2]=i,n[a*4+3]=t+.5;return n}function vt(e){return yt.has(e)}var yt=new Set(`position.normal.normalCompressed.uv0.size.rotation.offset.perspectiveDivide.centerOffset.groundDistance.previousDelta.lineParameters.sizeFeatureAttribute.profileRight.profileUp.pathVertexInfo.profileRotation.pathRotationUp.pathMaxStretchDistance.featureAttribute.position.size.sizeFeatureAttribute.profileRight.profileUp.profileRotation.pathRotationUp.pathMaxStretchDistance`.split(`.`)),bt=class{constructor(){this.box=oe(),this.sphere=new pe}};function xt(e,t,n){let r=ce(t,Ct),i=ae(t,wt);if(le(n)){let t=re(St,n[12],n[13],n[14]);b(X,r,t),b(Z,i,t),T(e,X),T(e,Z)}else if(S(X,r,n),T(e,X),!ne(r,i)){S(Z,i,n),T(e,Z);for(let t=0;t<3;++t)x(X,r),x(Z,i),X[t]=i[t],Z[t]=r[t],S(X,X,n),S(Z,Z,n),T(e,X),T(e,Z)}}var St=p(),X=p(),Z=p(),Ct=p(),wt=p();function Tt(e,t){return e??=[],e.push(t),e}function Et(e,t){if(e==null)return null;let n=e.filter(e=>e!==t);return n.length===0?null:n}function Dt(e,t,n,r,i){Q[0]=e.get(t,0),Q[1]=e.get(t,1),Q[2]=e.get(t,2),Le(Q,$,3),n.set(i,0,$[0]),r.set(i,0,$[1]),n.set(i,1,$[2]),r.set(i,1,$[3]),n.set(i,2,$[4]),r.set(i,2,$[5])}var Q=p(),$=new Float32Array(6),Ot=class{constructor(e={}){this.id=c(),this.type=0,this._highlightIds=new Set,this._shaderTransformation=null,this._visible=!0,this.castShadow=e.castShadow??!0,this.usesVerticalDistanceToGround=e.usesVerticalDistanceToGround??!1,this.graphicUid=e.graphicUid,this.layerViewUid=e.layerViewUid,e.isElevationSource&&(this.lastValidElevationBB=oe()),this._geometries=e.geometries?Array.from(e.geometries):[]}dispose(){this._geometries.length=0}get layer(){return this._layer}set layer(e){Fe(this._layer==null||e==null,`Object3D can only be added to a single Layer`),this._layer=e}addGeometry(e){e.visible=this._visible,this._geometries.push(e);for(let t of this._highlightIds)e.addHighlight(t);this._emit(`geometriesChanged`,{object:this,removed:[],added:[e]}),this._highlightIds.size&&this._emit(`highlightChanged`,this),this._invalidateBoundingVolume()}removeGeometry(e){let t=this._geometries.splice(e,1)[0];if(t){for(let e of this._highlightIds)t.removeHighlight(e);this._emit(`geometriesChanged`,{object:this,removed:[t],added:[]}),this._highlightIds.size&&this._emit(`highlightChanged`,this),this._invalidateBoundingVolume()}}removeAllGeometries(){for(;this._geometries.length>0;)this.removeGeometry(0)}replaceGeometries(e){let t=this._geometries,n=Array.from(e);for(let e of t)for(let t of this._highlightIds)e.removeHighlight(t);for(let e of n){e.visible=this._visible;for(let t of this._highlightIds)e.addHighlight(t)}this._geometries=n,this._invalidateBoundingVolume(),this._emit(`geometriesChanged`,{object:this,removed:t,added:n}),this._highlightIds.size&&this._emit(`highlightChanged`,this)}geometryVertexAttributeUpdated(e,t,n=!1){this._emit(`attributesChanged`,{object:this,geometry:e,attribute:t,sync:n}),vt(t)&&this._invalidateBoundingVolume()}get visible(){return this._visible}set visible(e){if(this._visible!==e){this._visible=e;for(let e of this._geometries)e.visible=this._visible;this._emit(`visibilityChanged`,this)}}maskOccludee(){let e=new xe;for(let t of this._geometries)t.occludees=Tt(t.occludees,e);return this._emit(`occlusionChanged`,this),e}removeOcclude(e){for(let t of this._geometries)t.occludees=Et(t.occludees,e);this._emit(`occlusionChanged`,this)}highlight(e){let t=new be(e);for(let e of this._geometries)e.addHighlight(t);return this._emit(`highlightChanged`,this),this._highlightIds.add(t),t}removeHighlight(e){this._highlightIds.delete(e);for(let t of this._geometries)t.removeHighlight(e);this._emit(`highlightChanged`,this)}removeStateID(e){e.channel===0?this.removeHighlight(e):this.removeOcclude(e)}getCombinedStaticTransformation(e,t){return E(t,this.transformation,e.transformation)}getCombinedShaderTransformation(e,t=C()){return E(t,this.effectiveTransformation,e.transformation)}get boundingVolumeWorldSpace(){return this._bvWorldSpace||(this._bvWorldSpace=new bt,this._validateBoundingVolume(this._bvWorldSpace,0)),this._bvWorldSpace}get boundingVolumeObjectSpace(){return this._bvObjectSpace||(this._bvObjectSpace=new bt,this._validateBoundingVolume(this._bvObjectSpace,1)),this._bvObjectSpace}_validateBoundingVolume(e,t){let n=t===1;for(let t of this._geometries){let r=t.boundingInfo;r&&xt(e.box,r.box,n?t.transformation:this.getCombinedShaderTransformation(t))}se(e.box,e.sphere.center);for(let t of this._geometries){let r=t.boundingInfo;if(r==null)continue;let i=n?t.transformation:this.getCombinedShaderTransformation(t),a=fe(i);S(kt,r.sphere.center,i);let o=y(kt,e.sphere.center),s=r.sphere.radius*a;e.sphere.radius=Math.max(e.sphere.radius,o+s)}}_invalidateBoundingVolume(){let e=this._bvWorldSpace?.sphere;this._bvObjectSpace=this._bvWorldSpace=void 0,this.layer&&e&&this.layer.notifyObjectBBChanged(this,e)}_emit(e,t){this.layer?.events.emit(e,t)}get geometries(){return this._geometries}get transformation(){return this._transformation??ie}set transformation(e){this._transformation=ue(this._transformation??C(),e),this._invalidateBoundingVolume(),this._emit(`transformationChanged`,this)}get shaderTransformation(){return this._shaderTransformation}set shaderTransformation(e){this._shaderTransformation=e?ue(this._shaderTransformation??C(),e):null,this._invalidateBoundingVolume(),this._emit(`shaderTransformationChanged`,this)}get effectiveTransformation(){return this.shaderTransformation??this.transformation}get test(){}},kt=p(),At=[`layerObjectAdded`,`layerObjectRemoved`,`layerObjectsAdded`,`layerObjectsRemoved`,`transformationChanged`,`shaderTransformationChanged`,`visibilityChanged`,`occlusionChanged`,`highlightChanged`,`geometriesChanged`,`attributesChanged`],jt=class{constructor(e,t,n=``){this.stage=e,this.apiLayerViewUid=n,this.id=c(),this.events=new f,this.visible=!0,this.sliceable=!1,this._objectsAdded=[],this._handles=new r,this._objects=new Map,this._pickable=!0,this.visible=t?.visible??!0,this._pickable=t?.pickable??!0,this.updatePolicy=t?.updatePolicy??0,e.addLayer(this);for(let t of At)this._handles.add(this.events.on(t,n=>e.handleEvent(t,n)))}destroy(){this._handles.size&&(this._handles.destroy(),this.stage.removeLayer(this),this.invalidateSpatialQueryAccelerator())}get objects(){return this._objects}getObject(t){return e(this._objects.get(t))}set pickable(e){this._pickable=e}get pickable(){return this._pickable&&this.visible}add(e){this._objects.set(e.id,e),e.layer=this,this.events.emit(`layerObjectAdded`,e),this._octree!=null&&this._objectsAdded.push(e)}remove(e){this._objects.delete(e.id)&&(this.events.emit(`layerObjectRemoved`,e),e.layer=null,this._octree!=null&&(t(this._objectsAdded,e)||this._octree.remove([e])))}addMany(e){for(let t of e)this._objects.set(t.id,t),t.layer=this;this.events.emit(`layerObjectsAdded`,e),this._octree!=null&&this._objectsAdded.push(...e)}removeMany(e){let n=[];for(let t of e)this._objects.delete(t.id)&&n.push(t);if(n.length!==0&&(this.events.emit(`layerObjectsRemoved`,n),n.forEach(e=>e.layer=null),this._octree!=null)){for(let e=0;e<n.length;)t(this._objectsAdded,n[e])?(n[e]=n[n.length-1],--n.length):++e;this._octree.remove(n)}}commit(){this.stage.commitLayer(this)}sync(){this.updatePolicy!==1&&this.stage.syncLayer(this.id)}notifyObjectBBChanged(e,t){this._octree!=null&&!this._objectsAdded.includes(e)&&this._octree.update(e,t)}getSpatialQueryAccelerator(){return this._octree==null&&this._objects.size>50?(this._octree=new ze(e=>e.boundingVolumeWorldSpace.sphere),this._octree.add(this._objects.values())):this._octree!=null&&this._objectsAdded.length>0&&(this._octree.add(this._objectsAdded),this._objectsAdded.length=0),this._octree}invalidateSpatialQueryAccelerator(){this._octree=s(this._octree),this._objectsAdded.length=0}get test(){}};export{z as C,Be as D,He as E,Ve as O,R as S,Ue as T,qe as _,Y as a,V as b,gt as c,Qe as d,tt as f,U as g,W as h,vt as i,L as k,J as l,G as m,Ot as n,_t as o,K as p,Dt as r,nt as s,jt as t,Ze as u,H as v,We as w,B as x,Ke as y};