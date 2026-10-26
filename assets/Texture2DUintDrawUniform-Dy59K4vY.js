import{n as e}from"./Error-BplF0QKp.js";import{t}from"./Accessor-e7T-9MbM.js";import{E as n,M as r}from"./promiseUtils-DqimbNUr.js";import{n as i,t as a}from"./decorators-BTkzlYqr.js";import{t as o}from"./uid-tFVEb1ZF.js";import{r as s}from"./Ellipsoid-Co4rBm1M.js";import{r as c}from"./tslib.es6-qUHyP9zl.js";import{t as l}from"./Evented-CvLrUu1x.js";import{c as u,u as d}from"./vec3f64-DIOQknMY.js";import{T as f}from"./mathUtils-D79yUFwW.js";import{D as p,w as m}from"./vec2-C5dJMieJ.js";import{l as h}from"./screenUtils-DLu5fZRL.js";import{l as g,t as _}from"./vec4-B-G2J025.js";import{o as v,r as y}from"./vec4f64-CjgU5APJ.js";import{a as b,i as ee,o as x}from"./vec2f64-IO40D2xB.js";import{s as te,t as ne}from"./Texture-C7GphHEp.js";import{Pn as re,jn as ie}from"./index-D5n14Pfv.js";import{d as ae,f as S,i as oe,p as C,r as se,u as w}from"./oitResolution.glsl-CziGeqeq.js";import{a as T}from"./ManagedTexture-KWyoFc2U.js";import{Ft as E,It as D,J as ce,Lt as O,rn as k}from"./doublePrecisionUtils-h2HDg16l.js";import{x as le}from"./OverlayRenderer-BhWutSot.js";import{$ as A,J as ue}from"./BufferView-CDwF6SxX.js";import{a as j}from"./CameraSpace.glsl-CJ2PKkP5.js";import{F as de,I as fe,U as pe,W as me,b as he}from"./RealisticTree.glsl-Bffg1X7R.js";import{n as ge,r as _e}from"./MainLighting.glsl-BVv8KL3W.js";import{r as ve,t as ye}from"./fontUtils-B33k-QTw.js";import{r as be}from"./GridLocalOriginFactory-BHaoB9tI.js";var M=Symbol(`hasTransparencyModeSymbol`);function xe(e){return M in e}var Se=class{constructor(e,t=`center`,n=!1,r=x(),i=d(0,0,0),a=-1,o=`world`,s=u(),c=0){this.verticalOffset=e,this.anchor=t,this.hasLabelVerticalOffset=n,this.screenOffset=r,this.centerOffset=i,this.groundDistance=a,this.centerOffsetUnits=o,this.translation=s,this.elevationOffset=c}},Ce=class{constructor(e,t=`center`,n=`center`,r=null,i=x()){this.placement=e,this.horizontalPlacement=t,this.verticalPlacement=n,this.text=r,this.displaySize=i}};function N(e,t,n){return e.canvas||=document.createElement(`canvas`),e.canvas.width=t,e.canvas.height=n,e.canvas}function P(e){let{size:t}=e.definition,n=e.fontString(t),r=F.get(n);if(!r){let i=N(Te,0,0).getContext(`2d`);e.setFontProperties(i,t);let a=i.measureText(Ee);r=new we(a.actualBoundingBoxAscent,a.actualBoundingBoxDescent),F.set(n,r)}return r}var F=new Map,we=class{get maxHeight(){return this.maxAscent+this.maxDescent}constructor(e,t){this.maxAscent=e,this.maxDescent=t}},Te={canvas:null},Ee=(()=>{let e=``;for(let t=32;t<127;t++)e+=String.fromCharCode(t);return e})(),De=class{constructor(e,t,n,r){this.text=e,this._alignment=t,this._parameters=n,this._maxSize=r,this._textWidths=[],this._lineWidths=[],this._renderPixelRatio=null,this._metricsCached=null,this.key=`${e}--${this._parameters.key}-${this._alignment}`,this._lines=e.replaceAll(` `,`\xA0`).split(/\r?\n/)}get displayWidth(){return Math.ceil(this._displayWidth+2*this._horizontalPadding)}get displayHeight(){let e=this._metrics.firstLineAscent;for(let t=0;t<this._lines.length-1;t++)e+=this._lineSpacing;return e+=this._metrics.lastLineDescent,Math.ceil(e+2*this._haloSize+2*this._verticalPadding)}get renderedWidth(){return this._toRoundedRenderUnit(this.displayWidth)}get renderedHeight(){return this._toRoundedRenderUnit(this.displayHeight)}get firstRenderedBaselinePosition(){return this._toRenderUnit(this._firstLineYOffset+this._metrics.firstLineAscent)}get _firstLineYOffset(){return this._verticalPadding+this._haloSize}get _metrics(){if(this._metricsCached==null){let e=N(L,R,R).getContext(`2d`),t=this._parameters.definition.pixelRatio,n=this._fontSize*t;this._parameters.setFontProperties(e,n);let r=2*this._haloSize,i=this._parameters.definition.font;i.style!==`italic`&&i.style!==`oblique`&&i.weight!==`bold`&&i.weight!==`bolder`||(r+=.3*e.measureText(`A`).width),this._textWidths.length=0,this._lineWidths.length=0;let a=0,o=0,s=0,c=0,l=0;this._lines.forEach((n,i)=>{let u=e.measureText(n),d=u.width/t,f=d+r;this._textWidths.push(d),this._lineWidths.push(f),a=Math.max(a,f),c=Math.max(c,u.actualBoundingBoxAscent/t),l=Math.max(l,u.actualBoundingBoxDescent/t),i===0&&(o=u.actualBoundingBoxAscent/t),i===this._lines.length-1&&(s=u.actualBoundingBoxDescent/t)});let u=P(this._parameters),d=Math.max(c,u.maxAscent),f=Math.max(l,u.maxDescent),p=o,m=this._parameters.definition.font.decoration===`underline`?f:s,h=a;this._metricsCached=new ke(p,m,d,f,h)}return this._metricsCached}get _lineSpacing(){return(this._midLineHeight+this._linePadding)*this._parameters.definition.lineSpacingFactor}get _midLineHeight(){return this._metrics.midLineHeight}get _linePadding(){return this._midLineHeight*Oe}get _midLineAscent(){return this._metrics.maxLineAscent}get _renderedFontSize(){return this._toRenderUnit(this._fontSize)}get _fontSize(){return this._parameters.definition.size}get _renderedHaloSize(){return this._toRenderUnit(this._haloSize)}get _haloSize(){return this._parameters.haloSize}get _horizontalPadding(){return this._hasBackground?this._parameters.definition.background.padding[0]:0}get _verticalPadding(){return Math.max(this._hasBackground?this._parameters.definition.background.padding[1]:0,1)}get _hasBackground(){return!!this._parameters.backgroundStyle}get renderPixelRatio(){if(this._renderPixelRatio==null){let e=this._parameters.definition.pixelRatio;this._renderPixelRatio=Math.min(e,Math.min(this._maxSize[0]/this.displayWidth,this._maxSize[1]/this.displayHeight))}return this._renderPixelRatio}_getLineXOffset(e){switch(this._alignment){case 0:return this._horizontalPadding;case 1:return(this.displayWidth-this._lineWidths[e])/2;case 2:return this.displayWidth-this._horizontalPadding-this._lineWidths[e]}}render(e,t,n){e.save();let r=t/=this.renderPixelRatio,i=n/=this.renderPixelRatio,a=this._haloSize,o=this._firstLineYOffset+this._metrics.firstLineAscent;t+=a,n+=o;let s=this._haloSize>0;s&&this._renderHalo(e,r,i,a,o),this._parameters.setFontProperties(e,this._renderedFontSize);for(let r=0;r<this._lines.length;++r){let i=this._lines[r],a=this._getLineXOffset(r);s&&(e.globalCompositeOperation=`destination-out`,e.fillStyle=`rgb(0, 0, 0)`,this._fillText(e,i,t+a,n),this._renderLineDecoration(e,t+a,n,this._textWidths[r])),e.globalCompositeOperation=`source-over`,e.fillStyle=this._parameters.textStyle,this._fillText(e,i,t+this._getLineXOffset(r),n),this._renderLineDecoration(e,t+a,n,this._textWidths[r]),n+=this._lineSpacing}if(k.TEXT_SHOW_BASELINE){e.strokeStyle=z,e.setLineDash([2,2]),e.lineWidth=1;let t=i+o;for(let n=0;n<this._lines.length;++n)this._drawLine(e,[r,t],[r+this.displayWidth,t]),t+=this._lineSpacing}if(k.TEXT_SHOW_BORDER&&(e.strokeStyle=z,e.setLineDash([]),e.lineWidth=1,this._drawBox(e,[r,i],[this.displayWidth,this.displayHeight])),this._hasBackground){let t=this._parameters.definition.background.borderRadius*this.renderPixelRatio;this._roundedRect(e,r,i,t),e.globalCompositeOperation=`destination-over`,e.fillStyle=this._parameters.backgroundStyle,e.fill()}e.restore()}_renderLineDecoration(e,t,n,r,i=!1){if(this._parameters.definition.font.decoration===`none`||r===0)return;let a=Math.max(this._parameters.definition.size/16,1);switch(this._parameters.definition.font.decoration){case`underline`:n+=2*a;break;case`line-through`:n-=.33*this._midLineAscent}let o=i?this._haloSize:0;e.strokeStyle=i?this._parameters.haloStyle:this._parameters.textStyle,e.lineWidth=this._toRenderUnit(a+2*o),e.beginPath(),e.moveTo(this._toRenderUnit(t-o),this._toRenderUnit(n)),e.lineTo(this._toRenderUnit(t+r+o),this._toRenderUnit(n)),e.stroke()}_roundedRect(e,t,n,r){t=this._toRenderUnit(t),n=this._toRenderUnit(n);let i=this.renderedWidth,a=this.renderedHeight;r===0?e.rect(t,n,i,a):(r=f(r,0,Math.floor(a/2)),e.beginPath(),e.moveTo(t,n+r),e.arcTo(t,n,t+r,n,r),e.lineTo(t+i-r,n),e.arcTo(t+i,n,t+i,n+r,r),e.lineTo(t+i,n+a-r),e.arcTo(t+i,n+a,t+i-r,n+a,r),e.lineTo(t+r,n+a),e.arcTo(t,n+a,t,n+a-r,r),e.closePath())}_renderHalo(e,t,n,r,i){let a=this.renderedWidth,o=this.renderedHeight,s=N(L,Math.max(a,R),Math.max(o,R)),c=s.getContext(`2d`);c.clearRect(0,0,a,o),this._parameters.setFontProperties(c,this._renderedFontSize),c.fillStyle=this._parameters.haloStyle,c.strokeStyle=this._parameters.haloStyle;let l=this._renderedHaloSize<3;c.lineJoin=l?`miter`:`round`,l?this._renderHaloEmulated(c,r,i):this._renderHaloNative(c,r,i);let u=i;for(let e=0;e<this._lines.length;++e){let t=this._getLineXOffset(e);this._renderLineDecoration(c,r+t,u,this._textWidths[e],!0),u+=this._lineSpacing}e.globalAlpha=this._parameters.definition.halo.color[3],e.drawImage(s,0,0,a,o,this._toRenderUnit(t),this._toRenderUnit(n),a,o),e.globalAlpha=1}_renderHaloEmulated(e,t,n){for(let r=0;r<this._lines.length;++r){let i=this._lines[r],a=this._getLineXOffset(r);for(let[r,o]of I)this._fillText(e,i,t+a+this._haloSize*r,n+this._haloSize*o);n+=this._lineSpacing}}_renderHaloNative(e,t,n){let r=2*this._haloSize;for(let i=0;i<this._lines.length;++i){let a=this._lines[i],o=this._getLineXOffset(i),s=.1;for(let i=0;i<5;i++){let c=1-4*s+i*s;e.lineWidth=this._toRenderUnit(c*r),this._strokeText(e,a,t+o,n)}n+=this._lineSpacing}}get _displayWidth(){return this._metrics.displayWidth}_toRenderUnit(e){return e*this.renderPixelRatio}_toRoundedRenderUnit(e){return Math.round(e*this.renderPixelRatio)}_fillText(e,t,n,r){e.fillText(t,this._toRenderUnit(n),this._toRenderUnit(r))}_strokeText(e,t,n,r){e.strokeText(t,this._toRenderUnit(n),this._toRenderUnit(r))}_drawLine(e,t,n){e.beginPath(),e.moveTo(this._toRoundedRenderUnit(t[0])+.5,this._toRoundedRenderUnit(t[1])+.5),e.lineTo(this._toRoundedRenderUnit(n[0])+.5,this._toRoundedRenderUnit(n[1])+.5),e.stroke()}_drawBox(e,t,n){let r=this._toRenderUnit(t[0]),i=this._toRenderUnit(t[1]),a=this._toRenderUnit(n[0]),o=this._toRenderUnit(n[1]),s=Math.floor(r)+.5,c=Math.ceil(r+a)-.5,l=Math.floor(i)+.5,u=Math.ceil(i+o)-.5;e.beginPath(),e.moveTo(s,l),e.lineTo(c,l),e.lineTo(c,u),e.lineTo(s,u),e.lineTo(s,l),e.stroke()}},I=[];for(let e=0;e<360;e+=360/16)I.push([Math.cos(Math.PI*e/180),Math.sin(Math.PI*e/180)]);var L={canvas:null},Oe=.2,R=512,z=`rgb(255, 0, 255, 0.5)`,ke=class{get firstLineHeight(){return this.firstLineAscent+this.maxLineDescent}get midLineHeight(){return this.maxLineAscent+this.maxLineDescent}get lastLineHeight(){return this.maxLineAscent+this.lastLineDescent}constructor(e,t,n,r,i){this.firstLineAscent=e,this.lastLineDescent=t,this.maxLineAscent=n,this.maxLineDescent=r,this.displayWidth=i}},Ae=Object.freeze({left:0,center:.5,right:1}),je=Object.freeze({"bottom-left":b(0,0),bottom:b(.5,0),"bottom-right":b(1,0),left:b(0,.5),center:b(.5,.5),right:b(1,.5),"top-left":b(0,1),top:b(.5,1),"top-right":b(1,1)});function Me(e){switch(e){case`left`:return 0;case`right`:return 2;default:return 1}}function Ne(e){switch(e){case`bottom-left`:case`left`:case`top-left`:return`left`;case`bottom`:case`center`:case`top`:return`center`;case`bottom-right`:case`right`:case`top-right`:return`right`}}function Pe(e){switch(e){case`bottom-left`:case`bottom`:case`bottom-right`:return`bottom`;case`left`:case`center`:case`right`:return`center`;case`top-left`:case`top`:case`top-right`:return`top`}}function Fe(e,t){switch(t){case`bottom`:return e===`left`?`bottom-left`:e===`right`?`bottom-right`:`bottom`;case`center`:return e;case`top`:return e===`left`?`top-left`:e===`right`?`top-right`:`top`}}function Ie(e){return e===`middle`?`center`:e}function Le(e,t){switch(e){case`top`:return p(t,0,1);case`bottom`:return p(t,0,-1);default:return m(t,ee)}}var Re=class t{constructor(e){this.definition=e,this.key=JSON.stringify(e),this.haloSize=Math.round(e.halo.size),this.textStyle=B(e.color),this.haloStyle=ze(e.halo.color),this.backgroundStyle=e.background.color[3]===0?null:B(e.background.color)}fontString(e){let t=this.definition.font;return`${t.style} ${t.weight} ${e}px ${t.family}, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji`}setFontProperties(e,t){e.font=this.fontString(t),e.textAlign=`left`,e.textBaseline=`alphabetic`}static async fromSymbol(n,r){let i=n?.material?.color?.toUnitRGBA()??y,a=n.size==null?12:h(n.size),o=n.lineHeight,s=n.background?.color?.toUnitRGBA()??y,c={family:n.font?.family??`sans-serif`,decoration:n.font?.decoration??`none`,weight:n.font?.weight??`normal`,style:n.font?.style??`normal`},l=n.halo,u=l?.color!=null&&l.size>0?{size:h(l.size),color:l.color.toUnitRGBA()}:{size:0,color:y},d=new t({color:i,size:a,background:{color:s,padding:n.background==null?[0,0]:[.65*a,.5*a],borderRadius:n.background==null?0:6/16*a},lineSpacingFactor:o,font:c,halo:u,pixelRatio:r});if(n.font){let t=!1,r=d.fontString(a);try{t=(await document.fonts.load(r)).some(e=>!ve(e))}catch{e.getLogger(`esri.views.3d.webgl-engine.lib.TextRenderParameters`).warnOnce(`Failed to preload font '${r}'. Some text symbology may be rendered using the default browser font.`)}if(!t&&!Be.has(n.font.family))try{await ye(n.font)}catch{}}return d}};function ze(e){return`rgb(${e.slice(0,3).map(e=>Math.floor(255*e)).toString()})`}function B(e){return`rgba(${e.slice(0,3).map(e=>Math.floor(255*e)).toString()},${e[3]})`}var Be=new Set([`Arial`,`Times New Roman`,`Courier New`,`serif`,`sans-serif`,`monospace`,`cursive`,`fantasy`,`system-ui`,`ui-serif`,`ui-sans-serif`,`ui-monospace`,`ui-rounded`,`math`,`emoji`,`fangsong`]),V=4096,H=class extends t{constructor(e){super(e),this.id=o(),this.events=new l,this._texture=null,this._atlas=new He(256,256),this._needsRepack=!1,this._canRepack=!0,this._elementsToRender=new Map,this._elements=new Map,this._uvCallbacks=new Map,this.updating=!1}initialize(){this._canvas=document.createElement(`canvas`),this._canvas.setAttribute(`id`,`textAtlasCanvas`),this._canvas.setAttribute(`style`,`display:none`),this._ctx=this._canvas.getContext(`2d`),this._stage=this.view.stage,this._stage.addTexture(this),this._updateCanvasElementSize(this._atlas),this._reset()}unload(){this._texture=r(this._texture),this._frameWorker=n(this._frameWorker),this.updating=!1,this.events.emit(`unloaded`)}get loaded(){return this._texture!=null}get texture(){return this._texture}static get maxSize(){return K=be.stableRendering?U:0,[V-U-K,V-U-K-W]}load(e){if(this._texture)return this._texture;let t=new te;return t.wrapMode=33071,t.samplingMode=9987,t.hasMipmap=!0,t.preMultiplyAlpha=!0,t.maxAnisotropy=e.parameters.maxMaxAnisotropy,this._texture=new ne(e,t,this._canvas),this._frameWorker=this.view.resourceController.scheduler.registerTask(ie.TEXT_TEXTURE_ATLAS,this),this.setDirty(),this._texture}dispose(){this._elements.clear(),this._elementsToRender.clear(),this._frameWorker=n(this._frameWorker),this._texture&&=(this._stage.removeTexture(this),r(this._texture)),this._canvas.width=0,this._canvas.height=0,this._canvas=null,this._ctx=null}_updateCanvasElementSize(e){this._canvas.width=e.width,this._canvas.height=e.height}_resizeAtlas(e,t){let{width:n,height:r}=this._atlas;n===e&&r===t||(this._atlas.width=e,this._atlas.height=t,this._texture?.resize(e,t),this._texture?.updateData(0,0,0,n,r,this._canvas),this._updateCanvasElementSize(this._atlas),this._elements.forEach(e=>this._uvCallbacks.get(e.textRenderer.key)?.forEach(t=>t(e.uv))),this._reset())}_reset(){this._elementsToRender.clear(),this._atlas.reset(),this._needsRepack=!0,this.setDirty()}_addAtlasElement(e,t,n,r){let i=this._atlas;if(i.width<n||i.height<r)return!1;let a=i.cursors.get(r);if(!a){if(i.height<i.nextY+r)return!1;a=[new G(i.nextY)],i.cursors.set(r,a),i.nextY+=r}let o=a.find(e=>i.width>=e.x+n);if(o==null){if(i.height<i.nextY+r)return!1;o=new G(i.nextY),i.nextY+=r,a.push(o)}return e.setNewPosition(o),this._elements.set(t,e),this._elementsToRender.set(t,e),o.x+=n,!0}_ensureCallbacks(e){let t=this._uvCallbacks.get(e);if(t)return t;let n=new Set;return this._uvCallbacks.set(e,n),n}_addCallback(e,t){this._ensureCallbacks(e).add(t)}_removeCallback(e,t){let n=this._uvCallbacks.get(e);return!(!n?.delete(t)||n.size!==0)&&(this._uvCallbacks.delete(e),!0)}_processAddition(e){let t=e.textRenderer.key;if(this._needsRepack)return void this._elements.set(t,e);let n=this._atlas,r=e.textRenderer.renderedWidth,i=e.textRenderer.renderedHeight,a=r+U,o=i+U+W;if(!this._addAtlasElement(e,t,a,o)){if(this._canRepack)this._reset();else if(n.width<a){let e=T(Math.max(a,1.5*n.width),V);this._resizeAtlas(e,n.height)}else{let e=n.nextY+o,t=T(Math.max(e,1.5*n.height),V);if(t>n.height)this._resizeAtlas(n.width,t);else if(n.width<V){let e=T(1.5*n.width,V);this._resizeAtlas(e,n.height)}}this._elements.set(t,e)}}_renderElement(e){let t=e.commitNewPosition(),n=e.textRenderer;this._ctx.clearRect(t[0]-U,t[1]-U,n.renderedWidth+2*U,n.renderedHeight+2*U),n.render(this._ctx,t[0],t[1]),this._uvCallbacks.get(n.key)?.forEach(t=>t(e.uv))}get readyToRun(){return this.updating}runTask(e){if(this._texture==null)return re;for(;this._needsRepack&&(this._canRepack||this._atlas.height<V&&this._atlas.height<V);){this._canRepack=this._needsRepack=!1;let t=this._elements;this._elements=new Map,t.forEach(e=>this._processAddition(e)),e.madeProgress()}if(this._elementsToRender.size>0){for(let[t,n]of this._elementsToRender){if(e.done)break;this._renderElement(n),this._elementsToRender.delete(t),e.madeProgress()}this._texture.setData(this._canvas)}this.updating=this._elementsToRender.size>0}addText(e,t){let n=e.key;this._addCallback(n,t);let r=this._elements.get(n);return r?_(r.uv,y)||t(r.uv):(r=new Ve(e),this._processAddition(r),this.setDirty()),{remove:()=>this._removeText(e,t)}}_removeText(e,t){let n=e.key;this._elements.get(n)&&this._removeCallback(n,t)&&(this._elements.delete(n),this._elementsToRender.delete(n),this._canRepack=!0)}setDirty(){this._texture&&(this.updating=!0)}get test(){}get usedMemory(){return(this._texture?.usedMemory??0)+(this._canvas?.width??0)*(this._canvas?.height??0)*4}};c([a({constructOnly:!0})],H.prototype,`view`,void 0),c([a({type:Boolean})],H.prototype,`updating`,void 0),H=c([i(`esri.views.3d.webgl-engine.lib.TextTextureAtlas`)],H);var U=2,W=2,Ve=class{constructor(e){this.textRenderer=e,this._uv=v(),this._newPosition=[0,0]}get uv(){if(this._xOffset==null||this._yOffset==null)return y;let{renderedWidth:e,renderedHeight:t}=this.textRenderer;return g(this._uv,this._xOffset,this._yOffset+t,this._xOffset+e,this._yOffset)}setNewPosition(e){this._newPosition[0]=e.x,this._newPosition[1]=e.y}commitNewPosition(){return this._xOffset=this._newPosition[0],this._yOffset=this._newPosition[1],this._newPosition}get xOffset(){return this._xOffset}get yOffset(){return this._yOffset}},He=class{constructor(e,t){this.width=e,this.height=t,this.cursors=new Map,this.nextY=0}reset(){this.cursors.clear(),this.nextY=K}},G=class{constructor(e){this.y=e,this.x=K}},K=0,Ue=class{constructor(e,t){this._material=e,this._repository=t}dispose(){this._glMaterial!=null&&this._repository.release(this._material)}load(e,t,n){if(!this._material.produces.get(t)?.(n))return null;if(this._glMaterial??=this._repository.acquire(this._material,t,n),this._glMaterial){if(this._glMaterial.ensureResources(e)===2)return this._glMaterial;this._repository.requestRender()}return null}};function We(e){e.code.add(C`float normals2FoamIntensity(vec3 n, float waveStrength){
float normalizationFactor =  max(0.015, waveStrength);
return max((n.x + n.y)*0.3303545/normalizationFactor + 0.3303545, 0.0);
}`)}function Ge(e){e.code.add(C`vec3 foamIntensity2FoamColor(float foamIntensityExternal, float foamPixelIntensity, vec3 skyZenitColor, float dayMod){
return foamIntensityExternal * (0.075 * skyZenitColor * pow(foamPixelIntensity, 4.) +  50.* pow(foamPixelIntensity, 23.0)) * dayMod;
}`)}function Ke(e){e.fragment.uniforms.add(new D(`cloudAbsorption`,e=>e.clouds.absorption),new D(`cloudCoverage`,e=>e.clouds.coverage)).code.add(C`vec4 lookupCloudsFromTextureArray(sampler2DArray cubeMap, vec3 rayDir) {
int faceIndex;
vec2 uv;
if(rayDir.z <= 0.0) {
float hazeFactor = smoothstep(-0.01, mix(0.0, 0.075, cloudCoverage), abs(dot(rayDir, vec3(0, 0, 1))));
float shading = clamp(1.0 - cloudAbsorption, 0.6, 1.0) * (1.0 - hazeFactor);
float totalTransmittance = hazeFactor;
return vec4(shading, totalTransmittance, shading, totalTransmittance);
}
if (abs(rayDir.x) >= abs(rayDir.y) && abs(rayDir.x) >= abs(rayDir.z)) {
if(rayDir.x > 0.0) {
faceIndex = 0;
uv = rayDir.yz / rayDir.x;
uv = vec2(-uv.x, uv.y);
} else {
faceIndex = 1;
uv = rayDir.yz / rayDir.x;
uv = vec2(-uv.x, -uv.y);
}
} else if (abs(rayDir.y) >= abs(rayDir.x) && abs(rayDir.y) >= abs(rayDir.z)) {
if(rayDir.y > 0.0) {
faceIndex = 2;
uv = rayDir.xz / rayDir.y;
} else {
faceIndex = 3;
uv = rayDir.xz / rayDir.y;
uv = vec2(uv.x, -uv.y);
}
} else {
if(rayDir.y < 0.0) {
faceIndex = 4;
uv = rayDir.xy / rayDir.z;
uv = vec2(uv.x, -uv.y);
} else {
faceIndex = 5;
uv = rayDir.xy / rayDir.z;
uv = vec2(uv.x, -uv.y);
}
}
uv = 0.5 * (uv + 1.0);
if(faceIndex != 5) {
uv.y = uv.y - 0.5;
}
uv.y = uv.y * 2.0;
vec4 s = texture(cubeMap, vec3(uv, float(faceIndex)));
return s;
}`)}var qe=class extends w{constructor(e,t){super(e,`sampler2DArray`,0,(n,r)=>n.bindTexture(e,t(r)))}};function q(e){let t=e.fragment;t.constants.add(`radiusCloudsSquared`,`float`,Je).code.add(C`vec3 intersectWithCloudLayer(vec3 dir, vec3 cameraPosition, vec3 spherePos) {
float B = 2.0 * dot(cameraPosition, dir);
float C = dot(cameraPosition, cameraPosition) - radiusCloudsSquared;
float det = B * B - 4.0 * C;
float pointIntDist = max(0.0, 0.5 *(-B + sqrt(det)));
return (cameraPosition + dir * pointIntDist) - spherePos;
}`),t.uniforms.add(new D(`radiusCurvatureCorrection`,({clouds:e})=>e.parallax.radiusCurvatureCorrection)).code.add(C`vec3 correctForPlanetCurvature(vec3 dir) {
dir.z = dir.z * (1.0 - radiusCurvatureCorrection) + radiusCurvatureCorrection;
return dir;
}`),t.code.add(C`vec3 rotateDirectionToAnchorPoint(mat4 rotMat, vec3 inVec) {
return (rotMat * vec4(inVec, 0.0)).xyz;
}`),_e(t),ge(t),t.constants.add(`RIM_COLOR`,`vec3`,d(.28,.175,.035)),t.constants.add(`sunsetTransitionFactor`,`float`,.3),t.constants.add(`rimScattering`,`float`,140),t.constants.add(`backlightFactor`,`float`,.2),t.constants.add(`backlightScattering`,`float`,10),t.constants.add(`backlightTransition`,`float`,.3),t.code.add(C`vec3 calculateCloudColor(vec3 cameraPosition, vec3 worldSpaceRay, vec4 clouds) {
float upDotLight = dot(cameraPosition, mainLightDirection);
float dirDotLight = max(dot(worldSpaceRay, mainLightDirection), 0.0);
float sunsetTransition = clamp(pow(max(upDotLight, 0.0), sunsetTransitionFactor), 0.0, 1.0);
vec3 ambientLight = calculateAmbientIrradiance(cameraPosition);
vec3 combinedLight = clamp((mainLightIntensity + ambientLight )/PI, vec3(0.0), vec3(1.0));
vec3 baseCloudColor = pow(combinedLight * pow(clouds.xyz, vec3(GAMMA)), vec3(INV_GAMMA));
float scatteringMod = max(clouds.a < 0.5 ? clouds.a / 0.5 : - clouds.a / 0.5 + 2.0, 0.0);
float rimLightIntensity = 0.5 + 0.5 * pow(max(upDotLight, 0.0), 0.35);
vec3 directSunScattering = RIM_COLOR * rimLightIntensity * (pow(dirDotLight, rimScattering)) * scatteringMod;
float additionalLight = backlightFactor * pow(dirDotLight, backlightScattering) * (1. - pow(sunsetTransition, backlightTransition)) ;
return vec3(baseCloudColor * (1.0 + additionalLight) + directSunScattering);
}`),e.include(Ke),t.uniforms.add(new j(`readChannelsRG`,e=>e.clouds.readChannels===0),new qe(`cubeMap`,e=>e.clouds.data?.cubeMap?.colorTexture)).code.add(C`vec4 sampleCloud(vec3 rayDir, bool readOtherChannel) {
vec4 s = lookupCloudsFromTextureArray(cubeMap, rayDir);
bool readRG = readChannelsRG ^^ readOtherChannel;
s = readRG ? vec4(vec3(s.r), s.g) : vec4(vec3(s.b), s.a);
return length(s) == 0.0 ? vec4(s.rgb, 1.0) : s;
}`),t.uniforms.add(new O(`anchorPoint`,e=>e.clouds.parallax.anchorPoint),new O(`anchorPointNew`,e=>e.clouds.parallaxNew.anchorPoint),new E(`rotationClouds`,e=>e.clouds.parallax.transform),new E(`rotationCloudsNew`,e=>e.clouds.parallaxNew.transform),new D(`cloudsOpacity`,e=>e.clouds.opacity),new D(`fadeFactor`,e=>e.clouds.fadeFactor),new j(`crossFade`,e=>e.clouds.fadeState===3)).code.add(C`vec4 renderClouds(vec3 worldRay, vec3 cameraPosition) {
vec3 intersectionPoint = intersectWithCloudLayer(worldRay, cameraPosition, anchorPoint);
vec3 worldRayRotated = rotateDirectionToAnchorPoint(rotationClouds, normalize(intersectionPoint));
vec3 worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
vec4 cloudData = sampleCloud(worldRayRotatedCorrected, crossFade);
vec3 cameraPositionN = normalize(cameraPosition);
vec4 cloudColor = vec4(calculateCloudColor(cameraPositionN, worldRay, cloudData), cloudData.a);
if(crossFade) {
intersectionPoint = intersectWithCloudLayer(worldRay, cameraPosition, anchorPointNew);
worldRayRotated = rotateDirectionToAnchorPoint(rotationCloudsNew, normalize(intersectionPoint));
worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
cloudData = sampleCloud(worldRayRotatedCorrected, false);
vec4 cloudColorNew = vec4(calculateCloudColor(cameraPositionN, worldRay, cloudData), cloudData.a);
cloudColor = mix(cloudColor, cloudColorNew, fadeFactor);
}
float totalTransmittance = length(cloudColor.rgb) == 0.0 ?
1.0 :
clamp(cloudColor.a * cloudsOpacity + (1.0 - cloudsOpacity), 0.0 , 1.0);
return vec4(cloudColor.rgb, totalTransmittance);
}`)}var Je=(s.radius+le)**2;function Ye(e,t){let n=e.fragment;n.include(fe,t),n.include(ae),n.include(Ge),t.cloudReflections&&e.include(q),t.screenSpaceReflections&&e.include(de,t),n.include(he,t),n.constants.add(`fresnelSky`,`vec3`,[.02,1,15]),n.constants.add(`fresnelMaterial`,`vec2`,[.02,.1]),n.constants.add(`roughness`,`float`,.015),n.constants.add(`foamIntensityExternal`,`float`,1.7),n.constants.add(`ssrIntensity`,`float`,.65),n.constants.add(`ssrHeightFadeStart`,`float`,pe),n.constants.add(`ssrHeightFadeEnd`,`float`,me),n.constants.add(`waterDiffusion`,`float`,.92),n.constants.add(`waterSeaColorMod`,`float`,.8),n.constants.add(`correctionViewingPowerFactor`,`float`,.4),n.constants.add(`skyZenitColor`,`vec3`,[.52,.68,.9]),n.constants.add(`skyColor`,`vec3`,[.67,.79,.9]),n.constants.add(`cloudFresnelModifier`,`vec2`,[1.2,.01]),n.code.add(C`PBRShadingWater shadingInfo;
vec3 getSkyGradientColor(in float cosTheta, in vec3 horizon, in vec3 zenit) {
float exponent = pow((1.0 - cosTheta), fresnelSky[2]);
return mix(zenit, horizon, exponent);
}`),n.uniforms.add(new D(`lightingSpecularStrength`,e=>e.lighting.mainLight.specularStrength),new D(`lightingEnvironmentStrength`,e=>e.lighting.mainLight.environmentStrength)),n.code.add(C`vec3 getWaterColor(in vec3 n, in vec3 v, in vec3 l, vec3 color, in vec3 lightIntensity, in vec3 localUp, in float shadow, float foamIntensity, vec3 viewPosition, vec3 position) {
float reflectionHit = 0.0;
float reflectionHitDiffused = 0.0;
vec3 seaWaterColor = linearizeGamma(color);
vec3 h = normalize(l + v);
shadingInfo.NdotV = clamp(dot(n, v), 0.001, 1.0);
shadingInfo.VdotN = clamp(dot(v, n), 0.001, 1.0);
shadingInfo.NdotH = clamp(dot(n, h), 0.0, 1.0);
shadingInfo.VdotH = clamp(dot(v, h), 0.0, 1.0);
shadingInfo.LdotH = clamp(dot(l, h), 0.0, 1.0);
float upDotV = max(dot(localUp,v), 0.0);
vec3 skyHorizon = linearizeGamma(skyColor);
vec3 skyZenit = linearizeGamma(skyZenitColor);
vec3 skyColor = getSkyGradientColor(upDotV, skyHorizon, skyZenit );
float upDotL = max(dot(localUp,l),0.0);
float daytimeMod = 0.1 + upDotL * 0.9;
skyColor *= daytimeMod;
float shadowModifier = clamp(shadow, 0.8, 1.0);
vec3 fresnelModifier = fresnelReflection(shadingInfo.VdotN, vec3(fresnelSky[0]), fresnelSky[1]);
vec3 reflSky = lightingEnvironmentStrength * fresnelModifier * skyColor * shadowModifier;
vec3 reflSea = seaWaterColor * mix(skyColor, upDotL * lightIntensity * LIGHT_NORMALIZATION, 2.0 / 3.0) * shadowModifier;
vec3 specular = vec3(0.0);
if(upDotV > 0.0 && upDotL > 0.0) {
vec3 specularSun = brdfSpecularWater(shadingInfo, roughness, vec3(fresnelMaterial[0]), fresnelMaterial[1]);
vec3 incidentLight = lightIntensity * LIGHT_NORMALIZATION * shadow;
float NdotL = clamp(dot(n, l), 0.0, 1.0);
specular = lightingSpecularStrength * NdotL * incidentLight * specularSun;
}
vec3 foam = vec3(0.0);
if(upDotV > 0.0) {
foam = foamIntensity2FoamColor(foamIntensityExternal, foamIntensity, skyZenitColor, daytimeMod);
}
float correctionViewingFactor = pow(max(dot(v, localUp), 0.0), correctionViewingPowerFactor);
vec3 normalCorrectedClouds = mix(localUp, n, correctionViewingFactor);
vec3 reflectedWorld = normalize(reflect(-v, normalCorrectedClouds));`),t.cloudReflections&&n.uniforms.add(new D(`cloudsOpacity`,e=>e.clouds.opacity)).code.add(C`vec4 cloudsColor = renderClouds(reflectedWorld, position);
cloudsColor.a = 1.0 - cloudsColor.a;
cloudsColor = pow(cloudsColor, vec4(GAMMA));
cloudsColor *= clamp(fresnelModifier.y * cloudFresnelModifier[0] - cloudFresnelModifier[1], 0.0, 1.0) * cloudsOpacity;`),t.screenSpaceReflections?n.uniforms.add(new E(`view`,e=>e.camera.viewMatrix),new ce(`lastFrameColorTexture`,e=>e.reprojection.lastFrameColor?.getTexture()),new D(`fadeFactorSSR`,e=>e.screenSpaceReflections.fadeFactor)).code.add(C`vec3 viewDir = normalize(viewPosition);
vec4 viewNormalVectorCoordinate = view * vec4(n, 0.0);
vec3 viewNormal = normalize(viewNormalVectorCoordinate.xyz);
vec4 viewUp = view * vec4(localUp, 0.0);
vec3 viewNormalCorrectedSSR = mix(viewUp.xyz, viewNormal, correctionViewingFactor);
vec3 reflected = normalize(reflect(viewDir, viewNormalCorrectedSSR));
vec3 hitCoordinate = screenSpaceIntersection(reflected, viewPosition, viewDir, viewUp.xyz, 0.0);
vec3 reflectedColor = vec3(0.0);
if (hitCoordinate.z > 0.0)
{
vec2 reprojectedCoordinate = reprojectionCoordinate(hitCoordinate);
vec2 dCoords = smoothstep(0.3, 0.6, abs(vec2(0.5, 0.5) - hitCoordinate.xy));
float heightMod = smoothstep(ssrHeightFadeEnd, ssrHeightFadeStart, -viewPosition.z);
reflectionHit = clamp(1.0 - (1.3 * dCoords.y), 0.0, 1.0) * heightMod * fadeFactorSSR;
reflectionHitDiffused = waterDiffusion * reflectionHit;
reflectedColor = linearizeGamma(texture(lastFrameColorTexture, reprojectedCoordinate).xyz) *
reflectionHitDiffused * fresnelModifier.y * ssrIntensity;
}
float seaColorMod =  mix(waterSeaColorMod, waterSeaColorMod * 0.5, reflectionHitDiffused);
vec3 waterRenderedColor = tonemapACES((1.0 - reflectionHitDiffused) * reflSky + reflectedColor +
reflSea * seaColorMod + specular + foam);`):n.code.add(C`vec3 waterRenderedColor = tonemapACES(reflSky + reflSea * waterSeaColorMod + specular + foam);`),t.cloudReflections?t.screenSpaceReflections?n.code.add(C`return waterRenderedColor * (1.0 - (1.0 - reflectionHit) * cloudsColor.a) + (1.0 - reflectionHit) * cloudsColor.xyz;
}`):n.code.add(C`return waterRenderedColor * (1.0 - cloudsColor.a) + cloudsColor.xyz;
}`):n.code.add(C`return waterRenderedColor;
}`)}function Xe(e,t){t.spherical?e.vertex.code.add(C`vec3 getLocalUp(in vec3 pos, in vec3 origin) {
return normalize(pos + origin);
}`):e.vertex.code.add(C`vec3 getLocalUp(in vec3 pos, in vec3 origin) {
return vec3(0.0, 0.0, 1.0);
}`),t.spherical?e.vertex.code.add(C`mat3 getTBNMatrix(in vec3 n) {
vec3 t = normalize(cross(vec3(0.0, 0.0, 1.0), n));
vec3 b = normalize(cross(n, t));
return mat3(t, b, n);
}`):e.vertex.code.add(C`mat3 getTBNMatrix(in vec3 n) {
vec3 t = vec3(1.0, 0.0, 0.0);
vec3 b = normalize(cross(n, t));
return mat3(t, b, n);
}`)}function Ze(e){let t=0;return e.some(({emissions:e})=>e===3||e===2&&t===1||e===1&&t===2?(t=3,!0):(e!==0&&t===0&&(t=e),!1)),t}function Qe(e){switch(e.elementType){case`float`:switch(e.elementCount){case 1:return C`float`;case 2:return C`vec2`;case 3:return C`vec3`;case 4:return C`vec4`;case 9:return C`mat3`;default:e.elementCount}break;case`int`:switch(e.elementCount){case 1:return C`int`;case 2:return C`ivec2`;case 3:return C`ivec3`;case 4:return C`ivec4`;case 9:throw Error(`Invalid element count 9 for type int`);default:e.elementCount}break;case`uint`:switch(e.elementCount){case 1:return C`uint`;case 2:return C`uvec2`;case 3:return C`uvec3`;case 4:return C`uvec4`;case 9:throw Error(`Invalid element count 9 for type uint`);default:e.elementCount}break;default:e.elementType}throw Error(`unsupported field`)}var J=new D(`constNaN`,()=>NaN,{supportsNaN:!0}),Y=class extends se{constructor(e){super(),this.supportNaN=e}};function $e(e,t){let n=t?.supportNaN;n&&(e.uniforms.add(J),e.code.add(C`bool bitsEncodeFloat16NaN(highp uint bits) {
const highp uint nanExponent = 0x00007c00u;
highp uint exponent = bits & nanExponent;
highp uint mantissa = bits & 0x000003ffu;
return exponent == nanExponent && mantissa != 0u;
}`)),e.code.add(C`
    mediump float unpackHalf1x16(highp uint bits) {
      ${S(n,C`
        if (bitsEncodeFloat16NaN(bits)) {
          return constNaN;
        }`)}
      return unpackHalf2x16(bits).x;
    }`),e.code.add(C`
    mediump vec2 unpackHalf2x16NaNSupport(highp uint bits) {
      vec2 result = unpackHalf2x16(bits);
      ${S(n,C`
        if (bitsEncodeFloat16NaN(bits)) {
          result.x = constNaN;
        }
        if (bitsEncodeFloat16NaN(bits >> ${C.uint($[2])})) {
          result.y = constNaN;
        }
        `)}
      return result;
    }`)}function et(e,t){let n=t?.supportNaN;n&&(e.uniforms.add(J),e.code.add(C`bool bitsEncodeFloat32NaN(highp uint bits) {
const highp uint nanExponent = 0x7f800000u;
highp uint exponent = bits & nanExponent;
highp uint mantissa = bits & 0x007fffffu;
return exponent == nanExponent && mantissa != 0u;
}`)),e.code.add(C`
    highp float unpackFloat1x32(highp uint bits) {
      ${S(n,C`
        if (bitsEncodeFloat32NaN(bits)) {
          return constNaN;
        }`)}
      return uintBitsToFloat(bits);
    }`)}function tt(e){e.code.add(C`mediump int unpackInt1x16(highp uint bits) {
highp uint signExtendedBits = (bits & 0x8000u) != 0u ? (bits | 0xffff0000u) : bits;
return int(signExtendedBits);
}`)}function nt(e,t){let{fieldType:n}=e;return`${(0,st[n])(ct(e,t))}`}function X(e,t){let n=[];for(let t of e){let e=C`unpackFloat1x32(${t})`;n.push(e)}return n.join(t)}c([oe()],Y.prototype,`supportNaN`,void 0);var Z=e=>C`${e[0]}`,rt=e=>{let t=e[0],n=C`uvec4(${C.uint($[0])}, ${C.uint($[1])}, ${C.uint($[2])}, ${C.uint($[3])})`,r=C`uvec4(${C.hexuint(lt[1])})`;return C`((uvec4(${t}) >> ${n}) & ${r})`},it=e=>C`(float(${Z(e)})/${C.float(255)})`,at=e=>C`unpackFloat1x32(${e[0]})`,ot=e=>C`vec4(${X(e,`, `)})`,st={u8:Z,unorm8:it,vec4unorm8:e=>C`(vec4(${rt(e)})/${C.float(255)})`,snorm16:e=>C`unpackSnorm2x16(${e[0]}).x`,vec2snorm16:e=>C`unpackSnorm2x16(${e[0]})`,f16:A?e=>C`unpackHalf1x16(${e[0]})`:at,vec4f16:A?e=>C`vec4(unpackHalf2x16NaNSupport(${e[0]}), unpackHalf2x16NaNSupport(${e[1]}))`:ot,f32:at,vec4u8:rt,vec2f32:e=>C`vec2(${X(e,`, `)})`,vec3f32:e=>C`vec3(${X(e,`, `)})`,vec4f32:ot,mat3f32:e=>C`mat3(${X(e,`,
`)})`};function ct(e,t){let{byteOffset:n,byteSize:r}=e,i=t.channelByteStride,a=t.byteStride,o=Math.ceil(r/Q),s=ut[t.channels],c=[];for(let e=0;e<o;++e){let t=e*Q,o=n+t,l=r-t,u=Math.min(l,Q),d=0,f=[];for(;d<u;){let e=o+d,t=Math.floor(e/a),n=e%a,r=Math.floor(n/i),c=n%i,l=i-c,p=u-d,m=Math.min(l,p),h=C`texel${C.int(t)}${s[r]}`,g=m===4?``:C` & ${C.hexuint(lt[m])}`,_=c===0?``:C` >> ${C.uint($[c])}`,v=C`((${h}${_})${g})`,y=d===0?``:C` << ${C.uint($[d])}`,b=C`(${v})${y}`;f.push(b),d+=m}c.push(C`(${f.join(` | `)})`)}return c}var Q=4,$=[0,8,16,24],lt=[0,255,65535,16777215,4294967295],ut={1:[C``],2:[C`.x`,C`.y`],4:[C`.x`,C`.y`,C`.z`,C`.w`]},dt=new Y(!0),ft=new Y(!1),pt=class{constructor(e){this.moduleId=o(),this.namespace=`_tbb_${this.moduleId}_`;let{itemIndexAttribute:t,bufferUniform:n,layout:r}=e,i=e.fieldFilter??(()=>!0),a=e.enableNaNSupport?dt:ft;this.TextureBackedBufferModule=(e,o)=>mt(this.namespace,e,o,t,n,r,i,a),this.getTextureAttribute=ht(this.namespace)}};function mt(e,t,n,r,i,a,o,s){let{vertex:c}=t,{texelFormatInfo:l}=a;c.include(et,s),c.include($e,s),c.include(tt);let u=`${e}tbbStride`,d=`${e}TextureBackedBufferItemData`,f=`${e}fetchTextureBackedBufferItemData`,p=gt(e);for(let e of[u,d,f,p])ue(e.length<1024,`Identifiers do not have a valid length`);c.constants.add(u,`uint`,a.texelStride),c.uniforms.add(i);let m=[];for(let e of a.fields.values())o(e.name,n)&&m.push(e);if(m.length===0)return;let h=[];for(let e=0;e<a.texelStride;++e)h.push(!1);for(let e of m)for(let t=0;t<e.numTexels;++t)h[e.startTexel+t]=!0;c.code.add(C`
  struct ${d} {`);for(let e of m)c.code.add(C`\t${Qe(e)} ${e.name};`);c.code.add(C`};`),c.code.add(C`
  ${d} ${f}(highp uint itemIndex) {
    ${d} itemData;
    highp uint index = itemIndex * ${u};
    highp uint rowWidth = uint(textureSize(${i.name}, 0).x);
    int coordX = int(index % rowWidth);
    int coordY = int(index / rowWidth);
  `);let g=_t[l.channels],_=vt[l.channels];for(let e=0;e<h.length;++e)!1!==h[e]&&c.code.add(C`highp ${g} texel${C.int(e)} = texelFetch(${i.name}, ivec2(coordX + ${C.int(e)}, coordY), 0)${_};`);for(let e of m)c.code.add(C`itemData.${e.name} = ${nt(e,l)};`);c.code.add(C`return itemData;
}`),c.code.add(C`${d} ${p};`),c.main.add(C`${p} = ${f}(${r});`)}function ht(e){let t=gt(e);return e=>C`${t}.${e}`}function gt(e){return`${e}ItemData`}var _t={1:C`uint`,2:C`uvec2`,4:C`uvec4`},vt={1:C`.x`,2:C`.xy`,4:``},yt=class extends w{constructor(e,t){super(e,`usampler2D`,2,(n,r,i)=>n.bindTexture(e,t(r,i)))}};export{Ce as C,Se as S,xe as T,Me as _,Ye as a,P as b,Ue as c,Ne as d,Pe as f,Ae as g,Ie as h,Xe as i,H as l,Fe as m,pt as n,q as o,je as p,Ze as r,We as s,yt as t,Re as u,Le as v,M as w,N as x,De as y};