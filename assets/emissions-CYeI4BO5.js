import"./string-BpVBm9CH.js";import{n as e}from"./Error-DlH92XPf.js";import{c as t,n,o as r,t as i}from"./decorators-B0Ozpuuo.js";import{N as a,j as o}from"./promiseUtils-De_zspLB.js";import{t as s}from"./uid-tFVEb1ZF.js";import{r as c}from"./Ellipsoid-Co4rBm1M.js";import{r as l}from"./tslib.es6-qUHyP9zl.js";import{n as u}from"./JSONSupport-B7yFOY-c.js";import{t as d}from"./Evented-BTX6JxCX.js";import{c as f,r as p}from"./vec3f64-BCBDKjuM.js";import{b as m,v as h}from"./mathUtils-8B23-m-L.js";import{E as ee,x as g}from"./vec2-C1aKXbzV.js";import{h as _}from"./screenUtils-6qnVF103.js";import{l as te,u as ne}from"./vec4-Xgyc9IxX.js";import{n as re,t as v}from"./vec4f64-DeczMt8m.js";import{s as ie,t as ae}from"./Texture-Bx8O5-fI.js";import{d as oe,r as y,s as b}from"./vec2f64-UJ3ILzaq.js";import{An as se,Mn as ce}from"./index-wLElo4kf.js";import{d as x,f as S,l as le,u as ue}from"./floatBlendScale.glsl-BaQhFMcs.js";import{An as C,J as de,Tn as fe,Y as pe,gn as me,kn as w,nr as he,pt as ge,vn as _e,vt as ve,yn as ye}from"./VertexColor.glsl-nQ4npUUV.js";import{d as be}from"./TextureCompressionTracker-yD0osMEG.js";import{k as xe}from"./WebGLLayer-D_PC2mJl.js";import{D as Se,O as Ce,b as we,h as Te,v as Ee,y as De}from"./ReceiveShadowsConfiguration-TZDqAUu3.js";import{r as Oe,t as ke}from"./fontUtils-CoRXiSs0.js";import{i as T}from"./ManagedTexture-aRoRQNAV.js";var E,D=class extends u{static{E=this}constructor(e){super(e),this.type=`rainy`,this.cloudCover=.5,this.precipitation=.5}clone(){return new E({cloudCover:this.cloudCover,precipitation:this.precipitation})}get scattering(){return h(E.minScattering,E.maxScattering,this.precipitation**3)}static{this.minScattering=4e-6}static{this.maxScattering=2e-4}};l([r({rainy:`rainy`}),i({json:{write:{isRequired:!0}}})],D.prototype,`type`,void 0),l([i({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],D.prototype,`cloudCover`,void 0),l([i({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],D.prototype,`precipitation`,void 0),D=E=l([n(`esri.views.3d.environment.RainyWeather`)],D);var O=D,k,A=k=class extends u{constructor(e){super(e),this.type=`sunny`,this.cloudCover=.5}clone(){return new k({cloudCover:this.cloudCover})}get scattering(){return O.minScattering*(this.cloudCover+.5)}};l([r({sunny:`sunny`}),i({json:{write:{isRequired:!0}}})],A.prototype,`type`,void 0),l([i({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],A.prototype,`cloudCover`,void 0),A=k=l([n(`esri.views.3d.environment.SunnyWeather`)],A);var j=A,M=class{constructor(e,t,n,r,i,a,o,s,c=.5){this.coverage=e,this.density=t,this.absorption=n,this.cloudSize=r,this.detailSize=i,this.smoothness=a,this.cloudHeight=o,this.raymarchingSteps=s,this.median=c}},N={sunny:new M([0,.6],[.03,.03],[0,0],[.9,.9],[.8,.8],[.7,.7],[.05,.05],0),cloudy:new M([.3,.65],[.2,.4],[0,0],[.85,.85],[.75,.75],[.3,.4],[1,1],2,.6),rainy:new M([.6,.8],[.5,.8],[.1,.5],[.9,.9],[.75,.75],[.5,.5],[1,1],2,.4),snowy:new M([.25,.75],[.3,.3],[0,0],[.95,.95],[.7,.7],[.69,.75],[.3,1],1,.65),foggy:new M([.8,.8],[.5,.5],[0,0],[.95,.95],[.9,.9],[.55,.55],[.3,.3],0)};N.default=N.sunny;var Ae=N.cloudy.coverage[0]/N.rainy.coverage[0],P,F=P=class extends u{constructor(e){super(e),this.type=`cloudy`,this.cloudCover=.5}clone(){return new P({cloudCover:this.cloudCover})}get scattering(){return h(O.minScattering,O.maxScattering,this.cloudCover)*Ae}};l([r({cloudy:`cloudy`}),i({json:{write:{isRequired:!0}}})],F.prototype,`type`,void 0),l([i({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],F.prototype,`cloudCover`,void 0),F=P=l([n(`esri.views.3d.environment.CloudyWeather`)],F);var je=F,I,L=I=class extends u{constructor(e){super(e),this.type=`snowy`,this.cloudCover=.5,this.precipitation=.5,this.snowCover=`disabled`}clone(){return new I({cloudCover:this.cloudCover,precipitation:this.precipitation,snowCover:this.snowCover})}get scattering(){return h(O.minScattering,O.maxScattering,this.precipitation**3)}};l([r({snowy:`snowy`}),i({json:{write:{isRequired:!0}}})],L.prototype,`type`,void 0),l([i({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],L.prototype,`cloudCover`,void 0),l([i({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],L.prototype,`precipitation`,void 0),l([i({type:[`enabled`,`disabled`],nonNullable:!0,json:{write:!0}})],L.prototype,`snowCover`,void 0),L=I=l([n(`esri.views.3d.environment.SnowyWeather`)],L);var R={key:`type`,base:j,typeMap:{sunny:j,cloudy:je,rainy:O,snowy:L,foggy:xe}},Me=Object.keys(R.typeMap);function Ne(e,t){return Me.includes(e)?!0:(t.error(`"${e}" is not a valid weather type`),!1)}var Pe=1e4,Fe=1e5,z=Symbol(`hasTransparencyModeSymbol`);function Ie(e){return z in e}var Le=class{constructor(e,t=`center`,n=!1,r=y(),i=f(0,0,0),a=-1,o=`world`,s=p(),c=0){this.verticalOffset=e,this.anchor=t,this.hasLabelVerticalOffset=n,this.screenOffset=r,this.centerOffset=i,this.groundDistance=a,this.centerOffsetUnits=o,this.translation=s,this.elevationOffset=c}},Re=class{constructor(e,t=`center`,n=`center`,r=null,i=y()){this.placement=e,this.horizontalPlacement=t,this.verticalPlacement=n,this.text=r,this.displaySize=i}};function B(e,t,n){return e.canvas||=document.createElement(`canvas`),e.canvas.width=t,e.canvas.height=n,e.canvas}function V(e){let{size:t}=e.definition,n=e.fontString(t),r=H.get(n);if(!r){let i=B(Be,0,0).getContext(`2d`);e.setFontProperties(i,t);let a=i.measureText(Ve);r=new ze(a.actualBoundingBoxAscent,a.actualBoundingBoxDescent),H.set(n,r)}return r}var H=new Map,ze=class{get maxHeight(){return this.maxAscent+this.maxDescent}constructor(e,t){this.maxAscent=e,this.maxDescent=t}},Be={canvas:null},Ve=(()=>{let e=``;for(let t=32;t<127;t++)e+=String.fromCharCode(t);return e})(),He=class{constructor(e,t,n,r){this.text=e,this._alignment=t,this._parameters=n,this._maxSize=r,this._textWidths=[],this._lineWidths=[],this._renderPixelRatio=null,this._metricsCached=null,this.key=`${e}--${this._parameters.key}-${this._alignment}`,this._lines=e.replaceAll(` `,`\xA0`).split(/\r?\n/)}get displayWidth(){return Math.ceil(this._displayWidth+this._horizontalPadding*2)}get displayHeight(){let e=this._metrics.firstLineAscent;for(let t=0;t<this._lines.length-1;t++)e+=this._lineSpacing;return e+=this._metrics.lastLineDescent,Math.ceil(e+2*this._haloSize+2*this._verticalPadding)}get renderedWidth(){return this._toRoundedRenderUnit(this.displayWidth)}get renderedHeight(){return this._toRoundedRenderUnit(this.displayHeight)}get firstRenderedBaselinePosition(){return this._toRenderUnit(this._firstLineYOffset+this._metrics.firstLineAscent)}get _firstLineYOffset(){return this._verticalPadding+this._haloSize}get _metrics(){if(this._metricsCached==null){let e=B(W,G,G).getContext(`2d`),t=this._parameters.definition.pixelRatio,n=this._fontSize*t;this._parameters.setFontProperties(e,n);let r=2*this._haloSize,i=this._parameters.definition.font;(i.style===`italic`||i.style===`oblique`||i.weight===`bold`||i.weight===`bolder`)&&(r+=e.measureText(`A`).width*.3),this._textWidths.length=0,this._lineWidths.length=0;let a=0,o=0,s=0,c=0,l=0;this._lines.forEach((n,i)=>{let u=e.measureText(n),d=u.width/t,f=d+r;this._textWidths.push(d),this._lineWidths.push(f),a=Math.max(a,f),c=Math.max(c,u.actualBoundingBoxAscent/t),l=Math.max(l,u.actualBoundingBoxDescent/t),i===0&&(o=u.actualBoundingBoxAscent/t),i===this._lines.length-1&&(s=u.actualBoundingBoxDescent/t)});let u=V(this._parameters),d=Math.max(c,u.maxAscent),f=Math.max(l,u.maxDescent),p=o,m=this._parameters.definition.font.decoration===`underline`?f:s,h=a;this._metricsCached=new We(p,m,d,f,h)}return this._metricsCached}get _lineSpacing(){return(this._midLineHeight+this._linePadding)*this._parameters.definition.lineSpacingFactor}get _midLineHeight(){return this._metrics.midLineHeight}get _linePadding(){return this._midLineHeight*Ue}get _midLineAscent(){return this._metrics.maxLineAscent}get _renderedFontSize(){return this._toRenderUnit(this._fontSize)}get _fontSize(){return this._parameters.definition.size}get _renderedHaloSize(){return this._toRenderUnit(this._haloSize)}get _haloSize(){return this._parameters.haloSize}get _horizontalPadding(){return this._hasBackgroundOrBorder?this._parameters.definition.background.padding[0]+this._borderSize:0}get _verticalPadding(){return Math.max(this._hasBackgroundOrBorder?this._parameters.definition.background.padding[1]:0,1)+this._borderSize}get _hasBackground(){return this._parameters.backgroundStyle!=null}get _hasBackgroundOrBorder(){return this._hasBackground||this._hasBorder}get _hasBorder(){return this._parameters.borderStyle!=null&&this._parameters.borderSize>0}get _borderSize(){return this._hasBorder?this._parameters.borderSize:0}get _rendererBorderSize(){return this._toRenderUnit(this._borderSize)}get renderPixelRatio(){if(this._renderPixelRatio==null){let e=this._parameters.definition.pixelRatio;this._renderPixelRatio=Math.min(e,Math.min(this._maxSize[0]/this.displayWidth,this._maxSize[1]/this.displayHeight))}return this._renderPixelRatio}_getLineXOffset(e){switch(this._alignment){case 0:return this._horizontalPadding;case 1:return(this.displayWidth-this._lineWidths[e])/2;case 2:return this.displayWidth-this._horizontalPadding-this._lineWidths[e]}}render(e,t,n){e.save(),t/=this.renderPixelRatio,n/=this.renderPixelRatio;let r=t,i=n,a=this._haloSize,o=this._firstLineYOffset+this._metrics.firstLineAscent;t+=a,n+=o;let s=this._haloSize>0;s&&this._renderHalo(e,r,i,a,o),this._parameters.setFontProperties(e,this._renderedFontSize);for(let r=0;r<this._lines.length;++r){let i=this._lines[r],a=this._getLineXOffset(r);s&&(e.globalCompositeOperation=`destination-out`,e.fillStyle=`rgb(0, 0, 0)`,this._fillText(e,i,t+a,n),this._renderLineDecoration(e,t+a,n,this._textWidths[r])),e.globalCompositeOperation=`source-over`,e.fillStyle=this._parameters.textStyle,this._fillText(e,i,t+this._getLineXOffset(r),n),this._renderLineDecoration(e,t+a,n,this._textWidths[r]),n+=this._lineSpacing}if(he.TEXT_SHOW_BASELINE){e.strokeStyle=K,e.setLineDash([2,2]),e.lineWidth=1;let t=i+o;for(let n=0;n<this._lines.length;++n)this._drawLine(e,[r,t],[r+this.displayWidth,t]),t+=this._lineSpacing}if(he.TEXT_SHOW_BORDER&&(e.strokeStyle=K,e.setLineDash([]),e.lineWidth=1,this._drawBox(e,[r,i],[this.displayWidth,this.displayHeight])),this._hasBackgroundOrBorder){let t=this._rendererBorderSize,n=m(this._parameters.definition.background.borderRadius*this.renderPixelRatio,0,Math.floor(Math.min(this.renderedWidth-t,this.renderedHeight-t)/2)),a=Math.max(n-t/2,0);e.globalCompositeOperation=`destination-over`,this._hasBackground&&(this._roundedRect(e,r,i,a,t),e.fillStyle=this._parameters.backgroundStyle,e.fill()),this._hasBorder&&(this._roundedRect(e,r,i,n,t/2),e.strokeStyle=this._parameters.borderStyle,e.lineWidth=t,e.lineJoin=`round`,e.stroke())}e.restore()}_renderLineDecoration(e,t,n,r,i=!1){if(this._parameters.definition.font.decoration===`none`||r===0)return;let a=Math.max(this._parameters.definition.size/16,1);switch(this._parameters.definition.font.decoration){case`underline`:n+=2*a;break;case`line-through`:n-=this._midLineAscent*.33}let o=i?this._haloSize:0;e.strokeStyle=i?this._parameters.haloStyle:this._parameters.textStyle,e.lineWidth=this._toRenderUnit(a+o*2),e.beginPath(),e.moveTo(this._toRenderUnit(t-o),this._toRenderUnit(n)),e.lineTo(this._toRenderUnit(t+r+o),this._toRenderUnit(n)),e.stroke()}_roundedRect(e,t,n,r,i){t=this._toRenderUnit(t)+i,n=this._toRenderUnit(n)+i;let a=this.renderedWidth-2*i,o=this.renderedHeight-2*i;if(!(a<=0||o<=0)){if(e.beginPath(),r===0){e.moveTo(t,n),e.lineTo(t+a,n),e.lineTo(t+a,n+o),e.lineTo(t,n+o),e.closePath();return}e.moveTo(t,n+r),e.arcTo(t,n,t+r,n,r),e.lineTo(t+a-r,n),e.arcTo(t+a,n,t+a,n+r,r),e.lineTo(t+a,n+o-r),e.arcTo(t+a,n+o,t+a-r,n+o,r),e.lineTo(t+r,n+o),e.arcTo(t,n+o,t,n+o-r,r),e.closePath()}}_renderHalo(e,t,n,r,i){let a=this.renderedWidth,o=this.renderedHeight,s=B(W,Math.max(a,G),Math.max(o,G)),c=s.getContext(`2d`);c.clearRect(0,0,a,o),this._parameters.setFontProperties(c,this._renderedFontSize),c.fillStyle=this._parameters.haloStyle,c.strokeStyle=this._parameters.haloStyle;let l=this._renderedHaloSize<3;c.lineJoin=l?`miter`:`round`,l?this._renderHaloEmulated(c,r,i):this._renderHaloNative(c,r,i);let u=i;for(let e=0;e<this._lines.length;++e){let t=this._getLineXOffset(e);this._renderLineDecoration(c,r+t,u,this._textWidths[e],!0),u+=this._lineSpacing}e.globalAlpha=this._parameters.definition.halo.color[3],e.drawImage(s,0,0,a,o,this._toRenderUnit(t),this._toRenderUnit(n),a,o),e.globalAlpha=1}_renderHaloEmulated(e,t,n){for(let r=0;r<this._lines.length;++r){let i=this._lines[r],a=this._getLineXOffset(r);for(let[r,o]of U)this._fillText(e,i,t+a+this._haloSize*r,n+this._haloSize*o);n+=this._lineSpacing}}_renderHaloNative(e,t,n){let r=2*this._haloSize;for(let i=0;i<this._lines.length;++i){let a=this._lines[i],o=this._getLineXOffset(i);for(let i=0;i<5;i++){let s=.6+i*.1;e.lineWidth=this._toRenderUnit(s*r),this._strokeText(e,a,t+o,n)}n+=this._lineSpacing}}get _displayWidth(){return this._metrics.displayWidth}_toRenderUnit(e){return e*this.renderPixelRatio}_toRoundedRenderUnit(e){return Math.round(e*this.renderPixelRatio)}_fillText(e,t,n,r){e.fillText(t,this._toRenderUnit(n),this._toRenderUnit(r))}_strokeText(e,t,n,r){e.strokeText(t,this._toRenderUnit(n),this._toRenderUnit(r))}_drawLine(e,t,n){e.beginPath(),e.moveTo(this._toRoundedRenderUnit(t[0])+.5,this._toRoundedRenderUnit(t[1])+.5),e.lineTo(this._toRoundedRenderUnit(n[0])+.5,this._toRoundedRenderUnit(n[1])+.5),e.stroke()}_drawBox(e,t,n){let r=this._toRenderUnit(t[0]),i=this._toRenderUnit(t[1]),a=this._toRenderUnit(n[0]),o=this._toRenderUnit(n[1]),s=Math.floor(r)+.5,c=Math.ceil(r+a)-.5,l=Math.floor(i)+.5,u=Math.ceil(i+o)-.5;e.beginPath(),e.moveTo(s,l),e.lineTo(c,l),e.lineTo(c,u),e.lineTo(s,u),e.lineTo(s,l),e.stroke()}},U=[];for(let e=0;e<360;e+=360/16)U.push([Math.cos(Math.PI*e/180),Math.sin(Math.PI*e/180)]);var W={canvas:null},Ue=.2,G=512,K=`rgb(255, 0, 255, 0.5)`,We=class{get firstLineHeight(){return this.firstLineAscent+this.maxLineDescent}get midLineHeight(){return this.maxLineAscent+this.maxLineDescent}get lastLineHeight(){return this.maxLineAscent+this.lastLineDescent}constructor(e,t,n,r,i){this.firstLineAscent=e,this.lastLineDescent=t,this.maxLineAscent=n,this.maxLineDescent=r,this.displayWidth=i}},Ge=Object.freeze({left:0,center:.5,right:1}),Ke=Object.freeze({"bottom-left":b(0,0),bottom:b(.5,0),"bottom-right":b(1,0),left:b(0,.5),center:b(.5,.5),right:b(1,.5),"top-left":b(0,1),top:b(.5,1),"top-right":b(1,1)});function qe(e){switch(e){case`left`:return 0;case`right`:return 2;default:return 1}}function Je(e){switch(e){case`bottom-left`:case`left`:case`top-left`:return`left`;case`bottom`:case`center`:case`top`:return`center`;case`bottom-right`:case`right`:case`top-right`:return`right`}}function Ye(e){switch(e){case`bottom-left`:case`bottom`:case`bottom-right`:return`bottom`;case`left`:case`center`:case`right`:return`center`;case`top-left`:case`top`:case`top-right`:return`top`}}function Xe(e,t){switch(t){case`bottom`:return e===`left`?`bottom-left`:e===`right`?`bottom-right`:`bottom`;case`center`:return e;case`top`:return e===`left`?`top-left`:e===`right`?`top-right`:`top`}}function Ze(e){return e===`middle`?`center`:e}function Qe(e,t){switch(e){case`top`:return g(t,0,1);case`bottom`:return g(t,0,-1);default:return ee(t,oe)}}var $e=class t{constructor(e){this.definition=e,this.key=JSON.stringify(e),this.haloSize=Math.round(e.halo.size),this.textStyle=tt(e.color),this.haloStyle=et(e.halo.color),this.backgroundStyle=nt(e.background.color),this.borderSize=e.background.border.size,this.borderStyle=nt(e.background.border.color)}fontString(e){let t=this.definition.font;return`${t.style} ${t.weight} ${e}px ${t.family}, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji`}setFontProperties(e,t){e.font=this.fontString(t),e.textAlign=`left`,e.textBaseline=`alphabetic`}static async fromSymbol(n,r){let i=q(n?.material?.color),a=n.size==null?12:_(n.size),o=n.lineHeight,s=q(n.background?.color),c=n.border,l=q(c?.color),u=c!=null&&c.size>0&&l!==v?{size:_(c.size),color:l}:{size:0,color:v},d=n.background!=null||u.size>0,f={family:n.font?.family??`sans-serif`,decoration:n.font?.decoration??`none`,weight:n.font?.weight??`normal`,style:n.font?.style??`normal`},p=n.halo,m=p?.color!=null&&p.size>0?{size:_(p.size),color:p.color.toUnitRGBA()}:{size:0,color:v},h=new t({color:i,size:a,background:{color:s,border:u,padding:d?[a*.65,a*.5]:[0,0],borderRadius:d?6/16*a:0},lineSpacingFactor:o,font:f,halo:m,pixelRatio:r});if(n.font){let t=!1,r=h.fontString(a);try{t=(await document.fonts.load(r)).some(e=>!ke(e))}catch{e.getLogger(`esri.views.3d.webgl-engine.lib.TextRenderParameters`).warnOnce(`Failed to preload font '${r}'. Some text symbology may be rendered using the default browser font.`)}if(!t&&!rt.has(n.font.family))try{await Oe(n.font)}catch{}}return h}};function et(e){return`rgb(${e.slice(0,3).map(e=>Math.floor(e*255)).toString()})`}function tt(e){return`rgba(${e.slice(0,3).map(e=>Math.floor(e*255)).toString()},${e[3]})`}function nt(e){return e[3]===0?null:tt(e)}var rt=new Set([`Arial`,`Times New Roman`,`Courier New`,`serif`,`sans-serif`,`monospace`,`cursive`,`fantasy`,`system-ui`,`ui-serif`,`ui-sans-serif`,`ui-monospace`,`ui-rounded`,`math`,`emoji`,`fangsong`]);function q(e){return e!=null&&e.a!==0?e.toUnitRGBA():v}var J=4096,Y=class extends t{constructor(e){super(e),this.id=s(),this.events=new d,this._texture=null,this._atlas=new ot(256,256),this._needsRepack=!1,this._canRepack=!0,this._elementsToRender=new Map,this._elements=new Map,this._uvCallbacks=new Map,this.updating=!1}initialize(){this._canvas=document.createElement(`canvas`),this._canvas.setAttribute(`id`,`textAtlasCanvas`),this._canvas.setAttribute(`style`,`display:none`),this._ctx=this._canvas.getContext(`2d`),this._stage=this.view.stage,this._stage.addTexture(this),this._updateCanvasElementSize(this._atlas),this._reset()}unload(){this._texture=o(this._texture),this._frameWorker=a(this._frameWorker),this.updating=!1,this.events.emit(`unloaded`)}get loaded(){return this._texture!=null}get texture(){return this._texture}static get maxSize(){return Q=be.stableRendering?X:0,[J-X-Q,J-X-Q-it]}load(e){if(this._texture)return this._texture;let t=new ie;return t.wrapMode=33071,t.samplingMode=9987,t.hasMipmap=!0,t.preMultiplyAlpha=!0,t.maxAnisotropy=e.parameters.maxMaxAnisotropy,this._texture=new ae(e,t,this._canvas),this._frameWorker=this.view.resourceController.scheduler.registerTask(se.TEXT_TEXTURE_ATLAS,this),this.setDirty(),this._texture}dispose(){this._elements.clear(),this._elementsToRender.clear(),this._frameWorker=a(this._frameWorker),this._texture&&=(this._stage.removeTexture(this),o(this._texture)),this._canvas.width=0,this._canvas.height=0,this._canvas=null,this._ctx=null}_updateCanvasElementSize(e){this._canvas.width=e.width,this._canvas.height=e.height}_resizeAtlas(e,t){let{width:n,height:r}=this._atlas;(n!==e||r!==t)&&(this._atlas.width=e,this._atlas.height=t,this._texture?.resize(e,t),this._texture?.updateData(0,0,0,n,r,this._canvas),this._updateCanvasElementSize(this._atlas),this._elements.forEach(e=>this._uvCallbacks.get(e.textRenderer.key)?.forEach(t=>t(e.uv))),this._reset())}_reset(){this._elementsToRender.clear(),this._atlas.reset(),this._needsRepack=!0,this.setDirty()}_addAtlasElement(e,t,n,r){let i=this._atlas;if(i.width<n||i.height<r)return!1;let a=i.cursors.get(r);if(!a){if(i.height<i.nextY+r)return!1;a=[new Z(i.nextY)],i.cursors.set(r,a),i.nextY+=r}let o=a.find(e=>i.width>=e.x+n);if(o==null){if(i.height<i.nextY+r)return!1;o=new Z(i.nextY),i.nextY+=r,a.push(o)}return e.setNewPosition(o),this._elements.set(t,e),this._elementsToRender.set(t,e),o.x+=n,!0}_ensureCallbacks(e){let t=this._uvCallbacks.get(e);if(t)return t;let n=new Set;return this._uvCallbacks.set(e,n),n}_addCallback(e,t){this._ensureCallbacks(e).add(t)}_removeCallback(e,t){let n=this._uvCallbacks.get(e);return n?.delete(t)&&n.size===0?(this._uvCallbacks.delete(e),!0):!1}_processAddition(e){let t=e.textRenderer.key;if(this._needsRepack){this._elements.set(t,e);return}let n=this._atlas,r=e.textRenderer.renderedWidth,i=e.textRenderer.renderedHeight,a=r+X,o=i+X+it;if(!this._addAtlasElement(e,t,a,o)){if(this._canRepack)this._reset();else if(n.width<a){let e=T(Math.max(a,n.width*1.5),J);this._resizeAtlas(e,n.height)}else{let e=n.nextY+o,t=T(Math.max(e,n.height*1.5),J);if(t>n.height)this._resizeAtlas(n.width,t);else if(n.width<J){let e=T(n.width*1.5,J);this._resizeAtlas(e,n.height)}}this._elements.set(t,e)}}_renderElement(e){let t=e.commitNewPosition(),n=e.textRenderer;this._ctx.clearRect(t[0]-X,t[1]-X,n.renderedWidth+2*X,n.renderedHeight+2*X),n.render(this._ctx,t[0],t[1]),this._uvCallbacks.get(n.key)?.forEach(t=>t(e.uv))}get readyToRun(){return this.updating}runTask(e){if(this._texture==null)return ce;for(;this._needsRepack&&(this._canRepack||this._atlas.height<J&&this._atlas.height<J);){this._canRepack=this._needsRepack=!1;let t=this._elements;this._elements=new Map,t.forEach(e=>this._processAddition(e)),e.madeProgress()}if(this._elementsToRender.size>0){for(let[t,n]of this._elementsToRender){if(e.done)break;this._renderElement(n),this._elementsToRender.delete(t),e.madeProgress()}this._texture.setData(this._canvas)}this.updating=this._elementsToRender.size>0}addText(e,t){let n=e.key;this._addCallback(n,t);let r=this._elements.get(n);return r?ne(r.uv,v)||t(r.uv):(r=new at(e),this._processAddition(r),this.setDirty()),{remove:()=>this._removeText(e,t)}}_removeText(e,t){let n=e.key;this._elements.get(n)&&this._removeCallback(n,t)&&(this._elements.delete(n),this._elementsToRender.delete(n),this._canRepack=!0)}setDirty(){this._texture&&(this.updating=!0)}get test(){}get usedMemory(){return(this._texture?.usedMemory??0)+(this._canvas?.width??0)*(this._canvas?.height??0)*4}};l([i({constructOnly:!0})],Y.prototype,`view`,void 0),l([i({type:Boolean})],Y.prototype,`updating`,void 0),Y=l([n(`esri.views.3d.webgl-engine.lib.TextTextureAtlas`)],Y);var X=2,it=2,at=class{constructor(e){this.textRenderer=e,this._uv=re(),this._newPosition=[0,0]}get uv(){if(this._xOffset==null||this._yOffset==null)return v;let{renderedWidth:e,renderedHeight:t}=this.textRenderer;return te(this._uv,this._xOffset,this._yOffset+t,this._xOffset+e,this._yOffset)}setNewPosition(e){this._newPosition[0]=e.x,this._newPosition[1]=e.y}commitNewPosition(){return this._xOffset=this._newPosition[0],this._yOffset=this._newPosition[1],this._newPosition}get xOffset(){return this._xOffset}get yOffset(){return this._yOffset}},ot=class{constructor(e,t){this.width=e,this.height=t,this.cursors=new Map,this.nextY=0}reset(){this.cursors.clear(),this.nextY=Q}},Z=class{constructor(e){this.y=e,this.x=Q}},Q=0,st=class extends t{precompile(e){return!!this.acquireTechniques(e)}get usedMemory(){return 0}get renderOccludedFlags(){return 1}get testsTransparentRenderOrder(){return 0}get isDecoration(){return!1}get readyToRun(){return!1}get numGeometries(){return 0}get hasOccludees(){return!1}get emissions(){return 0}forEachGeometry(e){}},ct=class extends st{},lt=class extends st{},ut=class{constructor(e,t){this._material=e,this._repository=t}dispose(){this._glMaterial!=null&&this._repository.release(this._material)}load(e,t,n){if(!this._material.produces.get(t)?.(n))return null;if(this._glMaterial??=this._repository.acquire(this._material,t,n),this._glMaterial){if(this._glMaterial.ensureResources(e)===2)return this._glMaterial;this._repository.requestRender()}return null}};function dt(e){e.code.add(x`float normals2FoamIntensity(vec3 n, float waveStrength){
float normalizationFactor =  max(0.015, waveStrength);
return max((n.x + n.y)*0.3303545/normalizationFactor + 0.3303545, 0.0);
}`)}function ft(e){e.code.add(x`vec3 foamIntensity2FoamColor(float foamIntensityExternal, float foamPixelIntensity, vec3 skyZenitColor, float dayMod){
return foamIntensityExternal * (0.075 * skyZenitColor * pow(foamPixelIntensity, 4.) +  50.* pow(foamPixelIntensity, 23.0)) * dayMod;
}`)}function pt(e,t){let n=e.fragment;n.include(pe),n.uniforms.add(_e,ye,new ge(`depthMap`,e=>e.depth?.attachment),new C(`invResolutionHeight`,e=>1/e.camera.height),new w(`reprojectionMatrix`,e=>e.reprojection.matrix)).code.add(x`
  vec2 reprojectionCoordinate(vec3 projectionCoordinate) {
    vec4 clipDepthCoordinate = proj * vec4(0.0, 0.0, -projectionCoordinate.z, 1.0);
    vec4 reprojectedCoordinate = reprojectionMatrix * vec4(
      clipDepthCoordinate.w * (projectionCoordinate.xy * 2.0 - 1.0),
      clipDepthCoordinate.z,
      clipDepthCoordinate.w
    );
    reprojectedCoordinate.xy /= reprojectedCoordinate.w;
    return reprojectedCoordinate.xy * 0.5 + 0.5;
  }

  vec4 applyProjectionMat(mat4 projectionMat, vec3 viewPosition) {
    vec4 projectedCoordinate =  projectionMat * vec4(viewPosition, 1.0);
    projectedCoordinate.xy /= projectedCoordinate.w;
    projectedCoordinate.xy = projectedCoordinate.xy*0.5 + 0.5;
    return projectedCoordinate;
  }

  float rayMarchScreenReachFromWorldReach(vec3 startPosition, vec3 rayDirection, float rayMarchWorldReach) {
    float rayDistanceWorld = max(0.0, rayMarchWorldReach);

    // Stop rays towards camera at near plane
    if (rayDirection.z > 0.0) {
      float distanceToNearPlane = (-nearFar[0] - startPosition.z) / rayDirection.z;
      rayDistanceWorld = min(rayDistanceWorld, max(0.0, distanceToNearPlane));
    }

    vec2 projectedCoordStart = applyProjectionMat(proj, startPosition).xy;
    vec2 projectedCoordEnd = applyProjectionMat(proj, startPosition + rayDirection * rayDistanceWorld).xy;
    vec2 projectedCoordOffset = projectedCoordEnd - projectedCoordStart;

    return ${t.useProjectedRayLength?`length(projectedCoordOffset)`:`abs(projectedCoordOffset.y)`};
  }

  vec3 screenSpaceIntersectionWithLimits(
    vec3 rayDirection,
    vec3 startPosition,
    vec3 viewDirection,
    vec3 normal,
    float rayStepOffset,
    float rayMarchMaxReach,
    float rayMarchMaxSteps
  ) {
    vec3 viewPosition = startPosition;

    // Project the start position to the screen
    vec4 projectedCoordStart = applyProjectionMat(proj, viewPosition);
    vec3 homogeneousStart = viewPosition / projectedCoordStart.w;
    float inverseWStart = 1.0 / projectedCoordStart.w;

    // Advance the position in the ray direction
    viewPosition += rayDirection;

    vec4 projectedCoordVanishingPoint = applyProjectionMat(proj, rayDirection);

    // Project the advanced position to the screen
    vec4 projectedCoordEnd = applyProjectionMat(proj, viewPosition);
    vec3  homogeneousEnd = viewPosition / projectedCoordEnd.w;
    float inverseWEnd = 1.0 / projectedCoordEnd.w;

    // Calculate the ray direction in screen space
    vec2 projectedCoordDirection = (projectedCoordEnd.xy - projectedCoordStart.xy);
    vec2 vanishingPointScreenOffset = (projectedCoordVanishingPoint.xy - projectedCoordStart.xy);

    float rayMarchDistance = ${t.useProjectedRayLength?`length(vanishingPointScreenOffset.xy)`:`abs(vanishingPointScreenOffset.y)`};
    float clampedRayMarchDistance = min(rayMarchDistance, rayMarchMaxReach);

    float projectedCoordDirectionLength = length(projectedCoordDirection);

    // normalize the projection direction depending on maximum steps
    // this determines how blocky the ray march looks
    vec2 projectedStep = clampedRayMarchDistance * projectedCoordDirection / (rayMarchMaxSteps * projectedCoordDirectionLength);

    // Normalize the homogeneous camera space coordinates
    vec3 homogeneousStep = clampedRayMarchDistance * (homogeneousEnd - homogeneousStart) / (rayMarchMaxSteps * projectedCoordDirectionLength);
    float inverseWStep = clampedRayMarchDistance * (inverseWEnd - inverseWStart) / (rayMarchMaxSteps * projectedCoordDirectionLength);

    // initialize the variables for ray marching
    vec2 projectedPosition = projectedCoordStart.xy;
    vec3 homogeneousPosition = homogeneousStart;
    float inverseW = inverseWStart;
    float rayStartZ = -startPosition.z; // estimated ray start depth value
    float rayEndZ = -startPosition.z;   // estimated ray end depth value
    float previousEstimatedZ = -startPosition.z;
    float rayDepthDelta = 0.0;
    float estimatedDepthDifference;
    float sampledDepth;
    vec3 firstSegmentHit = vec3(projectedPosition, 0.0);

    if (dot(normal, rayDirection) < 0.0 || dot(-viewDirection, normal) < 0.0) {
      return vec3(projectedPosition, 0.0);
    }

    float previousEstimatedDepthDifference = 0.0;

    vec2 offsetProjectedPosition = projectedPosition + rayStepOffset * projectedStep;
    projectedPosition = clamp(
      offsetProjectedPosition,
      vec2(0.0),
      vec2(0.999)
    );
    homogeneousPosition.z += rayStepOffset * homogeneousStep.z;
    inverseW += rayStepOffset * inverseWStep;

    int rayMarchMaxStepsInt = int(rayMarchMaxSteps);
    for(int stepIndex = 0; stepIndex < rayMarchMaxStepsInt - 1; ++stepIndex) {
      sampledDepth = -linearDepthFromTexture(depthMap, projectedPosition); // get linear depth from the depth buffer

      // Estimate depth of the marching ray
      rayStartZ = previousEstimatedZ;
      estimatedDepthDifference = -rayStartZ - sampledDepth;
      rayEndZ = (homogeneousStep.z * 0.5 + homogeneousPosition.z) / (inverseWStep * 0.5 + inverseW);
      rayDepthDelta = rayEndZ - rayStartZ;
      previousEstimatedZ = rayEndZ;

      if(-rayEndZ > nearFar[1] || -rayEndZ < nearFar[0] || projectedPosition.y < 0.0  || projectedPosition.y > 1.0 ) {
        return firstSegmentHit;
      }

      // Preserve the original march result, but remember a first sample within the surface thickness.
      // A clamped sample no longer matches the UV of the reconstructed ray depth.
      if (stepIndex == 0 && rayStepOffset > 0.0 && all(equal(projectedPosition, offsetProjectedPosition))) {
        float firstSegmentDepthDifference = -homogeneousPosition.z / inverseW - sampledDepth;
        vec2 firstSegmentPixelOffset = (projectedPosition - projectedCoordStart.xy) * vec2(textureSize(depthMap, 0));
        if (firstSegmentDepthDifference < 0.025 / abs(inverseW) &&
          firstSegmentDepthDifference > 0.0 &&
          sampledDepth > nearFar[0] &&
          sampledDepth < nearFar[1] &&
          length(firstSegmentPixelOffset) > 1.0) {
          firstSegmentHit = vec3(projectedPosition, sampledDepth);
        }
      }

      // If we detect a hit - return the intersection point, two conditions:
      //  - estimatedDepthDifference > 0.0 - sampled point depth is in front of estimated depth
      //  - if difference between estimatedDepthDifference and rayDepthDelta is not too large
      //  - if difference between estimatedDepthDifference and 0.025/abs(inverseW) is not too large
      //  - if the sampled depth is not behind far plane or in front of near plane

      if(estimatedDepthDifference < 0.025 / abs(inverseW) + abs(rayDepthDelta) &&
        estimatedDepthDifference > 0.0 &&
        sampledDepth > nearFar[0] &&
        sampledDepth < nearFar[1] &&
        abs(projectedPosition.y - projectedCoordStart.y) > invResolutionHeight) {
        float hitInterpolationWeight = estimatedDepthDifference / (estimatedDepthDifference - previousEstimatedDepthDifference);
        vec2 refinedProjectedPosition = mix(projectedPosition - projectedStep, projectedPosition, 1.0 - hitInterpolationWeight);
        if (abs(refinedProjectedPosition.y - projectedCoordStart.y) > invResolutionHeight) {
          return vec3(refinedProjectedPosition, sampledDepth);
        }
        else {
          return vec3(projectedPosition, sampledDepth);
        }
      }

      ${S(!t.clampRayToScreen,`if (projectedPosition.x <= 0.0  || projectedPosition.x >= 1.0) {
        return firstSegmentHit;
      }`)}

      // Continue with ray marching
      projectedPosition = projectedPosition + projectedStep;
      homogeneousPosition.z += homogeneousStep.z;
      inverseW += inverseWStep;
      previousEstimatedDepthDifference = estimatedDepthDifference;

      ${S(t.clampRayToScreen,`projectedPosition = clamp(projectedPosition, vec2(0.0), vec2(0.999));`)}
    }
    return firstSegmentHit;
  }

  vec3 screenSpaceIntersection(vec3 rayDirection, vec3 startPosition, vec3 viewDirection, vec3 normal, float rayStepOffset) {
    return screenSpaceIntersectionWithLimits(
      rayDirection,
      startPosition,
      viewDirection,
      normal,
      rayStepOffset,
      ${x.float(t.rayMarchMaxReach)},
      ${x.float(t.rayMarchMaxSteps)}
    );
  }
  `)}function mt(e){e.fragment.uniforms.add(new C(`cloudAbsorption`,e=>e.clouds.absorption),new C(`cloudCoverage`,e=>e.clouds.coverage)).code.add(x`vec4 lookupCloudsFromTextureArray(sampler2DArray cubeMap, vec3 rayDir) {
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
}`)}var ht=class extends le{constructor(e,t){super(e,`sampler2DArray`,0,(n,r)=>n.bindTexture(e,t(r)))}};function $(e,t){let n=e.fragment;n.constants.add(`radiusCloudsSquared`,`float`,gt).code.add(x`vec3 intersectWithCloudLayer(vec3 dir, vec3 cameraPosition, vec3 spherePos) {
float B = 2.0 * dot(cameraPosition, dir);
float C = dot(cameraPosition, cameraPosition) - radiusCloudsSquared;
float det = B * B - 4.0 * C;
float pointIntDist = max(0.0, 0.5 *(-B + sqrt(det)));
return (cameraPosition + dir * pointIntDist) - spherePos;
}`),n.uniforms.add(new C(`radiusCurvatureCorrection`,({clouds:e})=>e.parallax.radiusCurvatureCorrection)).code.add(x`vec3 correctForPlanetCurvature(vec3 dir) {
dir.z = dir.z * (1.0 - radiusCurvatureCorrection) + radiusCurvatureCorrection;
return dir;
}`),n.code.add(x`vec3 rotateDirectionToAnchorPoint(mat4 rotMat, vec3 inVec) {
return (rotMat * vec4(inVec, 0.0)).xyz;
}`),n.include(we,t),n.constants.add(`RIM_COLOR`,`vec3`,f(.28,.175,.035)),n.constants.add(`sunsetTransitionFactor`,`float`,.3),n.constants.add(`rimScattering`,`float`,140),n.constants.add(`backlightFactor`,`float`,.2),n.constants.add(`backlightScattering`,`float`,10),n.constants.add(`backlightTransition`,`float`,.3),n.uniforms.add(Ee,De).code.add(x`vec3 calculateCloudColor(vec3 cameraPosition, vec3 worldSpaceRay, vec4 clouds) {
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
}`),e.include(mt),n.uniforms.add(new ve(`readChannelsRG`,e=>e.clouds.readChannels===0),new ht(`cubeMap`,e=>e.clouds.data?.cubeMap?.colorTexture)).code.add(x`vec4 sampleCloud(vec3 rayDir, bool readOtherChannel) {
vec4 s = lookupCloudsFromTextureArray(cubeMap, rayDir);
bool readRG = readChannelsRG ^^ readOtherChannel;
s = readRG ? vec4(vec3(s.r), s.g) : vec4(vec3(s.b), s.a);
return length(s) == 0.0 ? vec4(s.rgb, 1.0) : s;
}`),n.uniforms.add(new me(`anchorPoint`,e=>e.clouds.parallax.anchorPoint),new me(`anchorPointNew`,e=>e.clouds.parallaxNew.anchorPoint),new w(`rotationClouds`,e=>e.clouds.parallax.transform),new w(`rotationCloudsNew`,e=>e.clouds.parallaxNew.transform),new C(`cloudsOpacity`,e=>e.clouds.opacity),new C(`fadeFactor`,e=>e.clouds.fadeFactor),new ve(`crossFade`,e=>e.clouds.fadeState===3)).code.add(x`vec4 renderClouds(vec3 worldRay, vec3 cameraPosition) {
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
}`)}var gt=(c.radius+Fe)**2;function _t(e,t){let n=e.fragment;n.include(Te,t),n.include(ue),n.include(ft),t.cloudReflections&&e.include($,t),t.screenSpaceReflections&&e.include(pt,t),n.include(de,t),n.constants.add(`fresnelSky`,`vec3`,[.02,1,15]),n.constants.add(`fresnelMaterial`,`vec2`,[.02,.1]),n.constants.add(`roughness`,`float`,.015),n.constants.add(`foamIntensityExternal`,`float`,1.7),n.constants.add(`ssrIntensity`,`float`,.65),n.constants.add(`ssrHeightFadeStart`,`float`,Se),n.constants.add(`ssrHeightFadeEnd`,`float`,Ce),n.constants.add(`waterDiffusion`,`float`,.92),n.constants.add(`waterSeaColorMod`,`float`,.8),n.constants.add(`correctionViewingPowerFactor`,`float`,.4),n.constants.add(`skyZenitColor`,`vec3`,[.52,.68,.9]),n.constants.add(`skyColor`,`vec3`,[.67,.79,.9]),n.constants.add(`cloudFresnelModifier`,`vec2`,[1.2,.01]),n.code.add(x`PBRShadingWater shadingInfo;
vec3 getSkyGradientColor(in float cosTheta, in vec3 horizon, in vec3 zenit) {
float exponent = pow((1.0 - cosTheta), fresnelSky[2]);
return mix(zenit, horizon, exponent);
}`),n.uniforms.add(new C(`lightingSpecularStrength`,e=>e.lighting.mainLight.specularStrength),new C(`lightingEnvironmentStrength`,e=>e.lighting.mainLight.environmentStrength)),n.code.add(x`vec3 getWaterColor(in vec3 n, in vec3 v, in vec3 l, vec3 color, in vec3 lightIntensity, in vec3 localUp, in float shadow, float foamIntensity, vec3 viewPosition, vec3 position) {
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
vec3 reflectedWorld = normalize(reflect(-v, normalCorrectedClouds));`),t.cloudReflections&&n.uniforms.add(new C(`cloudsOpacity`,e=>e.clouds.opacity)).code.add(x`vec4 cloudsColor = renderClouds(reflectedWorld, position);
cloudsColor.a = 1.0 - cloudsColor.a;
cloudsColor = pow(cloudsColor, vec4(GAMMA));
cloudsColor *= clamp(fresnelModifier.y * cloudFresnelModifier[0] - cloudFresnelModifier[1], 0.0, 1.0) * cloudsOpacity;`),t.screenSpaceReflections?n.uniforms.add(fe,new ge(`lastFrameColorTexture`,e=>e.reprojection.lastFrameColor?.getTexture()),new C(`fadeFactorSSR`,e=>e.screenSpaceReflections.fadeFactor)).code.add(x`vec3 viewDir = normalize(viewPosition);
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
reflSea * seaColorMod + specular + foam);`):n.code.add(x`vec3 waterRenderedColor = tonemapACES(reflSky + reflSea * waterSeaColorMod + specular + foam);`),t.cloudReflections?t.screenSpaceReflections?n.code.add(x`return waterRenderedColor * (1.0 - (1.0 - reflectionHit) * cloudsColor.a) + (1.0 - reflectionHit) * cloudsColor.xyz;
}`):n.code.add(x`return waterRenderedColor * (1.0 - cloudsColor.a) + cloudsColor.xyz;
}`):n.code.add(x`return waterRenderedColor;
}`)}function vt(e){let t=0;return e.some(({emissions:e})=>e===3||e===2&&t===1||e===1&&t===2?(t=3,!0):(e!==0&&t===0&&(t=e),!1)),t}export{j as A,Le as C,Pe as D,R as E,Ne as O,Re as S,Ie as T,qe as _,dt as a,V as b,lt as c,Ge as d,Je as f,Ke as g,Ye as h,pt as i,N as k,Y as l,Qe as m,_t as n,ut as o,Ze as p,$ as r,ct as s,vt as t,$e as u,Xe as v,z as w,B as x,He as y};