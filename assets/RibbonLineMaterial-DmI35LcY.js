const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./RibbonLine.glsl-CDNAcxpl.js","./oitResolution.glsl-CziGeqeq.js","./arrayUtils-BsOR1o4f.js","./typedArrayUtil-8Eur52Mg.js","./Error-BplF0QKp.js","./tslib.es6-qUHyP9zl.js","./colorUtils-DZZ966ow.js","./NoParameters-XZJ-8n06.js","./doublePrecisionUtils-BljtQ88P.js","./Accessor-e7T-9MbM.js","./handleUtils-Coa78TkJ.js","./tracking-Cj9GXM8i.js","./ObservableBase-tBewJuL0.js","./promiseUtils-DqimbNUr.js","./decorators-BTkzlYqr.js","./MapUtils-CdcpkzIf.js","./jsonMap-BiWEmGox.js","./scheduling-BdGvXJ-L.js","./nextTick-e2wXLyPh.js","./PooledArray-BJc8I6oO.js","./time-BzYz5R50.js","./uid-tFVEb1ZF.js","./guards-Mz9drnB9.js","./vec3f64-DIOQknMY.js","./mathUtils-D79yUFwW.js","./vec2-C5dJMieJ.js","./common-DhvcAEWc.js","./mat3-Dp2-WUQo.js","./mat3f64-B6tTkprt.js","./screenUtils-Bibd7Xdi.js","./Polygon-BIcg-kpF.js","./Extent-CpNb9F8j.js","./Ellipsoid-Co4rBm1M.js","./spatialReferenceUtils-CoDbwbrK.js","./pe-fdmqh6Cp.js","./preload-helper-CRzLMJPS.js","./assets-D564oNYU.js","./request-rdNS-bl0.js","./JSONSupport-4jj9G2Aw.js","./SpatialReference-D8rtP1Py.js","./units-DltCDX7f.js","./zmUtils-CoAtydMV.js","./curveUtils-D3VHt5Fq.js","./aaBoundingRect-B_KJOUms.js","./curveExtent-CRLFekGb.js","./ellipticArc7Utils-BOJkUyQ8.js","./coordsUtils-DmFHiZEh.js","./vec3-C5q_s_3T.js","./mat4f64-E_FXCKxO.js","./lengthUtils-B44-fMy6.js","./mat4-i5hbKyBt.js","./vec4-B-G2J025.js","./vec4f64-CjgU5APJ.js","./vec2f64-IO40D2xB.js","./checkWebGLError-DYkDLOvZ.js","./enums-CsvnPRfA.js","./plane-BHXp72G_.js","./vectorStacks-Cp0nIiMq.js","./quatf64-CwpDH0r1.js","./mathUtils-uPSHaE6A.js","./ObjectStack-DcapzbTw.js","./ray-D-AYx416.js","./VertexAttributeLocations-Yf6enskR.js","./VertexElementDescriptor-DVcI4qMB.js","./Attribute-DyLIUiq7.js","./Emissions.glsl-DAUpwJJ8.js","./lineSegment-BVrBmUae.js","./frustum-BSf00zpj.js","./BufferView-CDwF6SxX.js","./renderState-B0K_fXr7.js","./Indices-6y32yFIA.js","./ShaderBuilder-CrOLBtCv.js"])))=>i.map(i=>d[i]);
import{n as e}from"./Error-BplF0QKp.js";import{n as t}from"./decorators-BTkzlYqr.js";import{a as n,i as r}from"./time-BzYz5R50.js";import{t as i}from"./uid-tFVEb1ZF.js";import{t as a}from"./preload-helper-CRzLMJPS.js";import{r as o}from"./tslib.es6-qUHyP9zl.js";import{c as s}from"./vec3f64-DIOQknMY.js";import{T as c}from"./mathUtils-D79yUFwW.js";import{D as l,w as u}from"./vec2-C5dJMieJ.js";import{t as d}from"./projectBuffer-gC-2pljJ.js";import{n as f}from"./uuid-CxFjXsEJ.js";import{g as p}from"./screenUtils-Bibd7Xdi.js";import{A as m,C as h,I as g,P as _,b as ee,c as v,j as y,n as b,p as x,x as S,y as C}from"./vec3-C5q_s_3T.js";import{t as te}from"./mat4f64-E_FXCKxO.js";import{C as ne,D as w,S as T}from"./mat4-i5hbKyBt.js";import{l as E}from"./vec4-B-G2J025.js";import{c as D,i as O,o as k,r as A}from"./vec4f64-CjgU5APJ.js";import{o as re}from"./vec2f64-IO40D2xB.js";import{h as j,i as M,s as N}from"./enums-CsvnPRfA.js";import{s as ie,t as ae}from"./Texture-C7GphHEp.js";import{g as P,w as F,x as I,y as L}from"./plane-BHXp72G_.js";import{t as oe}from"./computeTranslationToOriginAndRotation-B6qrDN39.js";import{T as se,_ as ce,a as le,b as ue,c as de,f as R,i as z,p as B,s as V,v as fe,w as pe}from"./oitResolution.glsl-CziGeqeq.js";import{c as me,d as he,f as ge,o as _e,s as ve}from"./lineSegment-BVrBmUae.js";import{_ as ye,g as be,l as xe,m as Se,o as Ce,p as we,t as Te}from"./ManagedTexture-CoIW9HsA.js";import{At as Ee,B as De,C as Oe,D as ke,E as Ae,F as je,Ft as Me,I as Ne,It as Pe,K as Fe,Kt as Ie,L as Le,N as Re,Nt as ze,O as Be,Ot as Ve,P as He,Pt as Ue,T as We,Z as Ge,a as Ke,d as qe,f as Je,i as Ye,j as Xe,jt as Ze,kt as Qe,l as $e,m as et,o as tt,p as nt,qt as rt,s as it,tt as at,ut as ot,wt as st}from"./doublePrecisionUtils-BljtQ88P.js";import{a as ct,c as lt,s as ut}from"./WebGLLayer-CSjiX3HS.js";import{a as dt,n as ft}from"./InterleavedLayout-BTxFaBv0.js";import{Y as pt,et as mt}from"./BufferView-CDwF6SxX.js";import{i as ht,n as gt,s as _t}from"./renderState-B0K_fXr7.js";import{t as vt}from"./ShaderBuilder-CrOLBtCv.js";var yt=B`vec4(0.0, 0.0, 2.0, 1.0)`;function bt(e,t,n,r,i,a,o,s,c,l,u){let f=Pt[u.mode],p,m,h=0;if(d(e,t,n,r,c.spatialReference,i,s))return f?.requiresAlignment(u)?(h=f.applyElevationAlignmentBuffer(r,i,a,o,s,c,l,u),p=a,m=o):(p=r,m=i),d(p,c.spatialReference,m,a,l.spatialReference,o,s)?h:void 0}function xt(e,t,n,r,i){let a=(lt(e)?e.z:ut(e)?e.array[e.offset+2]:e[2])||0;switch(n.mode){case`on-the-ground`:{let n=ct(t,e,`ground`)??0;i.verticalDistanceToGround=0,i.sampledElevation=n,i.z=n;return}case`relative-to-ground`:{let o=ct(t,e,`ground`)??0,s=n.geometryZWithOffset(a,r);i.verticalDistanceToGround=s,i.sampledElevation=o,i.z=s+o;return}case`relative-to-scene`:{let o=ct(t,e,`scene`)??0,s=n.geometryZWithOffset(a,r);i.verticalDistanceToGround=s,i.sampledElevation=o,i.z=s+o;return}case`absolute-height`:{let o=n.geometryZWithOffset(a,r),s=ct(t,e,`ground`)??0;i.verticalDistanceToGround=o-s,i.sampledElevation=s,i.z=o;return}default:i.z=0;return}}function St(e,t,n,r){return xt(e,t,n,r,It),It.z}function Ct(e,t,n){return t===`on-the-ground`&&n===`on-the-ground`?e.staysOnTheGround:t===n||t!==`on-the-ground`&&n!==`on-the-ground`?t==null||n==null?e.definedChanged:1:e.onTheGroundChanged}function wt(e){return e===`relative-to-ground`||e===`relative-to-scene`}function Tt(e){return e!==`absolute-height`}function Et(e,t,n,r,i){xt(t,n,i,r,It),Dt(e,It.verticalDistanceToGround);let a=It.sampledElevation,o=w(Ft,e.transformation);return Lt[0]=t.x,Lt[1]=t.y,Lt[2]=It.z,oe(t.spatialReference,Lt,o,r.spatialReference)?e.transformation=o:console.warn(`Could not locate symbol object properly, it might be misplaced`),a}function Dt(e,t){for(let n=0;n<e.geometries.length;++n){let r=e.geometries[n].getMutableAttribute(`groundDistance`);r&&r.data[0]!==t&&(r.data[0]=t,e.geometryVertexAttributeUpdated(e.geometries[n],`groundDistance`))}}function Ot(e,t,n,r,i,a){let o=0,s=a.spatialReference;t*=3,r*=3;for(let c=0;c<i;++c){let i=e[t],c=e[t+1],l=e[t+2],u=a.getElevation(i,c,l,s,`ground`)??0;o+=u,n[r]=i,n[r+1]=c,n[r+2]=u,t+=3,r+=3}return o/i}function kt(e,t,n,r,i,a,o,s){let c=0,l=s.calculateOffsetRenderUnits(o),u=s.featureExpressionInfoContext,d=a.spatialReference;t*=3,r*=3;for(let o=0;o<i;++o){let i=e[t],o=e[t+1],s=e[t+2],f=a.getElevation(i,o,s,d,`ground`)??0;c+=f,n[r]=i,n[r+1]=o,n[r+2]=u==null?s+f+l:f+l,t+=3,r+=3}return c/i}function At(e,t,n,r,i,a,o,s){let c=0,l=s.calculateOffsetRenderUnits(o),u=s.featureExpressionInfoContext,d=a.spatialReference;t*=3,r*=3;for(let o=0;o<i;++o){let i=e[t],o=e[t+1],s=e[t+2],f=a.getElevation(i,o,s,d,`scene`)??0;c+=f,n[r]=i,n[r+1]=o,n[r+2]=u==null?s+f+l:f+l,t+=3,r+=3}return c/i}function jt(e){let t=e.meterUnitOffset,n=e.featureExpressionInfoContext;return t!==0||n!=null}function Mt(e,t,n,r,i,a,o,s){let c=s.calculateOffsetRenderUnits(o),l=s.featureExpressionInfoContext;t*=3,r*=3;for(let a=0;a<i;++a){let i=e[t],a=e[t+1],o=e[t+2];n[r]=i,n[r+1]=a,n[r+2]=l==null?o+c:c,t+=3,r+=3}return 0}var Nt=class{constructor(){this.verticalDistanceToGround=0,this.sampledElevation=0,this.z=0}},Pt={"absolute-height":{applyElevationAlignmentBuffer:Mt,requiresAlignment:jt},"on-the-ground":{applyElevationAlignmentBuffer:Ot,requiresAlignment:()=>!0},"relative-to-ground":{applyElevationAlignmentBuffer:kt,requiresAlignment:()=>!0},"relative-to-scene":{applyElevationAlignmentBuffer:At,requiresAlignment:()=>!0}},Ft=te(),It=new Nt,Lt=s(),H={dash:[4,3],dot:[1,3],"long-dash":[8,3],"short-dash":[4,1],"short-dot":[1,1]},Rt={dash:H.dash,"dash-dot":[...H.dash,...H.dot],dot:H.dot,"long-dash":H[`long-dash`],"long-dash-dot":[...H[`long-dash`],...H.dot],"long-dash-dot-dot":[...H[`long-dash`],...H.dot,...H.dot],none:null,"short-dash":H[`short-dash`],"short-dash-dot":[...H[`short-dash`],...H[`short-dot`]],"short-dash-dot-dot":[...H[`short-dash`],...H[`short-dot`],...H[`short-dot`]],"short-dot":H[`short-dot`],solid:null},zt=8,Bt=class{constructor(e,t,n){this.image=e,this.width=t,this.length=n,this.uuid=f()}};function Vt(e){return e!=null&&`image`in e}function Ht(e,t){return e==null?e:{pattern:e.slice(),pixelRatio:t}}function Ut(e){return{pattern:[e,e],pixelRatio:2}}function Wt(e){switch(e?.type){case`style`:return Gt(e.style);case`image`:return new Bt(e.image,e.width,e.length);case void 0:case null:return null}return null}function Gt(e){return e==null?null:Ht(Rt[e],zt)}var Kt=8;function qt(e,t){let{vertex:n,attributes:r}=e;n.uniforms.add(new V(`intrinsicWidth`,e=>e.width));let{hasScreenSizePerspective:i,spherical:a}=t;i?(e.include(be,t),ye(n),Ee(n,t),n.uniforms.add(new Ue(`inverseViewMatrix`,(e,t)=>T(Jt,ne(Jt,t.camera.viewMatrix,e.origin)))),n.code.add(B`
      float applyLineSizeScreenSizePerspective(float size, vec3 pos) {
        vec3 worldPos = (inverseViewMatrix * vec4(pos, 1)).xyz;
        vec3 groundUp = ${a?B`normalize(worldPos + localOrigin)`:B`vec3(0.0, 0.0, 1.0)`};
        float absCosAngle = abs(dot(groundUp, normalize(worldPos - cameraPosition)));

        return screenSizePerspectiveScaleFloat(size, absCosAngle, length(pos), screenSizePerspective);
      }
    `)):n.code.add(B`float applyLineSizeScreenSizePerspective(float size, vec3 pos) {
return size;
}`),t.hasVVSize?(r.add(`sizeFeatureAttribute`,`float`),n.uniforms.add(new de(`vvSizeMinSize`,e=>e.vvSize.minSize),new de(`vvSizeMaxSize`,e=>e.vvSize.maxSize),new de(`vvSizeOffset`,e=>e.vvSize.offset),new de(`vvSizeFactor`,e=>e.vvSize.factor),new de(`vvSizeFallback`,e=>e.vvSize.fallback)),n.code.add(B`
    float getSize(${R(i,`vec3 pos`)}) {
      float size = isnan(sizeFeatureAttribute)
        ? vvSizeFallback.x
        : intrinsicWidth * clamp(vvSizeOffset + sizeFeatureAttribute * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).x;

      return ${R(i,`applyLineSizeScreenSizePerspective(size, pos)`,`size`)};
    }
    `)):(r.add(`size`,`float`),n.code.add(B`
    float getSize(${R(i,`vec3 pos`)}) {
      float fullSize = intrinsicWidth * size;
      return ${R(i,`applyLineSizeScreenSizePerspective(fullSize, pos)`,`fullSize`)};
    }
    `)),t.hasVVOpacity?(r.add(`opacityFeatureAttribute`,`float`),n.constants.add(`vvOpacityNumber`,`int`,8),n.uniforms.add(new De(`vvOpacityValues`,Kt,e=>e.vvOpacity.values),new De(`vvOpacityOpacities`,Kt,e=>e.vvOpacity.opacityValues),new V(`vvOpacityFallback`,e=>e.vvOpacity.fallback,{supportsNaN:!0})),n.code.add(B`
    float interpolateOpacity(float value) {
      if (value <= vvOpacityValues[0]) {
        return vvOpacityOpacities[0];
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f);
        }
      }

      return vvOpacityOpacities[vvOpacityNumber - 1];
    }

    vec4 applyOpacity(vec4 color) {
      if (isnan(opacityFeatureAttribute)) {
        // If there is a color vv then it will already have taken care of applying the fallback
        return ${R(t.hasVVColor,`color`,`vec4(color.rgb, vvOpacityFallback)`)};
      }

      return vec4(color.rgb, interpolateOpacity(opacityFeatureAttribute));
    }
    `)):n.code.add(B`vec4 applyOpacity(vec4 color) {
return color;
}`),t.hasVVColor?(e.include(Ne,t),r.add(`colorFeatureAttribute`,`float`),n.code.add(B`vec4 getColor() {
vec4 color = interpolateVVColor(colorFeatureAttribute);
if (isnan(color.r)) {
return vec4(0);
}
return applyOpacity(color);
}`)):(r.add(`color`,`vec4`),n.code.add(B`vec4 getColor() {
return applyOpacity(color);
}`))}var Jt=te();function Yt(e){e.vertex.code.add(`#define noPerspectiveWrite(x, w) (x * w)`)}function Xt(e){e.fragment.code.add(`#define noPerspectiveRead(x) (x * gl_FragCoord.w)`)}var Zt=class{constructor(e,t,n){this._createTexture=e,this._parametersKey=t,this._repository=new Map,this._orphanCache=n.newCache(`procedural-texture-repository:${i()}`,e=>e.dispose())}destroy(){for(let{texture:e}of this._repository.values())e.dispose();this._repository.clear(),this._orphanCache.destroy()}swap(e,t=null){let n=this._acquire(e);return this.release(t),n}release(e){if(e==null)return;let t=this._parametersKey(e),n=this._repository.get(t);if(n&&(n.refCount--,n.refCount===0)){this._repository.delete(t);let{texture:e}=n;this._orphanCache.put(t,e)}}_acquire(e){if(e==null)return null;let t=this._parametersKey(e),n=this._repository.get(t);if(n)return n.refCount++,n.texture;let r=this._orphanCache.pop(t)??this._createTexture(e),i=new Qt(r);return this._repository.set(t,i),r}},Qt=class{constructor(e){this.texture=e,this.refCount=1}};function $t(e,t){return new Zt(t=>{if(Vt(t))return rn(e,t.image);let{data:n,textureSize:r}=en(t),i=new ie(r,1);return i.dataType=N.FLOAT,i.pixelFormat=6403,i.internalFormat=M.R16F,i.wrapMode=10497,new ae(e,i,n)},e=>Vt(e)?`image-${e.uuid}`:`${e.pattern.join(`,`)}-r${e.pixelRatio}`,t)}function en(e){let t=tn(e),n=1/e.pixelRatio,r=nn(e),i=[],a=1;for(let e of t){for(let t=0;t<e;t++){let r=a*(Math.min(t,e-1-t)+.5)*n;i.push(r)}a=-a}let o=Math.round(t[0]/2);return{data:new Float32Array([...i.slice(o),...i.slice(0,o)]),textureSize:r}}function tn(e){return e.pattern.map(t=>Math.round(t*e.pixelRatio))}function nn(e){if(e==null)return 1;let t=tn(e);return Math.floor(t.reduce((e,t)=>e+t))}function rn(e,t){let{data:n,width:r,height:i}=t,a=new ie(r,i);return a.dataType=N.UNSIGNED_BYTE,a.pixelFormat=6408,a.internalFormat=M.RGBA8,a.wrapMode={s:10497,t:33071},a.hasMipmap=!0,a.samplingMode=9987,new ae(e,a,n)}function an(e){return e==null?A:e.length===4?e:E(on,e[0],e[1],e[2],1)}var on=k();function sn(e,t){if(!t.stippleEnabled)return void e.fragment.code.add(B`float getStippleAlpha(float lineWidth) { return 1.0; }
void discardByStippleAlpha(float stippleAlpha, float threshold) {}
vec4 blendStipple(vec4 color, float stippleAlpha) { return color; }`);let n=!(t.draped&&t.stipplePreferContinuous),{vertex:r,fragment:i}=e;t.draped||(Ee(r,t),r.uniforms.add(new Pe(`worldToScreenPerDistanceRatio`,({camera:e})=>1/e.perScreenPixelRatio)).code.add(B`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),e.varyings.add(`vStippleDistance`,`float`),e.varyings.add(`vStippleDistanceLimits`,`vec2`),e.varyings.add(`vStipplePatternStretch`,`float`),r.code.add(B`
    float discretizeWorldToScreenRatio(float worldToScreenRatio) {
      float step = ${B.float(ln)};

      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);
      return discreteWorldToScreenRatio;
    }
  `),ze(r),r.code.add(B`
    vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {

      // First check if the segment is long enough to support fully screen space patterns.
      // Force sparse mode for segments that are very large in screen space even if it is not allowed,
      // to avoid imprecision from calculating with large floats.
      if (segmentLengthPseudoScreen >= ${n?`patternLength`:`1e4`}) {
        // Round the screen length to get an integer number of pattern repetitions (minimum 1).
        float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
        float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
        float segmentLengthScreenRounded = flooredRepetitions * patternLength;

        float stretch = repetitions / flooredRepetitions;

        // We need to impose a lower bound on the stretch factor to prevent the dots from merging together when there is only 1 repetition.
        // 0.75 is the lowest possible stretch value for flooredRepetitions > 1, so it makes sense as lower bound.
        vStipplePatternStretch = max(0.75, stretch);

        return vec2(0.0, segmentLengthScreenRounded);
      }
      return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
    }
  `),i.uniforms.add(new le(`stipplePatternTexture`,e=>e.stippleTexture),new V(`stipplePatternPixelSizeInv`,e=>1/cn(e))),t.stippleOffColorEnabled&&i.uniforms.add(new Qe(`stippleOffColor`,e=>an(e.stippleOffColor))),e.include(Xt),t.worldSizedImagePattern?(e.varyings.add(`vStippleV`,`float`),e.fragment.include(Ce),i.code.add(B`vec4 getStippleColor(out bool isClamped) {
vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;
float u = vStippleDistance * stipplePatternPixelSizeInv;
float v = vStippleV == -1.0 ? 0.5 : vStippleV;
return texture(stipplePatternTexture, vec2(u, v));
}
vec4 getStippleColor() {
bool ignored;
return getStippleColor(ignored);
}
float getStippleSDF() {
vec4 color = getStippleColor();
return color.a == 0.0 ? -0.5 : 0.5;
}
float getStippleAlpha(float lineWidth) {
return getStippleColor().a;
}
vec4 blendStipple(vec4 color, float stippleAlpha) {
vec4 stippleColor = getStippleColor();
int mixMode  = 1;
vec3 col = mixExternalColor(color.rgb, vec3(1.0), stippleColor.rgb, mixMode);
float opacity = mixExternalOpacity(color.a, 1.0, stippleColor.a, mixMode);
return vec4(col, opacity);
}`)):i.code.add(B`
    float getStippleSDF(out bool isClamped) {
      float stippleDistanceClamped = noPerspectiveRead(clamp(vStippleDistance, vStippleDistanceLimits.x, vStippleDistanceLimits.y));
      float lineSizeInv = noPerspectiveRead(vLineSizeInv);

      vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
      isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;

      float u = stippleDistanceClamped * stipplePatternPixelSizeInv * lineSizeInv;
      u = fract(u);

      float sdf = texture(stipplePatternTexture, vec2(u, 0.5)).r;

      return (sdf - 0.5) * vStipplePatternStretch + 0.5;
    }

    float getStippleSDF() {
      bool ignored;
      return getStippleSDF(ignored);
    }

    float getStippleAlpha(float lineWidth) {
      bool isClamped;
      float stippleSDF = getStippleSDF(isClamped);
      float antiAliasedResult = clamp(stippleSDF * lineWidth + 0.5, 0.0, 1.0);
      return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
    }

    vec4 blendStipple(vec4 color, float stippleAlpha) {
      return ${t.stippleOffColorEnabled?`mix(color, stippleOffColor, stippleAlpha)`:`vec4(color.rgb, color.a * stippleAlpha)`};
    }
  `),i.code.add(B`
    void discardByStippleAlpha(float stippleAlpha, float threshold) {
     ${R(!t.stippleOffColorEnabled,`if (stippleAlpha < threshold) { discard; }`)}
    }
  `)}function cn(e){let t=e.stipplePattern;return Vt(t)?t.length:t?nn(t)/t.pixelRatio:1}var ln=.4,U=.5,un=O(U/2,U/2,1-U/2,1-U/2);function dn(e){return e===`cross`||e===`x`}function fn(e,t=128,n=t*U,r=0){let{data:i,parameters:a}=pn(e,t,n,r);return new Te(i,a)}function pn(e,t=128,n=t*U,r=0){return{data:mn(e,t,n,r),parameters:{mipmap:!1,wrap:{s:33071,t:33071},width:t,height:t,noUnpackFlip:!0,dataType:N.FLOAT,pixelFormat:6403,internalFormat:M.R16F,reloadable:!0}}}function mn(e,t=128,n=t*U,r=0){switch(e){case`circle`:default:return hn(t,n);case`square`:return gn(t,n);case`cross`:return vn(t,n,r);case`x`:return yn(t,n,r);case`kite`:return _n(t,n);case`triangle`:return bn(t,n);case`arrow`:return xn(t,n)}}function hn(e,t){let n=e/2-.5;return En(e,wn(n,n,t/2))}function gn(e,t){return Sn(e,t,!1)}function _n(e,t){return Sn(e,t,!0)}function vn(e,t,n=0){return Cn(e,t,!1,n)}function yn(e,t,n=0){return Cn(e,t,!0,n)}function bn(e,t){return En(e,Tn(e/2,t,t/2))}function xn(e,t){let n=t,r=t/2,i=e/2,a=.8*n,o=wn(i,(e-t)/2-a,Math.sqrt(a*a+r*r)),s=Tn(i,n,r);return En(e,(e,t)=>Math.max(s(e,t),-o(e,t)))}function Sn(e,t,n){return n&&(t/=Math.SQRT2),En(e,(r,i)=>{let a=r-.5*e+.25,o=.5*e-i-.75;if(n){let e=(a+o)/Math.SQRT2;o=(o-a)/Math.SQRT2,a=e}return Math.max(Math.abs(a),Math.abs(o))-.5*t})}function Cn(e,t,n,r=0){t-=r,n&&(t*=Math.SQRT2);let i=.5*t;return En(e,(t,a)=>{let o,s=t-.5*e,c=.5*e-a-1;if(n){let e=(s+c)/Math.SQRT2;c=(c-s)/Math.SQRT2,s=e}return s=Math.abs(s),c=Math.abs(c),o=s>c?s>i?Math.sqrt((s-i)*(s-i)+c*c):c:c>i?Math.sqrt(s*s+(c-i)*(c-i)):s,o-=r/2,o})}function wn(e,t,n){return(r,i)=>{let a=r-e,o=i-t;return Math.sqrt(a*a+o*o)-n}}function Tn(e,t,n){let r=Math.sqrt(t*t+n*n);return(i,a)=>{let o=Math.abs(i-e)-n,s=a-e+t/2+.75,c=(t*o+n*s)/r,l=-s;return Math.max(c,l)}}function En(e,t){let n=new Float32Array(e*e);for(let r=0;r<e;r++)for(let i=0;i<e;i++)n[i+e*r]=t(i,r)/e;return n}var Dn=32/5,On=.25;function kn(e,t){let n=mn(e,64,32,Dn),r=new ie(64);return r.internalFormat=M.R16F,r.dataType=N.FLOAT,r.pixelFormat=6403,r.wrapMode=33071,new ae(t,r,n)}function An(e,t){let n=e.vertex,r=t.hasScreenSizePerspective;ze(n),n.uniforms.get(`markerScale`)??n.constants.add(`markerScale`,`float`,1),n.constants.add(`markerSizePerLineWidth`,`float`,10).code.add(B`
  float getLineWidth(${R(r,`vec3 pos`)}) {
     return max(getSize(${R(r,`pos`)}), 1.0) * pixelRatio;
  }

  float getScreenMarkerSize(float lineWidth) {
    return markerScale * markerSizePerLineWidth * lineWidth;
  }
  `),t.space===2&&(n.constants.add(`maxSegmentLengthFraction`,`float`,.45),n.uniforms.add(new Pe(`perRenderPixelRatio`,e=>e.camera.perRenderPixelRatio)),n.code.add(B`
  bool areWorldMarkersHidden(vec3 pos, vec3 other) {
    vec3 midPoint = mix(pos, other, 0.5);
    float distanceToCamera = length(midPoint);
    float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
    float worldMarkerSize = getScreenMarkerSize(getLineWidth(${R(r,`pos`)})) * screenToWorldRatio;
    float segmentLen = length(pos - other);
    return worldMarkerSize > maxSegmentLengthFraction * segmentLen;
  }

  float getWorldMarkerSize(vec3 pos) {
    float distanceToCamera = length(pos);
    float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
    return getScreenMarkerSize(getLineWidth(${R(r,`pos`)})) * screenToWorldRatio;
  }
  `))}var jn=.1,Mn=r(1),Nn=r(1),Pn=1e3,Fn=27e6;function In(e,t){let{hasAnimation:n,animation:r}=t;if(!n)return;let{attributes:i,varyings:a,vertex:o,fragment:s}=e;i.add(`timeStamps`,`vec4`),a.add(`vTimeStamp`,`float`),a.add(`vFirstTime`,`float`),a.add(`vLastTime`,`float`),a.add(`vTransitionType`,`float`),o.main.add(B`vTimeStamp = timeStamps.x;
vFirstTime = timeStamps.y;
vLastTime = timeStamps.z;
vTransitionType = timeStamps.w;`),r===3&&s.constants.add(`decayRate`,`float`,2.3),s.code.add(B`
    float getTrailOpacity(float x) {
      if (x < 0.0) {
        return 0.0;
      }

      ${Ln(r)}
    }`),s.uniforms.add(new V(`timeElapsed`,e=>e.timeElapsed),new V(`trailLength`,e=>e.trailLength),new V(`speed`,e=>e.animationSpeed),new we(`startEndTime`,e=>l(Rn,e.startTime,e.endTime))),s.constants.add(`fadeInTime`,`float`,Nn),s.constants.add(`fadeOutTime`,`float`,Mn),s.constants.add(`incomingTransition`,`int`,0),s.constants.add(`outgoingTransition`,`int`,2),s.code.add(B`float fadeIn(float x) {
return smoothstep(0.0, fadeInTime, x);
}
float fadeOut(float x) {
return isinf(fadeOutTime) ? 1.0 : smoothstep(fadeOutTime, 0.0, x);
}
void updateAlphaIf(inout float alpha, bool condition, float newAlpha) {
alpha = condition ? min(alpha, newAlpha) : alpha;
}
vec4 animate(vec4 color) {
float startTime = startEndTime[0];
float endTime = startEndTime[1];
float totalTime = vLastTime - vFirstTime;
float actualFadeOutTime = min(fadeOutTime * speed, trailLength);
float longStreamlineThreshold = (fadeInTime + 1.0) * speed + actualFadeOutTime;
bool longStreamline = totalTime > longStreamlineThreshold;
float totalTimeWithFadeOut = longStreamline && actualFadeOutTime != trailLength ? totalTime : totalTime + actualFadeOutTime;
float fadeOutStartTime = longStreamline ? totalTime - actualFadeOutTime : totalTime;
float originTime =  -vFirstTime;
float actualEndTime = int(vTransitionType) == outgoingTransition ? min(endTime, startTime + vLastTime / speed) : endTime;
vec4 animatedColor = color;
if (speed == 0.0) {
float alpha = getTrailOpacity((totalTimeWithFadeOut - (vTimeStamp - vFirstTime)) / trailLength);
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
animatedColor.a *= alpha;
return animatedColor;
}
float relativeStartTime = mod(startTime, totalTimeWithFadeOut);
float shiftedTimeElapsed = timeElapsed - relativeStartTime + originTime;
float headRelativeToFirst = mod(shiftedTimeElapsed * speed, totalTimeWithFadeOut);
float vRelativeToHead = headRelativeToFirst - originTime - vTimeStamp;
float vAbsoluteTime = timeElapsed - vRelativeToHead / speed;
if (startTime > timeElapsed) {
return vec4(0.0);
}
float alpha = getTrailOpacity(vRelativeToHead / trailLength);
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, int(vTransitionType) != incomingTransition, step(startTime, vAbsoluteTime));
updateAlphaIf(alpha, headRelativeToFirst > fadeOutStartTime, fadeOut((headRelativeToFirst - fadeOutStartTime) / speed));
alpha *= fadeIn(vTimeStamp - vFirstTime);
animatedColor.a *= alpha;
return animatedColor;
}`)}function Ln(e){switch(e){case 2:return`return x >= 0.0 && x <= 1.0 ? 1.0 : 0.0;`;case 3:return`float cutOff = exp(-decayRate);
        return (exp(-decayRate * x) - cutOff) / (1.0 - cutOff);`;default:return`return 1.0;`}}var Rn=re(),zn=1;function Bn(e){let t=new vt,{attributes:n,varyings:r,vertex:i,fragment:a}=t,{applyMarkerOffset:o,draped:s,output:c,capType:l,stippleEnabled:u,falloffEnabled:d,roundJoins:f,wireframe:p,innerColorEnabled:m,hasAnimation:h,hasScreenSizePerspective:g,worldSizedImagePattern:_}=e;i.inputs.add(`position`,()=>`position`),a.include(xe),t.include(qt,e),t.include(sn,e),t.include(Ge,e),t.include(In,e);let ee=o&&!s;ee&&(i.uniforms.add(new V(`markerScale`,e=>e.markerScale)),t.include(An,{space:2,hasScreenSizePerspective:g})),Ze(i,e),i.uniforms.add(new Me(`inverseProjectionMatrix`,e=>e.camera.inverseProjectionMatrix),new Fe(`nearFar`,e=>e.camera.nearFar),new V(`miterLimit`,e=>e.join===`miter`?e.miterLimit:0),new Se(`viewport`,e=>e.camera.fullViewport)),i.constants.add(`LARGE_HALF_FLOAT`,`float`,65500),i.constants.add(`EPS`,`float`,.001),i.constants.add(`NUM_JOIN_SUBDIVISIONS`,`float`,e.numJoinSubdivisions),n.add(`position`,`vec3`),n.add(`previousDelta`,`vec4`),n.add(`nextDelta`,`vec4`),n.add(`lineParameters`,`vec2`),n.add(`u0`,`float`),r.add(`vColor`,`vec4`),r.add(`vpos`,`vec3`,{invariant:!0}),r.add(`vLineDistance`,`float`),r.add(`vLineWidth`,`float`),u||(r.add(`vIsInsideJoin`,`int`),r.add(`vStretchFactor`,`float`),r.add(`vJoinCenterLineSDFs`,`vec2`),r.add(`vSubdivisionFactor`,`float`));let v=u;v&&r.add(`vLineSizeInv`,`float`);let y=l===2,b=u&&y,x=d||b;x&&r.add(`vLineDistanceNorm`,`float`),y&&(r.add(`vSegmentSDF`,`float`),r.add(`vReverseSegmentSDF`,`float`)),i.code.add(B`vec3 perpendicular(vec3 v) {
return vec3(v.y, -v.x, 0.0);
}
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec3 rotateZ(vec3 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return vec3(m * v.xy, v.z);
}`),i.code.add(B`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
posNdc.z /= posNdc.w;
return posNdc;
}`),i.code.add(B`void clip(
inout vec4 pos,
inout vec4 prev,
inout vec4 next,
bool isStartVertex
) {
float vnp = nearFar[0] * 0.99;
if (pos.z > -nearFar[0]) {
if (!isStartVertex) {
if (prev.z < -nearFar[0]) {
pos = mix(prev, pos, interp(vnp, prev, pos));
next = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
} else {
if (next.z < -nearFar[0]) {
pos = mix(pos, next, interp(vnp, pos, next));
prev = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
}
} else {
if (prev.z > -nearFar[0]) {
prev = mix(pos, prev, interp(vnp, pos, prev));
}
if (next.z > -nearFar[0]) {
next = mix(next, pos, interp(vnp, next, pos));
}
}
}`),ze(i),i.constants.add(`aaWidth`,`float`,+!u).main.add(B`
    // unpack values from vertex type
    bool isStartVertex = abs(abs(lineParameters.y) - 3.0) == 1.0;
    vec3 prevPosition = position + previousDelta.xyz * previousDelta.w;
    vec3 nextPosition = position + nextDelta.xyz * nextDelta.w;

    float coverage = 1.0;

    // Check for special value of lineParameters.y which is used by the Renderer when graphics are removed before the
    // VBO is recompacted. If this is the case, then we just project outside of clip space.
    if (lineParameters.y == 0.0) {
      gl_Position = ${yt};
    }
    else {
      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      vec4 next = view * vec4(nextPosition, 1.0);

      bool isJoin = abs(lineParameters.y) < 3.0;
  `),ee&&i.main.add(B`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos.xyz, other.xyz);
if (!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos.xyz) * 0.5;
}`),t.include(Yt),i.main.add(B`
      clip(pos, prev, next, isStartVertex);

      vec3 clippedPos = pos.xyz;
      vec3 clippedCenter = mix(pos.xyz, isStartVertex ? next.xyz : prev.xyz, 0.5);

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);

      vec3 left = (pos.xyz - prev.xyz);
      vec3 right = (next.xyz - pos.xyz);

      float leftLen = length(left);
      float rightLen = length(right);

      float lineSize = getSize(${R(g,`clippedPos`)});
      ${R(u&&g,`float patternLineSize = getSize(clippedCenter);`)}
      ${R(u&&!g,`float patternLineSize = lineSize;`)}

      ${R(_,B`
          lineSize += aaWidth;
          float lineWidth = lineSize * pixelRatio * worldToScreenRatio;
          if (lineWidth < 1.0) {
            coverage = lineWidth;
            lineWidth = 1.0;
          }
        `,B`
          if (lineSize < 1.0) {
            coverage = lineSize; // convert sub-pixel coverage to alpha
            lineSize = 1.0;
          }

          lineSize += aaWidth;
          float lineWidth = lineSize * pixelRatio;
        `)}

      vLineWidth = noPerspectiveWrite(lineWidth, pos.w);
      ${v?B`vLineSizeInv = noPerspectiveWrite(1.0 / lineSize, pos.w);`:``}
  `),(u||y)&&i.main.add(B`
      float isEndVertex = float(!isStartVertex);
      vec3 segmentOrigin = mix(pos.xyz, prev.xyz, isEndVertex);
      vec3 segment = mix(right, left, isEndVertex);
      ${y?B`vec3 segmentEnd = mix(next.xyz, pos.xyz, isEndVertex);`:``}
    `),i.main.add(B`left = (leftLen > EPS) ? left/leftLen : vec3(0.0, 0.0, 0.0);
right = (rightLen > EPS) ? right/rightLen : vec3(0.0, 0.0, 0.0);
vec3 segmentDirection = isStartVertex ? right : left;
vec3 capDisplacementDir = vec3(0.0, 0.0, 0.0);
vec3 joinDisplacementDir = vec3(0.0, 0.0, 0.0);
float displacementLen = lineWidth;
float miterDisplacementLen = lineWidth;
float innerDisplacementLen = lineWidth;`),u||i.main.add(B`vIsInsideJoin = 0;
vStretchFactor = 1.0;
vSubdivisionFactor = 0.0;
vJoinCenterLineSDFs = vec2(LARGE_HALF_FLOAT);`),i.main.add(B`float subdivisionFactor = 0.0;
bool isOutside = false;
if (isJoin) {
isOutside = (left.x * right.y - left.y * right.x) * lineParameters.y > 0.0;
vec3 joinDirection = normalize(left + right);
joinDisplacementDir = perpendicular(joinDirection);
if (leftLen > EPS && rightLen > EPS) {
float nDotSeg = dot(joinDisplacementDir, left);
displacementLen /= length(nDotSeg * left - joinDisplacementDir);
miterDisplacementLen = displacementLen;
innerDisplacementLen = min(displacementLen, min(leftLen, rightLen)/abs(nDotSeg));
if (!isOutside) {
displacementLen = innerDisplacementLen;
}
}
subdivisionFactor = lineParameters.x;`),u||i.main.add(B`if(subdivisionFactor > 0.0) {
vIsInsideJoin = 1;
}
vSubdivisionFactor = isOutside ? subdivisionFactor : 0.5;
if (miterDisplacementLen > miterLimit * lineWidth) {
vec2 leftScreenDir = left.xy;
vec2 rightScreenDir = right.xy;
float leftScreenLen = length(leftScreenDir);
float rightScreenLen = length(rightScreenDir);
if (leftScreenLen > EPS && rightScreenLen > EPS) {
leftScreenDir /= leftScreenLen;
rightScreenDir /= rightScreenLen;
float theta = acos(clamp(dot(leftScreenDir, rightScreenDir), -1.0, 1.0));
float subdividedTriangleHeight = (innerDisplacementLen + lineWidth) * cos(theta / (2.0 + 2.0 * NUM_JOIN_SUBDIVISIONS));
float bevelTriangleHeight = innerDisplacementLen + lineWidth * cos(theta * 0.5);
float triangleHeight = NUM_JOIN_SUBDIVISIONS > 0.0 ? subdividedTriangleHeight : bevelTriangleHeight;
vStretchFactor = noPerspectiveWrite(max(triangleHeight / (2.0 * lineWidth), 1.0), pos.w);
}
}`),i.main.add(B`if (isOutside && (displacementLen > miterLimit * lineWidth)) {`),f?i.main.add(B`
        vec3 startDir = leftLen < EPS ? right : left;
        startDir = perpendicular(startDir);

        vec3 endDir = rightLen < EPS ? left : right;
        endDir = perpendicular(endDir);

        float factor = ${u?B`min(1.0, subdivisionFactor * ((NUM_JOIN_SUBDIVISIONS + 1.0) / NUM_JOIN_SUBDIVISIONS))`:B`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir.xy, endDir.xy), -1.0, 1.0));
        joinDisplacementDir = rotateZ(startDir, -sign(lineParameters.y) * factor * rotationAngle);
      `):i.main.add(B`
        vec3 startDir = perpendicular(leftLen < EPS ? right : left);
        vec3 endDir = perpendicular(rightLen < EPS ? left : right);

        ${R(u,B`joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? endDir : startDir;`,B`joinDisplacementDir = mix(startDir, endDir, subdivisionFactor);`)}
  `);let S=l!==0;return i.main.add(B`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = perpendicular(joinDisplacementDir);

      ${S?B`capDisplacementDir = vec3((isStartVertex ? -right : left).xy, 0.0);`:``}
    }
  `),i.main.add(B`
    // Displacement (in pixels) caused by join/or cap
    vec2 dposXY = (joinDisplacementDir.xy * sign(lineParameters.y) + capDisplacementDir.xy) * displacementLen;

    /**
     * To prevent z-fighting between layers, we also adjust the z value.
     * We want to ensure that the orientation of the final triangles is the same, regardless of the line width.
     * To do so, the below formula projects the xy displacement onto the original segment direction
     * to find the z-offset necessary so the triangle orientation is independent of the width.
     */
    float dposZ = dot(dposXY, segmentDirection.xy) / dot(segmentDirection.xy, segmentDirection.xy) * segmentDirection.z;
    vec3 dpos = vec3(dposXY, dposZ);

    float lineDistNorm = noPerspectiveWrite(sign(lineParameters.y), pos.w);

    vLineDistance = lineWidth * lineDistNorm;
    ${x?B`vLineDistanceNorm = lineDistNorm;`:``}

    pos.xyz += dpos;
  `),u||i.main.add(B`if (isJoin) {
vec2 joinCenterToVertex = dposXY;
vec2 leftCenterlineDir = left.xy;
vec2 rightCenterlineDir = right.xy;
float leftCenterlineLen = length(leftCenterlineDir);
float rightCenterlineLen = length(rightCenterlineDir);
leftCenterlineDir = leftCenterlineLen > EPS ? leftCenterlineDir / leftCenterlineLen : vec2(1.0, 0.0);
rightCenterlineDir = rightCenterlineLen > EPS ? rightCenterlineDir / rightCenterlineLen : leftCenterlineDir;
vJoinCenterLineSDFs = noPerspectiveWrite(
vec2(
dot(vec2(rightCenterlineDir.y, -rightCenterlineDir.x), joinCenterToVertex),
dot(vec2(leftCenterlineDir.y, -leftCenterlineDir.x), joinCenterToVertex)
),
pos.w
);
}`),y&&i.main.add(B`vec2 segmentDir = normalize(segment.xy);
vSegmentSDF = noPerspectiveWrite((isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin.xy, segmentDir)), pos.w);
vReverseSegmentSDF = noPerspectiveWrite((isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd.xy, -segmentDir)), pos.w);`),u&&(s?i.uniforms.add(new Pe(`worldToScreenRatio`,e=>1/e.screenToPCSRatio)):i.main.add(B`vec3 segmentCenter = mix((nextPosition + position) * 0.5, (position + prevPosition) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),i.main.add(B`float segmentLengthScreenDouble = length(segment.xy);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(nextPosition - position, position - prevPosition, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),s?i.main.add(B`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = u0 * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):i.main.add(B`float startPseudoScreen = mix(u0, u0 - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),i.uniforms.add(new V(`stipplePatternPixelSize`,e=>cn(e))),i.main.add(B`
      float patternLength = patternLineSize * stipplePatternPixelSize;

      ${R(_,B`
          float uu = mix(u0, u0 - segmentLengthRender, isEndVertex);
          vStippleDistanceLimits = vec2(uu, uu + segmentLengthRender);
          vStipplePatternStretch = 1.0;

          // The v-coordinate used in case of an image pattern.
          bool isLeft = sign(lineParameters.y) < 0.0;
          vStippleV = isLeft ? 0.0 : 1.0;
        `,B`
          // Compute the coordinates at both start and end of the line segment, because we need both to clamp to in the
          // fragment shader
          vStippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
        `)}

      vStippleDistance = mix(vStippleDistanceLimits.x, vStippleDistanceLimits.y, isEndVertex);

      // Adjust the coordinate to the displaced position (the pattern is shortened/overextended on the in/outside of
      // joins)
      if (segmentLengthScreenDouble >= EPS) {
        // Project the actual vertex position onto the line segment. Note that the resulting factor is within [0..1]
        // at the original vertex positions, and slightly outside of that range at the displaced positions
        vec3 stippleDisplacement = pos.xyz - segmentOrigin;
        float stippleDisplacementFactor = dot(segment.xy, stippleDisplacement.xy) / (segmentLengthScreenDouble * segmentLengthScreenDouble);

        // Apply this offset to the actual vertex coordinate (can be screen or pseudo-screen space)
        vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (vStippleDistanceLimits.y - vStippleDistanceLimits.x);
      }

      // Cancel out perspective correct interpolation because we want this length the really represent the screen
      // distance
      vStippleDistanceLimits = noPerspectiveWrite(vStippleDistanceLimits, pos.w);
      vStippleDistance = noPerspectiveWrite(vStippleDistance, pos.w);

      // Disable stipple distance limits on caps
      vStippleDistanceLimits = isJoin ?
                                 vStippleDistanceLimits :
                                 isStartVertex ?
                                  vec2(-1e34, vStippleDistanceLimits.y) :
                                  vec2(vStippleDistanceLimits.x, 1e34);
    `)),i.main.add(B`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;
      pos.z = pos.z * pos.w;

      vColor = getColor();
      vColor.a = noPerspectiveWrite(vColor.a * coverage, pos.w);

      ${p&&!s?`pos.z -= EPS * pos.w;`:``}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }`),t.fragment.include(at,e),t.include(Be,e),a.include(je),a.main.add(B`discardBySlice(vpos);`),t.include(Xt),a.include(Xe),a.main.add(B`
    float lineWidth = noPerspectiveRead(vLineWidth);
    float lineDistance = noPerspectiveRead(vLineDistance);
    ${R(x,B`float lineDistanceNorm = noPerspectiveRead(vLineDistanceNorm);`)}
  `),p?a.main.add(B`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(y&&a.main.add(B`float sdf = noPerspectiveRead(min(vSegmentSDF, vReverseSegmentSDF));
vec2 fragmentPosition = vec2(min(sdf, 0.0), lineDistance);
float fragmentRadius = length(fragmentPosition);
float fragmentCapSDF = (fragmentRadius - lineWidth) * 0.5;
float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);
if (capCoverage < alphaCutoff) {
discard;
}`),b?a.main.add(B`vec2 stipplePosition = vec2(
min(getStippleSDF() * 2.0 - 1.0, 0.0),
lineDistanceNorm
);
float stippleRadius = length(stipplePosition * lineWidth);
float stippleCapSDF = (stippleRadius - lineWidth) * 0.5;
float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
float stippleAlpha = step(alphaCutoff, stippleCoverage);`):a.main.add(B`float stippleAlpha = getStippleAlpha(lineWidth);`),c!==11&&a.main.add(B`discardByStippleAlpha(stippleAlpha, alphaCutoff);`),t.include(Xt),a.uniforms.add(new Qe(`intrinsicColor`,e=>e.color)).main.add(B`vec4 color = intrinsicColor * vColor;
color.a = noPerspectiveRead(color.a);`),m&&a.uniforms.add(new Qe(`innerColor`,e=>e.innerColor??e.color),new V(`innerWidth`,(e,t)=>e.innerWidth*t.camera.pixelRatio)).main.add(B`float distToInner = abs(lineDistance) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`),a.main.add(B`vec4 finalColor = blendStipple(color, stippleAlpha);`),d&&(a.uniforms.add(new V(`falloff`,e=>e.falloff)),a.main.add(B`finalColor.a *= pow(max(0.0, 1.0 - abs(lineDistanceNorm)), falloff);`)),u||a.main.add(B`float stretchFactor = vIsInsideJoin == 1 ? noPerspectiveRead(vStretchFactor) : 1.0;
float featherWidth = 2.0;
float featherStartDistance = max(lineWidth - featherWidth / stretchFactor, 0.0);
float straightFeatherStartDistance = max(lineWidth - featherWidth, 0.0);
float value = abs(lineDistance);
float feather = (value - featherStartDistance) / (lineWidth - featherStartDistance);
vec2 joinCenterSDFs = noPerspectiveRead(vJoinCenterLineSDFs);
float joinCenterDistance = abs(vSubdivisionFactor > 0.5 ? joinCenterSDFs.x : joinCenterSDFs.y);
float straightFeather = (joinCenterDistance - straightFeatherStartDistance) / (lineWidth - straightFeatherStartDistance);
feather = vIsInsideJoin == 1 ? max(feather, straightFeather) : feather;
finalColor.a *= 1.0 - clamp(feather, 0.0, 1.0);`),h&&a.main.add(B`
        finalColor = animate(finalColor);

        ${R(c!==11,B`
            if (finalColor.a <= alphaCutoff) {
              discard;
            }`)}
      `)),a.main.add(B`outputColorHighlightOLID(applySlice(finalColor, vpos), finalColor.rgb);`),t}var Vn=Object.freeze(Object.defineProperty({__proto__:null,build:Bn,ribbonlineNumRoundJoinSubdivisions:1},Symbol.toStringTag,{value:`Module`}));function Hn(e){let t=ft().vec3f(`position`).vec4f16(`previousDelta`).vec4f16(`nextDelta`).f32(`u0`).vec2f16(`lineParameters`);return e.hasVVColor?t.f32(`colorFeatureAttribute`):t.vec4u8(`color`,{glNormalized:!0}),e.hasVVSize?t.f32(`sizeFeatureAttribute`):t.f32(`size`),e.hasVVOpacity&&t.f32(`opacityFeatureAttribute`),Ie()&&t.vec4u8(`olidColor`),e.hasAnimation&&t.vec4f16(`timeStamps`),t}var Un=class extends Re{constructor(e,t){super(e,t,dt(Hn(t))),this.shader=new He(Vn,()=>a(()=>import(`./RibbonLine.glsl-CDNAcxpl.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71]),import.meta.url)),this.ignoreUnused=!0,this.primitiveType=t.wireframe?j.LINES:j.TRIANGLE_STRIP}_makePipelineState(e,t){let{output:n,hasOccludees:r}=e;return gt({blending:ke(n,!1,e.emissionDimmingPass),depthTest:Ae(n),depthWrite:We(e),colorWrite:_t,stencilWrite:r?qe:null,stencilTest:r?t?nt:Ye:null,polygonOffset:Oe(e)})}initializePipeline(e){if(e.occluder){let{hasOccludees:t}=e;this._occluderPipelineTransparent=gt({blending:ht,polygonOffset:Oe(e),depthTest:it,depthWrite:null,colorWrite:_t,stencilWrite:null,stencilTest:t?$e:null}),this._occluderPipelineOpaque=gt({blending:ht,polygonOffset:Oe(e),depthTest:t?it:Je,depthWrite:null,colorWrite:_t,stencilWrite:t?Ke:null,stencilTest:t?tt:null}),this._occluderPipelineMaskWrite=gt({blending:null,polygonOffset:Oe(e),depthTest:Je,depthWrite:null,colorWrite:null,stencilWrite:t?qe:null,stencilTest:t?nt:null})}return this._occludeePipeline=this._makePipelineState(e,!0),this._makePipelineState(e,!1)}getPipeline(e,t,n){if(n)return this._occludeePipeline;switch(e.occluder){case 11:return this._occluderPipelineTransparent??super.getPipeline(e,t,n);case 10:return this._occluderPipelineOpaque??super.getPipeline(e,t,n);default:e.occluder;case void 0:case null:return this._occluderPipelineMaskWrite??super.getPipeline(e,t,n)}}};Un=o([t(`esri.views.3d.webgl-engine.shaders.RibbonLineTechnique`)],Un);var W=class extends et{constructor(e){super(),this.spherical=e,this.capType=0,this.emissionSource=0,this.animation=2,this.polygonOffsetIndex=0,this.writeDepth=!1,this.draped=!1,this.stippleEnabled=!1,this.stippleOffColorEnabled=!1,this.stipplePreferContinuous=!0,this.numJoinSubdivisions=1,this.roundJoins=!1,this.applyMarkerOffset=!1,this.hasVVSize=!1,this.hasVVColor=!1,this.hasVVOpacity=!1,this.falloffEnabled=!1,this.innerColorEnabled=!1,this.hasOccludees=!1,this.occluder=!1,this.wireframe=!1,this.discardInvisibleFragments=!1,this.hasScreenSizePerspective=!1,this.worldSizedImagePattern=!1,this.textureCoordinateType=0,this.hasVVInstancing=!1,this.hasSliceTranslatedView=!0,this.overlayEnabled=!1,this.snowCover=!1}get hasAnimation(){return this.animation!==0}};o([z({count:3})],W.prototype,`capType`,void 0),o([z({count:8})],W.prototype,`emissionSource`,void 0),o([z({count:4})],W.prototype,`animation`,void 0),o([z({count:16})],W.prototype,`polygonOffsetIndex`,void 0),o([z()],W.prototype,`writeDepth`,void 0),o([z()],W.prototype,`draped`,void 0),o([z()],W.prototype,`stippleEnabled`,void 0),o([z()],W.prototype,`stippleOffColorEnabled`,void 0),o([z()],W.prototype,`stipplePreferContinuous`,void 0),o([z({count:8})],W.prototype,`numJoinSubdivisions`,void 0),o([z()],W.prototype,`roundJoins`,void 0),o([z()],W.prototype,`applyMarkerOffset`,void 0),o([z()],W.prototype,`hasVVSize`,void 0),o([z()],W.prototype,`hasVVColor`,void 0),o([z()],W.prototype,`hasVVOpacity`,void 0),o([z()],W.prototype,`falloffEnabled`,void 0),o([z()],W.prototype,`innerColorEnabled`,void 0),o([z()],W.prototype,`hasOccludees`,void 0),o([z()],W.prototype,`occluder`,void 0),o([z()],W.prototype,`wireframe`,void 0),o([z()],W.prototype,`discardInvisibleFragments`,void 0),o([z()],W.prototype,`hasScreenSizePerspective`,void 0),o([z()],W.prototype,`worldSizedImagePattern`,void 0);var Wn=class extends st{constructor(e,t){super(e,Kn),this.produces=new Map([[2,e=>fe(e)||se(e)&&this.parameters.renderOccluded===8],[3,e=>ue(e)],[10,e=>ce(e)&&this.parameters.renderOccluded===8],[11,e=>ce(e)&&this.parameters.renderOccluded===8],[4,e=>se(e)&&this.parameters.writeDepth&&this.parameters.renderOccluded!==8],[8,e=>se(e)&&!this.parameters.writeDepth&&this.parameters.renderOccluded!==8],[18,e=>pe(e)]]),this._configuration=new W(t)}updateConfiguration(e){super.updateConfiguration(e);let t=e.slot===18,n=this.parameters.stipplePattern!=null&&this.parameters.stippleTexture!=null&&e.output!==10,r=n&&t&&this.parameters.isImagePattern();this._configuration.draped=t,this._configuration.polygonOffset=this.parameters.polygonOffset,this._configuration.stippleEnabled=n,this._configuration.stippleOffColorEnabled=n&&this.parameters.stippleOffColor!=null,this._configuration.stipplePreferContinuous=n&&this.parameters.stipplePreferContinuous,this._configuration.numJoinSubdivisions=Zn(this.parameters.join,n),this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.roundJoins=this.parameters.join===`round`,this._configuration.capType=this.parameters.cap,this._configuration.applyMarkerOffset=this.parameters.markerParameters!=null&&Xn(this.parameters.markerParameters),this._configuration.polygonOffsetIndex=this.parameters.polygonOffsetIndex,this._configuration.writeDepth=this.parameters.writeDepth,this._configuration.hasVVSize=this.parameters.hasVVSize,this._configuration.hasVVColor=this.parameters.hasVVColor,this._configuration.hasVVOpacity=this.parameters.hasVVOpacity,this._configuration.innerColorEnabled=this.parameters.innerWidth>0&&this.parameters.innerColor!=null,this._configuration.falloffEnabled=this.parameters.falloff>0,this._configuration.hasOccludees=e.hasOccludees,this._configuration.occluder=this.parameters.renderOccluded===8,this._configuration.wireframe=this.parameters.wireframe,this._configuration.animation=this.parameters.animation,this._configuration.emissionSource=+!!this.emissions,this._configuration.hasScreenSizePerspective=!!this.parameters.screenSizePerspective&&!r,this._configuration.worldSizedImagePattern=r}get visible(){return this.parameters.color[3]>=.003913894324853229||this.parameters.stipplePattern!=null&&(this.parameters.stippleOffColor?.[3]??0)>.003913894324853229}get emissions(){return this.parameters.emissiveStrength>0?this.parameters.renderOccluded===8?1:2:0}setParameters(e,t){e.animation=this.parameters.animation,super.setParameters(e,t)}intersectDraped({attributes:e,screenToWorldRatio:t},n,r,i,a){if(!n.options.selectionMode)return;let o=e.get(`size`),s=this.parameters.width;if(this.parameters.vvSize){let t=e.get(`sizeFeatureAttribute`).data[0];s*=Number.isNaN(t)?this.parameters.vvSize.fallback[0]:c(this.parameters.vvSize.offset[0]+t*this.parameters.vvSize.factor[0],this.parameters.vvSize.minSize[0],this.parameters.vvSize.maxSize[0])}else o&&(s*=o.data[0]);let l=r[0],u=r[1],d=(s/2+4)*t,f=Number.MAX_VALUE,p=0,m=e.get(`position`).data,h=Yn(this.parameters,e)?m.length-2:m.length-5;for(let e=0;e<h;e+=3){let t=m[e],n=m[e+1],r=(e+3)%m.length,i=l-t,a=u-n,o=m[r]-t,s=m[r+1]-n,d=c((o*i+s*a)/(o*o+s*s),0,1),h=o*d-i,g=s*d-a,_=h*h+g*g;_<f&&(f=_,p=e/3)}f<d*d&&i(a.distance,a.renderDistance,a.normal,p)}intersect(t,n,r,i,a,o){let{options:s,camera:l,rayBegin:d,rayEnd:f}=r;if(!s.selectionMode||!t.visible||!l)return;if(!pt(n))return void e.getLogger(`esri.views.3d.webgl-engine.materials.RibbonLineMaterial`).error(`intersection assumes a translation-only matrix`);let p=t.attributes,v=p.get(`position`).data,x=this.parameters.width;if(this.parameters.vvSize){let e=p.get(`sizeFeatureAttribute`).data[0];Number.isNaN(e)||(x*=c(this.parameters.vvSize.offset[0]+e*this.parameters.vvSize.factor[0],this.parameters.vvSize.minSize[0],this.parameters.vvSize.maxSize[0]))}else p.has(`size`)&&(x*=p.get(`size`).data[0]);let C=nr;u(C,r.point);let te=x*l.pixelRatio,ne=4*l.pixelRatio,w=te/2+ne;_(lr[0],C[0]-w,C[1]+w,0),_(lr[1],C[0]+w,C[1]+w,0),_(lr[2],C[0]+w,C[1]-w,0),_(lr[3],C[0]-w,C[1]-w,0);for(let e=0;e<4;e++)if(!l.unprojectFromRenderScreen(lr[e],$[e]))return;L(l.eye,$[0],$[1],ur),L(l.eye,$[1],$[2],dr),L(l.eye,$[2],$[3],fr),L(l.eye,$[3],$[0],pr);let T=Number.MAX_VALUE,E=0,D=Yn(this.parameters,p)?v.length-2:v.length-5;for(let e=0;e<D;e+=3){G[0]=v[e]+n[12],G[1]=v[e+1]+n[13],G[2]=v[e+2]+n[14];let t=(e+3)%v.length;if(K[0]=v[t]+n[12],K[1]=v[t+1]+n[13],K[2]=v[t+2]+n[14],P(ur,G)<0&&P(ur,K)<0||P(dr,G)<0&&P(dr,K)<0||P(fr,G)<0&&P(fr,K)<0||P(pr,G)<0&&P(pr,K)<0)continue;let r=l.projectToRenderScreen(G,rr),i=l.projectToRenderScreen(K,ir);if(r==null||i==null)continue;if(r[2]<0&&i[2]>0){S(q,G,K);let e=l.frustum,t=-P(e[4],G)/b(q,F(e[4]));if(g(q,q,t),h(G,G,q),!l.projectToRenderScreen(G,r))continue}else if(r[2]>0&&i[2]<0){S(q,K,G);let e=l.frustum,t=-P(e[4],K)/b(q,F(e[4]));if(g(q,q,t),h(K,K,q),!l.projectToRenderScreen(K,i))continue}else if(r[2]<0&&i[2]<0)continue;r[2]=0,i[2]=0;let a=_e(r,i,sr),o=me(a,C);if(!(o>=T)){if(this.parameters.screenSizePerspective){let e=this.computeScreenSizePerspectiveWidth(a,G,K,C,l,x,ne);if(o>=e*e)continue}T=o,m(ar,G),m(or,K),E=e/3}}if(T<w*w){let e=Number.MAX_VALUE;if(ge(_e(ar,or,sr),_e(d,f,cr),J)){S(J,J,d);let t=ee(J);g(J,J,1/t),e=t/y(d,f)}o(e,e,J,E)}}createBufferWriter(){return new qn(Hn(this.parameters),this.parameters)}createGLMaterial(e){return new Gn(e)}validateParameters(e){e.join!==`miter`&&(e.miterLimit=0),e.markerParameters!=null&&(e.markerScale=e.markerParameters.width/e.width)}update(e){return!!this.parameters.hasAnimation&&(this.setParameters({timeElapsed:n(e.time)},!1),e.dt!==0)}computeScreenSizePerspectiveWidth(e,t,n,r,i,a,o){let s=ve(e,r);v($n,t,n,s),x(er,$n,i.viewMatrix);let c=ee(er),l=this.computeCameraAbsCosAngle($n,i,this._configuration.spherical);return Qn.update(l,c,this.parameters.screenSizePerspective,this.parameters.screenSizePerspectiveMinPixelReferenceSize),Qn.apply(a)*i.pixelRatio/2+o}computeCameraAbsCosAngle(e,t,n){return n?C(J,e):_(J,0,0,1),S(tr,e,t.eye),C(tr,tr),Math.abs(b(J,tr))}},Gn=class extends Ve{constructor(){super(...arguments),this._stipplePattern=null}dispose(){super.dispose(),this._stippleTextures?.release(this._stipplePattern),this._stipplePattern=null}beginSlot(e){let{stipplePattern:t}=this._material.parameters;return this._stipplePattern!==t&&(this._material.setParameters({stippleTexture:this._stippleTextures.swap(t,this._stipplePattern)}),this._stipplePattern=t),this.getTechnique(Un,e)}},Kn=class extends Le{constructor(){super(...arguments),this._width=0,this.color=D,this.join=`miter`,this.cap=0,this.miterLimit=5,this.writeDepth=!0,this.polygonOffset=0,this.polygonOffsetIndex=0,this.stippleTexture=null,this.stipplePreferContinuous=!0,this.markerParameters=null,this.markerScale=1,this.hasSlicePlane=!1,this.vvFastUpdate=!1,this.isClosed=!1,this.falloff=0,this.innerWidth=0,this.wireframe=!1,this.timeElapsed=r(0),this.animation=0,this.animationSpeed=1,this.trailLength=1,this.startTime=r(0),this.endTime=r(1/0),this.emissiveStrength=0}get width(){return this.isImagePattern()?this.stipplePattern.width:this._width}set width(e){this._width=e}get transparent(){return this.color[3]<1||this.hasAnimation||this.stipplePattern!=null&&(this.stippleOffColor?.[3]??0)<1}get hasAnimation(){return this.animation!==0}isImagePattern(){return Vt(this.stipplePattern)&&this.stippleTexture!=null}},qn=class{constructor(e,t){this.layout=e,this._parameters=t,this.numJoinSubdivisions=Zn(this._parameters.join,this._parameters.stipplePattern!=null)}_isClosed(e){return Yn(this._parameters,e)}allocate(e){return this.layout.createBuffer(e)}elementCount(e){let t=e.get(`position`).indices.length/2+1,n=this._isClosed(e),r=n?2:4;return r+=((n?t:t-1)-+!n)*(2*this.numJoinSubdivisions+4),r+=2,this._parameters.wireframe&&(r=2+4*(r-2)),r}write(e,t,n,r,i){if(i==null)return;let{buffer:a,offset:o}=i,s=this.layout,c=n.get(`position`),l=c.indices,u=c.data.length/3,d=n.get(`distanceToStart`)?.data;l&&l.length!==2*(u-1)&&console.warn(`RibbonLineMaterial does not support indices`);let f=s.fields.has(`sizeFeatureAttribute`),p=1,h=null;if(f){let e=n.get(`sizeFeatureAttribute`);e.data.length===1?p=e.data[0]:h=e.data}else p=n.get(`size`)?.data[0]??1;let g=[1,1,1,1],ee=0,v=null,b=s.fields.has(`colorFeatureAttribute`);if(b){let e=n.get(`colorFeatureAttribute`);e.data.length===1?ee=e.data[0]:v=e.data}else g=n.get(`color`)?.data??g;let S=n.get(`timeStamps`)?.data,C=S&&s.fields.has(`timeStamps`),te=s.fields.has(`opacityFeatureAttribute`),ne=0,w=null;if(te){let e=n.get(`opacityFeatureAttribute`);e.data.length===1?ne=e.data[0]:w=e.data}let T=new Float32Array(a.buffer),D=mt(a.buffer),O=new Uint8Array(a.buffer),k=s.stride/4,A=o*k,re=A,j=0,M=d?(e,t,n)=>j=d[n]:(e,t,n)=>j+=y(e,t),N=T.BYTES_PER_ELEMENT/D.BYTES_PER_ELEMENT,ie=4/N,ae=Ie(),P=(e,t,n,i,a,o,s,c)=>{T[A++]=t[0],T[A++]=t[1],T[A++]=t[2],ot(e,t,D,A*N),A+=ie,ot(n,t,D,A*N),A+=ie,T[A++]=c;let l=A*N;if(D[l++]=a,D[l++]=o,A=Math.ceil(l/N),b)T[A]=v?.[s]??ee;else{let e=Math.min(4*s,g.length-4),t=4*A;O[t]=255*g[e],O[t+1]=255*g[e+1],O[t+2]=255*g[e+2],O[t+3]=255*g[e+3]}if(A++,T[A++]=h?.[s]??p,te&&(T[A++]=w?.[s]??ne),ae){let e=4*A;r?(O[e++]=r[0],O[e++]=r[1],O[e++]=r[2],O[e++]=r[3]):(O[e++]=0,O[e++]=0,O[e++]=0,O[e++]=0),A=Math.ceil(.25*e)}C&&(l=A*N,D[l++]=i[0],D[l++]=i[1],D[l++]=i[2],D[l++]=i[3],A=Math.ceil(l/N))};A+=k,_(X,c.data[0],c.data[1],c.data[2]),C&&E(Q,S[0],S[1],S[2],S[3]),e&&x(X,X,e);let F=this._isClosed(n);if(F){let t=c.data.length-3;_(Y,c.data[t],c.data[t+1],c.data[t+2]),e&&x(Y,Y,e)}else _(Z,c.data[3],c.data[4],c.data[5]),e&&x(Z,Z,e),P(X,X,Z,Q,1,-4,0,0),P(X,X,Z,Q,1,4,0,0),m(Y,X),m(X,Z),C&&E(Q,S[4],S[5],S[6],S[7]);let I=+!F,L=F?u:u-1;for(let t=I;t<L;t++){let n=(t+1)%u*3;_(Z,c.data[n],c.data[n+1],c.data[n+2]),e&&x(Z,Z,e),M(Y,X,t),P(Y,X,Z,Q,0,-1,t,j),P(Y,X,Z,Q,0,1,t,j);let r=this.numJoinSubdivisions;for(let e=0;e<r;++e){let n=(e+1)/(r+1);P(Y,X,Z,Q,n,-1,t,j),P(Y,X,Z,Q,n,1,t,j)}if(P(Y,X,Z,Q,1,-2,t,j),P(Y,X,Z,Q,1,2,t,j),m(Y,X),m(X,Z),C){let e=(t+1)%u*4;E(Q,S[e],S[e+1],S[e+2],S[e+3])}}F?(_(Z,c.data[3],c.data[4],c.data[5]),e&&x(Z,Z,e),j=M(Y,X,L),P(Y,X,Z,Q,0,-1,I,j),P(Y,X,Z,Q,0,1,I,j)):(j=M(Y,X,L),P(Y,X,X,Q,0,-5,L,j),P(Y,X,X,Q,0,5,L,j)),Jn(T,re+k,T,re,k),A=Jn(T,A-k,T,A,k),this._parameters.wireframe&&this._addWireframeVertices(a,re,A,k)}_addWireframeVertices(e,t,n,r){let i=new Float32Array(e.buffer,n*Float32Array.BYTES_PER_ELEMENT),a=new Float32Array(e.buffer,t*Float32Array.BYTES_PER_ELEMENT,n-t),o=0,s=e=>o=Jn(a,e,i,o,r);for(let e=0;e<a.length-1;e+=2*r)s(e),s(e+2*r),s(e+1*r),s(e+2*r),s(e+1*r),s(e+3*r)}};function Jn(e,t,n,r,i){for(let a=0;a<i;a++)n[r++]=e[t++];return r}function Yn(e,t){return e.isClosed?t.get(`position`).indices.length>2:!1}function Xn(e){return e.anchor===1&&e.hideOnShortSegments&&e.placement===`begin-end`&&e.worldSpace}function Zn(e,t){let n=+!!t;switch(e){case`miter`:case`bevel`:return n;case`round`:return 1+n}}var Qn=new rt,G=s(),K=s(),$n=s(),er=s(),tr=s(),q=s(),J=s(),nr=s(),rr=p(),ir=p(),ar=s(),or=s(),sr=he(),cr=he(),Y=s(),X=s(),Z=s(),Q=k(),lr=[p(),p(),p(),p()],$=[s(),s(),s(),s()],ur=I(),dr=I(),fr=I(),pr=I();export{Tt as A,Ut as C,Ct as D,wt as E,xt as M,yt as N,Et as O,Vt as S,St as T,Zt as _,jn as a,qt as b,Nn as c,kn as d,dn as f,$t as g,un as h,Pn as i,Dt as j,bt as k,An as l,fn as m,Bn as n,Mn as o,U as p,zn as r,Fn as s,Wn as t,On as u,Xt as v,Nt as w,Wt as x,Yt as y};