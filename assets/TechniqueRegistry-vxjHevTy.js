import{D as e}from"./arrayUtils-Drsbwk3M.js";import{T as t,n,t as r}from"./Error-BEgq-oFF.js";import{O as i}from"./promiseUtils-BqE-zvAx.js";import{i as a}from"./time-BzYz5R50.js";import{a as o,r as s}from"./tslib.es6-qUHyP9zl.js";import{c,g as l}from"./mat3-Cb8I4Oqy.js";import{l as u}from"./screenUtils-DfxV3mCb.js";import{_ as d,d as f,f as p,g as m,h,l as g,m as _,p as v,u as y,v as b,x}from"./clippingUtils-c53mgKqQ.js";import{l as S}from"./TileClipper-i4NPHB9R.js";import{a as C,h as w,i as ee,s as te,u as ne}from"./enums-CsvnPRfA.js";import{s as re,t as ie}from"./Texture-CrOIekYi.js";import{a as ae,i as oe,r as se}from"./VertexArrayObject-BTNbjX1h.js";import"./constants-B28-ZZtS.js";import{t as ce}from"./SimpleMesh-OqGQTkVn.js";import{$ as le,A as ue,At as T,B as E,Bt as D,Ct as de,D as fe,Dt as pe,E as O,F as k,Ft as me,G as he,It as ge,J as A,K as _e,Lt as ve,M as ye,N as be,Nt as xe,O as Se,P as j,Rt as Ce,T as we,Tt as M,U as Te,Vt as Ee,W as De,X as Oe,Y as N,Z as ke,_ as Ae,a as P,b as je,bt as Me,c as F,ct as Ne,d as I,f as Pe,g as L,gt as Fe,h as Ie,i as Le,it as R,k as Re,l as z,lt as ze,m as B,n as V,nt as Be,o as Ve,p as He,pt as Ue,q as H,r as We,rt as Ge,s as U,tt as W,u as Ke,ut as qe,v as Je,vt as Ye,x as G,xt as Xe,yt as K,z as Ze,zt as Qe}from"./WGLContainer-DRF-2qId.js";import{a as $e,i as et,n as tt,r as nt,t as rt}from"./gradientStrokeConstants-CN9yelhJ.js";import{a as it,c as at,i as ot,r as st,s as ct,t as lt}from"./constants-BFM6X_pk.js";import{a as ut,d as dt,f as ft,h as pt,i as mt,l as ht,m as gt,n as _t,p as vt,r as yt,t as bt,u as q}from"./utils-BIAwmYNC.js";import{n as xt,r as St}from"./loadUtils-BdIpS0nZ.js";import{t as Ct}from"./ShaderCompiler-D9M996xd.js";var wt=new class{get forceStaticPath(){return t(`esri-cim-animations-enable-status`)===`disabled`}get forceAnimatedPath(){return t(`esri-cim-animations-enable-status`)===`forced`}get freezeGlobalTime(){return t(`esri-cim-animations-freeze-time`)??!1}get spotlightAnimatedSymbols(){return!!t(`esri-cim-animations-spotlight`)}get forceGlobalTimeOrigin(){return!1!==t(`esri-cim-animations-freeze-time`)}},Tt=class extends V{};s([z(G)],Tt.prototype,`globalTime`,void 0),s([z(H)],Tt.prototype,`animationTextureSize`,void 0),s([z(T)],Tt.prototype,`toScreen`,void 0),s([z(T)],Tt.prototype,`toNdc`,void 0),s([z(G)],Tt.prototype,`mapRotation`,void 0),s([z(G)],Tt.prototype,`pixelRatio`,void 0),s([z(G)],Tt.prototype,`scaleAdjustment`,void 0);var Et=class extends Ke{getVisualVariableData(e){return this._vvData||=K(this.visualVariableData,e).setDebugName(`storage2`),this._vvData}getFilterData(e){return K(this.filterFlags,e).setDebugName(`storage0`)}getAnimationData(e){return K(this.animation,e).setDebugName(`storage1`)}getVVData(e){return this.getVisualVariableData(e)}getDataDrivenData0(e){return K(this.dataDriven0,e).setDebugName(`storage30`)}getDataDrivenData1(e){return K(this.dataDriven1,e).setDebugName(`storage31`)}getDataDrivenData2(e){return K(this.dataDriven2,e).setDebugName(`storage32`)}getGPGPUData(e){return K(this.gpgpu,e).setDebugName(`storage4`)}getLocalTimeOrigin(e){return K(this.localTimeOrigin,e).x.setDebugName(`storage5`)}getFilterFlags(e){return t(`webgl-ignores-sampler-precision`)?me(this.getFilterData(e).x.multiply(ve(255))):this.getFilterData(e).x.multiply(ve(255))}getLabelVisibility(e){let t=this.getFilterData(e).y.multiply(255);return new G(1).subtract(t)}getAnimationValue(e){return this.getAnimationData(e).x}getSizeValue(e){return this.getVisualVariableData(e).x}getColorValue(e){return this.getVisualVariableData(e).y}getOpacityValue(e){return this.getVisualVariableData(e).z}getRotationValue(e){return this.getVisualVariableData(e).w}};s([U(k)],Et.prototype,`filterFlags`,void 0),s([U(k)],Et.prototype,`animation`,void 0),s([U(k)],Et.prototype,`gpgpu`,void 0),s([U(k)],Et.prototype,`localTimeOrigin`,void 0),s([U(k)],Et.prototype,`visualVariableData`,void 0),s([U(k)],Et.prototype,`dataDriven0`,void 0),s([U(k)],Et.prototype,`dataDriven1`,void 0),s([U(k)],Et.prototype,`dataDriven2`,void 0);var Dt=class extends V{getAttributeDataCoords(e){if(!this._uv){let t=_t(e),n=this.size,r=xe(t.x),i=xe(t.y).multiply(xe(256)),a=xe(t.z).multiply(xe(256)).multiply(xe(256)),o=ve(r.add(i).add(a)),s=we(o,n),c=o.subtract(s).divide(n);this._uv=new H(s,c).add(.5).divide(n)}return this._uv}};s([z(G)],Dt.prototype,`size`,void 0);var Ot=class extends V{};s([z(G)],Ot.prototype,`activeReasons`,void 0),s([z(G)],Ot.prototype,`highlightAll`,void 0);var kt=class extends V{};s([z(H)],kt.prototype,`position`,void 0),s([z(G)],kt.prototype,`distance`,void 0),s([z(G)],kt.prototype,`smallSymbolDistance`,void 0),s([z(G)],kt.prototype,`smallSymbolSizeThreshold`,void 0),s([z(W)],kt.prototype,`tlbr`,void 0);var J=class extends V{};s([z(T)],J.prototype,`displayViewScreenMat3`,void 0),s([z(T)],J.prototype,`displayViewMat3`,void 0),s([z(T)],J.prototype,`displayMat3`,void 0),s([z(T)],J.prototype,`viewMat3`,void 0),s([z(T)],J.prototype,`tileMat3`,void 0),s([z(G)],J.prototype,`displayZoomFactor`,void 0),s([z(G)],J.prototype,`requiredZoomFactor`,void 0),s([z(H)],J.prototype,`tileOffset`,void 0),s([z(G)],J.prototype,`currentScale`,void 0),s([z(G)],J.prototype,`currentZoom`,void 0),s([z(G)],J.prototype,`metersPerSRUnit`,void 0),s([z(G)],J.prototype,`rotation`,void 0),s([z(G)],J.prototype,`pixelRatio`,void 0),s([z(G)],J.prototype,`scaleFactor`,void 0);var At=class extends Le{};s([F(0,N)],At.prototype,`id`,void 0),s([F(1,G)],At.prototype,`bitset`,void 0),s([F(2,H)],At.prototype,`pos`,void 0);var jt=class extends Pe{};s([F(14,H)],jt.prototype,`nextPos1`,void 0),s([F(15,H)],jt.prototype,`nextPos2`,void 0);var Mt=class extends He{},Y=class extends We{clip(e,t){let n=new G(0),r=this.getFilterFlags(e);if(n=n.add(ve(2).multiply(ve(1).subtract(ft(r,0)))),this.inside?n=n.add(ve(2).multiply(ve(1).subtract(ft(r,1)))):this.outside?n=n.add(ve(2).multiply(ft(r,1))):this.highlight&&(n=n.add(ve(2).multiply(ve(1).subtract(this._checkHighlight(r))))),t!=null){let e=new G(1).subtract(R(t.x,this.view.currentZoom)),r=R(t.y,this.view.currentZoom);n=n.add(new G(2).multiply(e.add(r)))}return n}getFragmentOutput(e,t,n=new G(1/255)){let r=new Ve;return r.fragColor=this._maybeWriteHittest(t)??this._maybeHighlight(e,n)??e,r}_maybeHighlight(e,t){return this.highlight?new W(e.rgb,R(t,e.a)):null}_checkHighlight(e){let t=this._checkHighlightBit(e,0);for(let n=1;n<6;n++)t=t.add(this._checkHighlightBit(e,n));return R(new G(.1),t.add(this.highlight.highlightAll))}_checkHighlightBit(e,t){return bt(e,t).multiply(q(this.highlight.activeReasons,t))}computeHittestTriangle(e,t,n){let{viewMat3:r,tileMat3:i}=this.view,a=r.multiply(i),{nextPos1:o,nextPos2:s}=t;return{pos0:a.multiply(new N(e.pos,1)).xy,pos1:a.multiply(new N(o,1)).xy,pos2:a.multiply(new N(s,1)).xy}}maybeRunHittest(e,t,n){if(this.hittestRequest==null)return null;let r=this.hittest(e,t,n),i=A(r,new G(2)),a=A(r,new G(1)),o=E(a,()=>new W(new G(1/255),0,0,0),E(i,()=>new W(new G(2/255),0,0,0),new W(0))),s=E(De(i,a),new G(0),new G(2)),c=this.getAttributeDataCoords(e.id),l=ht(c);return s=s.add(this.clip(e.id,e.zoomRange)),{glPointSize:new G(1),glPosition:new W(l,s,1),color:o}}_maybeWriteHittest(e){return this.hittestRequest==null?null:e.color}getAttributeDataCoords(e){return this.storage.getAttributeDataCoords(e)}getVVData(e){return this.storageTextures.getVVData(this.getAttributeDataCoords(e))}getFilterFlags(e){return this.storageTextures.getFilterFlags(this.getAttributeDataCoords(e))}getLocalTimeOrigin(e){return this.storageTextures.getLocalTimeOrigin(this.getAttributeDataCoords(e))}getSizeValue(e){return this.storageTextures.getSizeValue(this.getAttributeDataCoords(e))}getColorValue(e){return this.storageTextures.getColorValue(this.getAttributeDataCoords(e))}getOpacityValue(e){return this.storageTextures.getOpacityValue(this.getAttributeDataCoords(e))}getRotationValue(e){return this.storageTextures.getRotationValue(this.getAttributeDataCoords(e))}};s([P],Y.prototype,`inside`,void 0),s([P],Y.prototype,`outside`,void 0),s([B(Ot)],Y.prototype,`highlight`,void 0),s([z(Dt)],Y.prototype,`storage`,void 0),s([U(Et)],Y.prototype,`storageTextures`,void 0),s([z(J)],Y.prototype,`view`,void 0),s([B(kt)],Y.prototype,`hittestRequest`,void 0);var Nt=class extends V{getPatternOffsetAtTileOrigin(e,t=new G(0),n=new G(1)){let r=new H(lt).divide(e),i=e.multiply(ye(this.maxIntsToLocalOrigin.multiply(r))).add(this.tileOffsetFromLocalOrigin).subtract(new G(.5).multiply(e));return i=new H(i.x.multiply(n).subtract(i.y.multiply(t)),i.x.multiply(t).add(i.y.multiply(n))),we(i,e)}};s([z(H)],Nt.prototype,`tileOffsetFromLocalOrigin`,void 0),s([z(H)],Nt.prototype,`maxIntsToLocalOrigin`,void 0);var Pt=class extends V{};s([z(H)],Pt.prototype,`size`,void 0);var Ft=class extends V{getColor(e,t,n){return be([De(gt(e),n),t],[Ae(e,this.values.first()),this.colors.first()],[fe(e,this.values.last()),this.colors.last()],[!0,()=>{let t=this.values.findIndex(t=>O(t,e)),n=this.values.get(t),r=t.subtract(1),i=this.values.get(r),a=e.subtract(i).divide(n.subtract(i));return L(this.colors.get(r),this.colors.get(t),a)}])}};s([z(M.ofType(W,8))],Ft.prototype,`colors`,void 0),s([z(M.ofType(G,8))],Ft.prototype,`values`,void 0);var It=class extends V{getOpacity(e){return be([gt(e),new G(1)],[Ae(e,this.opacityValues.first()),this.opacities.first()],[fe(e,this.opacityValues.last()),this.opacities.last()],[!0,()=>{let t=this.opacityValues.findIndex(t=>O(t,e)),n=this.opacityValues.get(t),r=t.subtract(1),i=this.opacityValues.get(r),a=e.subtract(i).divide(n.subtract(i));return L(this.opacities.get(r),this.opacities.get(t),a)}])}};s([z(M.ofType(G,8))],It.prototype,`opacities`,void 0),s([z(M.ofType(G,8))],It.prototype,`opacityValues`,void 0);var Lt=class extends V{getVVRotationMat4(e){return E(gt(e),Ue.identity(),()=>{let t=this.getNormalizedAngle(e).multiply(st),n=ge(t),r=ze(t);return new Ue(r,n,0,0,n.multiply(new G(-1)),r,0,0,0,0,1,0,0,0,0,1)})}getVVRotationMat3(e){return E(gt(e),T.identity(),()=>{let t=this.getNormalizedAngle(e).multiply(st),n=ge(t),r=ze(t);return new T(r,n,0,n.multiply(new G(-1)),r,0,0,0,1)})}getNormalizedAngle(e){let t=A(this.rotationType,new G(1));return E(t,new G(90).subtract(e),e)}};s([z(G)],Lt.prototype,`rotationType`,void 0);var Rt=class extends V{getSize(e,t){let n=this.minMaxValueAndSize.xy,r=this.minMaxValueAndSize.zw;return E(gt(e),t,()=>{let t=e.subtract(n.x).divide(n.y.subtract(n.x)),i=Xe(t,new G(0),new G(1));return r.x.add(i.multiply(r.y.subtract(r.x)))})}};s([z(W)],Rt.prototype,`minMaxValueAndSize`,void 0);var zt=class extends V{getSizeForViewScale(e){return be([Ae(e,this.values.first()),this.sizes.first()],[fe(e,this.values.last()),this.sizes.last()],[!0,()=>{let t=this.values.findIndex(t=>O(t,e)),n=this.values.get(t),r=t.subtract(1),i=this.values.get(r),a=e.subtract(i).divide(n.subtract(i));return L(this.sizes.get(r),this.sizes.get(t),a)}])}};s([z(M.ofType(G,8))],zt.prototype,`sizes`,void 0),s([z(M.ofType(G,8))],zt.prototype,`values`,void 0);var Bt=class extends V{getSize(e,t){let n=be([gt(e),t],[Ae(e,this.values.first()),this.sizes.first()],[fe(e,this.values.last()),this.sizes.last()],[!0,()=>{let t=this.values.findIndex(t=>O(t,e)),n=this.values.get(t),r=t.subtract(1),i=this.values.get(r),a=e.subtract(i).divide(n.subtract(i));return L(this.sizes.get(r),this.sizes.get(t),a)}]);return E(gt(n),t,n)}};s([z(M.ofType(G,8))],Bt.prototype,`sizes`,void 0),s([z(M.ofType(G,8))],Bt.prototype,`values`,void 0);var Vt=class extends V{getSize(e,t){return E(gt(e),t,e.multiply(this.unitValueToPixelsRatio))}};s([z(G)],Vt.prototype,`unitValueToPixelsRatio`,void 0);function Ht(e){return e.visualVariableSizeMinMaxValue!=null||e.visualVariableSizeScaleStops!=null||e.visualVariableSizeStops!=null||e.visualVariableSizeUnitValue!=null}function Ut(e,t,n){if(Ht(e)){let r=e.getSizeValue(t);return e.visualVariableSizeMinMaxValue?.getSize(r,n)??e.visualVariableSizeScaleStops?.getSizeForViewScale(e.view.currentScale)??e.visualVariableSizeStops?.getSize(r,n)??e.visualVariableSizeUnitValue?.getSize(r,n)}return n}function Wt(e,t,n,r=new Re(!1)){if(e.visualVariableColor==null)return n;let i=e.getColorValue(t);return e.visualVariableColor.getColor(i,n,r)}function Gt(e,t){if(e.visualVariableOpacity==null)return new G(1);let n=e.getOpacityValue(t);return e.visualVariableOpacity.getOpacity(n)}function Kt(e,t){if(e.visualVariableRotation==null)return T.identity();let n=e.getRotationValue(t);return e.visualVariableRotation.getVVRotationMat3(n)}function qt(e,t){if(e.visualVariableRotation==null)return new G(0);let n=e.getRotationValue(t);return e.visualVariableRotation.getNormalizedAngle(n)}var Jt=class extends At{};s([F(3,H)],Jt.prototype,`offset`,void 0),s([F(4,W)],Jt.prototype,`sizing`,void 0),s([F(5,W)],Jt.prototype,`value1Position2Value2`,void 0),s([F(6,W)],Jt.prototype,`animationPointerAndBaseSizeAndReferenceSize`,void 0),s([F(7,H)],Jt.prototype,`zoomRange`,void 0),s([F(8,G)],Jt.prototype,`lineLength`,void 0);var Yt=class extends Mt{},Xt=class extends Y{_vertexPreamble(e,t,n){let{id:r,offset:i,animationPointerAndBaseSizeAndReferenceSize:a,sizing:o}=e,s=a.xy,c=a.z,l=a.w,u=o.xy,d=this._getEvalParams(e,u,n),f,p;if(e.value1Position2Value2){let t;t=this.hittestRequest?new G(0):Zt(s,6,d).a.multiply(this.animationInfo.scaleAdjustment);let n=e.pos,r=e.value1Position2Value2.yz,i=e.value1Position2Value2.x,a=e.value1Position2Value2.w,o=t.subtract(i).divide(a.subtract(i));p=n.add(r.subtract(n).multiply(o)),f=R(new G(1),o).add(R(new G(0),D(o)))}else p=e.pos,f=new G(0);let m=o.z,h=q(e.bitset,et.bitset.isStroke),g=o.w,_=q(e.bitset,et.bitset.scaleSymbolsProportionally),v=Zt(s,0,d),y=be([A(q(e.bitset,et.bitset.isMapAligned),new G(1)),this.view.rotation.divide(180).multiply(Math.PI)],[!0,new G(0)]),b=new Me(ze(y),ge(y.multiply(-1)),ge(y),ze(y)).multiply(v.xy),x=v.z.subtract(y).subtract(t),S=v.w,C=q(e.bitset,et.bitset.isSDF),w=Ut(this,r,new G(l)).divide(new G(l));return{baseSize:c,animationPointer:s,strokeWidth:m,isOutline:h,unscaledDistanceToPx:g,scaleSymbolsProportionally:_,isSDF:C,position:this._getScreenPosition({id:r,pos:p,offset:i,referenceSize:l,translation:b,rotation:x,scale:S,vvScale:w}),evalParams:d,vvScale:w,scale:S,clip:f}}_getScreenPosition(e){let{pos:t,translation:n,rotation:r,scale:i,offset:a,id:o,vvScale:s}=e,c=qt(this,o).multiply(Math.PI/180),l=n.x.multiply(4/3),u=n.y.multiply(-1).multiply(4/3),d=ge(c),f=ze(c),p=f.multiply(l).add(D(d).multiply(u)),m=d.multiply(l).add(f.multiply(u)),h=ge(r.subtract(c)),g=ze(r.subtract(c)),_=new G(0),v=new G(1),{pixelRatio:y}=this.animationInfo,b=new T(v,_,_,_,v,_,p.multiply(y),m.multiply(y),v),x=new T(g,h.multiply(-1),_,h,g,_,0,0,v),S=i.multiply(s).multiply(y).multiply(4/3),C=x.multiply(S),w=this.animationInfo.toScreen.multiply(new N(t,1)),ee=b.multiply(w).xy,te=C.multiply(new N(a,0)).xy;return ee.add(te)}_clip(e,t){let n=super.clip(e,t),r=Ae(this._getLocalTimeOrigin(e),new G(0));return wt.forceGlobalTimeOrigin||(n=n.add(be([r,()=>new G(2)],[!0,()=>new G(0)]))),n}_getLocalTimeOrigin(e){return this.getLocalTimeOrigin(e)}_toNdc(e){return this.animationInfo.toNdc.multiply(new N(e,1)).xy}_getEvalParams(e,t,n){let{globalTime:r,animationTextureSize:i}=this.animationInfo;return{globalTime:r,localTimeOrigin:this._getLocalTimeOrigin(e.id),animationTextureSize:i,animationTexture:this.animationTexture,pixelDimensions:t,lineLength:n}}_getColor(e,t){return E(A(t.isSDF,new G(1)),this._getSDFColor(e,t),this._getSpriteColor(e,t))}_getSpriteColor(e,t){return K(this.mosaicTexture,e).multiply(t.color)}_getSDFColor(e,t){let n=K(this.mosaicTexture,e),r=new G(.5).subtract(yt(n)).multiply(t.distanceToPx).multiply(1),i=Xe(new G(.5).subtract(r),new G(0),new G(1)),a=t.color.multiply(i),o=t.outlineSize.multiply(.5),s=_e(r).subtract(o),c=Xe(new G(.5).subtract(s),new G(0),new G(1)),l=t.outlineColor.multiply(c);return new G(1).subtract(l.a).multiply(a).add(l)}};function Zt(e,t,n){let r=e.add(new H(t,0)),i=K(n.animationTexture,r.add(.5).divide(n.animationTextureSize)).xy;return e=e.add(i),Se({animationPointer:e,...n},W,null,e=>{let{out:t}=e;if(!t)throw Error(`out is null`);return $e({...e,out:t})})}s([z(Pt)],Xt.prototype,`mosaicInfo`,void 0),s([z(Tt)],Xt.prototype,`animationInfo`,void 0),s([z(Nt)],Xt.prototype,`localTileOffset`,void 0),s([U(k)],Xt.prototype,`mosaicTexture`,void 0),s([B(Ft)],Xt.prototype,`visualVariableColor`,void 0),s([B(It)],Xt.prototype,`visualVariableOpacity`,void 0),s([B(Rt)],Xt.prototype,`visualVariableSizeMinMaxValue`,void 0),s([B(zt)],Xt.prototype,`visualVariableSizeScaleStops`,void 0),s([B(Bt)],Xt.prototype,`visualVariableSizeStops`,void 0),s([B(Vt)],Xt.prototype,`visualVariableSizeUnitValue`,void 0),s([B(Lt)],Xt.prototype,`visualVariableRotation`,void 0),s([U(k)],Xt.prototype,`animationTexture`,void 0);var Qt=class extends Jt{};s([F(9,W)],Qt.prototype,`tlbr`,void 0),s([F(10,G)],Qt.prototype,`angle`,void 0);var $t=class extends Pe{};s([F(13,H)],$t.prototype,`nextPos1`,void 0),s([F(14,H)],$t.prototype,`nextPos2`,void 0);var en=class extends Yt{},tn=class extends Xt{constructor(){super(...arguments),this.computeAttributes={pos:[`nextPos1`,`nextPos2`]}}_fragmentPoly(e){let t=we(e.uv,new G(1)),n=L(e.tlbr.xy,e.tlbr.zw,t);return this._getColor(n,{color:e.color,distanceToPx:e.distanceToPx,isSDF:e.isSDF,outlineColor:e.outlineColor,outlineSize:e.strokeWidth})}_vertexPoly(e){let{position:t,animationPointer:n,evalParams:r,isOutline:i,unscaledDistanceToPx:a,vvScale:o,strokeWidth:s,scaleSymbolsProportionally:c,scale:l,isSDF:u,baseSize:d,clip:f}=this._vertexPreamble(e,new G(0),e.lineLength||new G(0)),p=this._toNdc(t),m=Zt(n,1,r);m=new W(m.rgb.multiply(m.a),m.a);let h=E(dt(e.bitset,et.bitset.colorLocked),m,Zt(n,2,r));h=new W(h.rgb.multiply(h.a),h.a);let g=Zt(n,3,r);g=new W(g.rgb.multiply(g.a),g.a);let _=Zt(n,4,r).a,v=Zt(n,5,r).a,y=Wt(this,e.id,m,De(dt(e.bitset,et.bitset.colorLocked),new Re(i))),b=L(y,h,g),x=Gt(this,e.id),S=L(x,_,v);return{unscaledDistanceToPx:a,vvScale:o,strokeWidth:s,scaleSymbolsProportionally:c,scale:l,isSDF:u,baseSize:d,ndc:p,color:b.multiply(S),z:this.clip(e.id,e.zoomRange).add(f.multiply(2)),isOutline:i,evalParams:r,distanceToPx:a.multiply(o)}}};function nn(e,t){return Ye(e,Te(t))}function rn(e,t,n){let r=n.subtract(t),i=nn(e.subtract(t),r),a=Xe(i.divide(Je(r)),new G(0),new G(1));return Ce(e,t.add(a.multiply(n.subtract(t))))}function X(e){let t=_e(e);return R(t.x.add(t.y).add(t.z),new G(1.05))}function Z(e,t,n,r){let i=new T(n.x.multiply(r.y).subtract(r.x.multiply(n.y)),r.x.multiply(t.y).subtract(t.x.multiply(r.y)),t.x.multiply(n.y).subtract(n.x.multiply(t.y)),n.y.subtract(r.y),r.y.subtract(t.y),t.y.subtract(n.y),r.x.subtract(n.x),t.x.subtract(r.x),n.x.subtract(t.x)),a=t.x.multiply(n.y.subtract(r.y)),o=n.x.multiply(r.y.subtract(t.y)),s=r.x.multiply(t.y.subtract(n.y)),c=a.add(o).add(s);return new G(1).divide(c).multiply(i.multiply(new N(1,e)))}function an(e,t,n,r){return A(X(Z(e,t,n,r)),new G(1))}function on(e,t,n,r){let i=n.subtract(t),a=r.subtract(t),o=pt(i,a),s=j(Ge(o,new G(it)),O(o,new G(-it)));return be([j(ue(s),an(e.xy,t,n,r)),new G(-1)],[!0,()=>{let i=rn(e,t,n),a=rn(e,n,r),o=rn(e,r,t);return Be(Be(i,a),o)}])}function sn(e,t,n){let{viewMat3:r,tileMat3:i}=e.view,a=r.multiply(i),o=a.multiply(new N(t.pos,1)),s=a.multiply(new N(n.nextPos1,1)),c=a.multiply(new N(n.nextPos2,1));return on(e.hittestRequest.position,o.xy,s.xy,c.xy)}function cn(e,t,n){return Ce(e,n).subtract(t)}function ln(e,t,n,r){let i=e.x,a=e.y,o=t.x,s=t.y,c=n.x,l=n.y,u=r.x,d=r.y,f=u.subtract(c),p=i.subtract(c),m=o.subtract(i),h=d.subtract(l),g=a.subtract(l),_=s.subtract(a),v=h.multiply(m).subtract(f.multiply(_)),y=f.multiply(g).subtract(h.multiply(p)).divide(v),b=m.multiply(g).subtract(_.multiply(p)).divide(v),x=j(ue(A(v,new G(0))),j(j(fe(y,new G(0)),Ae(y,new G(1))),j(fe(b,new G(0)),Ae(b,new G(1)))));return E(x,new G(1),new G(0))}function un(e,t,n,r,i){return j(j(fe(e.x,t),fe(e.y,n)),j(Ge(e.x,r),Ae(e.y,i)))}function dn(e,t,n,r){let i=r.xy,a=r.zw,o=new H(a.x,i.y),s=new H(i.x,a.y),c=Be(i.x,a.x),l=Be(i.y,a.y),u=Oe(i.x,a.x),d=Oe(i.y,a.y),f=Z(new H(c,l),e,t,n),p=Z(new H(u,d),e,t,n),m=Z(new H(c,d),e,t,n),h=Z(new H(u,l),e,t,n),g=j(A(X(f),new G(1)),j(A(X(p),new G(1)),j(A(X(m),new G(1)),A(X(h),new G(1))))),_=ln(i,o,e.xy,t.xy).add(ln(o,a,e.xy,t.xy)).add(ln(s,a,e.xy,t.xy)).add(ln(s,i,e.xy,t.xy)),v=ln(i,o,e.xy,n.xy).add(ln(o,a,e.xy,n.xy)).add(ln(s,a,e.xy,n.xy)).add(ln(s,i,e.xy,n.xy)),y=ln(i,o,t.xy,n.xy).add(ln(o,a,t.xy,n.xy)).add(ln(s,a,t.xy,n.xy)).add(ln(s,i,t.xy,n.xy)),b=un(e.xy,c,l,u,d),x=un(t.xy,c,l,u,d),S=un(n.xy,c,l,u,d),C=j(b,j(x,S));return{hasIntersectingSegments:De(O(_,new G(0)),De(O(v,new G(0)),O(y,new G(0)))),allTriangleVerticesInside:C,triangleContainsRect:g}}function fn(e,t,n,r){let{hasIntersectingSegments:i,allTriangleVerticesInside:a,triangleContainsRect:o}=dn(e,t,n,r);return E(i,new G(1),E(De(a,o),new G(2),new G(0)))}function pn(e,t,n,r){let{hasIntersectingSegments:i,allTriangleVerticesInside:a,triangleContainsRect:o}=dn(e,t,n,r);return E(De(i,De(a,o)),new G(2),new G(0))}function mn(e){return j(fe(e.tlbr.x,new G(0)),fe(e.tlbr.y,new G(0)),fe(e.tlbr.z,new G(0)),fe(e.tlbr.w,new G(0)))}var hn=class extends At{};s([F(3,W)],hn.prototype,`color`,void 0),s([F(4,H)],hn.prototype,`zoomRange`,void 0);var gn=class extends Y{constructor(){super(...arguments),this.type=`FillShader`,this.computeAttributes={pos:[`nextPos1`,`nextPos2`]}}vertex(e,t){let n=Gt(this,e.id),r=Wt(this,e.id,e.color).multiply(n),i=this.view.displayViewScreenMat3.multiply(new N(e.pos.xy,1)),a=this.clip(e.id,e.zoomRange);return{glPosition:new W(i.xy,a,1),color:r,...this.maybeRunHittest(e,t,null)}}fragment(e){return this.getFragmentOutput(e.color,e,new G(0))}hittest(e,t){let{pos0:n,pos1:r,pos2:i}=this.computeHittestTriangle(e,t,null),a=mn(this.hittestRequest);return E(a,()=>{let{tlbr:e}=this.hittestRequest;return pn(n,r,i,e)},()=>{let n=sn(this,e,t);return E(O(n,this.hittestRequest.distance),new G(0),new G(2))})}};s([B(Ft)],gn.prototype,`visualVariableColor`,void 0),s([B(It)],gn.prototype,`visualVariableOpacity`,void 0),s([o(0,I(hn)),o(1,I(jt))],gn.prototype,`vertex`,null),s([o(0,I(Mt))],gn.prototype,`fragment`,null);var _n=class extends hn{};s([F(5,W)],_n.prototype,`tlbr`,void 0),s([F(6,G)],_n.prototype,`width`,void 0),s([F(7,G)],_n.prototype,`height`,void 0),s([F(8,H)],_n.prototype,`offset`,void 0),s([F(9,H)],_n.prototype,`scale`,void 0),s([F(10,G)],_n.prototype,`angle`,void 0);var vn=class extends Mt{};function yn(e,t,n,r,i){let a=A(q(i,2),ve(1)),o=yt(new W(e,0));return E(a,Ne(r.divide(t.x),n.divide(t.y),0,D(n.divide(t.x)),r.divide(t.y),0,vt(de(o,0)),vt(de(0,o)),1),Ne(r.divide(t.x),n.divide(t.y),0,D(n.divide(t.x)),r.divide(t.y),0,0,0,1))}function bn(e,t){let n=e.view.requiredZoomFactor,r=new H(t.width,t.height),i=r.multiply(t.scale).multiply(n),a=t.angle.multiply(ct),o=ge(a),s=ze(a),c=yn(t.id,i,o,s,t.bitset),l=e.localTileOffset.getPatternOffsetAtTileOrigin(r,o,s),u=n.multiply(t.scale).multiply(t.offset.subtract(l)).divide(i),d=new N(t.pos,1),f=c.multiply(d).xy.subtract(u),p=t.tlbr.divide(e.mosaicInfo.size.xyxy),m=q(t.bitset,4);return e.visualVariableColor!=null&&(m=E(gt(e.getColorValue(t.id)),new G(0),m)),{tileTextureCoord:f,tlbr:p,sampleAlphaOnly:m}}function xn(e,t){let n=we(t.tileTextureCoord,new G(1)),r=L(t.tlbr.xy,t.tlbr.zw,n),i=K(e.mosaicTexture,r);return i=E(O(t.sampleAlphaOnly,new G(.5)),i.aaaa,i),t.color.multiply(i)}var Sn=class extends gn{constructor(){super(...arguments),this.type=`ComplexFillShader`}vertex(e,t){return{...super.vertex(e,t),...bn(this,e)}}fragment(e){let t=xn(this,e);return this.getFragmentOutput(t,e,new G(0))}};s([z(Pt)],Sn.prototype,`mosaicInfo`,void 0),s([U(k)],Sn.prototype,`mosaicTexture`,void 0),s([z(Nt)],Sn.prototype,`localTileOffset`,void 0),s([o(0,I(_n)),o(1,I(jt))],Sn.prototype,`vertex`,null),s([o(0,I(vn))],Sn.prototype,`fragment`,null);var Cn=class extends tn{constructor(){super(...arguments),this.type=`AnimatedFillShader`}vertex(e,t){let{distanceToPx:n,ndc:r,z:i,color:a,isOutline:o,strokeWidth:s,isSDF:c,scale:l,scaleSymbolsProportionally:u}=this._vertexPoly(e),d=this.view.requiredZoomFactor,f=e.sizing.xy,p=f.multiply(d),m=e.angle?e.angle.multiply(ct):new G(0),h=ge(m),g=ze(m),_=yn(e.id,p,h,g,e.bitset),v=this.localTileOffset.getPatternOffsetAtTileOrigin(f,h,g),y=d.multiply(e.offset.subtract(v)).divide(p),b=new N(e.pos,1),x=_.multiply(b).xy.subtract(y),S=e.tlbr.divide(this.mosaicInfo.size.xyxy);return{glPosition:new W(r,i,1),tlbr:S,uv:x,color:a.multiply(new G(1).subtract(o)),outlineColor:a.multiply(o),distanceToPx:n,strokeWidth:s.multiply(L(new G(1),l,u)),isOutline:o,isSDF:c,...this.maybeRunHittest(e,t,{})}}fragment(e){let t=this._fragmentPoly(e);return this.getFragmentOutput(t,e)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,null),o=mn(this.hittestRequest);return E(o,()=>{let{tlbr:e}=this.hittestRequest;return pn(r,i,a,e)},()=>{let n=sn(this,e,t);return E(O(n,this.hittestRequest.distance),new G(0),new G(2))})}};s([o(0,I(Qt)),o(1,I($t))],Cn.prototype,`vertex`,null),s([o(0,I(en))],Cn.prototype,`fragment`,null);var wn=class extends At{};s([F(3,W)],wn.prototype,`color`,void 0),s([F(4,H)],wn.prototype,`offset`,void 0),s([F(5,H)],wn.prototype,`normal`,void 0),s([F(6,G)],wn.prototype,`halfWidth`,void 0),s([F(7,G)],wn.prototype,`referenceHalfWidth`,void 0),s([F(8,H)],wn.prototype,`zoomRange`,void 0);var Tn=class extends Mt{},En=class extends V{};function Dn(e){return Oe(new G(at).multiply(R(e,new G(1))),new G(1))}function On(e,t){let{halfWidth:n,normal:r}=e,i=Dn(n),a=Je(r).multiply(n);return Xe(i.multiply(n.subtract(a)).divide(t.add(i).subtract(new G(1))),new G(0),new G(1))}function kn(e,t){let{id:n,halfWidth:r,referenceHalfWidth:i}=t;if(Ht(e)){let t=Ut(e,n,new G(2).multiply(i)),a=new G(ot),o=E(O(r,a),r.divide(Oe(i,a)),new G(1));return new G(.5).multiply(o).multiply(t)}return r}function An(e,t){let{id:n,offset:r,pos:i,normal:a,zoomRange:o}=t,{displayViewScreenMat3:s,displayViewMat3:c}=e.view,l=Wt(e,n,t.color),u=Gt(e,n),d=kn(e,t),f=new G(.5).multiply(e.antialiasingControls.antialiasing),p=Oe(d.add(f),new G(.45)).add(new G(.1).multiply(f)),m=Dn(p).multiply(p).multiply(r).multiply(e.view.scaleFactor),h=c.multiply(new N(m,new G(0))),g=s.multiply(new N(i,new G(1))).add(h),_=new G(2).multiply(R(d,new G(0))).add(e.clip(n,o)),v=new W(g.xy,_,1);return{color:l,opacity:u,halfWidth:p,normal:a,scaledOffset:m,scaledHalfWidth:d,glPosition:new W(v.xy,_,1)}}function jn(e,t){let{opacity:n,color:r}=e,i=On(e,t);return n.multiply(r).multiply(i)}s([z(G)],En.prototype,`antialiasing`,void 0),s([z(G)],En.prototype,`blur`,void 0);var Mn=class extends Y{constructor(){super(...arguments),this.type=`LineShader`,this.computeAttributes={pos:[`nextPos1`,`nextPos2`]}}vertex(e,t){let n=An(this,e);return{...n,...this.maybeRunHittest(e,t,n.halfWidth)}}fragment(e){let t=jn(e,this.antialiasingControls.blur);return this.getFragmentOutput(t,e)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,null),o=mn(this.hittestRequest),{distance:s,smallSymbolDistance:c,smallSymbolSizeThreshold:l,tlbr:u}=this.hittestRequest,d=R(n,l.multiply(.5)).multiply(s.subtract(c)),f=this.hittestRequest.position,p=Be(rn(f,r,i),rn(f,r,a)).subtract(n).add(d);return E(o,pn(r,i,a,u),E(O(p,s),new G(0),new G(2)))}};s([z(En)],Mn.prototype,`antialiasingControls`,void 0),s([B(Ft)],Mn.prototype,`visualVariableColor`,void 0),s([B(It)],Mn.prototype,`visualVariableOpacity`,void 0),s([B(Rt)],Mn.prototype,`visualVariableSizeMinMaxValue`,void 0),s([B(zt)],Mn.prototype,`visualVariableSizeScaleStops`,void 0),s([B(Bt)],Mn.prototype,`visualVariableSizeStops`,void 0),s([B(Vt)],Mn.prototype,`visualVariableSizeUnitValue`,void 0),s([o(0,I(wn)),o(1,I(jt))],Mn.prototype,`vertex`,null),s([o(0,I(Tn))],Mn.prototype,`fragment`,null);var Nn=class extends Qt{};s([F(10,G)],Nn.prototype,`accumulatedDistance`,void 0),s([F(11,H)],Nn.prototype,`normal`,void 0),s([F(12,H)],Nn.prototype,`segmentDirection`,void 0);var Pn=class extends en{},Fn=class extends tn{constructor(){super(...arguments),this.type=`AnimatedLineShader`}vertex(e,t){let{animationPointerAndBaseSizeAndReferenceSize:n}=e,r=n.xy,{distanceToPx:i,ndc:a,z:o,color:s,isOutline:c,strokeWidth:l,isSDF:u,baseSize:d,scale:f,scaleSymbolsProportionally:p,evalParams:m}=this._vertexPoly(e),h=e.sizing.xy,g=h.x.multiply(d).divide(h.y),_=Zt(r,6,m).a.multiply(this.animationInfo.scaleAdjustment),v=e.accumulatedDistance.subtract(_),{normal:y}=e,b=e.normal.y,x=v.divide(this.view.displayZoomFactor).add(Ye(e.segmentDirection,e.offset)).divide(g),S=b.add(1).divide(2),C=new H(x,S),w=e.tlbr.divide(this.mosaicInfo.size.xyxy),ee=d.divide(2),te=new G(.5).multiply(this.antialiasingControls.antialiasing),ne=Oe(ee.add(te),new G(.45)).add(new G(.1).multiply(te));return{glPosition:new W(a,o,1),tlbr:w,uv:C,color:s.multiply(new G(1).subtract(c)),outlineColor:s.multiply(c),distanceToPx:i,strokeWidth:l.multiply(L(new G(1),f,p)),isOutline:c,isSDF:u,halfWidth:ne,normal:y,...this.maybeRunHittest(e,t,ne)}}fragment(e){let t=this._fragmentPoly(e),n=On(e,this.antialiasingControls.blur),{halfWidth:r,normal:i}=e,a=Dn(r),o=Je(i).multiply(r),s=Xe(a.multiply(r.subtract(o)).divide(a.subtract(new G(1))),new G(0),new G(1));return this.getFragmentOutput(t.multiply(s).multiply(n),e)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,null),o=mn(this.hittestRequest),{distance:s,smallSymbolDistance:c,smallSymbolSizeThreshold:l,tlbr:u}=this.hittestRequest,d=R(n,l.multiply(.5)).multiply(s.subtract(c)),f=this.hittestRequest.position,p=Be(rn(f,r,i),rn(f,r,a)).subtract(n).add(d);return E(o,pn(r,i,a,u),E(O(p,s),new G(0),new G(2)))}};s([z(En)],Fn.prototype,`antialiasingControls`,void 0),s([o(0,I(Nn)),o(1,I($t))],Fn.prototype,`vertex`,null),s([o(0,I(Pn))],Fn.prototype,`fragment`,null);var In=class extends Jt{};s([F(9,H)],In.prototype,`uv`,void 0),s([F(10,G)],In.prototype,`angle`,void 0);var Ln=class extends Pe{};s([F(11,H)],Ln.prototype,`offsetNextVertex1`,void 0),s([F(12,H)],Ln.prototype,`offsetNextVertex2`,void 0),s([F(13,H)],Ln.prototype,`textureUVNextVertex1`,void 0),s([F(14,H)],Ln.prototype,`textureUVNextVertex2`,void 0);var Rn=class extends Yt{};function zn(e,t,n,r){return t.multiply(e.x).add(n.multiply(e.y)).add(r.multiply(e.z))}var Bn=class extends Xt{constructor(){super(...arguments),this.type=`AnimatedMarkerShader`,this.computeAttributes={offset:[`offsetNextVertex1`,`offsetNextVertex2`],uv:[`textureUVNextVertex1`,`textureUVNextVertex2`]}}vertex(e,t){let n=e.uv.divide(this.mosaicInfo.size),{position:r,animationPointer:i,evalParams:a,isOutline:o,unscaledDistanceToPx:s,vvScale:c,strokeWidth:l,scaleSymbolsProportionally:u,scale:d,isSDF:f,baseSize:p,clip:m}=this._vertexPreamble(e,e.angle,e.lineLength||new G(0)),h=this._toNdc(r),g=Zt(i,1,a);g=new W(g.rgb.multiply(g.a),g.a);let _=E(dt(e.bitset,et.bitset.colorLocked),g,Zt(i,2,a));_=new W(_.rgb.multiply(_.a),_.a);let v=Zt(i,3,a);v=new W(v.rgb.multiply(v.a),v.a);let y=Zt(i,4,a).a,b=Zt(i,5,a).a,x=Wt(this,e.id,g,De(dt(e.bitset,et.bitset.colorLocked),new Re(o))),S=L(x,_,v),C=Gt(this,e.id),w=L(C,y,b),ee=S.multiply(w),te=this.clip(e.id,e.zoomRange).add(m.multiply(2)),ne=s.multiply(c);return{glPosition:new W(h,te,1),uv:n,color:ee.multiply(new G(1).subtract(o)),outlineColor:ee.multiply(o),distanceToPx:ne,strokeWidth:l.multiply(L(new G(1),d,u)),isOutline:o,isSDF:f,...this.maybeRunHittest(e,t,{pos:e.pos,size:p,sizeCorrection:new G(1),isMapAligned:new G(1),vvRotationMat3:new T(1,0,0,0,1,0,0,0,1),placementMat3:new T(1,0,0,0,1,0,0,0,1),outlineSize:new G(1),distanceToPx:ne,isSDF:f})}}fragment(e){let t=this._getColor(e.uv,{color:e.color,distanceToPx:e.distanceToPx,isSDF:e.isSDF,outlineColor:e.outlineColor,outlineSize:e.strokeWidth});return wt.spotlightAnimatedSymbols&&(t=t.add(new W(0,.3,0,.3))),this.getFragmentOutput(t,e)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,n),o=mn(this.hittestRequest);return E(o,()=>{let{tlbr:e}=this.hittestRequest;return fn(r,i,a,e)},()=>E(Ge(n.size,this.hittestRequest.smallSymbolSizeThreshold),this._hittestSmallMarker(e,t,n),this._hittestMarker(e,t,n)))}_hittestSmallMarker(e,t,n){let{position:r,distance:i,smallSymbolDistance:a}=this.hittestRequest,o=i.subtract(a),{viewMat3:s,tileMat3:c}=this.view,l=s.multiply(c).multiply(new N(n.pos,1)).xy,u=n.size.multiply(.5),d=Ce(l,r).subtract(u).add(o);return E(O(d,this.hittestRequest.distance),new G(0),new G(2))}_hittestMarker(e,t,n){let r=this._vertexPreamble({...e},e.angle,new G(0)).position,i=this._vertexPreamble({...e,offset:t.offsetNextVertex1},e.angle,new G(0)).position,a=this._vertexPreamble({...e,offset:t.offsetNextVertex2},e.angle,new G(0)).position,o=this.hittestRequest.position,s=this.hittestRequest.distance,c=on(o,r,i,a);return E(O(c,s),new G(0),this._hittestSamples(r,i,a,e,t,n))}_hittestSamples(e,t,n,r,i,a){let{outlineSize:o,isSDF:s,distanceToPx:c}=a,l=this.hittestRequest.position,u=this.hittestRequest.distance,d=Z(l.add(new H(D(u),D(u))),e,t,n),f=Z(l.add(new H(0,D(u))),e,t,n),p=Z(l.add(new H(u,D(u))),e,t,n),m=Z(l.add(new H(D(u),0)),e,t,n),h=Z(l,e,t,n),g=Z(l.add(new H(u,0)),e,t,n),_=Z(l.add(new H(D(u),u)),e,t,n),v=Z(l.add(new H(0,u)),e,t,n),y=Z(l.add(new H(u,u)),e,t,n),b=r.uv.divide(this.mosaicInfo.size),x=i.textureUVNextVertex1.divide(this.mosaicInfo.size),S=i.textureUVNextVertex2.divide(this.mosaicInfo.size),C={color:new W(1,1,1,1),outlineSize:o,outlineColor:new W(1,1,1,1),isSDF:s,distanceToPx:c},w=new G(0);return w=w.add(X(d).multiply(this._getColor(zn(d,b,x,S),C).a)),w=w.add(X(f).multiply(this._getColor(zn(f,b,x,S),C).a)),w=w.add(X(p).multiply(this._getColor(zn(p,b,x,S),C).a)),w=w.add(X(m).multiply(this._getColor(zn(m,b,x,S),C).a)),w=w.add(X(h).multiply(this._getColor(zn(h,b,x,S),C).a)),w=w.add(X(g).multiply(this._getColor(zn(g,b,x,S),C).a)),w=w.add(X(_).multiply(this._getColor(zn(_,b,x,S),C).a)),w=w.add(X(v).multiply(this._getColor(zn(v,b,x,S),C).a)),w=w.add(X(y).multiply(this._getColor(zn(y,b,x,S),C).a)),E(O(w,new G(.05)),new G(2),new G(0))}};s([o(0,I(In)),o(1,I(Ln))],Bn.prototype,`vertex`,null),s([o(0,I(Rn))],Bn.prototype,`fragment`,null);var Q=class extends Ee{constructor(){super(...arguments),this.symbologyPlane=0,this._input=null}};function Vn(e){let t=1/e;return{antialiasing:t,blur:0+t}}var Hn=class extends Q{render(e,t){let{context:n,painter:r,pixelRatio:i}=e,{target:a}=t,{freezeGlobalTime:o}=wt,s=r.textureManager.animationStore.getTexture(n,0),u=[2/e.state.size[0],0,0,0,-2/e.state.size[1],0,-1,1,1],d=Array.from(l(x(),u)),f=Array.from(c(x(),d,a.transforms.displayViewScreenMat3)),_=t.instance.getInput(),S=r.textureManager.getMosaicInfo(e,t.textureKey,!1),{optionalAttributes:C}=_,w=C.zoomRange,ee=C.value1Position2Value2,te=`accumulatedDistance`in C&&C.accumulatedDistance,ne=`segmentDirection`in C&&C.segmentDirection,re=`normal`in C&&C.normal,ie=2**(t.target.key.level-e.displayLevel);r.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,_.uniforms),...p(e,t.target),antialiasingControls:Vn(i),mosaicInfo:S,animationInfo:{globalTime:e.animationsEnabled?!1===o?e.time/1e3:o:0,scaleAdjustment:ie,animationTextureSize:[s.descriptor.width,s.descriptor.height],toScreen:f,toNdc:u,mapRotation:e.state.rotation,pixelRatio:e.state.pixelRatio},localTileOffset:g(t.target)},textures:{...h(e),mosaicTexture:r.textureManager.getMosaicTexture(e,t.textureKey,!1),animationTexture:{unit:6,texture:s}},defines:{...v(e)},optionalAttributes:{zoomRange:w,value1Position2Value2:ee,accumulatedDistance:te,segmentDirection:ne,normal:re},useComputeBuffer:y(e)}),r.setPipelineState({...b(e)}),r.submitDraw(e,t),!1===o&&e.animationsEnabled&&a.requestRender()}},Un=class extends Hn{constructor(){super(...arguments),this.type=2,this.symbologyPlane=2,this.shaders={geometry:new Bn}}},Wn=class extends Hn{constructor(){super(...arguments),this.type=3,this.symbologyPlane=2,this.shaders={geometry:new Bn}}},Gn=class extends Hn{constructor(){super(...arguments),this.type=0,this.symbologyPlane=0,this.shaders={geometry:new Cn}}},Kn=class extends Hn{constructor(){super(...arguments),this.type=1,this.symbologyPlane=1,this.shaders={geometry:new Fn}}},qn=class extends Le{};s([F(0,H)],qn.prototype,`pos`,void 0);var Jn=class extends Mt{},Yn=class extends V{};s([z(G)],Yn.prototype,`dotSize`,void 0);var Xn=class extends V{};s([z(G)],Xn.prototype,`pixelRatio`,void 0),s([z(G)],Xn.prototype,`tileZoomFactor`,void 0);var Zn=1e-6,Qn=class extends We{constructor(){super(...arguments),this.type=`DotDensityPointShader`}vertex(e){let t=new T(1,0,0,0,-1,0,0,1,1).multiply(new N(e.pos.xy.divide(512),1)),n=K(this.drawLocations,t.xy),r=Oe(this.instance.dotSize.divide(2),new G(1)),i=new G(0);i=i.add(R(n.a,new G(Zn)).multiply(2));let a=r.add(this.instance.dotSize),o=this.view.displayViewScreenMat3.multiply(new N(e.pos.add(.5),1)),s=new W(o.xy,i,1),c=this.instance.dotSize.divide(a),l=new G(-1).divide(r.divide(a));return a=a.multiply(this.draw.pixelRatio.multiply(this.draw.tileZoomFactor)),{glPosition:s,glPointSize:a,color:n,ratio:c,invEdgeRatio:l}}fragment(e){let t=Je(e.glPointCoord.subtract(.5)).multiply(2),n=qe(new G(0),new G(1),e.invEdgeRatio.multiply(t.subtract(e.ratio)).add(1)),r=new Ve;return r.fragColor=e.color.multiply(n),r}};s([z(Yn)],Qn.prototype,`instance`,void 0),s([z(Xn)],Qn.prototype,`draw`,void 0),s([z(J)],Qn.prototype,`view`,void 0),s([U(k)],Qn.prototype,`drawLocations`,void 0),s([o(0,I(qn))],Qn.prototype,`vertex`,null),s([o(0,I(Jn))],Qn.prototype,`fragment`,null);var $n=class extends At{};s([F(3,G)],$n.prototype,`inverseArea`,void 0);var er=class extends V{};s([z(M.ofType(W,2))],er.prototype,`isActive`,void 0),s([z(M.ofType(W,8))],er.prototype,`colors`,void 0),s([z(G)],er.prototype,`dotValue`,void 0);var tr=class extends V{};s([z(G)],tr.prototype,`tileZoomFactor`,void 0),s([z(G)],tr.prototype,`pixelRatio`,void 0),s([z(G)],tr.prototype,`tileDotsOverArea`,void 0);var nr=class extends Ke{};s([U(k)],nr.prototype,`dotTexture0`,void 0),s([U(k)],nr.prototype,`dotTexture1`,void 0);var rr=class extends Y{constructor(){super(...arguments),this.type=`DotDensityPolygonShader`}_dotThreshold(e,t,n){return e.divide(t).divide(n)}vertex(e){let t=new T(2/512,0,0,0,-2/512,0,-1,1,1).multiply(new N(e.pos,1)),n=this.clip(e.id),r=new W(t.xy,n,1),i=this.getVVData(e.id).multiply(this.instance.isActive.get(0)).multiply(e.inverseArea),a=this.storageTextures.getDataDrivenData0(this.getAttributeDataCoords(e.id)).multiply(this.instance.isActive.get(1)).multiply(e.inverseArea),o=this.draw.tileZoomFactor.multiply(512).divide(this.draw.pixelRatio),s=this._dotThreshold(i,this.instance.dotValue,this.draw.tileDotsOverArea),c=this._dotThreshold(a,this.instance.dotValue,this.draw.tileDotsOverArea),l=e.pos.add(.5).divide(o);return{glPosition:r,color:new W(0,0,0,0),textureCoords:l,thresholds0:s,thresholds1:c}}fragment(e){let t=new Ve,n=K(this.drawTextures.dotTexture0,e.textureCoords),r=K(this.drawTextures.dotTexture1,e.textureCoords),i=e.thresholds0.subtract(n),a=e.thresholds1.subtract(r),o,s=Ue.fromColumns(this.instance.colors.get(0),this.instance.colors.get(1),this.instance.colors.get(2),this.instance.colors.get(3)),c=Ue.fromColumns(this.instance.colors.get(4),this.instance.colors.get(5),this.instance.colors.get(6),this.instance.colors.get(7));if(this.blending){let e=R(new G(0),i),t=R(new G(0),a),n=Ye(e,i).add(Ye(t,a)),r=R(n,new G(0)),l=new G(1).subtract(r),u=n.add(r),d=i.multiply(e).divide(u),f=a.multiply(t).divide(u),p=s.multiply(d).add(c.multiply(f));o=l.multiply(p)}else{let e=Oe(mt(i),mt(a)),t=R(e,new G(0)),n=new G(1).subtract(t),r=R(e,i),l=R(e,a),u=s.multiply(r).add(c.multiply(l));o=n.multiply(u)}return t.fragColor=o,t}hittest(e){return new G(0)}};s([P],rr.prototype,`blending`,void 0),s([z(er)],rr.prototype,`instance`,void 0),s([z(tr)],rr.prototype,`draw`,void 0),s([U(nr)],rr.prototype,`drawTextures`,void 0),s([o(0,I($n))],rr.prototype,`vertex`,null),s([o(0,I(Mt))],rr.prototype,`fragment`,null);var ir={pos:{count:2,type:ne.UNSIGNED_SHORT}},ar=class{constructor(){this._dotTextureSize=0,this._dotTextures=null,this._dotMesh=null}destroy(){this._disposeTextures(),this._dotFBO?.dispose(),this._dotMesh?.destroy()}getFBO(e){if(this._dotFBO==null){let t=new re(512,512);t.samplingMode=9728,t.wrapMode=33071;let n=new oe(e,new ae(C.DEPTH24_STENCIL8,512,512));this._dotFBO=new se(e,t,n)}return this._dotFBO}getDotDensityMesh(e){if(this._dotMesh==null){let t=262144,n=new Int16Array(t*2);for(let e=0;e<512;e++)for(let t=0;t<512;t++)n[2*(t+e*512)]=t,n[2*(t+e*512)+1]=e;this._dotMesh=ce.create(e,{primitive:w.POINTS,vertex:n,count:t,layout:ir})}return this._dotMesh}getDotDensityTextures(t,n,r){if(this._dotTextureSize===n&&this._seed===r||(this._disposeTextures(),this._dotTextureSize=n,this._seed=r),this._dotTextures===null){let i=new e(r);this._dotTextures=[this._allocDotDensityTexture(t,n,i),this._allocDotDensityTexture(t,n,i)]}return this._dotTextures}_disposeTextures(){if(this._dotTextures){for(let e=0;e<this._dotTextures.length;e++)this._dotTextures[e].dispose();this._dotTextures=null}}_allocDotDensityTexture(e,t,n){let r=new Float32Array(t*t*4);for(let e=0;e<r.length;e++)r[e]=n.getFloat();let i=new re(t);return i.dataType=te.FLOAT,i.samplingMode=9728,new ie(e,i,r)}},or=class extends Q{constructor(){super(...arguments),this.type=12,this.shaders={polygon:new rr,point:new Qn,fill:new gn},this._resources=new Map}render(e,t){_(e)||y(e)?this._renderPolygons(e,t):this._renderDotDensity(e,t)}_renderPolygons(e,t){let{painter:n}=e;n.setShader({shader:this.shaders.fill,uniforms:{...p(e,t.target),visualVariableColor:null,visualVariableOpacity:null},textures:h(e),defines:{...v(e)},optionalAttributes:{zoomRange:!1},useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}_renderDotDensity(e,t){let{context:n,painter:r,requiredLevel:i}=e,a=t.instance.getInput().uniforms,o=this._getOrCreateResourcesRecord(n),s=o.getDotDensityTextures(n,512,a.seed),c=1/2**(i-t.target.key.level),l=512*window.devicePixelRatio*512*window.devicePixelRatio,u=1/c*(1/c),f=a.dotScale?e.state.scale/a.dotScale:1,m=a.dotValue*f*u;r.setShader({shader:this.shaders.polygon,uniforms:{...p(e,t.target),instance:{isActive:a.isActive,colors:a.colors,dotValue:Math.max(1,m)},draw:{tileZoomFactor:c,pixelRatio:window.devicePixelRatio,tileDotsOverArea:l/(512*window.devicePixelRatio*512*window.devicePixelRatio)}},textures:{...h(e),drawTextures:{dotTexture0:{unit:5,texture:s[0]},dotTexture1:{unit:6,texture:s[1]}}},defines:{...v(e),blending:a.blending},optionalAttributes:{},useComputeBuffer:!1});let g=n.getViewport();n.setViewport(0,0,512,512);let _=n.boundFramebuffer,y=o.getFBO(n);n.bindFramebuffer(y),n.setClearColor(0,0,0,0),n.clear(16384),r.setPipelineState({color:{write:[!0,!0,!0,!0],blendMode:`composite`},depth:!1,stencil:!1}),r.updatePipelineState(n),r.submitDraw(e,t),n.bindFramebuffer(_),n.setViewport(g.x,g.y,g.width,g.height);let x=o.getFBO(n).colorTexture,S={shader:this.shaders.point,uniforms:{view:d(e,t.target),instance:{dotSize:a.dotSize},draw:{tileZoomFactor:1,pixelRatio:window.devicePixelRatio}},textures:{drawLocations:{unit:5,texture:x}},defines:{...v(e)},optionalAttributes:{},useComputeBuffer:!1};r.setPipelineState(b(e)),r.submitDrawMesh(n,S,o.getDotDensityMesh(n),{stencilRef:t.getStencilReference()})}shutdown(e){super.shutdown(e),this._resources.get(e)?.destroy(),this._resources.delete(e)}_getOrCreateResourcesRecord(e){let t=this._resources.get(e);return t??(t=new ar,this._resources.set(e,t)),t}},sr=class extends Q{constructor(){super(...arguments),this.type=10,this.shaders={geometry:new Sn}}render(e,t){let{painter:n}=e,r=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,r.uniforms),...p(e,t.target),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:g(t.target)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:r.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},cr=class extends At{};s([F(3,H)],cr.prototype,`offset`,void 0),s([F(4,W)],cr.prototype,`color`,void 0),s([F(5,H)],cr.prototype,`normal`,void 0),s([F(6,G)],cr.prototype,`halfWidth`,void 0),s([F(7,G)],cr.prototype,`referenceHalfWidth`,void 0),s([F(8,H)],cr.prototype,`zoomRange`,void 0);var lr=class extends Tn{};function ur(e,t,n){let{id:r,bitset:i}=t,a=q(i,0),o=O(a,new G(.5)),s=An(e,t),c=E(o,s.halfWidth,new G(0)),l=Gt(e,r),u=Wt(e,r,t.color),d=E(o,E(dt(i,1),u,t.color),u.multiply(l)),f=e.view.displayViewScreenMat3.multiply(new N(t.pos.xy,1)),p=e.clip(t.id),m=new W(f.xy,p,1),h=E(o,s.glPosition,m),g=n&&e.maybeRunHittest(t,n,o);return{isOutline:a,color:d,opacity:new G(1),halfWidth:c,normal:s.normal,glPosition:h,...g}}var dr=class extends Y{constructor(){super(...arguments),this.computeAttributes={pos:[`nextPos1`,`nextPos2`]}}};s([z(En)],dr.prototype,`antialiasingControls`,void 0),s([B(Ft)],dr.prototype,`visualVariableColor`,void 0),s([B(It)],dr.prototype,`visualVariableOpacity`,void 0),s([B(Rt)],dr.prototype,`visualVariableSizeMinMaxValue`,void 0),s([B(zt)],dr.prototype,`visualVariableSizeScaleStops`,void 0),s([B(Bt)],dr.prototype,`visualVariableSizeStops`,void 0),s([B(Vt)],dr.prototype,`visualVariableSizeUnitValue`,void 0);var fr=class extends dr{constructor(){super(...arguments),this.type=`OutlineFillShader`}vertex(e,t){return ur(this,e,t)}fragment(e){let{color:t,isOutline:n}=e,r=O(n,new G(.5)),i=jn(e,this.antialiasingControls.blur),a=E(r,i,t),o=E(r,new G(1/255),new G(0));return this.getFragmentOutput(a,e,o)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,null),o=mn(this.hittestRequest);return E(o,()=>{let{tlbr:e}=this.hittestRequest;return pn(r,i,a,e)},()=>{let r=sn(this,e,t);return E(De(n,O(r,this.hittestRequest.distance)),new G(0),new G(2))})}};s([o(0,I(cr)),o(1,I(jt))],fr.prototype,`vertex`,null),s([o(0,I(lr))],fr.prototype,`fragment`,null);var pr=class extends hn{};s([F(5,W)],pr.prototype,`tlbr`,void 0),s([F(6,G)],pr.prototype,`inverseRasterizationScale`,void 0);var mr=class extends Mt{};function hr(e){let t=new G(1),n=new G(0);return new T(t.divide(e.x),n.divide(e.y),0,D(n.divide(e.x)),t.divide(e.y),0,0,0,1)}function gr(e,t){let n=t.tlbr.xy,r=t.tlbr.zw,i=r.x.subtract(n.x),a=n.y.subtract(r.y),o=new H(i,a).multiply(t.inverseRasterizationScale),s=o.multiply(e.view.requiredZoomFactor),c=hr(s),l=e.localTileOffset.getPatternOffsetAtTileOrigin(o).divide(s),u=new N(t.pos,1);return{tileTextureCoord:c.multiply(u).xy.subtract(l),tlbr:t.tlbr.divide(e.mosaicInfo.size.xyxy)}}function _r(e,t){let n=we(e.tileTextureCoord,new G(1)),r=L(e.tlbr.xy,e.tlbr.zw,n),i=K(t.mosaicTexture,r);return e.color.multiply(i)}var vr=class extends gn{constructor(){super(...arguments),this.type=`PatternFillShader`}vertex(e,t){return{...super.vertex(e,t),...gr(this,e)}}fragment(e){let t=_r(e,this);return this.getFragmentOutput(t,e,new G(0))}};s([z(Pt)],vr.prototype,`mosaicInfo`,void 0),s([U(k)],vr.prototype,`mosaicTexture`,void 0),s([z(Nt)],vr.prototype,`localTileOffset`,void 0),s([o(0,I(pr)),o(1,I(jt))],vr.prototype,`vertex`,null),s([o(0,I(mr))],vr.prototype,`fragment`,null);var yr=class extends cr{};s([F(9,W)],yr.prototype,`tlbr`,void 0),s([F(10,G)],yr.prototype,`inverseRasterizationScale`,void 0);var br=class extends lr{},xr=class extends fr{constructor(){super(...arguments),this.type=`PatternOutlineFillShader`}vertex(e,t){return{...ur(this,e,t),...gr(this,e)}}fragment(e){let{isOutline:t}=e,n=O(t,new G(.5)),r=jn(e,this.antialiasingControls.blur),i=_r(e,this),a=E(n,r,i),o=E(n,new G(1/255),new G(0));return this.getFragmentOutput(a,e,o)}};s([z(Pt)],xr.prototype,`mosaicInfo`,void 0),s([U(k)],xr.prototype,`mosaicTexture`,void 0),s([z(Nt)],xr.prototype,`localTileOffset`,void 0),s([o(0,I(yr)),o(1,I(jt))],xr.prototype,`vertex`,null),s([o(0,I(br))],xr.prototype,`fragment`,null);var Sr=1/16,Cr=class extends At{};s([F(3,W)],Cr.prototype,`color`,void 0),s([F(4,W)],Cr.prototype,`tlbr`,void 0),s([F(5,G)],Cr.prototype,`angle`,void 0),s([F(6,G)],Cr.prototype,`aux1`,void 0),s([F(7,G)],Cr.prototype,`aux2`,void 0),s([F(8,H)],Cr.prototype,`aux3`,void 0),s([F(9,H)],Cr.prototype,`aux4`,void 0),s([F(10,H)],Cr.prototype,`zoomRange`,void 0);var wr=class extends br{},Tr=class extends dr{constructor(){super(...arguments),this.type=`ComplexOutlineFillShader`}vertex(e,t){let{aux1:n,aux2:r,aux3:i,aux4:a}=e,o={...e,width:n,height:r,offset:i,scale:a.multiply(Sr)},s={...e,halfWidth:n,referenceHalfWidth:r,offset:i,normal:a.subtract(128).multiply(Sr)},c=ur(this,s),l=bn(this,o),u=O(c.isOutline,new G(.5));return{...c,...l,...Object.assign({},this.maybeRunHittest(e,t,u))}}fragment(e){let{isOutline:t}=e,n=O(t,new G(.5)),r=jn(e,this.antialiasingControls.blur),i=xn(this,e),a=E(n,r,i),o=E(n,new G(1/255),new G(0));return this.getFragmentOutput(a,e,o)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,null),o=mn(this.hittestRequest);return E(o,()=>{let{tlbr:e}=this.hittestRequest;return pn(r,i,a,e)},()=>{let r=sn(this,e,t);return E(De(n,O(r,this.hittestRequest.distance)),new G(0),new G(2))})}};s([z(Pt)],Tr.prototype,`mosaicInfo`,void 0),s([U(k)],Tr.prototype,`mosaicTexture`,void 0),s([z(Nt)],Tr.prototype,`localTileOffset`,void 0),s([o(0,I(Cr)),o(1,I(jt))],Tr.prototype,`vertex`,null),s([o(0,I(wr))],Tr.prototype,`fragment`,null);var Er=class extends Q{constructor(){super(...arguments),this.type=11,this.shaders={geometry:new Tr}}render(e,t){let{painter:n,pixelRatio:r}=e,i=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,i.uniforms),...p(e,t.target),antialiasingControls:Vn(r),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:g(t.target)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:i.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Dr=class extends Q{constructor(){super(...arguments),this.type=15,this.shaders={geometry:new gn}}render(e,t){let{painter:n}=e,r=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,r.uniforms),...p(e,t.target)},textures:h(e),defines:v(e),optionalAttributes:r.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Or=class extends hn{};s([F(5,W)],Or.prototype,`tlbr`,void 0),s([F(6,H)],Or.prototype,`relativePosition`,void 0),s([F(7,G)],Or.prototype,`gradientMethod`,void 0),s([F(8,H)],Or.prototype,`relativeGradientSize`,void 0);var kr=class extends Mt{},Ar=class extends gn{constructor(){super(...arguments),this.type=`GradientFillShader`}vertex(e,t){let{tlbr:n,relativePosition:r,gradientMethod:i,relativeGradientSize:a}=e,o=E(dt(e.bitset,tt.isAbsolute),this.view.displayZoomFactor,new G(1));return{...super.vertex(e,t),tlbr:n,relativePosition:r,gradientMethod:i,gradientSize:a.multiply(o),isDiscrete:q(e.bitset,tt.isDiscrete)}}fragment(e){let{tlbr:t,relativePosition:n,gradientMethod:r,gradientSize:i,isDiscrete:a}=e,o=E(O(a,new G(.5)),i.subtract(1),new H(0)),s=be([A(r,new G(nt.rectangular)),()=>{let e=_e(n).add(o).divide(i);return ut(Oe(e.x,e.y))}],[A(r,new G(nt.circular)),ut(Fe(Ye(n,n)).add(o.x).divide(i.x))],[!0,ut(n.x.add(o.x).divide(i.x))]),c=new H(Xe(s,new G(0),new G(1)),.5),l=L(t.xy,t.zw,c).divide(this.mosaicInfo.size),u=K(this.mosaicTexture,l),d=e.color.a;return this.getFragmentOutput(u.multiply(d),e,new G(0))}};s([z(Pt)],Ar.prototype,`mosaicInfo`,void 0),s([U(k)],Ar.prototype,`mosaicTexture`,void 0),s([o(0,I(Or)),o(1,I(jt))],Ar.prototype,`vertex`,null),s([o(0,I(kr))],Ar.prototype,`fragment`,null);var jr=class extends Q{constructor(){super(...arguments),this.type=16,this.shaders={geometry:new Ar},this.symbologyPlane=0}render(e,t){let{painter:n}=e,r=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,r.uniforms),...p(e,t.target),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:r.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Mr=class extends Q{constructor(){super(...arguments),this.type=26,this.shaders={geometry:new fr}}render(e,t){let{painter:n,pixelRatio:r}=e,i=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,i.uniforms),...p(e,t.target),antialiasingControls:Vn(r)},textures:h(e),defines:{...v(e)},optionalAttributes:i.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Nr=class extends Q{constructor(){super(...arguments),this.type=28,this.shaders={geometry:new vr}}render(e,t){let{painter:n}=e,r=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,r.uniforms),...p(e,t.target),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:g(t.target)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:r.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Pr=class extends Q{constructor(){super(...arguments),this.type=29,this.shaders={geometry:new xr}}render(e,t){let{painter:n,pixelRatio:r}=e,i=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,i.uniforms),...p(e,t.target),antialiasingControls:Vn(r),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:g(t.target)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:i.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Fr=class{constructor(e,t,n,r){this.startTime=e,this.startValue=t,this.endTime=n,this.endValue=r}getValue(e){if(e<=this.startTime)return this.startValue;if(e>=this.endTime)return this.endValue;let t=(e-this.startTime)/(this.endTime-this.startTime);return this.startValue+t*(this.endValue-this.startValue)}isForeverZero(e){return this.startValue===0&&this.endValue===0||this.endValue===0&&e>=this.endTime}};function Ir(e,t){return typeof e==`number`?e:e.getValue(t)}function Lr(e){return typeof e==`number`?e:e.endValue}function Rr(e,t){return typeof e==`number`?e===0:e.isForeverZero(t)}function zr(e,t,n,r){return e===n?e:new Fr(e,t,n,r)}function Br(e,t,n){let r=Ir(e,n),i=r*t;return i===0?0:zr(n,r,n+i,0)}function Vr(e,t){let n=!0;return n&&=e.collisions===t.collisions,n&&=e.density===t.density,n&&=e.interpolate===t.interpolate,n&&=e.lineCollisionWidth===t.lineCollisionWidth,n&&=e.lineSpacing===t.lineSpacing,n&&=e.maxTurnAngle===t.maxTurnAngle,n&&=e.minSpeedThreshold===t.minSpeedThreshold,n&&=e.segmentLength===t.segmentLength,n&&=e.smoothing===t.smoothing,n&&=e.velocityScale===t.velocityScale,n&&=e.verticesPerLine===t.verticesPerLine,n&&=e.onlyForwardTracing===t.onlyForwardTracing,n&&=e.continuous===t.continuous,n&&=e.maxNumberOfStreamlines===t.maxNumberOfStreamlines,n&&=Hr(e.perturb,t.perturb),n}function Hr(e,t){return!e&&!t||!(e&&!t||!e&&t)&&e?.rotation===t?.rotation&&e?.scale===t?.scale}function Ur(e){let t=qr(Kr(e)),n=t,r=Math.max(t/2,5),i=Math.round(u(e.maxPathLength)/r)+1,{density:a}=e,o=u(e.smoothing),s=e.flowRepresentation===`flow-from`?1:-1,{continuous:c,perturb:l}=e;return{smoothing:o,interpolate:!0,velocityScale:s,verticesPerLine:i,minSpeedThreshold:.001,segmentLength:r,maxTurnAngle:1,collisions:!0,lineCollisionWidth:n,lineSpacing:10,density:a,onlyForwardTracing:!1,continuous:c,perturb:l,wrapAround:!1,maxNumberOfStreamlines:1/0}}function Wr(e,t,n,r){if(e.length===0)return[];let i=[],o=n.time-t.time,s=xt(e),c=s?St(e[0].hasMagnitude):1,l=s?({vertices:e},t)=>{let n=e,r=t*c;return{x:n[r],y:n[r+1],time:a(n[r+2]),speed:0}}:({vertices:e},t)=>e[t];for(let s of e){let{stage:e,vertices:u}=s;if(e===2)continue;let d=u.length/c,f=l(s,0),p=f.time,m=(o*r-p)%(l(s,d-1).time-p)+p,h=f.x,g=f.y,_=f.time;for(let e=1;e<d&&_<m;e++){let t=l(s,e),n=Math.min(t.time,m)-_,r=t.time-_;h+=(t.x-h)*(n/r),g+=(t.y-g)*(n/r),_=a(_+n)}i.push(Gr(h,g,t,n))}return i}function Gr(e,t,n,r){return e/=n.size[0],t=1-(t/=n.size[1]),e*=n.extent.xmax-n.extent.xmin,t*=n.extent.ymax-n.extent.ymin,e+=n.extent.xmin,t+=n.extent.ymin,e-=r.extent.xmin,t-=r.extent.ymin,e/=r.extent.xmax-r.extent.xmin,t=1-(t/=r.extent.ymax-r.extent.ymin),{x:e*=r.size[0],y:t*=r.size[1]}}function Kr(e){if(!e.hasVisualVariables(`size`))return{kind:`constant`,value:[u(e.trailWidth)]};let t=e.getVisualVariablesForType(`size`)[0],n=[],r=[],i;if(t.stops){for(let e of t.stops)n.push(e.value),r.push(u(e.size));i=t.stops.length}else n.push(t.minDataValue,t.maxDataValue),r.push(u(t.minSize),u(t.maxSize)),i=2;return{kind:`ramp`,stops:n,values:r,count:i}}function qr(e){return e.kind===`constant`?e.value[0]:e.values[e.values.length-1]}function Jr(e){let t=e.toRgba();return[t[0]/255,t[1]/255,t[2]/255,t[3]]}function Yr(e){return{kind:`constant`,value:[.1,.1,.1,1]}}function Xr(e){if(!e.hasVisualVariables(`color`))return{kind:`constant`,value:Jr(e.color)};let t=e.getVisualVariablesForType(`color`)[0],n=[],r=[];for(let e of t.stops)n.push(e.value),Array.prototype.push.apply(r,Jr(e.color));return{kind:`ramp`,stops:n,values:r,count:t.stops.length}}function Zr(e){if(!e.hasVisualVariables(`opacity`))return{kind:`constant`,value:[1]};let t=e.getVisualVariablesForType(`opacity`)[0],n=[],r=[];for(let e of t.stops)n.push(e.value),r.push(e.opacity);return{kind:`ramp`,stops:n,values:r,count:t.stops.length}}var Qr=8;function $r(e){if(e.kind===`constant`)return{constant:e.value,count:1,stops:Array(Qr).fill(0),values:Array(Qr).fill(e.value)};let t=Math.min(e.count,Qr),n=Array(Qr).fill(e.stops[t-1]),r=Array(Qr).fill(null).map((n,r)=>{let i=4*Math.min(r,t-1);return e.values.slice(i,i+4)});for(let r=0;r<t;r++)n[r]=e.stops[r];return{constant:[0,0,0,0],count:t,stops:n,values:r}}function ei(e){if(e.kind===`constant`)return{constant:e.value[0],count:1,stops:Array(Qr).fill(0),values:Array(Qr).fill(e.value[0])};let t=Math.min(e.count,Qr),n=Array(Qr).fill(e.stops[t-1]),r=Array(Qr).fill(e.values[t-1]);for(let i=0;i<t;i++)n[i]=e.stops[i],r[i]=e.values[i];return{constant:0,count:t,stops:n,values:r}}function ti(e,t){return e===t||e!=null&&t!=null&&e.equals(t)}function ni(e,t){if(!Vr(e.simulationSettings,t.simulationSettings)||!ti(e.timeExtent,t.timeExtent))return!1;let n=!0;return n&&=e.loadImagery===t.loadImagery,n&&=e.createFlowMesh===t.createFlowMesh,n&&=e.color.kind===t.color.kind,n&&=e.opacity.kind===t.opacity.kind,n&&=e.size.kind===t.size.kind,n}var ri=36e5,ii=3600,ai=class extends V{};s([z(G)],ai.prototype,`time`,void 0),s([z(T)],ai.prototype,`dvsMat3`,void 0),s([z(T)],ai.prototype,`displayViewMat3`,void 0),s([z(G)],ai.prototype,`displayOpacity`,void 0),s([z(G)],ai.prototype,`startTime`,void 0),s([z(G)],ai.prototype,`endTime`,void 0);var oi=class extends V{};s([z(G)],oi.prototype,`trailLength`,void 0),s([z(G)],oi.prototype,`flowSpeed`,void 0),s([z(G)],oi.prototype,`featheringSize`,void 0),s([z(G)],oi.prototype,`featheringOffset`,void 0),s([z(G)],oi.prototype,`introFade`,void 0),s([z(G)],oi.prototype,`fadeToZero`,void 0),s([z(G)],oi.prototype,`decayRate`,void 0);var si=class extends V{};s([z(G)],si.prototype,`min`,void 0),s([z(G)],si.prototype,`max`,void 0);var ci=class extends V{getValue(e,t){return t?be([Ae(e,this.stops.first()),this.values.first()],[fe(e,this.stops.get(this.count.subtract(1))),this.values.get(this.count.subtract(1))],[!0,()=>{let t=this.stops.findIndex(t=>O(t,e)),n=this.stops.get(t),r=t.subtract(1),i=this.stops.get(r),a=e.subtract(i).divide(n.subtract(i));return L(this.values.get(r),this.values.get(t),a)}]):this.constant}};s([z(W)],ci.prototype,`constant`,void 0),s([z(M.ofType(G,8))],ci.prototype,`stops`,void 0),s([z(M.ofType(W,8))],ci.prototype,`values`,void 0),s([z(he)],ci.prototype,`count`,void 0);var li=class extends V{getValue(e,t){return t?be([Ae(e,this.stops.first()),this.values.first()],[fe(e,this.stops.get(this.count.subtract(1))),this.values.get(this.count.subtract(1))],[!0,()=>{let t=this.stops.findIndex(t=>O(t,e)),n=this.stops.get(t),r=t.subtract(1),i=this.stops.get(r),a=e.subtract(i).divide(n.subtract(i));return L(this.values.get(r),this.values.get(t),a)}]):this.constant}};function ui(e,t,n){return e.add(t.multiply(new G(2)).multiply(n))}function di(e,t,n,r){return e.dvsMat3.multiply(new N(t,1)).add(e.displayViewMat3.multiply(new N(n.multiply(r),0))).xy}function fi(e,t,n){let r=L(new G(0),Qe(t.multiply(new G(-1))),n);return Qe(t.multiply(e).multiply(new G(-1))).subtract(r).divide(new G(1).subtract(r))}function pi(e,t,n,r){let i=Xe(new G(.5).subtract(r.divide(n)),new G(0),new G(.5)),a=E(O(t,i),new G(1).subtract(t.subtract(i).divide(new G(.5).subtract(i))),new G(1));return e.multiply(a)}function mi(e,t){return new W(e.rgb.multiply(t),t)}function hi(e,t){return we(e.multiply(3.634).add(t.multiply(5.153)).add(7.381),new G(1))}s([z(G)],li.prototype,`constant`,void 0),s([z(M.ofType(G,8))],li.prototype,`stops`,void 0),s([z(M.ofType(G,8))],li.prototype,`values`,void 0),s([z(he)],li.prototype,`count`,void 0);var gi=class extends Le{};s([F(0,H)],gi.prototype,`position`,void 0),s([F(1,H)],gi.prototype,`texcoord`,void 0);var _i=class extends He{},vi=class extends We{constructor(){super(...arguments),this.type=`FlowImageryShader`,this.vvColor=null,this.vvOpacity=null}vertex(e){let t=this.state.dvsMat3.multiply(new N(e.position,1)).xy;return{glPosition:new W(t,0,1),texcoord:e.texcoord}}fragment(e){let t=K(this.texture,e.texcoord),n=this.config.min.add(t.r.multiply(this.config.max.subtract(this.config.min))),r=this.color.getValue(n,this.vvColor),i=r.a.multiply(this.opacity.getValue(t.r,this.vvOpacity)).multiply(t.a),a=new Ve;return a.fragColor=mi(r,i),a}};s([P],vi.prototype,`vvColor`,void 0),s([P],vi.prototype,`vvOpacity`,void 0),s([z(ai)],vi.prototype,`state`,void 0),s([z(si)],vi.prototype,`config`,void 0),s([U(k)],vi.prototype,`texture`,void 0),s([z(ci)],vi.prototype,`color`,void 0),s([z(li)],vi.prototype,`opacity`,void 0),s([o(0,I(gi))],vi.prototype,`vertex`,null),s([o(0,I(_i))],vi.prototype,`fragment`,null);var yi=class extends Le{};s([F(0,W)],yi.prototype,`xyts0`,void 0),s([F(1,W)],yi.prototype,`xyts1`,void 0),s([F(2,W)],yi.prototype,`typeIdFirstTimeLastTime`,void 0),s([F(3,W)],yi.prototype,`extrudeInfo`,void 0);var bi=class extends He{},xi=class extends We{constructor(){super(...arguments),this.type=`FlowParticlesShader`,this.vvColor=null,this.vvOpacity=null,this.vvSize=null}vertex(e){let t=e.typeIdFirstTimeLastTime.z,n=e.typeIdFirstTimeLastTime.w.subtract(t),r=e.xyts0.xy,i=e.xyts0.z.subtract(t),a=e.xyts0.w,o=e.xyts1.xy,s=e.xyts1.z.subtract(t),c=e.xyts1.w,l=e.typeIdFirstTimeLastTime.x,u=e.typeIdFirstTimeLastTime.y,d=new G(2),f=new G(1),p=new G(2),m=new G(3),h=e.extrudeInfo.xy,g=e.extrudeInfo.zw,_=n.add(this.config.trailLength),v=we(this.state.time.multiply(this.config.flowSpeed),_),y=v.subtract(i).divide(s.subtract(i)),b=Xe(y,new G(0),new G(1)),x=L(i,s,b),S=L(a,c,b),C=L(h,g,b),w=Te(o.subtract(r)).multiply(new G(.5)),ee=A(l,d),te=De(A(u,f),A(u,p)),ne=E(ee,De(Ge(y,new G(0)),j(O(y,new G(1)),ke(s,n))),Ge(y,new G(0))),re=E(ee,be([A(u,f),C],[A(u,p),C.multiply(new G(-1))],[A(u,m),C.add(w)],[!0,C.multiply(new G(-1)).add(w)]),be([A(u,f),h],[A(u,p),h.multiply(new G(-1))],[A(u,m),C],[!0,C.multiply(new G(-1))])),ie=E(ee,be([A(u,f),new H(.5,0)],[A(u,p),new H(.5,1)],[A(u,m),new H(1,0)],[!0,new H(1,1)]),be([A(u,f),new H(.5,0)],[A(u,p),new H(.5,1)],[A(u,m),new H(.5,0)],[!0,new H(.5,1)])),ae=E(ee,x,E(te,i,x)),oe=E(ee,S,E(te,a,S)),se=E(ee,fi(v.subtract(x).divide(this.config.trailLength),this.config.decayRate,this.config.fadeToZero),E(te,fi(v.subtract(i).divide(this.config.trailLength),this.config.decayRate,this.config.fadeToZero),fi(v.subtract(x).divide(this.config.trailLength),this.config.decayRate,this.config.fadeToZero))),ce=new G(1).subtract(Qe(ae.multiply(new G(-1)))),le=ui(this.size.getValue(oe,this.vvSize),this.config.featheringSize,this.config.featheringOffset),ue=this.color.getValue(oe,this.vvColor),T=ue.a.multiply(this.opacity.getValue(oe,this.vvOpacity)).multiply(se).multiply(L(new G(1),ce,this.config.introFade)).multiply(this.state.displayOpacity),D=E(ee,L(r,o,b),E(te,r,L(r,o,b))),de=di(this.state,D,re,le);return{glPosition:E(ne,new W(0,0,-2,1),new W(de,0,1)),color:mi(ue,T),texcoord:ie,size:le}}fragment(e){let t=new Ve;return t.fragColor=pi(e.color,Je(e.texcoord.subtract(new H(.5))),e.size,this.config.featheringSize),t}};s([P],xi.prototype,`vvColor`,void 0),s([P],xi.prototype,`vvOpacity`,void 0),s([P],xi.prototype,`vvSize`,void 0),s([z(ai)],xi.prototype,`state`,void 0),s([z(oi)],xi.prototype,`config`,void 0),s([z(ci)],xi.prototype,`color`,void 0),s([z(li)],xi.prototype,`opacity`,void 0),s([z(li)],xi.prototype,`size`,void 0),s([o(0,I(yi))],xi.prototype,`vertex`,null),s([o(0,I(bi))],xi.prototype,`fragment`,null);var Si=class extends Le{};s([F(0,N)],Si.prototype,`positionAndSide`,void 0),s([F(1,N)],Si.prototype,`timeInfo`,void 0),s([F(2,H)],Si.prototype,`extrude`,void 0),s([F(3,G)],Si.prototype,`speed`,void 0);var Ci=class extends He{},wi=class extends We{constructor(){super(...arguments),this.type=`FlowStreamlinesShader`,this.vvColor=null,this.vvOpacity=null,this.vvSize=null}vertex(e){let t=e.positionAndSide.xy,n=this.color.getValue(e.speed,this.vvColor),r=this.opacity.getValue(e.speed,this.vvOpacity),i=ui(this.size.getValue(e.speed,this.vvSize),this.config.featheringSize,this.config.featheringOffset),a=di(this.state,t,e.extrude,i),o=n.a.multiply(r);return{glPosition:new W(a,0,1),side:e.positionAndSide.z,timeInfo:e.timeInfo,color:mi(n,o),size:i}}fragment(e){let t=e.timeInfo.z.subtract(e.timeInfo.y).add(this.config.trailLength),n=hi(e.timeInfo.y,e.timeInfo.z),r=we(n.multiply(t).add(this.state.time.multiply(this.config.flowSpeed)),t).add(e.timeInfo.y).subtract(e.timeInfo.x).divide(this.config.trailLength),i=e.color.multiply(this.state.displayOpacity).multiply(E(Ge(r,new G(0)),new G(0),fi(r,this.config.decayRate,this.config.fadeToZero))),a=new Ve;return a.fragColor=pi(i,_e(e.side).divide(new G(2)),e.size,this.config.featheringSize),a}};s([P],wi.prototype,`vvColor`,void 0),s([P],wi.prototype,`vvOpacity`,void 0),s([P],wi.prototype,`vvSize`,void 0),s([z(ai)],wi.prototype,`state`,void 0),s([z(oi)],wi.prototype,`config`,void 0),s([z(ci)],wi.prototype,`color`,void 0),s([z(li)],wi.prototype,`opacity`,void 0),s([z(li)],wi.prototype,`size`,void 0),s([o(0,I(Si))],wi.prototype,`vertex`,null),s([o(0,I(Ci))],wi.prototype,`fragment`,null);var Ti=class extends Ee{constructor(){super(...arguments),this.type=14,this.drawPhase=1,this.shaders={imagery:new vi,particles:new xi,streamlines:new wi}}render(e,t){let{painter:n}=e;n.setPipelineState({depth:!1,color:{write:[!0,!0,!0,!0],blendMode:`composite`},stencil:{write:!1,test:{compare:514,op:{fail:7680,zFail:7680,zPass:7680},mask:255}}}),this._renderResource(e,t.item.resources,this._createVisualState(e,t))}_renderResource(e,t,n){switch(t.kind){case`stack`:this._renderStackResources(e,t,n);return;case`imagery`:this._renderImageryResources(e,t,n);return;case`particles`:this._renderParticlesResources(e,t,n);return;case`streamlines`:this._renderStreamlinesResources(e,t,n);return}}_createVisualState(e,t){let{item:n,dvsMat3:r}=t,i=e.time/1e3;return{time:e.animationsEnabled?i:ri,dvsMat3:r,displayViewMat3:e.state.displayViewMat3,displayOpacity:e.animationsEnabled?Ir(n.displayOpacity,i):Lr(n.displayOpacity),startTime:n.startTime,endTime:n.endTime}}_renderStackResources(e,t,n){for(let r of t.resources)this._renderResource(e,r,n)}_renderImageryResources({context:e,painter:t},n,r){let i=n.getProgramSpec(r);t.submitDrawMeshUntyped(e,{shader:this.shaders.imagery,uniforms:i.uniforms,textures:i.textures,defines:i.defines,optionalAttributes:i.optionalAttributes,useComputeBuffer:!1},n.mesh,{stencilRef:0})}_renderParticlesResources({context:e,painter:t},n,r){let i=n.getProgramSpec(r);t.submitDrawMeshUntyped(e,{shader:this.shaders.particles,uniforms:i.uniforms,textures:i.textures,defines:i.defines,optionalAttributes:i.optionalAttributes,useComputeBuffer:!1},n.mesh,{stencilRef:0})}_renderStreamlinesResources({context:e,painter:t},n,r){let i=n.getProgramSpec(r);t.submitDrawMeshUntyped(e,{shader:this.shaders.streamlines,uniforms:i.uniforms,textures:i.textures,defines:i.defines,optionalAttributes:i.optionalAttributes,useComputeBuffer:!1},n.mesh,{stencilRef:0})}},Ei=class{constructor(e,t,n,r){this.dataType=e,this.samplingMode=t,this.pixelFormat=n,this.internalFormat=r}};function Di(e,t){let{textureFloatLinear:n,colorBufferFloat:i}=e.capabilities,a=i?.textureFloat,o=i?.textureHalfFloat,s=i?.floatBlend,c=e.driverTest.floatBufferBlend.result;if(!a&&!o)throw new r(`heatmap:missing-color-buffer-float`,`HeatmapRenderer requires the WebGL extension EXT_color_buffer_float or EXT_color_buffer_half_float or WEBGL_color_buffer_float.`);if(!(s&&c||o))throw new r(`heatmap:missing-float-blend`,`HeatmapRenderer requires the WebGL extension EXT_float_blend or EXT_color_buffer_half_float.`+(c?``:` This device claims support for EXT_float_blend, but does not actually support it.`));let l=a&&s&&c,u=o,d=n,f=!!i?.R32F,p=!!i?.R16F;if(l&&d)return d||t.warnOnce(`Missing WebGL extension OES_texture_float_linear. Heatmap quality may be reduced.`),new Ei(te.FLOAT,d?9729:9728,f?6403:6408,f?ee.R32F:6408);if(u)return new Ei(te.HALF_FLOAT,9729,p?6403:6408,p?ee.R16F:6408);throw new r(`heatmap:missing-hardware-support`,`HeatmapRenderer requires WebGL extensions that allow it to render and blend to float or half float textures.`)}new Ei(te.HALF_FLOAT,9728,6408,6408);var Oi=()=>n.getLogger(`esri.views.2d.engine.webgl.shaderGraph.techniques.heatmap.HeatmapResources`),ki=class{destroy(){this._accumulateFramebuffer=i(this._accumulateFramebuffer),this._resolveGradientTexture=i(this._resolveGradientTexture),this._prevGradientHash=null,this._qualityProfile=null}get initialized(){return this._accumulateFramebuffer!=null&&this._resolveGradientTexture!=null}get accumulateFramebuffer(){return this._accumulateFramebuffer}get resolveGradientTexture(){return this._resolveGradientTexture}loadQualityProfile(e){if(this._qualityProfile==null){let t=Di(e,Oi());this._qualityProfile={...t,defines:{usesHalfFloatPrecision:t.dataType!==te.FLOAT}}}return this._qualityProfile}ensureAccumulateFBO(e,t,n){if(this._accumulateFramebuffer==null){let{dataType:r,samplingMode:i,pixelFormat:a,internalFormat:o}=this.loadQualityProfile(e),s=new re(t,n);s.pixelFormat=a,s.internalFormat=o,s.dataType=r,s.samplingMode=i,s.wrapMode=33071;let c=new ae(C.DEPTH24_STENCIL8,t,n);this._accumulateFramebuffer=new se(e,s,c)}else{let{width:e,height:r}=this._accumulateFramebuffer;e===t&&r===n||this._accumulateFramebuffer.resize(t,n)}return this._accumulateFramebuffer}ensureResolveGradientTexture(e,t,n){if(this._resolveGradientTexture==null){let t=new re;t.wrapMode=33071,this._resolveGradientTexture=new ie(e,t),this._prevGradientHash=null}return this._prevGradientHash!==t&&(this._resolveGradientTexture.resize(n.length/4,1),this._resolveGradientTexture.setData(n),this._prevGradientHash=t),this._resolveGradientTexture}};function Ai(e){return e?.25:1}var ji=class extends At{};s([F(5,H)],ji.prototype,`offset`,void 0);var Mi=class extends Mt{},Ni=class extends V{};s([z(G)],Ni.prototype,`radius`,void 0),s([z(G)],Ni.prototype,`isFieldActive`,void 0);var Pi=class extends Y{constructor(){super(...arguments),this.type=`HeatmapAccumulateShader`,this.usesHalfFloatPrecision=!1}vertex(e){let{radius:t,isFieldActive:n}=this.kernelControls,r=e.offset,i=n.multiply(this.getVVData(e.id).x).add(new G(1).subtract(n)),a=this.view.displayViewScreenMat3.multiply(new N(e.pos,1)).add(this.view.displayViewMat3.multiply(new N(r,0)).multiply(t)),o=this.clip(e.id);return{glPosition:new W(a.xy,o,1),offset:r,fieldValue:i,color:new W(0),...this.maybeRunHittest(e,{},null)}}fragment(e){let{offset:t,fieldValue:n}=e,r=Je(t),i=R(r,new G(1)),a=new G(1).subtract(r.multiply(r)),o=a.multiply(a),s=i.multiply(o).multiply(n).multiply(new G(Ai(this.usesHalfFloatPrecision)));return this.getFragmentOutput(new W(s),e)}hittest(e){let{viewMat3:t,tileMat3:n}=this.view,r=cn(t.multiply(n).multiply(new N(e.pos,1)).xy,this.kernelControls.radius,this.hittestRequest.position);return E(O(r,this.hittestRequest.distance),new G(0),new G(2))}};s([P],Pi.prototype,`usesHalfFloatPrecision`,void 0),s([z(Ni)],Pi.prototype,`kernelControls`,void 0),s([o(0,I(ji))],Pi.prototype,`vertex`,null),s([o(0,I(Mi))],Pi.prototype,`fragment`,null);var Fi=class extends Le{};s([F(0,H)],Fi.prototype,`position`,void 0);var Ii=class extends He{},Li=class extends V{};s([z(H)],Li.prototype,`minAndInvRange`,void 0),s([z(G)],Li.prototype,`normalization`,void 0);var Ri=class extends We{constructor(){super(...arguments),this.type=`HeatmapResolveShader`,this.usesHalfFloatPrecision=!1}vertex(e){return{glPosition:new W(e.position.multiply(2).subtract(1),1,1),uv:e.position}}fragment(e){let{accumulatedDensity:t}=this,n=K(this.densityTexture,e.uv).r.divide(new G(Ai(this.usesHalfFloatPrecision)));n=n.multiply(t.normalization),n=n.subtract(t.minAndInvRange.x).multiply(t.minAndInvRange.y);let r=K(this.gradientTexture,new H(n,.5)),i=new Ve;return i.fragColor=new W(r.rgb.multiply(r.a),r.a),i}};s([P],Ri.prototype,`usesHalfFloatPrecision`,void 0),s([z(Li)],Ri.prototype,`accumulatedDensity`,void 0),s([U(k)],Ri.prototype,`densityTexture`,void 0),s([U(k)],Ri.prototype,`gradientTexture`,void 0),s([o(0,I(Fi))],Ri.prototype,`vertex`,null),s([o(0,I(Ii))],Ri.prototype,`fragment`,null);var zi=class extends Q{constructor(){super(...arguments),this.type=19,this.drawPhase=73,this.shaders={accumulate:new Pi,resolve:new Ri},this._isBound=!1,this._resources=new Map}shutdown(e){super.shutdown(e),this._resources.get(e)?.destroy(),this._resources.delete(e),this._prevFBO=null,this._unbind()}render(e,t){let{context:n,painter:r,state:i}=e,a=t.instance.getInput(),{isFieldActive:o}=a.uniforms,s=this._getOrCreateResourcesRecord(n),c=s.loadQualityProfile(n);y(e)||this._bind(e,s,a),r.setShader({shader:this.shaders.accumulate,uniforms:{...p(e,t.target),kernelControls:{radius:Gi(a,i),isFieldActive:+!!o}},textures:h(e),defines:{...v(e),...c.defines},optionalAttributes:{},useComputeBuffer:y(e)});let l=y(e)?Ui:Hi;r.setPipelineState(l),r.submitDraw(e,t)}getStencilReference(e){return Vi(e)}renderResolvePass(e,t){if(y(e))return;let{context:n,painter:r}=e,i=this._resources.get(n);if(this._prevFBO==null||this._prevViewport==null||!i?.initialized)return;let{defines:a}=i.loadQualityProfile(n),{minDensity:o,maxDensity:s,radius:c}=t.getInput().uniforms,l=i.accumulateFramebuffer,u=i.resolveGradientTexture,d={shader:this.shaders.resolve,uniforms:{accumulatedDensity:{minAndInvRange:[o,1/(s-o)],normalization:3/(c*c*Math.PI)}},textures:{densityTexture:{unit:8,texture:l.colorTexture},gradientTexture:{unit:9,texture:u}},defines:a,optionalAttributes:{},useComputeBuffer:!1};n.bindFramebuffer(this._prevFBO),n.setViewport(0,0,this._prevViewport.width,this._prevViewport.height),n.bindTexture(l.colorTexture,8),n.bindTexture(u,9),r.setPipelineState(Wi),r.submitDrawMesh(n,d,r.quadMesh),this._unbind()}_getOrCreateResourcesRecord(e){let t=this._resources.get(e);return t??(t=new ki,this._resources.set(e,t)),t}_unbind(){this._prevFBO=null,this._prevViewport=null,this._isBound=!1}_bind(e,t,n){let{context:r,state:i,pixelRatio:a}=e,o=r.boundFramebuffer;if(this._isBound||o==null)return;let s=r.getViewport();this._prevFBO=o,this._prevViewport=s;let{gradient:c,gradientHash:l}=n.uniforms;t.ensureResolveGradientTexture(r,l,c);let{width:u,height:d}=s,f=Bi(Gi(n,i),a),p=u*f,m=d*f,h=t.ensureAccumulateFBO(r,p,m);r.blitFramebuffer(o,h,1024),r.bindFramebuffer(h),r.setViewport(0,0,h.width,h.height),r.setColorMask(!0,!0,!0,!0),r.setClearColor(0,0,0,0),r.clear(16384),this._isBound=!0}};function Bi(e,t){let n=t>1.5?.25:.5;return e<1/(2*n)?1:n}function Vi(e){return e.key.level+1}var Hi={color:{write:[!0,!0,!0,!0],blendMode:`additive`},depth:!1,stencil:{write:!1,test:{compare:518,mask:255,op:{fail:7680,zFail:7680,zPass:7681}}}},Ui={...Hi,stencil:!1},Wi={color:{write:[!0,!0,!0,!0],blendMode:`composite`},depth:!1,stencil:!1};function Gi(e,t){let{referenceScale:n,radius:r}=e.uniforms;return r*(n===0?1:n/t.scale)}var Ki=1/S,qi=class extends At{};s([F(3,W)],qi.prototype,`color`,void 0),s([F(4,H)],qi.prototype,`offset`,void 0),s([F(5,H)],qi.prototype,`textureUV`,void 0),s([F(6,W)],qi.prototype,`fontAndReferenceSize`,void 0),s([F(7,W)],qi.prototype,`outlineColor`,void 0),s([F(8,W)],qi.prototype,`haloColor`,void 0),s([F(9,H)],qi.prototype,`outlineAndHaloSize`,void 0),s([F(10,H)],qi.prototype,`zoomRange`,void 0),s([F(11,G)],qi.prototype,`clipAngle`,void 0),s([F(12,W)],qi.prototype,`referenceSymbol`,void 0),s([F(15,G)],qi.prototype,`visibility`,void 0);var Ji=class extends Pe{};s([F(13,H)],Ji.prototype,`offsetNextVertex1`,void 0),s([F(14,H)],Ji.prototype,`offsetNextVertex2`,void 0);var Yi=class extends Mt{},$=class extends Y{constructor(){super(...arguments),this.type=`TextShader`,this.computeAttributes={offset:[`offsetNextVertex1`,`offsetNextVertex2`]},this.textRenderPassType=0,this.isBackgroundPass=!1,this.isLabel=!1}clipLabel(e,t){let{clipAngle:n,zoomRange:r,visibility:i}=e,a=n.multiply(Ki),o=we(a.subtract(this.view.rotation),new G(360)),s=new G(0),c=Ze(this.view.currentZoom.multiply(10)).divide(10),l=r.x,u=r.y,d=new G(1).subtract(R(l,c)).multiply(2),f=new G(j(fe(o,new G(90)),Ge(o,new G(270)))).multiply(2),p=new G(2).multiply(new G(1).subtract(R(c,u)));return s=s.add(t.multiply(d)),s=s.add(t.multiply(f)),s=s.add(p),i&&(s=s.add(i)),s}vertex(e,t){let n=q(e.bitset,0),r=new G(1).subtract(n),i=e.fontAndReferenceSize[0],a=e.fontAndReferenceSize[1],o=e.fontAndReferenceSize[2],s=e.fontAndReferenceSize[3],c=i.divide(o),l=this.textRenderPassType===1?e.outlineColor:this.textRenderPassType===2?e.haloColor:this._getVertexColor(e),u=this.view.displayViewScreenMat3.multiply(new N(e.pos,1)),d=e.offset,f=new G(1),p=T.identity(),m=new H(0);if(this.isLabel){if(!e.referenceSymbol)throw Error(`InternalError: Optional attribute 'referenceSymbol' expected for labels`);let t=e.referenceSymbol,n=t.xy,r=t.z,i=this._unpackDirection(t.w),a=Ut(this,e.id,r).divide(2),o=i.multiply(a.add(4));m=n.add(o),d=d.add(m)}else f=Ut(this,e.id,a).divide(a),i=i.multiply(f),c=c.multiply(f),d=d.multiply(f),p=Kt(this,e.id),d=p.multiply(new N(d,0)).xy;let h=q(e.bitset,3),g=this._getViewRotationMatrix(h).multiply(new N(d,0)).multiply(this.view.scaleFactor),_=this.isLabel?this.clipLabel(e,h):this.clip(e.id,e.zoomRange);_=this.isBackgroundPass?_.add(r.multiply(2)):_.add(n.multiply(2));let v=new G(0);if(this.textRenderPassType===1&&(_=_.add(E(A(e.outlineAndHaloSize.x,new G(0)),new G(2),new G(0))),v=new G(e.outlineAndHaloSize.x).divide(c).divide(s)),this.textRenderPassType===2){let t=e.outlineAndHaloSize.x,n=new G(e.outlineAndHaloSize.y);_=_.add(E(A(n,new G(0)),new G(2),new G(0))),v=n.add(t).divide(c).divide(s)}let y=this.isLabel?O(_,new G(1)):new Re(!1);return{glPosition:new W(u.xy.add(g.xy),_,1),color:l,size:c,textureUV:e.textureUV.divide(this.mosaicInfo.size),antialiasingWidth:new G(.105).multiply(o).divide(i).divide(this.view.pixelRatio),outlineDistanceOffset:v,...this.maybeRunHittest(e,t,{vvSizeAdjustment:f,vvRotation:p,labelOffset:m,labelClipped:y,scaleFactor:this.view.scaleFactor})}}_getViewRotationMatrix(e){let t=this.view.displayViewMat3,n=this.view.displayMat3,r=new G(1).subtract(e);return t.multiply(e).add(n.multiply(r))}_getHittestAlignmentMatrix(e){let t=this.view.viewMat3.multiply(this.view.tileMat3),n=this.view.tileMat3,r=new G(1).subtract(e);return t.multiply(e).add(n.multiply(r))}fragment(e){let t=new G(2/8),n=new G(1).subtract(t),r=K(this.mosaicTexture,e.textureUV).a,i=n.subtract(e.outlineDistanceOffset);this.highlight&&(i=i.divide(2));let a=e.antialiasingWidth,o=qe(i.subtract(a),i.add(a),r);return this.getFragmentOutput(e.color.multiply(o),e)}computeHittestTriangle(e,t,{vvSizeAdjustment:n,vvRotation:r,labelOffset:i,scaleFactor:a}){let o,s,c;this.isLabel?(o=new N(e.offset.multiply(a).add(i),0),s=new N(t.offsetNextVertex1.multiply(a).add(i),0),c=new N(t.offsetNextVertex2.multiply(a).add(i),0)):(o=r.multiply(new N(e.offset.multiply(a).multiply(n),0)),s=r.multiply(new N(t.offsetNextVertex1.multiply(a).multiply(n),0)),c=r.multiply(new N(t.offsetNextVertex2.multiply(a).multiply(n),0)));let{viewMat3:l,tileMat3:u}=this.view,d=l.multiply(u).multiply(new N(e.pos,1)),f=q(e.bitset,3),p=this._getHittestAlignmentMatrix(f);return{pos0:d.add(p.multiply(o)).xy,pos1:d.add(p.multiply(s)).xy,pos2:d.add(p.multiply(c)).xy}}hittest(e,t,n){let{vvSizeAdjustment:r,vvRotation:i,labelOffset:a,labelClipped:o,scaleFactor:s}=n,c=mn(this.hittestRequest),{pos0:l,pos1:u,pos2:d}=this.computeHittestTriangle(e,t,{vvSizeAdjustment:r,vvRotation:i,labelOffset:a,scaleFactor:s});return E(c,()=>{let{tlbr:e}=this.hittestRequest;return this.isLabel?E(o,new G(0),pn(l,u,d,e)):pn(l,u,d,e)},()=>{let e=on(this.hittestRequest.position,l,u,d),t=this.isLabel?o:new Re(!1);return E(t,new G(0),E(O(e,this.hittestRequest.distance),new G(0),new G(2)))})}_unpackDirection(e){let t=new he(e),n=je(t,new he(2)),r=pe(t,new he(3));return new H(new G(n).subtract(1),new G(r).subtract(1))}_getVertexColor(e){let t=e.color;if(this.visualVariableColor){let n=this.getColorValue(e.id);t=this.visualVariableColor.getColor(n,e.color,new Re(!1))}if(this.visualVariableOpacity){let n=this.getOpacityValue(e.id),r=this.visualVariableOpacity.getOpacity(n);t=t.multiply(r)}return t}};s([B(Ft)],$.prototype,`visualVariableColor`,void 0),s([B(It)],$.prototype,`visualVariableOpacity`,void 0),s([B(Lt)],$.prototype,`visualVariableRotation`,void 0),s([B(Rt)],$.prototype,`visualVariableSizeMinMaxValue`,void 0),s([B(zt)],$.prototype,`visualVariableSizeScaleStops`,void 0),s([B(Bt)],$.prototype,`visualVariableSizeStops`,void 0),s([B(Vt)],$.prototype,`visualVariableSizeUnitValue`,void 0),s([z(Pt)],$.prototype,`mosaicInfo`,void 0),s([U(k)],$.prototype,`mosaicTexture`,void 0),s([P],$.prototype,`textRenderPassType`,void 0),s([P],$.prototype,`isBackgroundPass`,void 0),s([P],$.prototype,`isLabel`,void 0),s([o(0,I(qi)),o(1,I(Ji))],$.prototype,`vertex`,null),s([o(0,I(Yi))],$.prototype,`fragment`,null);var Xi=class extends Q{constructor(){super(...arguments),this.type=20,this.shaders={geometry:new $},this.drawPhase=14,this.symbologyPlane=3}render(e,t){let{painter:n}=e,r=v(e),i={...b(e),stencil:{write:!1,test:{compare:516,mask:255,op:{fail:7680,zFail:7680,zPass:7680}}}},a=t.instance.getInput(),o={shader:this.shaders.geometry,uniforms:{...m(e,t.target,a.uniforms),...p(e,t.target),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...r,textRenderPassType:0,isBackgroundPass:!0,isLabel:!0},optionalAttributes:a.optionalAttributes,useComputeBuffer:y(e)};n.setPipelineState(i),n.setShader(o),n.submitDraw(e,t,{stencilRef:255}),n.setShader({...o,defines:{...r,textRenderPassType:2,isBackgroundPass:!1,isLabel:!0}}),n.submitDraw(e,t,{stencilRef:255}),n.setShader({...o,defines:{...r,textRenderPassType:0,isBackgroundPass:!1,isLabel:!0}}),n.submitDraw(e,t,{stencilRef:255})}};function Zi(e){return R(new G(0),e).multiply(2).subtract(1)}var Qi=class extends wn{};s([F(9,G)],Qi.prototype,`accumulatedDistance`,void 0),s([F(10,G)],Qi.prototype,`totalLength`,void 0),s([F(11,G)],Qi.prototype,`gradientSize`,void 0),s([F(12,H)],Qi.prototype,`segmentDirection`,void 0),s([F(13,W)],Qi.prototype,`tlbr`,void 0);var $i=class extends V{};s([z(G)],$i.prototype,`isColorPass`,void 0);var ea=class extends Mn{constructor(){super(...arguments),this.type=`GradientStrokeShader`}vertex(e,t){let{totalLength:n,gradientSize:r,segmentDirection:i,tlbr:a}=e,o=An(this,e),s=q(e.bitset,rt.isAlongLine),c=n.divide(this.view.displayZoomFactor),l=E(dt(e.bitset,rt.isAbsoluteSize),()=>{let e=E(O(s,new G(.5)),c,o.halfWidth);return r.divide(e)},r),u=e.accumulatedDistance.add(Ye(i,o.scaledOffset).divide(c)),d=a.divide(this.mosaicInfo.size.xyxy);return{...o,tlbr:d,relativePositionAlongLine:u,relativeGradientSize:l,isAlongLine:q(e.bitset,rt.isAlongLine),isDiscrete:q(e.bitset,rt.isDiscrete),...this.maybeRunHittest(e,t,o.halfWidth)}}fragment(e){let{isAlongLine:n,isDiscrete:r,relativePositionAlongLine:i,relativeGradientSize:a,normal:o,tlbr:s}=e,c=On(e,this.antialiasingControls.blur),l=Zi(o.y).multiply(Be(Je(o),new G(1))),u=new G(.5).multiply(l).add(new G(.5)),d=E(O(n,new G(.5)),i,u),f=E(O(r,new G(.5)),a.subtract(1),new G(0)),p=d.add(f).divide(a);p=E(O(n,new G(.5)),p,ut(p));let m=L(s.xy,s.zw,new H(Xe(p,new G(0),new G(1)),.5)),h=K(this.mosaicTexture,m),g=e.opacity.multiply(c),_=this.getFragmentOutput(h.multiply(g),e),v=R(new G(.5),this.technique.isColorPass).multiply(t(`gradient-depth-epsilon`)),y=R(new G(0),o.y).multiply(new G(t(`gradient-depth-bias`)).subtract(v));return _.glFragDepth=Xe(Je(o).add(y),new G(0),new G(1)),_}};s([z(Pt)],ea.prototype,`mosaicInfo`,void 0),s([U(k)],ea.prototype,`mosaicTexture`,void 0),s([z($i)],ea.prototype,`technique`,void 0),s([o(0,I(Qi)),o(1,I(jt))],ea.prototype,`vertex`,null);var ta=class extends Q{constructor(){super(...arguments),this.type=17,this.shaders={geometry:new ea},this.symbologyPlane=1}_getShaderOptions(e,t,n){let{painter:r,pixelRatio:i}=e,a=t.instance.getInput();return{shader:this.shaders.geometry,uniforms:{...m(e,t.target,a.uniforms),...p(e,t.target),antialiasingControls:Vn(i),mosaicInfo:r.textureManager.getMosaicInfo(e,t.textureKey),technique:{isColorPass:n}},textures:{...h(e),mosaicTexture:r.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:a.optionalAttributes,useComputeBuffer:y(e)}}render(e,t){let{painter:n}=e;if(y(e)||_(e)){let r=b(e);n.setPipelineState(r),n.setShader(this._getShaderOptions(e,t,1)),n.submitDraw(e,t)}else e.context.setClearDepth(1),e.context.clear(256),n.setShader(this._getShaderOptions(e,t,0)),n.setPipelineState({color:!1,depth:{write:{zNear:0,zFar:1},test:513},stencil:{write:!1,test:{compare:514,mask:255,op:{fail:7680,zFail:7680,zPass:7680}}}}),n.submitDraw(e,t),n.setShader(this._getShaderOptions(e,t,1)),n.setPipelineState({color:{write:[!0,!0,!0,!0],blendMode:`composite`},depth:{write:!1,test:515},stencil:{write:!1,test:{compare:514,mask:255,op:{fail:7680,zFail:7680,zPass:7680}}}}),n.submitDraw(e,t)}},na=class extends Q{constructor(){super(...arguments),this.type=21,this.shaders={geometry:new Mn},this.symbologyPlane=1}render(e,t){let{painter:n,pixelRatio:r}=e,i=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,i.uniforms),...p(e,t.target),antialiasingControls:Vn(r)},textures:h(e),defines:{...v(e)},optionalAttributes:i.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},ra=class extends wn{};s([F(9,G)],ra.prototype,`accumulatedDistance`,void 0),s([F(10,H)],ra.prototype,`segmentDirection`,void 0),s([F(11,G)],ra.prototype,`offsetAlongLine`,void 0),s([F(12,G)],ra.prototype,`capType`,void 0),s([F(13,W)],ra.prototype,`tlbr`,void 0);var ia=class extends Mn{constructor(){super(...arguments),this.type=`TexturedLineShader`}_getDistanceRatio(e,t){let n=q(e.bitset,2);return n.multiply(Oe(t,new G(.25)).multiply(new G(2))).add(new G(1).subtract(n).multiply(u(1)))}_getSDFAlpha(e){let{halfWidth:t,normal:n,tlbr:r,patternSize:i,accumulatedDistance:a,offsetAlongLine:o,dashToPx:s,capType:c}=e,l=i.x.divide(4).multiply(s),u=ye(a.add(o).divide(l)),d=L(r.xy,r.zw,new H(u,.5)),f=yt(K(this.mosaicTexture,d)).multiply(2).subtract(1).multiply(64).multiply(s),p=n.y.multiply(t),m=be([A(c,new G(1)),f.subtract(t)],[A(c,new G(2)),Fe(le(Oe(f,new G(0)),new G(2)).add(p.multiply(p))).subtract(t)],[!0,f]),h=Xe(new G(.25).subtract(m),new G(0),new G(1));return new W(h)}_getPatternColor(e){let{halfWidth:t,normal:n,color:r,accumulatedDistance:i,patternSize:a,sampleAlphaOnly:o,tlbr:s}=e,c=a.y.multiply(new G(2).multiply(t).divide(a.x)),l=ye(i.divide(c)),u=new G(.5).multiply(n.y).add(new G(.5)),d=L(s.xy,s.zw,new H(u,l)),f=K(this.mosaicTexture,d);return this.visualVariableColor!=null&&(f=E(O(o,new G(.5)),new W(r.a),r)),f}vertex(e,t){let{segmentDirection:n,tlbr:r,bitset:i}=e,a=An(this,e),o=e.accumulatedDistance.divide(this.view.displayZoomFactor).add(Ye(n,a.scaledOffset)),s=new H(r.z.subtract(r.x),r.w.subtract(r.y)),c=r.divide(this.mosaicInfo.size.xyxy),l=q(i,3),u=q(i,4),d=E(O(l,new G(.5)),this._getDistanceRatio(e,a.scaledHalfWidth),new G(1));return{...a,tlbr:c,patternSize:s,accumulatedDistance:o,isSDF:l,sampleAlphaOnly:u,dashToPx:d,offsetAlongLine:e.offsetAlongLine,capType:e.capType,...this.maybeRunHittest(e,t,a.halfWidth)}}fragment(e){let{color:t,opacity:n,isSDF:r}=e,i=On(e,this.antialiasingControls.blur),a=E(O(r,new G(.5)),this._getSDFAlpha(e),this._getPatternColor(e)),o=t.multiply(n).multiply(i).multiply(a);return this.getFragmentOutput(o,e)}};s([z(Pt)],ia.prototype,`mosaicInfo`,void 0),s([U(k)],ia.prototype,`mosaicTexture`,void 0),s([o(0,I(ra)),o(1,I(jt))],ia.prototype,`vertex`,null);var aa=class extends Q{constructor(){super(...arguments),this.type=33,this.shaders={geometry:new ia},this.symbologyPlane=1}render(e,t){let{painter:n,pixelRatio:r}=e,i=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,i.uniforms),...p(e,t.target),antialiasingControls:Vn(r),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...v(e)},optionalAttributes:i.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},oa=class extends At{};s([F(3,W)],oa.prototype,`color`,void 0),s([F(4,W)],oa.prototype,`outlineColor`,void 0),s([F(5,H)],oa.prototype,`offset`,void 0),s([F(6,H)],oa.prototype,`textureUV`,void 0),s([F(7,W)],oa.prototype,`sizing`,void 0),s([F(8,G)],oa.prototype,`placementAngle`,void 0),s([F(9,G)],oa.prototype,`sdfDecodeCoeff`,void 0),s([F(10,H)],oa.prototype,`zoomRange`,void 0);var sa=class extends Pe{};s([F(11,H)],sa.prototype,`offsetNextVertex1`,void 0),s([F(12,H)],sa.prototype,`offsetNextVertex2`,void 0),s([F(13,H)],sa.prototype,`textureUVNextVertex1`,void 0),s([F(14,H)],sa.prototype,`textureUVNextVertex2`,void 0);var ca=class extends Mt{};function la(e,t,n,r){return t.multiply(e.x).add(n.multiply(e.y)).add(r.multiply(e.z))}function ua(e){return e.multiply(e).divide(128)}var da=class extends Y{constructor(){super(...arguments),this.type=`MarkerShader`,this.computeAttributes={offset:[`offsetNextVertex1`,`offsetNextVertex2`],textureUV:[`textureUVNextVertex1`,`textureUVNextVertex2`]}}vertex(e,t){let n=ua(e.sizing.x),r=ua(e.sizing.y),i=ua(e.sizing.z),a=e.placementAngle,o=q(e.bitset,et.bitset.isSDF),s=q(e.bitset,et.bitset.isMapAligned),c=q(e.bitset,et.bitset.scaleSymbolsProportionally),l=dt(e.bitset,et.bitset.colorLocked),u=Gt(this,e.id),d=Wt(this,e.id,e.color,l).multiply(u),f=this.view.displayViewScreenMat3.multiply(new N(e.pos.xy,1)),p=Ut(this,e.id,i).divide(i),m=n.multiply(p),h=e.offset.xy.multiply(p),g=r.multiply(c.multiply(p.subtract(1)).add(1));g=Be(g,Oe(m.subtract(.99),new G(0)));let _=Oe(g,new G(1)),v=Be(g,new G(1)),y=T.fromRotation(a.multiply(ct)),b=Kt(this,e.id),x=this._getViewRotationMatrix(s).multiply(b).multiply(y).multiply(new N(h.xy,0)).multiply(this.view.scaleFactor),S=this.clip(e.id,e.zoomRange),C=new W(f.xy.add(x.xy),S,1),w=e.textureUV.divide(this.mosaicInfo.size),ee=e.outlineColor.multiply(v),te=q(e.bitset,et.bitset.overrideOutlineColor),ne=e.sdfDecodeCoeff.multiply(m);return{glPosition:C,color:d,textureUV:w,outlineColor:ee,outlineSize:_,distanceToPx:ne,isSDF:o,overrideOutlineColor:te,...this.maybeRunHittest(e,t,{pos:e.pos,size:m,sizeCorrection:p,scaleFactor:this.view.scaleFactor,isMapAligned:s,vvRotationMat3:b,placementMat3:y,outlineSize:_,distanceToPx:ne,isSDF:o})}}fragment(e){let t=this._getColor(e.textureUV,e);return this.getFragmentOutput(t,e)}hittest(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,n),o=mn(this.hittestRequest);return E(o,()=>{let{tlbr:e}=this.hittestRequest;return fn(r,i,a,e)},()=>E(Ge(n.size,this.hittestRequest.smallSymbolSizeThreshold),this._hittestSmallMarker(e,t,n),this._hittestMarker(e,t,n)))}_getViewRotationMatrix(e){let t=this.view.displayViewMat3,n=this.view.displayMat3,r=new G(1).subtract(e);return t.multiply(e).add(n.multiply(r))}_getViewScreenMatrix(e){let t=this.view.viewMat3.multiply(this.view.tileMat3),n=this.view.tileMat3,r=new G(1).subtract(e);return t.multiply(e).add(n.multiply(r))}_getColor(e,t){return E(A(t.isSDF,new G(1)),this._getSDFColor(e,t),this._getSpriteColor(e,t))}_getSpriteColor(e,t){return K(this.mosaicTexture,e).multiply(t.color)}_getSDFColor(e,t){let n=K(this.mosaicTexture,e),r=new G(.5).subtract(yt(n)).multiply(t.distanceToPx).multiply(1),i=Xe(new G(.5).subtract(r),new G(0),new G(1)),a=t.color.multiply(i),o=t.outlineSize;this.highlight&&(o=Oe(o,t.overrideOutlineColor.multiply(4)));let s=o.multiply(.5),c=_e(r).subtract(s),l=Xe(new G(.5).subtract(c),new G(0),new G(1)),u=L(t.outlineColor,t.color,t.overrideOutlineColor).multiply(l);return new G(1).subtract(u.a).multiply(a).add(u)}_hittestSmallMarker(e,t,n){let{position:r,distance:i,smallSymbolDistance:a}=this.hittestRequest,o=i.subtract(a),{viewMat3:s,tileMat3:c}=this.view,l=s.multiply(c).multiply(new N(n.pos,1)).xy,u=n.size.multiply(.5),d=Ce(l,r).subtract(u).add(o);return E(O(d,this.hittestRequest.distance),new G(0),new G(2))}_hittestMarker(e,t,n){let{pos0:r,pos1:i,pos2:a}=this.computeHittestTriangle(e,t,n),o=this.hittestRequest.position,s=this.hittestRequest.distance,c=on(o,r,i,a);return E(O(c,s),new G(0),this._hittestSamples(r,i,a,e,t,n))}computeHittestTriangle(e,t,n){let{pos:r,sizeCorrection:i,scaleFactor:a,isMapAligned:o}=n,s=new N(e.offset.multiply(i).multiply(a),0),c=new N(t.offsetNextVertex1.multiply(i).multiply(a),0),l=new N(t.offsetNextVertex2.multiply(i).multiply(a),0),{viewMat3:u,tileMat3:d}=this.view,f=u.multiply(d).multiply(new N(r,1)),p=this._getViewScreenMatrix(o).multiply(n.vvRotationMat3).multiply(n.placementMat3);return{pos0:f.add(p.multiply(s)).xy,pos1:f.add(p.multiply(c)).xy,pos2:f.add(p.multiply(l)).xy}}_hittestSamples(e,t,n,r,i,a){let{outlineSize:o,isSDF:s,distanceToPx:c}=a,l=this.hittestRequest.position,u=this.hittestRequest.distance,d=Z(l.add(new H(D(u),D(u))),e,t,n),f=Z(l.add(new H(0,D(u))),e,t,n),p=Z(l.add(new H(u,D(u))),e,t,n),m=Z(l.add(new H(D(u),0)),e,t,n),h=Z(l,e,t,n),g=Z(l.add(new H(u,0)),e,t,n),_=Z(l.add(new H(D(u),u)),e,t,n),v=Z(l.add(new H(0,u)),e,t,n),y=Z(l.add(new H(u,u)),e,t,n),b=r.textureUV.divide(this.mosaicInfo.size),x=i.textureUVNextVertex1.divide(this.mosaicInfo.size),S=i.textureUVNextVertex2.divide(this.mosaicInfo.size),C={color:new W(1),outlineColor:new W(1),overrideOutlineColor:new G(1),outlineSize:o,distanceToPx:c,isSDF:s},w=new G(0);return w=w.add(X(d).multiply(this._getColor(la(d,b,x,S),C).a)),w=w.add(X(f).multiply(this._getColor(la(f,b,x,S),C).a)),w=w.add(X(p).multiply(this._getColor(la(p,b,x,S),C).a)),w=w.add(X(m).multiply(this._getColor(la(m,b,x,S),C).a)),w=w.add(X(h).multiply(this._getColor(la(h,b,x,S),C).a)),w=w.add(X(g).multiply(this._getColor(la(g,b,x,S),C).a)),w=w.add(X(_).multiply(this._getColor(la(_,b,x,S),C).a)),w=w.add(X(v).multiply(this._getColor(la(v,b,x,S),C).a)),w=w.add(X(y).multiply(this._getColor(la(y,b,x,S),C).a)),E(O(w,new G(.05)),new G(2),new G(0))}};s([B(Ft)],da.prototype,`visualVariableColor`,void 0),s([B(It)],da.prototype,`visualVariableOpacity`,void 0),s([B(Lt)],da.prototype,`visualVariableRotation`,void 0),s([B(Rt)],da.prototype,`visualVariableSizeMinMaxValue`,void 0),s([B(zt)],da.prototype,`visualVariableSizeScaleStops`,void 0),s([B(Bt)],da.prototype,`visualVariableSizeStops`,void 0),s([B(Vt)],da.prototype,`visualVariableSizeUnitValue`,void 0),s([z(Pt)],da.prototype,`mosaicInfo`,void 0),s([U(k)],da.prototype,`mosaicTexture`,void 0),s([o(0,I(oa)),o(1,I(sa))],da.prototype,`vertex`,null),s([o(0,I(ca))],da.prototype,`fragment`,null);var fa=class extends Q{constructor(){super(...arguments),this.type=23,this.shaders={geometry:new da},this.symbologyPlane=2}render(e,t){let{painter:n}=e,r=t.instance.getInput();n.setShader({shader:this.shaders.geometry,uniforms:{...m(e,t.target,r.uniforms),...p(e,t.target),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey,!0)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey,!0)},defines:{...v(e)},optionalAttributes:r.optionalAttributes,useComputeBuffer:y(e)}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},pa=class{constructor(){this.computeAttributes={}}get locationsMap(){let e=new Map;for(let t in this.locations)e.set(t,this.locations[t].index);return e}get optionPropertyKeys(){if(!this._optionPropertyKeys){let e=new Set(Object.keys(this.options));this._optionPropertyKeys=e}return this._optionPropertyKeys}get _transformFeedbackBindings(){return[]}get locationInfo(){if(!this._locationInfo){let e=this.locationsMap,t=Array.from(e.entries()).map(([e,t])=>`${e}.${t}`).join(`.`);this._locationInfo={stringHash:t,locations:e,computeAttributeMap:this.computeAttributes}}return this._locationInfo}get renamedLocationsMap(){let e=new Map;for(let[t,n]of this.locationsMap.entries())e.set(`a_`+t,n);return e}getShaderKey(e,t,n,r,i){return`${Object.keys(e).map(t=>`${t}.${e[t]}`).join(`.`)}.${Object.keys(r).filter(e=>r[e]).map(e=>`${e}_${r[e].toString()}`).join(`.`)}.${Object.keys(t).filter(e=>this.optionPropertyKeys.has(e)).join(`.`)}.${Object.keys(n).filter(e=>n[e]).join(`.`)}`}getProgram(e,t,n,r){let i=``,a=``;for(let e in n)if(n[e]){let t=typeof n[e]==`boolean`?`#define ${e}\n`:`#define ${e} ${n[e]}\n`;i+=t,a+=t}return i+=this.vertexShader,a+=this.fragmentShader,new Ie(`glslShaderModule`,i,a,this.renamedLocationsMap,this._getUniformBindings(t),this._getTextureBindings(),this._transformFeedbackBindings)}_getUniformBindings(e){let t=[];for(let e in this.required){let n=this.required[e];t.push({uniformHydrated:null,shaderModulePath:e,uniformName:e,uniformType:n.type,uniformArrayElementType:ma(n),uniformArrayLength:ha(n)})}for(let n in e){let r=this.options[n];if(e[n])for(let e in r){let i=r[e];t.push({uniformHydrated:null,shaderModulePath:`${n}.${e}`,uniformName:e,uniformType:i.type,uniformArrayElementType:ma(i),uniformArrayLength:ha(i)})}}return t}_getTextureBindings(){let e=[];for(let t in this.textures)e.push({textureHydrated:null,shaderModulePath:t,textureName:t});return e}},ma=e=>e.type===`array`?e.elementType?.type:void 0,ha=e=>e.type===`array`?e.size:void 0,ga={bitBlit:{"bitBlit.vert":`attribute vec2 a_pos;
attribute vec2 a_tex;
varying mediump vec2 v_uv;
void main(void) {
gl_Position = vec4(a_pos , 0.0, 1.0);
v_uv = a_tex;
}`,"bitBlit.frag":`uniform lowp sampler2D u_tex;
uniform lowp float u_opacity;
varying mediump vec2 v_uv;
void main() {
lowp vec4 color = texture2D(u_tex, v_uv);
gl_FragColor = color * u_opacity;
}`},debug:{overlay:{"overlay.frag":`precision mediump float;
varying vec4 v_color;
void main(void) {
gl_FragColor = v_color;
}`,"overlay.vert":`attribute vec3 a_PositionAndFlags;
uniform mat3 u_dvsMat3;
uniform vec4 u_colors[4];
uniform float u_opacities[4];
varying vec4 v_color;
void main(void) {
vec2 position = a_PositionAndFlags.xy;
float flags = a_PositionAndFlags.z;
int colorIndex = int(mod(flags, 4.0));
vec4 color;
for (int i = 0; i < 4; i++) {
color = u_colors[i];
if (i == colorIndex) {
break;
}
}
int opacityIndex = int(mod(floor(flags / 4.0), 4.0));
float opacity;
for (int i = 0; i < 4; i++) {
opacity = u_opacities[i];
if (i == opacityIndex) {
break;
}
}
v_color = color * opacity;
gl_Position = vec4((u_dvsMat3 * vec3(position, 1.0)).xy, 0.0, 1.0);
}`}},dot:{dot:{"dot.vert":`precision highp float;
attribute vec2 a_pos;
uniform sampler2D u_texture;
uniform highp mat3 u_dvsMat3;
uniform highp float u_tileZoomFactor;
uniform highp float u_dotSize;
uniform highp float u_pixelRatio;
varying vec2 v_pos;
varying vec4 v_color;
varying float v_dotRatio;
varying float v_invEdgeRatio;
const float EPSILON = 0.000001;
void main()
{
mat3 tileToTileTexture = mat3(  1., 0., 0.,
0., -1., 0.,
0., 1., 1.  );
vec3 texCoords = tileToTileTexture * vec3(a_pos.xy / 512., 1.);
v_color = texture2D(u_texture, texCoords.xy);
float smoothEdgeWidth = max(u_dotSize / 2., 1.) ;
float z = 0.;
z += 2.0 * step(v_color.a, EPSILON);
gl_PointSize = (smoothEdgeWidth + u_dotSize);
gl_Position = vec4((u_dvsMat3 * vec3(a_pos + .5, 1.)).xy, z, 1.);
v_dotRatio = u_dotSize / gl_PointSize;
v_invEdgeRatio = -1. / ( smoothEdgeWidth / gl_PointSize );
gl_PointSize  *= (u_pixelRatio * u_tileZoomFactor);
}`,"dot.frag":`precision mediump float;
varying vec4 v_color;
varying float v_dotRatio;
varying float v_invEdgeRatio;
uniform highp float u_tileZoomFactor;
void main()
{
float dist = length(gl_PointCoord - vec2(.5, .5)) * 2.;
float alpha = smoothstep(0., 1., v_invEdgeRatio * (dist - v_dotRatio) + 1.);
gl_FragColor = v_color * alpha;
}`}},filtering:{"bicubic.glsl":`vec4 computeWeights(float v) {
float b = 1.0 / 6.0;
float v2 = v * v;
float v3 = v2 * v;
float w0 = b * (-v3 + 3.0 * v2 - 3.0 * v + 1.0);
float w1 = b * (3.0 * v3  - 6.0 * v2 + 4.0);
float w2 = b * (-3.0 * v3 + 3.0 * v2 + 3.0 * v + 1.0);
float w3 = b * v3;
return vec4(w0, w1, w2, w3);
}
vec4 bicubicOffsetsAndWeights(float v) {
vec4 w = computeWeights(v);
float g0 = w.x + w.y;
float g1 = w.z + w.w;
float h0 = 1.0 - (w.y / g0) + v;
float h1 = 1.0 + (w.w / g1) - v;
return vec4(h0, h1, g0, g1);
}
vec4 sampleBicubicBSpline(sampler2D sampler, vec2 coords, vec2 texSize) {
vec2 eX = vec2(1.0 / texSize.x, 0.0);
vec2 eY = vec2(0.0, 1.0 / texSize.y);
vec2 texel = coords * texSize - 0.5;
vec3 hgX = bicubicOffsetsAndWeights(fract(texel).x).xyz;
vec3 hgY = bicubicOffsetsAndWeights(fract(texel).y).xyz;
vec2 coords10 = coords + hgX.x * eX;
vec2 coords00 = coords - hgX.y * eX;
vec2 coords11 = coords10 + hgY.x * eY;
vec2 coords01 = coords00 + hgY.x * eY;
coords10 = coords10 - hgY.y * eY;
coords00 = coords00 - hgY.y * eY;
vec4 color00 = texture2D(sampler, coords00);
vec4 color10 = texture2D(sampler, coords10);
vec4 color01 = texture2D(sampler, coords01);
vec4 color11 = texture2D(sampler, coords11);
color00 = mix(color00, color01, hgY.z);
color10 = mix(color10, color11, hgY.z);
color00 = mix(color00, color10, hgX.z);
return color00;
}`,"bilinear.glsl":`vec4 sampleBilinear(sampler2D sampler, vec2 coords, vec2 texSize) {
vec2 texelStart = floor(coords * texSize);
vec2 coord0 = texelStart / texSize;
vec2 coord1 = (texelStart +  vec2(1.0, 0.0)) / texSize;
vec2 coord2 = (texelStart +  vec2(0.0, 1.0)) / texSize;
vec2 coord3 = (texelStart +  vec2(1.0, 1.0)) / texSize;
vec4 color0 = texture2D(sampler, coord0);
vec4 color1 = texture2D(sampler, coord1);
vec4 color2 = texture2D(sampler, coord2);
vec4 color3 = texture2D(sampler, coord3);
vec2 blend = fract(coords * texSize);
vec4 color01 = mix(color0, color1, blend.x);
vec4 color23 = mix(color2, color3, blend.x);
vec4 color = mix(color01, color23, blend.y);
#ifdef NNEDGE
float alpha = floor(color0.a * color1.a * color2.a * color3.a + 0.5);
color = color * alpha + (1.0 - alpha) * texture2D(sampler, coords);
#endif
return color;
}`,"epx.glsl":`vec4 sampleEPX(sampler2D sampler, float size, vec2 coords, vec2 texSize) {
vec2 invSize = 1.0 / texSize;
vec2 texel = coords * texSize;
vec2 texel_i = floor(texel);
vec2 texel_frac = fract(texel);
vec4 colorP = texture2D(sampler, texel_i * invSize);
vec4 colorP1 = vec4(colorP);
vec4 colorP2 = vec4(colorP);
vec4 colorP3 = vec4(colorP);
vec4 colorP4 = vec4(colorP);
vec4 colorA = texture2D(sampler, (texel_i - vec2(0.0, 1.0)) * invSize);
vec4 colorB = texture2D(sampler, (texel_i + vec2(1.0, 0.0)) * invSize);
vec4 colorC = texture2D(sampler, (texel_i - vec2(1.0, 0.0)) * invSize);
vec4 colorD = texture2D(sampler, (texel_i + vec2(0.0, 1.0)) * invSize);
if (colorC == colorA && colorC != colorD && colorA != colorB) {
colorP1 = colorA;
}
if (colorA == colorB && colorA != colorC && colorB != colorD) {
colorP2 = colorB;
}
if (colorD == colorC && colorD != colorB && colorC != colorA) {
colorP3 = colorC;
}
if (colorB == colorD && colorB != colorA && colorD != colorC) {
colorP4 = colorD;
}
vec4 colorP12 = mix(colorP1, colorP2, texel_frac.x);
vec4 colorP34 = mix(colorP1, colorP2, texel_frac.x);
return mix(colorP12, colorP34, texel_frac.y);
}`},heatmap:{heatmapResolve:{"heatmapResolve.frag":`precision highp float;
#ifdef HEATMAP_PRECISION_HALF_FLOAT
#define COMPRESSION_FACTOR 4.0
#else
#define COMPRESSION_FACTOR 1.0
#endif
uniform sampler2D u_texture;
uniform sampler2D u_gradient;
uniform vec2 u_densityMinAndInvRange;
uniform float u_densityNormalization;
varying vec2 v_uv;
void main() {
vec4 data = texture2D(u_texture, v_uv);
float density = data.r * COMPRESSION_FACTOR;
density *= u_densityNormalization;
density = (density - u_densityMinAndInvRange.x) * u_densityMinAndInvRange.y;
vec4 color = texture2D(u_gradient, vec2(density, 0.5));
gl_FragColor = vec4(color.rgb * color.a, color.a);
}`,"heatmapResolve.vert":`precision highp float;
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
v_uv = a_pos;
gl_Position = vec4(a_pos * 2.0 - 1.0, 1., 1.);
}`}},highlight:{"blur.frag":`varying mediump vec2 v_texcoord;
uniform mediump vec4 u_direction;
uniform mediump mat4 u_channelSelector;
uniform mediump float u_sigma;
uniform sampler2D u_texture;
mediump float gauss1(mediump vec2 dir) {
return exp(-dot(dir, dir) / (2.0 * u_sigma * u_sigma));
}
mediump vec4 selectChannel(mediump vec4 sample) {
return u_channelSelector * sample;
}
void accumGauss1(mediump float i, inout mediump float tot, inout mediump float weight) {
mediump float w = gauss1(i * u_direction.xy);
tot += selectChannel(texture2D(u_texture, v_texcoord + i * u_direction.zw))[3] * w;
weight += w;
}
void main(void) {
mediump float tot = 0.0;
mediump float weight = 0.0;
accumGauss1(-5.0, tot, weight);
accumGauss1(-4.0, tot, weight);
accumGauss1(-3.0, tot, weight);
accumGauss1(-2.0, tot, weight);
accumGauss1(-1.0, tot, weight);
accumGauss1(0.0, tot, weight);
accumGauss1(1.0, tot, weight);
accumGauss1(2.0, tot, weight);
accumGauss1(3.0, tot, weight);
accumGauss1(4.0, tot, weight);
accumGauss1(5.0, tot, weight);
gl_FragColor = vec4(0.0, 0.0, 0.0, tot / weight);
}`,"highlight.frag":`varying mediump vec2 v_texcoord;
uniform sampler2D u_texture;
uniform mediump float u_sigma;
uniform sampler2D u_shade;
uniform mediump vec2 u_minMaxDistance;
mediump float estimateDistance() {
mediump float y = texture2D(u_texture, v_texcoord)[3];
const mediump float y0 = 0.5;
mediump float m0 = 1.0 / (sqrt(2.0 * 3.1415) * u_sigma);
mediump float d = (y - y0) / m0;
return d;
}
mediump vec4 shade(mediump float d) {
mediump float mappedDistance = (d - u_minMaxDistance.x) / (u_minMaxDistance.y - u_minMaxDistance.x);
mappedDistance = clamp(mappedDistance, 0.0, 1.0);
return texture2D(u_shade, vec2(mappedDistance, 0.5));
}
void main(void) {
mediump float d = estimateDistance();
gl_FragColor = shade(d);
}`,"textured.vert":`attribute mediump vec2 a_position;
attribute mediump vec2 a_texcoord;
varying mediump vec2 v_texcoord;
void main(void) {
gl_Position = vec4(a_position, 0.0, 1.0);
v_texcoord = a_texcoord;
}`},materials:{"barycentric.glsl":`float inTriangle(vec3 bary) {
vec3 absBary = abs(bary);
return step((absBary.x + absBary.y + absBary.z), 1.05);
}
vec3 xyToBarycentric(in vec2 pos, in vec2 v0,  in vec2 v1, in vec2 v2) {
mat3 xyToBarycentricMat3 = mat3(
v1.x * v2.y - v2.x * v1.y, v2.x * v0.y - v0.x * v2.y, v0.x * v1.y - v1.x * v0.y,
v1.y - v2.y, v2.y - v0.y, v0.y - v1.y,
v2.x - v1.x, v0.x - v2.x, v1.x - v0.x
);
float A2 = v0.x * (v1.y - v2.y) + v1.x * (v2.y - v0.y) + v2.x * (v0.y - v1.y);
return (1. / A2) * xyToBarycentricMat3 * vec3(1., pos);
}`,"attributeData.glsl":`uniform highp sampler2D filterFlags;
uniform highp sampler2D animation;
uniform highp sampler2D gpgpu;
uniform highp sampler2D visualVariableData;
uniform highp sampler2D dataDriven0;
uniform highp sampler2D dataDriven1;
uniform highp sampler2D dataDriven2;
uniform float size;
highp vec2 getAttributeDataCoords(in highp vec3 id) {
highp vec3  texel = unpackDisplayIdTexel(id);
highp float u32 = float(int(texel.r) + int(texel.g) * 256 + int(texel.b) * 256 * 256);
highp float col = mod(u32, size);
highp float row = (u32 - col) / size;
highp float u = col / size;
highp float v = row / size;
return vec2(u, v);
}
highp vec2 getAttributeDataTextureCoords(in highp vec3 id) {
return (getAttributeDataCoords(id) * 2.0) - 1.0 + (.5 / vec2(size));
}
highp vec4 getFilterData(in highp vec3 id) {
vec2 coords = getAttributeDataCoords(id);
return texture2D(filterFlags, coords);
}
highp vec4 getAnimation(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(animation, coords);
}
highp vec4 getVisualVariableData(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(visualVariableData, coords);
}
highp vec4 getDataDriven0(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(dataDriven0, coords);
}
highp vec4 getDataDriven1(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(dataDriven1, coords);
}
highp vec4 getGPGPU(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(gpgpu, coords);
}
highp vec4 getDataDriven2(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(dataDriven2, coords);
}
float u88VVToFloat(in vec2 v) {
bool isMagic = v.x == 255.0 && v.y == 255.0;
if (isMagic) {
return NAN_MAGIC_NUMBER;
}
return (v.x + v.y * float(0x100)) - 32768.0;
}`,"constants.glsl":`const float C_DEG_TO_RAD = 3.14159265359 / 180.0;
const float C_256_TO_RAD = 3.14159265359 / 128.0;
const float C_RAD_TO_DEG = 180.0 / 3.141592654;
const float POSITION_PRECISION = 1.0 / 8.0;
const float FILL_POSITION_PRECISION = 1.0 / 1.0;
const float SOFT_EDGE_RATIO = 1.0;
const float THIN_LINE_WIDTH_FACTOR = 1.1;
const float THIN_LINE_HALF_WIDTH = 1.0;
const float EXTRUDE_SCALE_PLACEMENT_PADDING = 1.0 / 4.0;
const float OFFSET_PRECISION = 1.0 / 8.0;
const float OUTLINE_SCALE = 1.0 / 5.0;
const float SDF_FONT_SIZE = 24.0;
const float MAX_SDF_DISTANCE = 8.0;
const float PLACEMENT_PADDING = 8.0;
const float EPSILON = 0.00001;
const float EPSILON_HITTEST = 0.05;
const int MAX_FILTER_COUNT = 2;
const int ATTR_VV_SIZE = 0;
const int ATTR_VV_COLOR = 1;
const int ATTR_VV_OPACITY = 2;
const int ATTR_VV_ROTATION = 3;
const highp float NAN_MAGIC_NUMBER = 1e-30;
const int BITSET_GENERIC_LOCK_COLOR = 1;
const int BITSET_GENERIC_CONSIDER_ALPHA_ONLY = 4;
const int BITSET_MARKER_ALIGNMENT_MAP = 0;
const int BITSET_MARKER_OUTLINE_ALLOW_COLOR_OVERRIDE = 2;
const int BITSET_MARKER_SCALE_SYMBOLS_PROPORTIONALLY = 3;
const int BITSET_TYPE_FILL_OUTLINE = 0;
const int BITSET_FILL_RANDOM_PATTERN_OFFSET = 2;
const int BITSET_FILL_HAS_UNRESOLVED_REPLACEMENT_COLOR = 3;
const int BITSET_FILL_HAS_PATTERN_HEIGHT_PRECISION_FACTOR = 5;
const int BITSET_FILL_HAS_PATTERN_WIDTH_PRECISION_FACTOR = 6;
const int BITSET_LINE_SCALE_DASH = 2;`,fill:{"common.glsl":`#include <materials/symbologyTypeUtils.glsl>
#ifdef PATTERN
uniform mediump vec2 u_mosaicSize;
varying mediump float v_sampleAlphaOnly;
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
uniform lowp vec4 u_isActive[ 2 ];
uniform highp float u_dotValue;
uniform highp float u_tileDotsOverArea;
uniform highp float u_dotTextureDotCount;
uniform mediump float u_tileZoomFactor;
#endif
varying highp vec3 v_id;
varying lowp vec4 v_color;
varying lowp float v_opacity;
varying mediump vec4 v_aux1;
#ifdef PATTERN
varying mediump vec2 v_tileTextureCoord;
#endif
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
varying lowp float v_isOutline;
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
varying highp vec2 v_dotTextureCoords;
varying highp vec4 v_dotThresholds[ 2 ];
#endif`,"fill.frag":`precision highp float;
#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/fill/common.glsl>
#ifdef PATTERN
uniform lowp sampler2D u_texture;
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
uniform mediump mat4 u_dotColors[ 2 ];
uniform sampler2D u_dotTextures[ 2 ];
uniform vec4 u_dotBackgroundColor;
#endif
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.frag>
lowp vec4 drawLine() {
float v_lineWidth = v_aux1.x;
vec2  v_normal    = v_aux1.yz;
LineData inputs = LineData(
v_color,
v_normal,
v_lineWidth,
v_opacity,
v_id
);
return shadeLine(inputs);
}
#endif
lowp vec4 drawFill() {
lowp vec4 out_color = vec4(0.);
#ifdef HITTEST
out_color = v_color;
#elif defined(PATTERN)
mediump vec4 v_tlbr = v_aux1;
mediump vec2 normalizedTextureCoord = mod(v_tileTextureCoord, 1.0);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
if (v_sampleAlphaOnly > 0.5) {
color.rgb = vec3(color.a);
}
out_color = v_opacity * v_color * color;
#elif SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY && !defined(HIGHLIGHT)
vec4 textureThresholds0 = texture2D(u_dotTextures[0], v_dotTextureCoords);
vec4 textureThresholds1 = texture2D(u_dotTextures[1], v_dotTextureCoords);
vec4 difference0 = v_dotThresholds[0] - textureThresholds0;
vec4 difference1 = v_dotThresholds[1] - textureThresholds1;
#ifdef DD_DOT_BLENDING
vec4 isPositive0 = step(0.0, difference0);
vec4 isPositive1 = step(0.0, difference1);
float weightSum = dot(isPositive0, difference0) + dot(isPositive1, difference1);
float lessThanEqZero = step(weightSum, 0.0);
float greaterThanZero = 1.0 - lessThanEqZero ;
float divisor = (weightSum + lessThanEqZero);
vec4 weights0 = difference0 * isPositive0 / divisor;
vec4 weights1 = difference1 * isPositive1 / divisor;
vec4 dotColor = u_dotColors[0] * weights0 + u_dotColors[1] * weights1;
vec4 preEffectColor = greaterThanZero * dotColor + lessThanEqZero * u_dotBackgroundColor;
#else
float diffMax = max(max4(difference0), max4(difference1));
float lessThanZero = step(diffMax, 0.0);
float greaterOrEqZero = 1.0 - lessThanZero;
vec4 isMax0 = step(diffMax, difference0);
vec4 isMax1 = step(diffMax, difference1);
vec4 dotColor = u_dotColors[0] * isMax0 + u_dotColors[1] * isMax1;
vec4 preEffectColor = greaterOrEqZero * dotColor + lessThanZero * u_dotBackgroundColor;
#endif
out_color = preEffectColor;
#else
out_color = v_opacity * v_color;
#endif
#ifdef HIGHLIGHT
out_color.a = 1.0;
#endif
return out_color;
}
void main() {
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
if (v_isOutline > 0.5) {
gl_FragColor = drawLine();
} else {
gl_FragColor = drawFill();
}
#else
gl_FragColor = drawFill();
#endif
}`,"fill.vert":`#include <materials/symbologyTypeUtils.glsl>
#define PACKED_LINE
precision highp float;
attribute float a_bitset;
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
attribute float a_inverseArea;
vec4 a_color = vec4(0.0, 0.0, 0.0, 1.0);
vec2 a_zoomRange = vec2(0.0, 10000.0);
#else
attribute vec4 a_color;
attribute vec4 a_aux2;
attribute vec4 a_aux3;
#ifndef SYMBOLOGY_TYPE_IS_SIMPLE_LIKE
attribute vec4 a_aux1;
attribute vec2 a_zoomRange;
#else
vec2 a_zoomRange = vec2(0.0, 10000.0);
#endif
#endif
uniform vec2 u_tileOffset;
uniform vec2 u_maxIntNumOfCrossing;
#include <util/encoding.glsl>
#include <materials/vcommon.glsl>
#include <materials/fill/common.glsl>
#include <materials/fill/hittest.glsl>
const float INV_SCALE_COMPRESSION_FACTOR = 1.0 / 128.0;
const float MAX_REPRESENTABLE_INT = 16777216.0;
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
vec4 dotThreshold(vec4 featureAttrOverFeatureArea, float dotValue, float tileDotsOverArea) {
return featureAttrOverFeatureArea * (1.0 / dotValue)  * (1.0 / tileDotsOverArea);
}
#endif
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.vert>
void drawLine(out lowp vec4 out_color, out highp vec3 out_pos) {
LineData outputs = buildLine(
out_pos,
a_id,
a_pos,
a_color,
(a_aux3.xy - 128.) / 16.,
(a_aux3.zw - 128.) / 16.,
0.,
a_aux2.z / 16.,
a_bitset,
vec4(0.),
vec2(0.),
a_aux2.w / 16.
);
v_id      = outputs.id;
v_opacity = outputs.opacity;
v_aux1    = vec4(outputs.lineHalfWidth, outputs.normal, 0.);
out_color = outputs.color;
}
#endif
void drawFill(out lowp vec4 out_color, out highp vec3 out_pos) {
float a_bitSet = a_bitset;
out_color = getColor(a_color, a_bitSet, BITSET_GENERIC_LOCK_COLOR);
v_opacity = getOpacity();
v_id      = norm(a_id);
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
mat3 tileToTileNormalized = mat3(  2. / 512.,  0.,  0.,
0., -2. / 512.,  0.,
-1.,  1.,  1.  );
out_pos   = tileToTileNormalized * vec3((a_pos * FILL_POSITION_PRECISION), 1.);
#else
out_pos   = u_dvsMat3 * vec3(a_pos * FILL_POSITION_PRECISION, 1.);
#endif
#ifdef PATTERN
vec4  a_tlbr   = a_aux1;
float a_width  = a_aux2.x;
float a_height = a_aux2.y;
vec2  a_offset = a_aux2.zw;
vec2  a_scale  = a_aux3.xy;
float a_angle  = a_aux3.z;
if (getBit(a_bitset, BITSET_FILL_HAS_PATTERN_WIDTH_PRECISION_FACTOR) > 0.5) {
a_width *= INV_SCALE_COMPRESSION_FACTOR;
}
if (getBit(a_bitset, BITSET_FILL_HAS_PATTERN_HEIGHT_PRECISION_FACTOR) > 0.5) {
a_height *= INV_SCALE_COMPRESSION_FACTOR;
}
vec2 scale = INV_SCALE_COMPRESSION_FACTOR * a_scale;
float width = u_zoomFactor * a_width * scale.x;
float height = u_zoomFactor * a_height * scale.y;
float angle = C_256_TO_RAD * a_angle;
float sinA = sin(angle);
float cosA = cos(angle);
float dx = 0.0;
float dy = 0.0;
if (getBit(a_bitset, BITSET_FILL_RANDOM_PATTERN_OFFSET) > 0.5) {
float id = rgba2float(vec4(a_id, 0.0));
dx = rand(vec2(id, 0.0));
dy = rand(vec2(0.0, id));
}
mat3 patternMatrix = mat3(cosA / width, sinA / height, 0,
-sinA / width, cosA / height, 0,
dx,            dy,           1);
vec2 patternSize = vec2(a_width, a_height);
vec2 numPatternsPerMaxInt = vec2(MAX_REPRESENTABLE_INT) / patternSize;
vec2 maxIntCrossingOffsetCorrection = patternSize * fract(u_maxIntNumOfCrossing * numPatternsPerMaxInt);
vec2 tileOffset = u_tileOffset + maxIntCrossingOffsetCorrection - 0.5 * patternSize;
tileOffset = vec2(tileOffset.x * cosA - tileOffset.y * sinA, tileOffset.x * sinA + tileOffset.y * cosA);
tileOffset = mod(tileOffset, patternSize);
vec2 symbolOffset = u_zoomFactor * scale * vec2(a_offset - tileOffset) / vec2(width, height);
v_tileTextureCoord = (patternMatrix * vec3(a_pos * FILL_POSITION_PRECISION, 1.0)).xy - symbolOffset;
v_aux1 = a_tlbr / u_mosaicSize.xyxy;
v_sampleAlphaOnly = getBit(a_bitset, BITSET_GENERIC_CONSIDER_ALPHA_ONLY);
if (getBit(a_bitSet, BITSET_FILL_HAS_UNRESOLVED_REPLACEMENT_COLOR) > 0.5) {
#ifdef VV_COLOR
v_sampleAlphaOnly *= (1.0 - float(isNan(VV_ADATA[ATTR_VV_COLOR]))) * (1.0 - getBit(a_bitSet, BITSET_GENERIC_LOCK_COLOR));
#else
v_sampleAlphaOnly = 0.0;
#endif
}
#elif SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
vec4 ddAttributeData0 = getAttributeData2(a_id) * u_isActive[0] * a_inverseArea;
vec4 ddAttributeData1 = getAttributeData3(a_id) * u_isActive[1] * a_inverseArea;
float size = u_tileZoomFactor * 512.0 * 1.0 / u_pixelRatio;
v_dotThresholds[0] = dotThreshold(ddAttributeData0, u_dotValue, u_tileDotsOverArea);
v_dotThresholds[1] = dotThreshold(ddAttributeData1, u_dotValue, u_tileDotsOverArea);
v_dotTextureCoords = (a_pos * FILL_POSITION_PRECISION + 0.5) / size;
#endif
}
#ifdef HITTEST
void draw(out lowp vec4 out_color, out highp vec3 out_pos) {
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
if (getBit(a_bitset, BITSET_TYPE_FILL_OUTLINE) > 0.5) {
out_pos = vec3(0., 0., 2.);
return;
}
#endif
hittestFill(out_color, out_pos);
gl_PointSize = 1.0;
}
#elif defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE)
void draw(out lowp vec4 out_color, out highp vec3 out_pos) {
v_isOutline = getBit(a_bitset, BITSET_TYPE_FILL_OUTLINE);
if (v_isOutline > 0.5) {
drawLine(out_color, out_pos);
} else {
drawFill(out_color, out_pos);
}
}
#else
#define draw drawFill
#endif
void main()
{
INIT;
highp vec3 pos  = vec3(0.);
highp vec4 color  = vec4(0.);
draw(color, pos);
v_color = color;
gl_Position = vec4(clip(v_color, pos, getFilterFlags(), a_zoomRange), 1.0);
}`,"hittest.glsl":`#ifdef HITTEST
#include <materials/hittest/common.glsl>
attribute vec2 a_pos1;
attribute vec2 a_pos2;
void hittestFill(
out lowp vec4 out_color,
out highp vec3 out_pos
) {
vec3 pos        = u_viewMat3 * u_tileMat3 * vec3(a_pos  * FILL_POSITION_PRECISION, 1.);
vec3 pos1       = u_viewMat3 * u_tileMat3 * vec3(a_pos1 * FILL_POSITION_PRECISION, 1.);
vec3 pos2       = u_viewMat3 * u_tileMat3 * vec3(a_pos2 * FILL_POSITION_PRECISION, 1.);
float hittestDist = u_hittestDist;
float dist = distPointTriangle(u_hittestPos, pos.xy, pos1.xy, pos2.xy);
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
if (dist < 0. || dist >= hittestDist) {
out_pos.z += 2.0;
}
out_color = vec4(1. / 255., 0, 0, dist == 0. ? (1. / 255.) : 0.);
}
#endif`},hittest:{"common.glsl":`#ifdef HITTEST
uniform float hittestDist;
uniform highp vec2 hittestPos;
float projectScalar(vec2 a, vec2 b) {
return dot(a, normalize(b));
}
float distPointSegment(vec2 p0, vec2 p1, vec2 p2) {
vec2 L = p2 - p1;
vec2 A = p0 - p1;
float projAL = projectScalar(A, L);
float t = clamp(projAL / length(L), 0., 1.);
return distance(p0, p1 + t * (p2 - p1));
}
void hittestMarker(out lowp vec4 out_color, out highp vec3 out_pos, in highp vec3 pos, float size) {
float dist = distance(pos, vec3(hittestPos, 1.));
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
if ((dist - size) > hittestDist) {
out_pos.z += 2.0;
}
out_color = vec4(1. / 255., 0, 0, (dist - size) < 0. ? (1. / 255.) : 0.);
}
float intersectPointTriangleBary(vec2 p, vec2 a, vec2 b, vec2 c) {
return inTriangle(xyToBarycentric(p, a, b, c));
}
float distPointTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
vec2 ba = b - a;
vec2 ca = c - a;
float crossProduct = ba.x * ca.y - ca.x * ba.y;
bool isParallel = crossProduct < EPSILON_HITTEST && crossProduct > -EPSILON_HITTEST;
if (isParallel) {
return -1.;
}
if (intersectPointTriangleBary(p.xy, a, b, c) == 1.) {
return 0.;
}
float distAB = distPointSegment(p, a, b);
float distBC = distPointSegment(p, b, c);
float distCA = distPointSegment(p, c, a);
return min(min(distAB, distBC), distCA);
}
#endif`},icon:{"common.glsl":`#include <util/encoding.glsl>
uniform lowp vec2 u_mosaicSize;
varying lowp vec4 v_color;
varying highp vec3 v_id;
varying highp vec4 v_sizeTex;
varying mediump vec3 v_pos;
varying lowp float v_opacity;
uniform lowp sampler2D u_texture;
#ifdef SDF
varying lowp vec4 v_outlineColor;
varying mediump float v_outlineWidth;
varying mediump float v_distRatio;
varying mediump float v_overridingOutlineColor;
varying mediump float v_isThin;
#endif
#ifdef SDF
vec4 getColor(vec2 v_size, vec2 v_tex) {
#ifdef HITTEST
lowp vec4 fillPixelColor = vec4(1.0);
#else
lowp vec4 fillPixelColor = v_color;
#endif
float d = 0.5 - rgba2float(texture2D(u_texture, v_tex));
float size = max(v_size.x, v_size.y);
float dist = d * size * SOFT_EDGE_RATIO * v_distRatio;
fillPixelColor *= clamp(0.5 - dist, 0.0, 1.0);
float outlineWidth = v_outlineWidth;
#ifdef HIGHLIGHT
outlineWidth = max(outlineWidth, 4.0 * v_isThin);
#endif
if (outlineWidth > 0.25) {
lowp vec4 outlinePixelColor = v_overridingOutlineColor * v_color + (1.0 - v_overridingOutlineColor) * v_outlineColor;
float clampedOutlineSize = min(outlineWidth, size);
outlinePixelColor *= clamp(0.5 - abs(dist) + clampedOutlineSize * 0.5, 0.0, 1.0);
return v_opacity * ((1.0 - outlinePixelColor.a) * fillPixelColor + outlinePixelColor);
}
return v_opacity * fillPixelColor;
}
#else
vec4 getColor(vec2 _v_size, vec2 v_tex) {
lowp vec4 texColor = texture2D(u_texture, v_tex);
return v_opacity * texColor * v_color;
}
#endif`,heatmapAccumulate:{"heatmapAccumulate.frag":`precision mediump float;
#include <materials/icon/heatmapAccumulate/common.glsl>
#ifdef HEATMAP_PRECISION_HALF_FLOAT
#define COMPRESSION_FACTOR 0.25
#else
#define COMPRESSION_FACTOR 1.0
#endif
uniform lowp sampler2D u_texture;
void main() {
#ifdef HITTEST
gl_FragColor = v_hittestResult;
#else
float radius = length(v_offsetFromCenter);
float shapeWeight = step(radius, 1.0);
float oneMinusRadiusSquared = 1.0 - radius * radius;
float kernelWeight = oneMinusRadiusSquared * oneMinusRadiusSquared;
gl_FragColor = vec4(shapeWeight * kernelWeight * v_fieldValue * COMPRESSION_FACTOR);
#endif
}`,"common.glsl":`varying lowp vec4 v_hittestResult;
varying mediump vec2 v_offsetFromCenter;
varying highp float v_fieldValue;`,"heatmapAccumulate.vert":`precision highp float;
attribute vec2 a_vertexOffset;
vec4 a_color = vec4(0.0);
vec2 a_zoomRange = vec2(0.0, 10000.0);
uniform float u_radius;
uniform float u_isFieldActive;
#include <materials/vcommon.glsl>
#include <materials/hittest/common.glsl>
#include <materials/icon/heatmapAccumulate/common.glsl>
void main() {
float filterFlags = getFilterFlags();
#ifdef HITTEST
highp vec4 out_hittestResult = vec4(0.);
highp vec3 out_pos = vec3(0.);
vec3 pos = u_viewMat3 * u_tileMat3 * vec3(a_pos * POSITION_PRECISION, 1.0);
hittestMarker(out_hittestResult, out_pos, pos, u_radius);
v_hittestResult = out_hittestResult;
gl_PointSize = 1.;
gl_Position = vec4(clip(a_color, out_pos, filterFlags, a_zoomRange), 1.0);
#else
v_offsetFromCenter = sign(a_vertexOffset);
v_fieldValue = getAttributeData2(a_id).x * u_isFieldActive + 1.0 - u_isFieldActive;
vec3 centerPos = u_dvsMat3 * vec3(a_pos * POSITION_PRECISION, 1.0);
vec3 vertexPos = centerPos + u_displayViewMat3 * vec3(v_offsetFromCenter, 0.0) * u_radius;
gl_Position = vec4(clip(a_color, vertexPos, filterFlags, a_zoomRange), 1.0);
#endif
}`},"hittest.glsl":`#ifdef HITTEST
#include <materials/hittest/common.glsl>
attribute vec2 a_vertexOffset1;
attribute vec2 a_vertexOffset2;
attribute vec2 a_texCoords1;
attribute vec2 a_texCoords2;
vec2 getTextureCoords(in vec3 bary, in vec2 texCoords0, in vec2 texCoords1, in vec2 texCoords2) {
return texCoords0 * bary.x + texCoords1 * bary.y + texCoords2 * bary.z;
}
void hittestIcon(
inout lowp vec4 out_color,
out highp vec3 out_pos,
in vec3 pos,
in vec3 offset,
in vec2 size,
in float scaleFactor,
in float isMapAligned
) {
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
vec3 posBase = u_viewMat3 * u_tileMat3  * pos;
vec3 offset1 = scaleFactor * vec3(a_vertexOffset1 / 16.0, 0.);
vec3 offset2 = scaleFactor * vec3(a_vertexOffset2 / 16.0, 0.);
vec2 pos0    = (posBase + getMatrixNoDisplay(isMapAligned) * offset).xy;
vec2 pos1    = (posBase + getMatrixNoDisplay(isMapAligned) * offset1).xy;
vec2 pos2    = (posBase + getMatrixNoDisplay(isMapAligned) * offset2).xy;
vec3 bary0 = xyToBarycentric(u_hittestPos + vec2(-u_hittestDist, -u_hittestDist), pos0, pos1, pos2);
vec3 bary1 = xyToBarycentric(u_hittestPos + vec2(0., -u_hittestDist), pos0, pos1, pos2);
vec3 bary2 = xyToBarycentric(u_hittestPos + vec2(u_hittestDist, -u_hittestDist), pos0, pos1, pos2);
vec3 bary3 = xyToBarycentric(u_hittestPos + vec2(-u_hittestDist, 0.), pos0, pos1, pos2);
vec3 bary4 = xyToBarycentric(u_hittestPos, pos0, pos1, pos2);
vec3 bary5 = xyToBarycentric(u_hittestPos + vec2(u_hittestDist, 0.), pos0, pos1, pos2);
vec3 bary6 = xyToBarycentric(u_hittestPos + vec2(-u_hittestDist, u_hittestDist), pos0, pos1, pos2);
vec3 bary7 = xyToBarycentric(u_hittestPos + vec2(0., u_hittestDist), pos0, pos1, pos2);
vec3 bary8 = xyToBarycentric(u_hittestPos + vec2(u_hittestDist, u_hittestDist), pos0, pos1, pos2);
vec2 tex0 = a_texCoords  / u_mosaicSize;
vec2 tex1 = a_texCoords1 / u_mosaicSize;
vec2 tex2 = a_texCoords2 / u_mosaicSize;
float alphaSum = 0.;
alphaSum += inTriangle(bary0) * getColor(size, getTextureCoords(bary0, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary1) * getColor(size, getTextureCoords(bary1, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary2) * getColor(size, getTextureCoords(bary2, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary3) * getColor(size, getTextureCoords(bary3, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary4) * getColor(size, getTextureCoords(bary4, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary5) * getColor(size, getTextureCoords(bary5, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary6) * getColor(size, getTextureCoords(bary6, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary7) * getColor(size, getTextureCoords(bary7, tex0, tex1, tex2)).a;
out_pos.z += step(alphaSum, .05) * 2.0;
out_color = vec4(1. / 255., 0., 0., alphaSum / 255.);
}
#endif`,"icon.frag":`precision mediump float;
#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/icon/common.glsl>
void main()
{
#ifdef HITTEST
vec4 color = v_color;
#else
vec4 color = getColor(v_sizeTex.xy, v_sizeTex.zw);
#endif
#ifdef HIGHLIGHT
color.a = step(1.0 / 255.0, color.a);
#endif
gl_FragColor = color;
}`,"icon.vert":`precision highp float;
attribute vec4 a_color;
attribute vec4 a_outlineColor;
attribute vec4 a_sizeAndOutlineWidth;
attribute vec2 a_vertexOffset;
attribute vec2 a_texCoords;
attribute vec2 a_bitSetAndDistRatio;
attribute vec2 a_zoomRange;
#include <materials/vcommon.glsl>
#include <materials/icon/common.glsl>
#include <materials/icon/hittest.glsl>
float getMarkerScaleFactor(inout vec2 size, in float referenceSize) {
#ifdef VV_SIZE
float f = getSize(size.y) / size.y;
float sizeFactor = size.y / referenceSize;
return getSize(referenceSize) / referenceSize;
#else
return 1.;
#endif
}
void main()
{
INIT;
float a_bitSet = a_bitSetAndDistRatio.x;
vec3  pos           = vec3(a_pos * POSITION_PRECISION, 1.0);
vec2  size          = a_sizeAndOutlineWidth.xy * a_sizeAndOutlineWidth.xy / 128.0;
vec3  offset        = vec3(a_vertexOffset / 16.0, 0.);
float outlineSize   = a_sizeAndOutlineWidth.z * a_sizeAndOutlineWidth.z / 128.0;
float isMapAligned  = getBit(a_bitSet, BITSET_MARKER_ALIGNMENT_MAP);
float referenceSize = a_sizeAndOutlineWidth.w * a_sizeAndOutlineWidth.w / 128.0;
float scaleSymbolProportionally = getBit(a_bitSet, BITSET_MARKER_SCALE_SYMBOLS_PROPORTIONALLY);
float scaleFactor               = getMarkerScaleFactor(size, referenceSize);
size.xy     *= scaleFactor;
offset.xy   *= scaleFactor;
outlineSize *= scaleSymbolProportionally * (scaleFactor - 1.0) + 1.0;
vec2 v_tex   = a_texCoords / u_mosaicSize;
float filterFlags = getFilterFlags();
v_color    = getColor(a_color, a_bitSet, BITSET_GENERIC_LOCK_COLOR);
v_opacity  = getOpacity();
v_id       = norm(a_id);
v_pos      = u_dvsMat3 * pos + getMatrix(isMapAligned) * getRotation()  * offset;
v_sizeTex  = vec4(size.xy, v_tex.xy);
#ifdef SDF
v_isThin   = getBit(a_bitSet, BITSET_MARKER_OUTLINE_ALLOW_COLOR_OVERRIDE);
#ifdef VV_COLOR
v_overridingOutlineColor = v_isThin;
#else
v_overridingOutlineColor = 0.0;
#endif
v_outlineWidth = min(outlineSize, max(max(size.x, size.y) - 0.99, 0.0));
v_outlineColor = a_outlineColor;
v_distRatio = a_bitSetAndDistRatio.y / 128.0;
#endif
#ifdef HITTEST
highp vec4 out_color = vec4(0.);
highp vec3 out_pos   = vec3(0.);
hittestIcon(out_color, out_pos, pos, offset, size, scaleFactor, isMapAligned);
v_color = out_color;
gl_PointSize = 1.;
gl_Position = vec4(clip(v_color, out_pos, filterFlags, a_zoomRange), 1.0);
#else
gl_Position = vec4(clip(v_color, v_pos, filterFlags, a_zoomRange), 1.0);
#endif
}`},label:{"common.glsl":`uniform mediump float u_zoomLevel;
uniform mediump float u_mapRotation;
uniform mediump float u_mapAligned;
uniform mediump vec2 u_mosaicSize;
varying mediump float v_antialiasingWidth;
varying mediump float v_edgeDistanceOffset;
varying mediump vec2 v_tex;
varying mediump vec4 v_color;
varying lowp vec4 v_animation;`,"label.frag":`#include <materials/text/text.frag>`,"label.vert":`precision highp float;
#include <materials/vcommon.glsl>
#include <materials/text/common.glsl>
attribute vec4 a_color;
attribute vec4 a_haloColor;
attribute vec4 a_texAndSize;
attribute vec4 a_refSymbolAndPlacementOffset;
attribute vec4 a_glyphData;
attribute vec2 a_vertexOffset;
attribute vec2 a_texCoords;
uniform float u_isHaloPass;
uniform float u_isBackgroundPass;
uniform float u_mapRotation;
uniform float u_mapAligned;
float getZ(in float minZoom, in float maxZoom, in float angle) {
float glyphAngle = angle * 360.0 / 254.0;
float mapAngle = u_mapRotation * 360.0 / 254.0;
float diffAngle = min(360.0 - abs(mapAngle - glyphAngle), abs(mapAngle - glyphAngle));
float z = 0.0;
z += u_mapAligned * (2.0 * (1.0 - step(minZoom, u_currentZoom)));
z += u_mapAligned * 2.0 * step(90.0, diffAngle);
z += 2.0 * (1.0 - step(u_currentZoom, maxZoom));
return z;
}
void main()
{
INIT;
float groupMinZoom    = getMinZoom();
float glyphMinZoom    = a_glyphData.x;
float glyphMaxZoom    = a_glyphData.y;
float glyphAngle      = a_glyphData.z;
float a_isBackground  = a_glyphData.w;
float a_minZoom          = max(groupMinZoom, glyphMinZoom);
float a_placementPadding = a_refSymbolAndPlacementOffset.x * EXTRUDE_SCALE_PLACEMENT_PADDING;
vec2  a_placementDir     = unpack_u8_nf32(a_refSymbolAndPlacementOffset.zw);
float a_refSymbolSize    = a_refSymbolAndPlacementOffset.y;
float fontSize           = a_texAndSize.z;
float haloSize           = a_texAndSize.w * OUTLINE_SCALE;
vec2  vertexOffset = a_vertexOffset * OFFSET_PRECISION;
vec3  pos          = vec3(a_pos * POSITION_PRECISION, 1.0);
float z            = getZ(a_minZoom, glyphMaxZoom, glyphAngle);
float fontScale    = fontSize / SDF_FONT_SIZE;
float halfSize     = getSize(a_refSymbolSize) / 2.0;
float animation    = pow(getAnimationState(), vec4(2.0)).r;
float isText = 1.0 - a_isBackground;
float isBackground = u_isBackgroundPass * a_isBackground;
vec4  nonHaloColor = (isBackground + isText) * a_color;
v_color     = animation * ((1.0 - u_isHaloPass) * nonHaloColor + (u_isHaloPass * a_haloColor));
v_opacity   = 1.0;
v_tex       = a_texCoords / u_mosaicSize;
v_edgeDistanceOffset = u_isHaloPass * haloSize / fontScale / MAX_SDF_DISTANCE;
v_antialiasingWidth  = 0.105 * SDF_FONT_SIZE / fontSize / u_pixelRatio;
vec2 placementOffset = a_placementDir * (halfSize + a_placementPadding);
vec3 glyphOffset     = u_displayMat3 * vec3(vertexOffset + placementOffset, 0.0);
vec3 v_pos           = vec3((u_dvsMat3 * pos + glyphOffset).xy, z);
float isHidden = u_isBackgroundPass * isText + (1.0 - u_isBackgroundPass) * a_isBackground;
v_pos.z += 2.0 * isHidden;
gl_Position = vec4(v_pos, 1.0);
#ifdef DEBUG
v_color = vec4(a_color.rgb, z == 0.0 ? 1.0 : 0.645);
#endif
}`},line:{"hittest.glsl":`#include <materials/hittest/common.glsl>
#ifdef HITTEST
attribute vec2 a_pos1;
attribute vec2 a_pos2;
void hittestLine(out lowp vec4 out_color, out highp vec3 out_pos, float halfWidth) {
vec3 pos        = u_viewMat3 * u_tileMat3 * vec3(a_pos  * POSITION_PRECISION, 1.);
vec3 pos1       = u_viewMat3 * u_tileMat3 * vec3(a_pos1 * POSITION_PRECISION, 1.);
vec3 pos2       = u_viewMat3 * u_tileMat3 * vec3(a_pos2 * POSITION_PRECISION, 1.);
vec3 outTextureCoords = vec3(getAttributeDataTextureCoords(a_id), 0.0);
float dist = min(distPointSegment(u_hittestPos, pos.xy, pos1.xy),
distPointSegment(u_hittestPos, pos.xy, pos2.xy)) - halfWidth;
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
if (dist >= u_hittestDist) {
out_pos.z += 2.0;
}
out_color = vec4(1. / 255., 0, 0, dist <= 0. ? (1. / 255.) : 0.);
}
#endif`,"common.glsl":`varying lowp vec4 v_color;
varying highp vec3 v_id;
varying mediump vec2 v_normal;
varying mediump float v_lineHalfWidth;
varying lowp float v_opacity;
#ifdef PATTERN
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
#endif
#if defined(PATTERN) || defined(SDF)
varying highp float v_accumulatedDistance;
#endif
#ifdef SDF
varying mediump float v_lineWidthRatio;
#endif`,"line.frag":`precision lowp float;
#include <util/encoding.glsl>
#include <materials/constants.glsl>
#include <materials/symbologyTypeUtils.glsl>
#include <materials/line/common.glsl>
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.frag>
#ifdef HITTEST
void main() {
gl_FragColor = v_color;
}
#else
void main() {
LineData inputs = LineData(
v_color,
v_normal,
v_lineHalfWidth,
v_opacity,
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
v_tlbr,
v_patternSize,
#endif
#ifdef SDF
v_lineWidthRatio,
#endif
#if defined(PATTERN) || defined(SDF)
v_accumulatedDistance,
#endif
#endif
v_id
);
gl_FragColor = shadeLine(inputs);
}
#endif`,"line.vert":`precision highp float;
attribute vec4 a_color;
attribute vec4 a_offsetAndNormal;
attribute vec2 a_accumulatedDistanceAndHalfWidth;
attribute vec4 a_tlbr;
attribute vec4 a_segmentDirection;
attribute vec2 a_aux;
attribute vec2 a_zoomRange;
#include <materials/vcommon.glsl>
#include <materials/symbologyTypeUtils.glsl>
#include <materials/line/common.glsl>
#include <materials/line/hittest.glsl>
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.vert>
#ifdef HITTEST
void draw() {
float aa        = 0.5 * u_antialiasing;
float a_halfWidth = a_accumulatedDistanceAndHalfWidth.y / 16.;
float a_cimHalfWidth = a_aux.x / 16. ;
vec2  a_offset = a_offsetAndNormal.xy / 16.;
float baseWidth = getBaseLineHalfWidth(a_halfWidth, a_cimHalfWidth);
float halfWidth = getLineHalfWidth(baseWidth, aa);
highp vec3 pos  = vec3(0.);
v_color = vec4(0.);
hittestLine(v_color, pos, halfWidth);
gl_PointSize = 1.;
gl_Position = vec4(clip(v_color, pos, getFilterFlags(), a_zoomRange), 1.0);
}
#else
void draw()
{
highp vec3 pos = vec3(0.);
LineData outputs = buildLine(
pos,
a_id,
a_pos,
a_color,
a_offsetAndNormal.xy / 16.,
a_offsetAndNormal.zw / 16.,
a_accumulatedDistanceAndHalfWidth.x,
a_accumulatedDistanceAndHalfWidth.y / 16.,
a_segmentDirection.w,
a_tlbr,
a_segmentDirection.xy / 16.,
a_aux.x / 16.
);
v_id              = outputs.id;
v_color           = outputs.color;
v_normal          = outputs.normal;
v_lineHalfWidth   = outputs.lineHalfWidth;
v_opacity         = outputs.opacity;
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
v_tlbr          = outputs.tlbr;
v_patternSize   = outputs.patternSize;
#endif
#ifdef SDF
v_lineWidthRatio = outputs.lineWidthRatio;
#endif
#if defined(PATTERN) || defined(SDF)
v_accumulatedDistance = outputs.accumulatedDistance;
#endif
#endif
gl_Position = vec4(clip(outputs.color, pos, getFilterFlags(), a_zoomRange), 1.0);
}
#endif
void main() {
INIT;
draw();
}`},pie:{"pie.common.glsl":`uniform float outlineWidth;
uniform mediump float sectorThreshold;
varying vec3  v_id;
varying vec3  v_pos;
varying vec2  v_offset;
varying vec4  v_color;
varying float v_size;
varying float v_numOfEntries;
varying float v_maxSectorAngle;
varying vec2  v_filteredSectorToColorId[numberOfFields];
varying vec2  v_texCoords;
varying float v_outlineWidth;
varying float v_opacity;
struct FilteredChartInfo {
float endSectorAngle;
int colorId;
};`,"pie.frag":`precision highp float;
#include <util/atan2.glsl>
#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/pie/pie.common.glsl>
uniform lowp vec4 colors[numberOfFields];
uniform lowp vec4 defaultColor;
uniform lowp vec4 othersColor;
uniform lowp vec4 outlineColor;
uniform float donutRatio;
lowp vec4 getSectorColor(in int index, in vec2 filteredSectorToColorId[numberOfFields]) {
mediump int colorIndex = int(filteredSectorToColorId[index].y);
return colors[colorIndex];
}
const int OTHER_SECTOR_ID = 255;
#ifdef HITTEST
vec4 getColor() {
float distanceSize = length(v_offset) * v_size;
float donutSize = donutRatio * v_size;
float alpha = step(donutSize, distanceSize) * (1.0 - step(v_size, distanceSize));
return v_color;
}
#else
vec4 getColor() {
float angle = mod(90.0 - C_RAD_TO_DEG * atan2(v_offset.y, v_offset.x), 360.0);
int numOfEntries = int(v_numOfEntries);
float maxSectorAngle = v_maxSectorAngle;
lowp vec4 fillColor = (maxSectorAngle > 0.0 || sectorThreshold > 0.0) ? othersColor : defaultColor;
lowp vec4 prevColor = vec4(0.0);
lowp vec4 nextColor = vec4(0.0);
float startSectorAngle = 0.0;
float endSectorAngle = 0.0;
if (angle < maxSectorAngle) {
for (int index = 0; index < numberOfFields; ++index) {
startSectorAngle = endSectorAngle;
endSectorAngle = v_filteredSectorToColorId[index].x;
if (endSectorAngle > angle) {
fillColor = getSectorColor(index, v_filteredSectorToColorId);
prevColor = sectorThreshold != 0.0 && index == 0 && maxSectorAngle + EPSILON < 360. ? othersColor :
getSectorColor(index > 0 ? index - 1 : numOfEntries - 1, v_filteredSectorToColorId);
nextColor = sectorThreshold != 0.0 && abs(endSectorAngle - maxSectorAngle) < EPSILON && maxSectorAngle + EPSILON < 360. ? othersColor :
getSectorColor(index < numOfEntries - 1 ? index + 1 : 0, v_filteredSectorToColorId);
break;
}
if (index == numOfEntries - 1) {
break;
}
}
} else if (numOfEntries <= 0) {
prevColor = nextColor = fillColor;
} else {
prevColor = getSectorColor(numOfEntries - 1, v_filteredSectorToColorId);
nextColor = getSectorColor(0, v_filteredSectorToColorId);
startSectorAngle = maxSectorAngle;
endSectorAngle = 360.0;
}
lowp vec4 outlineColor = outlineColor;
float offset = length(v_offset);
float distanceSize = offset * v_size;
float distanceToStartSector = (angle - startSectorAngle);
float distanceToEndSector = (endSectorAngle - angle);
float sectorThreshold = 0.75;
float beginSectorAlpha = smoothstep(-sectorThreshold, sectorThreshold, distanceToStartSector * offset);
float endSectorAlpha = smoothstep(-sectorThreshold, sectorThreshold, distanceToEndSector * offset);
fillColor = mix(prevColor, fillColor, beginSectorAlpha) + mix(nextColor, fillColor, endSectorAlpha) - fillColor;
float aaThreshold = 0.75;
float startOfOutline = v_size - v_outlineWidth - aaThreshold;
float donutSize = donutRatio * startOfOutline;
float endOfDonut = donutSize - v_outlineWidth;
float innerCircleAlpha = endOfDonut > aaThreshold ? smoothstep(endOfDonut - aaThreshold, endOfDonut + aaThreshold, distanceSize) : 1.0;
float outerCircleAlpha = 1.0 - smoothstep(v_size - 2.0 * aaThreshold, v_size, distanceSize);
float circleAlpha = innerCircleAlpha * outerCircleAlpha;
if (startOfOutline > 0.0 && v_outlineWidth > 0.25) {
float outlineFactor = smoothstep(startOfOutline - aaThreshold, startOfOutline + aaThreshold, distanceSize);
float innerLineFactor = donutSize - aaThreshold > 0.0 ? 1.0 - smoothstep(donutSize - aaThreshold, donutSize + aaThreshold , distanceSize) : 0.0;
fillColor = mix(fillColor, outlineColor, innerLineFactor + outlineFactor);
}
return v_opacity * circleAlpha * fillColor;
}
#endif
void main()
{
vec4 color = getColor();
#ifdef highlight
color.a = step(1.0 / 255.0, color.a);
#endif
gl_FragColor = color;
}`,"pie.vert":`#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/barycentric.glsl>
#include <materials/vcommon.glsl>
#include <materials/vv.glsl>
#include <materials/attributeData.glsl>
#include <materials/pie/pie.common.glsl>
#include <materials/hittest/common.glsl>
attribute float a_bitSet;
attribute vec2  a_offset;
attribute vec2  a_texCoords;
attribute float a_referenceSize;
attribute vec2  a_zoomRange;
int filterValue(in float sectorAngle,
in int currentIndex,
inout FilteredChartInfo filteredInfo,
inout vec2 filteredSectorToColorId[numberOfFields]) {
if (sectorAngle > sectorThreshold * 360.0) {
filteredInfo.endSectorAngle += sectorAngle;
filteredSectorToColorId[filteredInfo.colorId] = vec2(filteredInfo.endSectorAngle, currentIndex);
++filteredInfo.colorId;
}
return 0;
}
int filterValues(inout vec2 filteredSectorToColorId[numberOfFields],
inout FilteredChartInfo filteredInfo,
in float sectorAngles[numberOfFields]) {
for (int index = 0; index < numberOfFields; ++index) {
float sectorValue = sectorAngles[index];
filterValue(sectorValue, index, filteredInfo, filteredSectorToColorId);
}
return filteredInfo.colorId;
}
float getMarkerSize(inout vec2 offset, inout float outlineSize, in float referenceSize, in float bitSet) {
float outSize = referenceSize * 0.5;
#ifdef VV_SIZE
float r = getSize(referenceSize, currentScale) / referenceSize;
outSize *= r;
offset.xy *= r;
float scaleSymbolProportionally = getBit(bitSet, BITSET_MARKER_SCALE_SYMBOLS_PROPORTIONALLY);
outlineSize *= scaleSymbolProportionally * (r - 1.0) + 1.0;
#endif
return outSize;
}
vec3 getOffset(in vec2 in_offset, float a_bitSet) {
float isMapAligned = getBit(a_bitSet, BITSET_MARKER_ALIGNMENT_MAP);
vec3  offset       = vec3(in_offset, 0.0);
return getMatrix(isMapAligned) * offset;
}
float filterNaNValues(in float value) {
return value != NAN_MAGIC_NUMBER && value > 0.0 ? value : 0.0;
}
void main()
{
INIT;
vec2  a_offset = a_offset / 16.0;
float outlineSize = outlineWidth;
float a_bitSet = a_bitSet;
float a_referenceSize = a_referenceSize;
vec2 a_texCoords = a_texCoords / 4.0;
float markerSize = getMarkerSize(a_offset, outlineSize, a_referenceSize, a_bitSet);
float filterFlags = getFilterFlags();
vec3  pos         = vec3(a_pos / 10.0, 1.0);
v_opacity      = getOpacity();
v_pos          = displayViewScreenMat3 * pos + getOffset(a_offset, a_bitSet);
v_offset       = sign(a_texCoords - 0.5);
v_size         = markerSize;
v_outlineWidth = outlineSize;
float attributeData[10];
vec4 attributeData3 = getDataDriven0(a_id);
attributeData[0] = filterNaNValues(attributeData3.x);
attributeData[1] = filterNaNValues(attributeData3.y);
attributeData[2] = filterNaNValues(attributeData3.z);
attributeData[3] = filterNaNValues(attributeData3.w);
#if (numberOfFields > 4)
vec4 attributeData4 = getDataDriven1(a_id);
attributeData[4] = filterNaNValues(attributeData4.x);
attributeData[5] = filterNaNValues(attributeData4.y);
attributeData[6] = filterNaNValues(attributeData4.z);
attributeData[7] = filterNaNValues(attributeData4.w);
#endif
#if (numberOfFields > 8)
vec4 attributeData5 = getDataDriven2(a_id);
attributeData[8] = filterNaNValues(attributeData5.x);
attributeData[9] = filterNaNValues(attributeData5.y);
#endif
float sum = 0.0;
for (int i = 0; i < numberOfFields; ++i) {
sum += attributeData[i];
}
float sectorAngles[numberOfFields];
for (int i = 0; i < numberOfFields; ++i) {
sectorAngles[i] = 360.0 * attributeData[i] / sum;
}
vec2 filteredSectorToColorId[numberOfFields];
FilteredChartInfo filteredInfo = FilteredChartInfo(0.0, 0);
int numOfEntries = filterValues(filteredSectorToColorId, filteredInfo, sectorAngles);
v_numOfEntries = float(numOfEntries);
v_maxSectorAngle = filteredInfo.endSectorAngle;
v_filteredSectorToColorId = filteredSectorToColorId;
#ifdef HITTEST
highp vec3 out_pos = vec3(0.0);
v_color            = vec4(0.0);
hittestMarker(v_color, out_pos, viewMat3 * tileMat3 *  pos, v_size);
gl_PointSize = 1.0;
gl_Position = vec4(clip(v_color, out_pos, filterFlags, a_zoomRange), 1.0);
#else
gl_Position = vec4(clip(v_color, v_pos, filterFlags, a_zoomRange), 1.0);
#endif
}`},shared:{line:{"common.glsl":`#if !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE) && defined(PATTERN)
uniform mediump vec2 u_mosaicSize;
varying mediump float v_sampleAlphaOnly;
#endif
struct LineData {
lowp vec4 color;
mediump vec2 normal;
mediump float lineHalfWidth;
lowp float opacity;
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
mediump vec4 tlbr;
mediump vec2 patternSize;
#endif
#ifdef SDF
mediump float lineWidthRatio;
#endif
#if defined(PATTERN) || defined(SDF)
highp float accumulatedDistance;
#endif
#endif
highp vec3 id;
};`,"line.frag":`uniform lowp float u_blur;
#if !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE) && !defined(HIGHLIGHT)
#if defined(PATTERN) || defined(SDF)
uniform sampler2D u_texture;
uniform highp float u_pixelRatio;
#endif
#endif
#if defined(SDF) && !defined(HIGHLIGHT) && !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE)
lowp vec4 getLineColor(LineData line) {
mediump float adjustedPatternWidth = line.patternSize.x * 2.0 * line.lineWidthRatio;
mediump float relativeTexX = fract(line.accumulatedDistance / adjustedPatternWidth);
mediump float relativeTexY = 0.5 + 0.25 * line.normal.y;
mediump vec2 texCoord = mix(line.tlbr.xy, line.tlbr.zw, vec2(relativeTexX, relativeTexY));
mediump float d = rgba2float(texture2D(u_texture, texCoord)) - 0.5;
float dist = d * line.lineHalfWidth;
return line.opacity * clamp(0.5 - dist, 0.0, 1.0) * line.color;
}
#elif defined(PATTERN) && !defined(HIGHLIGHT) && !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE)
lowp vec4 getLineColor(LineData line) {
mediump float lineHalfWidth = line.lineHalfWidth;
mediump float adjustedPatternHeight = line.patternSize.y * 2.0 * lineHalfWidth / line.patternSize.x;
mediump float relativeTexY = fract(line.accumulatedDistance / adjustedPatternHeight);
mediump float relativeTexX = 0.5 + 0.5 * line.normal.y;
mediump vec2 texCoord = mix(line.tlbr.xy, line.tlbr.zw, vec2(relativeTexX, relativeTexY));
lowp vec4 color = texture2D(u_texture, texCoord);
#ifdef VV_COLOR
if (v_sampleAlphaOnly > 0.5) {
color.rgb = vec3(color.a);
}
#endif
return line.opacity * line.color * color;
}
#else
lowp vec4 getLineColor(LineData line) {
return line.opacity * line.color;
}
#endif
vec4 shadeLine(LineData line)
{
mediump float thinLineFactor = max(THIN_LINE_WIDTH_FACTOR * step(line.lineHalfWidth, THIN_LINE_HALF_WIDTH), 1.0);
mediump float fragDist = length(line.normal) * line.lineHalfWidth;
lowp float alpha = clamp(thinLineFactor * (line.lineHalfWidth - fragDist) / (u_blur + thinLineFactor - 1.0), 0.0, 1.0);
lowp vec4 out_color = getLineColor(line) * alpha;
#ifdef HIGHLIGHT
out_color.a = step(1.0 / 255.0, out_color.a);
#endif
#ifdef ID
if (out_color.a < 1.0 / 255.0) {
discard;
}
out_color = vec4(line.id, 0.0);
#endif
return out_color;
}`,"line.vert":`float getBaseLineHalfWidth(in float lineHalfWidth, in float referenceHalfWidth) {
#ifdef VV_SIZE
float refLineWidth = 2.0 * referenceHalfWidth;
return 0.5 * (lineHalfWidth / max(referenceHalfWidth, EPSILON)) * getSize(refLineWidth);
#else
return lineHalfWidth;
#endif
}
float getLineHalfWidth(in float baseWidth, in float aa) {
float halfWidth = max(baseWidth + aa, 0.45) + 0.1 * aa;
#ifdef HIGHLIGHT
halfWidth = max(halfWidth, 2.0);
#endif
return halfWidth;
}
vec2 getDist(in vec2 offset, in float halfWidth) {
float thinLineFactor = max(THIN_LINE_WIDTH_FACTOR * step(halfWidth, THIN_LINE_HALF_WIDTH), 1.0);
return thinLineFactor * halfWidth * offset;
}
LineData buildLine(
out vec3 out_pos,
in vec3 in_id,
in vec2 in_pos,
in vec4 in_color,
in vec2 in_offset,
in vec2 in_normal,
in float in_accumulatedDist,
in float in_lineHalfWidth,
in float in_bitSet,
in vec4 in_tlbr,
in vec2 in_segmentDirection,
in float in_referenceHalfWidth
)
{
float aa        = 0.5 * u_antialiasing;
float baseWidth = getBaseLineHalfWidth(in_lineHalfWidth, in_referenceHalfWidth);
float halfWidth = getLineHalfWidth(baseWidth, aa);
float z         = 2.0 * step(baseWidth, 0.0);
vec2  dist      = getDist(in_offset, halfWidth);
vec3  offset    = u_displayViewMat3 * vec3(dist, 0.0);
vec3  pos       = u_dvsMat3 * vec3(in_pos * POSITION_PRECISION, 1.0) + offset;
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
vec4  color     = in_color;
float opacity   = 1.0;
#else
vec4  color     = getColor(in_color, in_bitSet, BITSET_GENERIC_LOCK_COLOR);
float opacity   = getOpacity();
#ifdef SDF
const float SDF_PATTERN_HALF_WIDTH = 15.5;
float scaleDash = getBit(in_bitSet, BITSET_LINE_SCALE_DASH);
float lineWidthRatio = (scaleDash * max(halfWidth - 0.55 * u_antialiasing, 0.25) + (1.0 - scaleDash)) / SDF_PATTERN_HALF_WIDTH;
#endif
#endif
#if !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE) && defined(PATTERN)
v_sampleAlphaOnly = getBit(in_bitSet, BITSET_GENERIC_CONSIDER_ALPHA_ONLY);
#endif
out_pos = vec3(pos.xy, z);
return LineData(
color,
in_normal,
halfWidth,
opacity,
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
in_tlbr / u_mosaicSize.xyxy,
vec2(in_tlbr.z - in_tlbr.x, in_tlbr.w - in_tlbr.y),
#endif
#ifdef SDF
lineWidthRatio,
#endif
#if defined(PATTERN) || defined(SDF)
in_accumulatedDist * u_zoomFactor + dot(in_segmentDirection, dist),
#endif
#endif
norm(in_id)
);
}`}},text:{"common.glsl":`uniform highp vec2 u_mosaicSize;
varying highp vec3 v_id;
varying mediump vec3 v_pos;
varying lowp float v_opacity;
varying lowp vec4 v_color;
varying highp vec2 v_tex;
varying mediump float v_antialiasingWidth;
varying mediump float v_edgeDistanceOffset;
varying lowp float v_transparency;`,"hittest.glsl":`#include <materials/hittest/common.glsl>`,"text.frag":`precision mediump float;
#include <materials/text/common.glsl>
uniform lowp sampler2D u_texture;
#ifdef HITTEST
vec4 getColor() {
return v_color;
}
#else
vec4 getColor()
{
float SDF_CUTOFF = (2.0 / 8.0);
float SDF_BASE_EDGE_DIST = 1.0 - SDF_CUTOFF;
lowp float dist = texture2D(u_texture, v_tex).a;
mediump float edge = SDF_BASE_EDGE_DIST - v_edgeDistanceOffset;
#ifdef HIGHLIGHT
edge /= 2.0;
#endif
lowp float aa = v_antialiasingWidth;
lowp float alpha = smoothstep(edge - aa, edge + aa, dist);
return alpha * v_color * v_opacity;
}
#endif
void main()
{
gl_FragColor = getColor();
}`,"text.vert":`precision highp float;
#include <materials/utils.glsl>
#include <materials/vcommon.glsl>
#include <materials/text/common.glsl>
#include <materials/text/hittest.glsl>
attribute vec4 a_color;
attribute vec4 a_haloColor;
attribute vec4 a_texFontSize;
attribute vec4 a_aux;
attribute vec2 a_zoomRange;
attribute vec2 a_vertexOffset;
attribute vec2 a_texCoords;
uniform float u_isHaloPass;
uniform float u_isBackgroundPass;
float getTextSize(inout vec2 offset, inout float baseSize, in float referenceSize) {
#ifdef VV_SIZE
float r = getSize(referenceSize) / referenceSize;
baseSize *= r;
offset.xy *= r;
return baseSize;
#endif
return baseSize;
}
void main()
{
INIT;
float a_isBackground  = a_aux.y;
float a_referenceSize = a_aux.z * a_aux.z / 256.0;
float a_bitSet        = a_aux.w;
float a_fontSize      = a_texFontSize.z;
vec2  a_offset        = a_vertexOffset * OFFSET_PRECISION;
vec3  in_pos        = vec3(a_pos * POSITION_PRECISION, 1.0);
float fontSize      = getTextSize(a_offset, a_fontSize, a_referenceSize);
float fontScale     = fontSize / SDF_FONT_SIZE;
vec3  offset        = getRotation() * vec3(a_offset, 0.0);
mat3  extrudeMatrix = getBit(a_bitSet, 0) == 1.0 ? u_displayViewMat3 : u_displayMat3;
float isText = 1.0 - a_isBackground;
float isBackground = u_isBackgroundPass * a_isBackground;
vec4  nonHaloColor  = (isBackground * a_color) + (isText * getColor(a_color, a_bitSet, 1));
v_color   = u_isHaloPass * a_haloColor + (1.0 - u_isHaloPass) * nonHaloColor;
v_opacity = getOpacity();
v_id      = norm(a_id);
v_tex     = a_texCoords / u_mosaicSize;
v_pos     = u_dvsMat3 * in_pos + extrudeMatrix * offset;
float isHidden = u_isBackgroundPass * isText + (1.0 - u_isBackgroundPass) * a_isBackground;
v_pos.z += 2.0 * isHidden;
v_edgeDistanceOffset = u_isHaloPass * OUTLINE_SCALE * a_texFontSize.w / fontScale / MAX_SDF_DISTANCE;
v_antialiasingWidth  = 0.105 * SDF_FONT_SIZE / fontSize / u_pixelRatio;
#ifdef HITTEST
highp vec3 out_pos  = vec3(0.);
v_color = vec4(0.);
hittestMarker(v_color, out_pos, u_viewMat3 * u_tileMat3 *  vec3(a_pos * POSITION_PRECISION, 1.0)
+ u_tileMat3 * offset, fontSize / 2.);
gl_PointSize = 1.;
gl_Position = vec4(clip(v_color, out_pos, getFilterFlags(), a_zoomRange), 1.0);
#else
gl_Position =  vec4(clip(v_color, v_pos, getFilterFlags(), a_zoomRange), 1.0);
#endif
}`},"symbologyTypeUtils.glsl":`#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_OUTLINE_FILL || SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_OUTLINE_FILL_SIMPLE
#define SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_SIMPLE || SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_OUTLINE_FILL_SIMPLE
#define SYMBOLOGY_TYPE_IS_SIMPLE_LIKE
#endif`,"vv.glsl":`#if defined(VV_SIZE_MIN_MAX_VALUE) || defined(VV_SIZE_SCALE_STOPS) || defined(VV_SIZE_FIELD_STOPS) || defined(VV_SIZE_UNIT_VALUE)
#define VV_SIZE
#endif
#if defined(VV_COLOR) || defined(VV_SIZE) || defined(VV_OPACITY) || defined(VV_ROTATION)
#define VV
#endif
#ifdef VV_COLOR
uniform highp float colorValues[8];
uniform vec4 colors[8];
#endif
#ifdef VV_SIZE_MIN_MAX_VALUE
uniform highp vec4 minMaxValueAndSize;
#endif
#ifdef VV_SIZE_SCALE_STOPS
uniform highp float values[8];
uniform float sizes[8];
#endif
#ifdef VV_SIZE_FIELD_STOPS
uniform highp float values[8];
uniform float sizes[8];
#endif
#ifdef VV_SIZE_UNIT_VALUE
uniform highp float unitMeterRatio;
#endif
#ifdef VV_OPACITY
uniform highp float opacityValues[8];
uniform float opacities[8];
#endif
#ifdef VV_ROTATION
uniform lowp float rotationType;
#endif
bool isNan(float val) {
return (val == NAN_MAGIC_NUMBER);
}
#ifdef VV_SIZE_MIN_MAX_VALUE
float getVVMinMaxSize(float sizeValue, float fallback) {
if (isNan(sizeValue)) {
return fallback;
}
float interpolationRatio = (sizeValue  - minMaxValueAndSize.x) / (minMaxValueAndSize.y - minMaxValueAndSize.x);
interpolationRatio = clamp(interpolationRatio, 0.0, 1.0);
return minMaxValueAndSize.z + interpolationRatio * (minMaxValueAndSize.w - minMaxValueAndSize.z);
}
#endif
#ifdef VV_SIZE_SCALE_STOPS
float getVVScaleStopsSize(float currentScale) {
float outSize;
if (currentScale <= values[0]) {
outSize = sizes[0];
} else {
if (currentScale >= values[7]) {
outSize = sizes[7];
} else {
int index;
index = -1;
for (int i = 0; i < 8; i++) {
if (values[i] > currentScale) {
index = i;
break;
}
}
int prevIndex = index - 1;
float a = currentScale - values[prevIndex];
float b = values[index] - values[prevIndex];
outSize = mix(sizes[prevIndex], sizes[index], a / b);
}
}
return outSize;
}
#endif
#ifdef VV_SIZE_FIELD_STOPS
const int VV_SIZE_N = 8;
float getVVStopsSize(float sizeValue, float fallback) {
if (isNan(sizeValue)) {
return fallback;
}
if (sizeValue <= values[0]) {
return sizes[0];
}
if (sizeValue >= values[VV_SIZE_N - 1]) {
return sizes[VV_SIZE_N - 1];
}
for (int i = 1; i < VV_SIZE_N; ++i) {
if (values[i] >= sizeValue) {
float f = (sizeValue - values[i-1]) / (values[i] - values[i-1]);
return mix(sizes[i-1], sizes[i], f);
}
}
return sizes[VV_SIZE_N - 1];
}
#endif
#ifdef VV_SIZE_UNIT_VALUE
float getVVUnitValue(float sizeValue, float fallback) {
if (isNan(sizeValue)) {
return fallback;
}
return sizeValue * (metersPerSRUnit / unitMeterRatio);
}
#endif
#ifdef VV_OPACITY
const int VV_OPACITY_N = 8;
float getVVOpacity(float opacityValue) {
if (isNan(opacityValue)) {
return 1.0;
}
if (opacityValue <= opacityValues[0]) {
return opacities[0];
}
for (int i = 1; i < VV_OPACITY_N; ++i) {
if (opacityValues[i] >= opacityValue) {
float f = (opacityValue - opacityValues[i-1]) / (opacityValues[i] - opacityValues[i-1]);
return mix(opacities[i-1], opacities[i], f);
}
}
return opacities[VV_OPACITY_N - 1];
}
#endif
#ifdef VV_ROTATION
mat4 getVVRotation(float rotationValue) {
if (isNan(rotationValue)) {
return mat4(1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1);
}
float rotation = rotationValue;
if (rotationType == 1.0) {
rotation = 90.0 - rotation;
}
float angle = C_DEG_TO_RAD * rotation;
float sinA = sin(angle);
float cosA = cos(angle);
return mat4(cosA, sinA, 0, 0,
-sinA,  cosA, 0, 0,
0,     0, 1, 0,
0,     0, 0, 1);
}
mat3 getVVRotationMat3(float rotationValue) {
if (isNan(rotationValue)) {
return mat3(1, 0, 0,
0, 1, 0,
0, 0, 1);
}
float rotation = rotationValue;
if (rotationType == 1.0) {
rotation = 90.0 - rotation;
}
float angle = C_DEG_TO_RAD * -rotation;
float sinA = sin(angle);
float cosA = cos(angle);
return mat3(cosA, -sinA, 0,
sinA, cosA, 0,
0,    0,    1);
}
#endif
#ifdef VV_COLOR
const int VV_COLOR_N = 8;
vec4 getVVColor(float colorValue, vec4 fallback, float isColorLocked) {
if (isNan(colorValue) || isColorLocked == 1.0) {
return fallback;
}
if (colorValue <= colorValues[0]) {
return colors[0];
}
for (int i = 1; i < VV_COLOR_N; ++i) {
if (colorValues[i] >= colorValue) {
float f = (colorValue - colorValues[i-1]) / (colorValues[i] - colorValues[i-1]);
return mix(colors[i-1], colors[i], f);
}
}
return colors[VV_COLOR_N - 1];
}
#endif
float getVVSize(in float size, in float vvSize, in float currentScale)  {
#ifdef VV_SIZE_MIN_MAX_VALUE
return getVVMinMaxSize(vvSize, size);
#elif defined(VV_SIZE_SCALE_STOPS)
float outSize = getVVScaleStopsSize(currentScale);
return isNan(outSize) ? size : outSize;
#elif defined(VV_SIZE_FIELD_STOPS)
float outSize = getVVStopsSize(vvSize, size);
return isNan(outSize) ? size : outSize;
#elif defined(VV_SIZE_UNIT_VALUE)
return getVVUnitValue(vvSize, size);
#else
return size;
#endif
}`,"utils.glsl":`float rshift(in float u32, in int amount) {
return floor(u32 / pow(2.0, float(amount)));
}
float getBit(in float bitset, in int bitIndex) {
float offset = pow(2.0, float(bitIndex));
return mod(floor(bitset / offset), 2.0);
}
const int maxHighlightReasons = 6;
float getFilterBit(in float bitset, in int bitIndex) {
return getBit(bitset, bitIndex + maxHighlightReasons);
}
float getHighlightBit(in float bitset, in int bitIndex) {
return getBit(bitset, bitIndex);
}
highp vec3 unpackDisplayIdTexel(in highp vec3 bitset) {
float isAggregate = getBit(bitset.b, 7);
return (1.0 - isAggregate) * bitset + isAggregate * (vec3(bitset.rgb) - vec3(0.0, 0.0, float(0x80)));
}
vec4 unpack(in float u32) {
float r = mod(rshift(u32, 0), 255.0);
float g = mod(rshift(u32, 8), 255.0);
float b = mod(rshift(u32, 16), 255.0);
float a = mod(rshift(u32, 24), 255.0);
return vec4(r, g, b, a);
}
vec3 norm(in vec3 v) {
return v /= 255.0;
}
vec4 norm(in vec4 v) {
return v /= 255.0;
}
float max4(vec4 target) {
return max(max(max(target.x, target.y), target.z), target.w);
}
vec2 unpack_u8_nf32(vec2 bytes) {
return (bytes - 127.0) / 127.0;
}
highp float rand(in vec2 co) {
highp float a = 12.9898;
highp float b = 78.233;
highp float c = 43758.5453;
highp float dt = dot(co, vec2(a,b));
highp float sn = mod(dt, 3.14);
return fract(sin(sn) * c);
}`,"vcommon.glsl":`#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/attributeData.glsl>
#include <materials/vv.glsl>
#include <materials/barycentric.glsl>
attribute vec2 a_pos;
attribute highp vec3 a_id;
uniform highp mat3 displayViewScreenMat3;
uniform highp mat3 displayViewMat3;
uniform highp mat3 displayMat3;
uniform highp mat3 tileMat3;
uniform highp mat3 viewMat3;
uniform highp float pixelRatio;
uniform mediump float zoomFactor;
uniform mediump float antialiasing;
uniform mediump float currentScale;
uniform mediump float currentZoom;
uniform mediump float metersPerSRUnit;
uniform mediump float activeReasons;
uniform mediump float highlightAll;
vec4 VV_ADATA = vec4(0.0);
void loadVisualVariableData(inout vec4 target) {
target.rgba = getVisualVariableData(a_id);
}
#ifdef VV
#define INIT loadVisualVariableData(VV_ADATA)
#else
#define INIT
#endif
vec4 getColor(in vec4 a_color, in float a_bitSet, int index) {
#ifdef VV_COLOR
float isColorLocked   = getBit(a_bitSet, index);
return getVVColor(VV_ADATA[ATTR_VV_COLOR], a_color, isColorLocked);
#else
return a_color;
#endif
}
float getOpacity() {
#ifdef VV_OPACITY
return getVVOpacity(VV_ADATA[ATTR_VV_OPACITY]);
#else
return 1.0;
#endif
}
float getSize(in float in_size, in float currentScale) {
#ifdef VV_SIZE
return getVVSize(in_size, VV_ADATA[ATTR_VV_SIZE], currentScale);
#else
return in_size;
#endif
}
mat3 getRotation() {
#ifdef VV_ROTATION
return getVVRotationMat3(mod(VV_ADATA[ATTR_VV_ROTATION], 360.0));
#else
return mat3(1.0);
#endif
}
float getFilterFlags() {
#ifdef IGNORES_SAMPLER_PRECISION
return ceil(getFilterData(a_id).x * 255.0);
#else
return getFilterData(a_id).x * 255.0;
#endif
}
vec4 getAnimationState() {
return getAnimation(a_id);
}
float getMinZoom() {
vec4 data0 = getFilterData(a_id) * 255.0;
return data0.g;
}
mat3 getMatrixNoDisplay(float isMapAligned) {
return isMapAligned * viewMat3 * tileMat3 + (1.0 - isMapAligned) * tileMat3;
}
mat3 getMatrix(float isMapAligned) {
return isMapAligned * displayViewMat3 + (1.0 - isMapAligned) * displayMat3;
}
float checkHighlightBit(float filterFlags, int index) {
return getHighlightBit(filterFlags, index) * getBit(activeReasons, index);
}
float checkHighlight(float filterFlags) {
float result = checkHighlightBit(filterFlags, 0);
for (int i = 1; i < maxHighlightReasons; i++) {
result = result + checkHighlightBit(filterFlags, i);
}
return step(0.1, result + highlightAll);
}
vec3 clip(inout vec4 color, inout vec3 pos, in float filterFlags, in vec2 minMaxZoom) {
pos.z += 2.0 * (1.0 - getFilterBit(filterFlags, 0));
#ifdef inside
pos.z += 2.0 * (1.0 - getFilterBit(filterFlags, 1));
#elif defined(outside)
pos.z += 2.0 * getFilterBit(filterFlags, 1);
#elif defined(highlight)
pos.z += 2.0 * (1.0 - checkHighlight(filterFlags));
#endif
pos.z += 2.0 * (step(minMaxZoom.y, currentZoom) + (1.0 - step(minMaxZoom.x, currentZoom)));
return pos;
}`},"post-processing":{dra:{"dra.frag":`precision mediump float;
uniform sampler2D u_minColor;
uniform sampler2D u_maxColor;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main() {
vec4 minColor = texture2D(u_minColor, vec2(0.5));
vec4 maxColor = texture2D(u_maxColor, vec2(0.5));
vec4 color = texture2D(u_texture, v_uv);
vec3 minColorUnpremultiply = minColor.rgb / minColor.a;
vec3 maxColorUnpremultiply = maxColor.rgb / maxColor.a;
vec3 colorUnpremultiply = color.rgb / color.a;
vec3 range = maxColorUnpremultiply - minColorUnpremultiply;
gl_FragColor = vec4(color.a * (colorUnpremultiply - minColorUnpremultiply) / range, color.a);
}`,"min-max":{"min-max.frag":`#extension GL_EXT_draw_buffers : require
precision mediump float;
#define CELL_SIZE 2
uniform sampler2D u_minTexture;
uniform sampler2D u_maxTexture;
uniform vec2 u_srcResolution;
uniform vec2 u_dstResolution;
varying vec2 v_uv;
void main() {
vec2 srcPixel = floor(gl_FragCoord.xy) * float(CELL_SIZE);
vec2 onePixel = vec2(1.0) / u_srcResolution;
vec2 uv = (srcPixel + 0.5) / u_srcResolution;
vec4 minColor = vec4(1.0);
vec4 maxColor = vec4(0.0);
for (int y = 0; y < CELL_SIZE; ++y) {
for (int x = 0; x < CELL_SIZE; ++x) {
vec2 offset = uv + vec2(x, y) * onePixel;
minColor = min(minColor, texture2D(u_minTexture, offset));
maxColor = max(maxColor, texture2D(u_maxTexture, offset));
}
}
gl_FragData[0] = minColor;
gl_FragData[1] = maxColor;
}`}},"edge-detect":{"frei-chen":{"frei-chen.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
uniform vec2 u_texSize;
varying vec2 v_uv;
vec2 texel = vec2(1.0 / u_texSize.x, 1.0 / u_texSize.y);
mat3 G[9];
const mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );
const mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );
const mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );
const mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );
const mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );
const mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );
const mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );
const mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );
const mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );
void main() {
G[0] = g0,
G[1] = g1,
G[2] = g2,
G[3] = g3,
G[4] = g4,
G[5] = g5,
G[6] = g6,
G[7] = g7,
G[8] = g8;
mat3 I;
float cnv[9];
vec3 sample;
for (float i = 0.0; i < 3.0; i++) {
for (float j = 0.0; j < 3.0; j++) {
sample = texture2D(u_colorTexture, v_uv + texel * vec2(i - 1.0,j - 1.0)).rgb;
I[int(i)][int(j)] = length(sample);
}
}
for (int i = 0; i < 9; i++) {
float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
cnv[i] = dp3 * dp3;
}
float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);
gl_FragColor = vec4(vec3(sqrt(M / S)), texture2D(u_colorTexture, v_uv).a);
}`},sobel:{"sobel.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
varying vec2 v_uv;
uniform vec2 u_texSize;
vec2 texel = vec2(1.0 / u_texSize.x, 1.0 / u_texSize.y);
mat3 G[2];
const mat3 g0 = mat3( 1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0 );
const mat3 g1 = mat3( 1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0 );
void main() {
mat3 I;
float cnv[2];
vec3 sample;
G[0] = g0;
G[1] = g1;
for (float i = 0.0; i < 3.0; i++) {
for (float j = 0.0; j < 3.0; j++) {
sample = texture2D( u_colorTexture, v_uv + texel * vec2(i-1.0,j-1.0) ).rgb;
I[int(i)][int(j)] = length(sample);
}
}
for (int i = 0; i < 2; i++) {
float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
cnv[i] = dp3 * dp3;
}
gl_FragColor = vec4(vec3(0.5 * sqrt(cnv[0] * cnv[0] + cnv[1] * cnv[1])), texture2D(u_colorTexture, v_uv).a);
}`}},"edge-enhance":{"edge-enhance.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
varying vec2 v_uv;
uniform vec2 u_texSize;
vec2 texel = vec2(1.0 / u_texSize.x, 1.0 / u_texSize.y);
mat3 G[2];
const mat3 g0 = mat3( 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0 );
const mat3 g1 = mat3( 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, -1.0, -1.0, -1.0 );
void main() {
mat3 I;
float cnv[2];
vec3 sample;
G[0] = g0;
G[1] = g1;
for (float i = 0.0; i < 3.0; i++) {
for (float j = 0.0; j < 3.0; j++) {
sample = texture2D( u_colorTexture, v_uv + texel * vec2(i-1.0,j-1.0) ).rgb;
I[int(i)][int(j)] = length(sample);
}
}
for (int i = 0; i < 2; i++) {
float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
cnv[i] = dp3 * dp3;
}
vec4 color = texture2D(u_colorTexture, v_uv);
gl_FragColor = vec4(0.5 * sqrt(cnv[0] * cnv[0] + cnv[1] * cnv[1]) * color);
}`},filterEffect:{"filterEffect.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
uniform mat4 u_coefficients;
varying vec2 v_uv;
void main() {
vec4 color = texture2D(u_colorTexture, v_uv);
vec4 rgbw = u_coefficients * vec4(color.a > 0.0 ? color.rgb / color.a : vec3(0.0), 1.0);
float a = color.a;
gl_FragColor = vec4(a * rgbw.rgb, a);
}`},pp:{"pp.vert":`precision mediump float;
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
gl_Position = vec4(a_position, 0.0, 1.0);
v_uv = (a_position + 1.0) / 2.0;
}`}},raster:{common:{"projection.glsl":`uniform sampler2D u_transformGrid;
uniform vec2 u_transformSpacing;
uniform vec2 u_transformGridSize;
uniform vec2 u_targetImageSize;
vec2 projectPixelLocation(vec2 coords) {
#ifdef LOOKUP_PROJECTION
vec4 pv = texture2D(u_transformGrid, coords);
return vec2(pv.r, pv.g);
#endif
vec2 index_image = floor(coords * u_targetImageSize);
vec2 oneTransformPixel = vec2(0.25 / u_transformGridSize.s, 1.0 / u_transformGridSize.t);
vec2 index_transform = floor(index_image / u_transformSpacing) / u_transformGridSize;
vec2 pos = fract((index_image + vec2(0.5, 0.5)) / u_transformSpacing);
vec2 srcLocation;
vec2 transform_location = index_transform + oneTransformPixel * 0.5;
if (pos.s <= pos.t) {
vec4 ll_abc = texture2D(u_transformGrid, vec2(transform_location.s, transform_location.t));
vec4 ll_def = texture2D(u_transformGrid, vec2(transform_location.s + oneTransformPixel.s, transform_location.t));
srcLocation.s = dot(ll_abc.rgb, vec3(pos, 1.0));
srcLocation.t = dot(ll_def.rgb, vec3(pos, 1.0));
} else {
vec4 ur_abc = texture2D(u_transformGrid, vec2(transform_location.s + 2.0 * oneTransformPixel.s, transform_location.t));
vec4 ur_def = texture2D(u_transformGrid, vec2(transform_location.s + 3.0 * oneTransformPixel.s, transform_location.t));
srcLocation.s = dot(ur_abc.rgb, vec3(pos, 1.0));
srcLocation.t = dot(ur_def.rgb, vec3(pos, 1.0));
}
return srcLocation;
}`,"common.glsl":`uniform sampler2D u_image;
uniform int u_bandCount;
uniform bool u_flipY;
uniform float u_opacity;
uniform int u_resampling;
uniform vec2 u_srcImageSize;
#ifdef APPLY_PROJECTION
#include <raster/common/projection.glsl>
#endif
#ifdef BICUBIC
#include <filtering/bicubic.glsl>
#endif
#ifdef BILINEAR
#include <filtering/bilinear.glsl>
#endif
vec2 getPixelLocation(vec2 coords) {
vec2 targetLocation = u_flipY ? vec2(coords.s, 1.0 - coords.t) : coords;
#ifdef APPLY_PROJECTION
targetLocation = projectPixelLocation(targetLocation);
#endif
return targetLocation;
}
bool isOutside(vec2 coords){
if (coords.t>1.00001 ||coords.t<-0.00001 || coords.s>1.00001 ||coords.s<-0.00001) {
return true;
} else {
return false;
}
}
vec4 getPixel(vec2 pixelLocation) {
#ifdef BICUBIC
vec4 color = sampleBicubicBSpline(u_image, pixelLocation, u_srcImageSize);
#elif defined(BILINEAR)
vec4 color = sampleBilinear(u_image, pixelLocation, u_srcImageSize);
#else
vec4 color = texture2D(u_image, pixelLocation);
#endif
return color;
}`},flow:{"getDisplayOpacity.glsl":`uniform float u_displayOpacity;
float getDisplayOpacity() {
return u_displayOpacity;
}`,"getFadeOpacity.glsl":`uniform float u_decayRate;
uniform float u_fadeToZero;
float getFadeOpacity(float x) {
float cutOff = mix(0.0, exp(-u_decayRate), u_fadeToZero);
return (exp(-u_decayRate * x) - cutOff) / (1.0 - cutOff);
}`,"getFragmentColor.glsl":`vec4 getFragmentColor(vec4 color, float dist, float size, float featheringSize) {
float featheringStart = clamp(0.5 - featheringSize / size, 0.0, 0.5);
if (dist > featheringStart) {
color *= 1.0 - (dist - featheringStart) / (0.5 - featheringStart);
}
return color;
}`,"getRangeOpacity.glsl":`uniform float u_startTime;
uniform float u_endTime;
float getRangeOpacity(float vertexTime, float cycle, float totalTime, float flowSpeed) {
float vTime = (vertexTime + cycle * totalTime) / flowSpeed;
if (vTime < u_startTime) {
return 0.0;
}
if (vTime > u_endTime) {
return 0.0;
}
return 1.0;
}`,"getTimeSeed.glsl":`float getTimeSeed(float firstTime, float lastTime) {
return mod(firstTime * 3.634f + lastTime * 5.153f + 7.381f, 1.0f);
}`,imagery:{"imagery.frag":`precision highp float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform float u_Min;
uniform float u_Max;
uniform float u_featheringSize;
#include <raster/flow/vv.glsl>
float getIntensity(float v) {
return u_Min + v * (u_Max - u_Min);
}
void main(void) {
vec4 sampled = texture2D(u_texture, v_texcoord);
float intensity = getIntensity(sampled.r);
gl_FragColor = getColor(intensity);
gl_FragColor.a *= getOpacity(sampled.r);
gl_FragColor.a *= sampled.a;
gl_FragColor.rgb *= gl_FragColor.a;
}`,"imagery.vert":`attribute vec2 a_position;
attribute vec2 a_texcoord;
uniform mat3 u_dvsMat3;
varying vec2 v_texcoord;
void main(void) {
vec2 xy = (u_dvsMat3 * vec3(a_position, 1.0)).xy;
gl_Position = vec4(xy, 0.0, 1.0);
v_texcoord = a_texcoord;
}`},particles:{"particles.frag":`precision highp float;
varying vec4 v_color;
varying vec2 v_texcoord;
varying float v_size;
uniform float u_featheringSize;
#include <raster/flow/getFragmentColor.glsl>
void main(void) {
gl_FragColor = getFragmentColor(v_color, length(v_texcoord - 0.5), v_size, u_featheringSize);
}`,"particles.vert":`attribute vec4 a_xyts0;
attribute vec4 a_xyts1;
attribute vec4 a_typeIdFirstTimeLastTime;
attribute vec4 a_extrudeInfo;
uniform mat3 u_dvsMat3;
uniform mat3 u_displayViewMat3;
uniform float u_time;
uniform float u_trailLength;
uniform float u_flowSpeed;
varying vec4 v_color;
varying vec2 v_texcoord;
varying float v_size;
uniform float u_featheringSize;
uniform float u_introFade;
#include <raster/flow/vv.glsl>
#include <raster/flow/getFadeOpacity.glsl>
#include <raster/flow/getDisplayOpacity.glsl>
#include <raster/flow/getTimeSeed.glsl>
void main(void) {
float firstTime = a_typeIdFirstTimeLastTime.z;
float lastTime = a_typeIdFirstTimeLastTime.w;
float duration = lastTime - firstTime;
vec2 position0 = a_xyts0.xy;
float t0 = a_xyts0.z - firstTime;
float speed0 = a_xyts0.w;
vec2 position1 = a_xyts1.xy;
float t1 = a_xyts1.z - firstTime;
float speed1 = a_xyts1.w;
float type = a_typeIdFirstTimeLastTime.x;
float id = a_typeIdFirstTimeLastTime.y;
float seed = getTimeSeed(firstTime, lastTime);
vec2 e0 = a_extrudeInfo.xy;
vec2 e1 = a_extrudeInfo.zw;
float animationPeriod = duration + u_trailLength;
float scaledTime = u_time * u_flowSpeed;
float t = mod(scaledTime, animationPeriod);
float fUnclamped = (t - t0) / (t1 - t0);
float f = clamp(fUnclamped, 0.0, 1.0);
float clampedTime = mix(t0, t1, f);
float speed = mix(speed0, speed1, f);
vec2 extrude;
vec2 position;
float fadeOpacity;
float introOpacity;
if (type == 2.0) {
if (fUnclamped < 0.0 || (fUnclamped > 1.0 && t1 != duration)) {
gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
return;
}
vec2 ortho = mix(e0, e1, f);
vec2 parallel;
parallel = normalize(position1 - position0) * 0.5;
if (id == 1.0) {
extrude = ortho;
v_texcoord = vec2(0.5, 0.0);
} else if (id == 2.0) {
extrude = -ortho;
v_texcoord = vec2(0.5, 1.0);
} else if (id == 3.0) {
extrude = ortho + parallel;
v_texcoord = vec2(1.0, 0.0);
} else if (id == 4.0) {
extrude = -ortho + parallel;
v_texcoord = vec2(1.0, 1.0);
}
fadeOpacity = getFadeOpacity((t - clampedTime) / u_trailLength);
introOpacity = 1.0 - exp(-clampedTime);
v_size = getSize(speed);
v_color = getColor(speed);
v_color.a *= getOpacity(speed);
position = mix(position0, position1, f);
} else {
if (fUnclamped < 0.0) {
gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
return;
}
if (id == 1.0) {
extrude = e0;
v_texcoord = vec2(0.5, 0.0);
fadeOpacity = getFadeOpacity((t - t0) / u_trailLength);
introOpacity = 1.0 - exp(-t0);
v_size = getSize(speed0);
v_color = getColor(speed0);
v_color.a *= getOpacity(speed0);
position = position0;
} else if (id == 2.0) {
extrude = -e0;
v_texcoord = vec2(0.5, 1.0);
fadeOpacity = getFadeOpacity((t - t0) / u_trailLength);
introOpacity = 1.0 - exp(-t0);
v_size = getSize(speed0);
v_color = getColor(speed0);
v_color.a *= getOpacity(speed0);
position = position0;
} else if (id == 3.0) {
extrude = mix(e0, e1, f);
v_texcoord = vec2(0.5, 0.0);
fadeOpacity = getFadeOpacity((t - clampedTime) / u_trailLength);
introOpacity = 1.0 - exp(-clampedTime);
v_size = getSize(speed);
v_color = getColor(speed);
v_color.a *= getOpacity(speed);
position = mix(position0, position1, f);
} else if (id == 4.0) {
extrude = -mix(e0, e1, f);
v_texcoord = vec2(0.5, 1.0);
fadeOpacity = getFadeOpacity((t - clampedTime) / u_trailLength);
introOpacity = 1.0 - exp(-clampedTime);
v_size = getSize(speed);
v_color = getColor(speed);
v_color.a *= getOpacity(speed);
position = mix(position0, position1, f);
}
}
vec2 xy = (u_dvsMat3 * vec3(position, 1.0) + u_displayViewMat3 * vec3(extrude * v_size, 0.0)).xy;
gl_Position = vec4(xy, 0.0, 1.0);
v_color.a *= fadeOpacity;
v_color.a *= mix(1.0, introOpacity, u_introFade);
v_color.a *= getDisplayOpacity();
v_color.rgb *= v_color.a;
}`},streamlines:{"streamlines.frag":`precision highp float;
varying float v_side;
varying float v_time;
varying float v_firstTime;
varying float v_lastTime;
varying vec4 v_color;
varying float v_size;
uniform float u_time;
uniform float u_trailLength;
uniform float u_flowSpeed;
uniform float u_featheringSize;
uniform float u_introFade;
#include <raster/flow/getFragmentColor.glsl>
#include <raster/flow/getFadeOpacity.glsl>
#include <raster/flow/getRangeOpacity.glsl>
#include <raster/flow/getDisplayOpacity.glsl>
#include <raster/flow/getTimeSeed.glsl>
void main(void) {
float totalTime = v_lastTime - v_firstTime;
float trailLength = u_trailLength;
float period = totalTime + trailLength;
float seed = getTimeSeed(v_firstTime, v_lastTime);
float t = mod(seed * period + u_time * u_flowSpeed, period) + v_firstTime - v_time;
float fading = t / trailLength;
vec4 color = v_color;
color *= getDisplayOpacity();
color *= fading < 0.0 ? 0.0 : getFadeOpacity(fading);
gl_FragColor = getFragmentColor(color, length((v_side + 1.0) / 2.0 - 0.5), v_size, u_featheringSize);
}`,"streamlines.vert":`attribute vec3 a_positionAndSide;
attribute vec3 a_timeInfo;
attribute vec2 a_extrude;
attribute float a_speed;
uniform mat3 u_dvsMat3;
uniform mat3 u_displayViewMat3;
varying float v_time;
varying float v_firstTime;
varying float v_lastTime;
varying vec4 v_color;
varying float v_side;
varying float v_size;
uniform float u_featheringSize;
#include <raster/flow/vv.glsl>
void main(void) {
vec4 lineColor = getColor(a_speed);
float lineOpacity = getOpacity(a_speed);
float lineSize = getSize(a_speed);
vec2 position = a_positionAndSide.xy;
v_side = a_positionAndSide.z;
vec2 xy = (u_dvsMat3 * vec3(position, 1.0) + u_displayViewMat3 * vec3(a_extrude * lineSize, 0.0)).xy;
gl_Position = vec4(xy, 0.0, 1.0);
v_time = a_timeInfo.x;
v_firstTime = a_timeInfo.y;
v_lastTime = a_timeInfo.z;
v_color = lineColor;
v_color.a *= lineOpacity;
v_color.rgb *= v_color.a;
v_size = lineSize;
}`},"vv.glsl":`#define MAX_STOPS 8
#ifdef VV_COLOR
uniform float u_color_stops[MAX_STOPS];
uniform vec4 u_color_values[MAX_STOPS];
uniform int u_color_count;
#else
uniform vec4 u_color;
#endif
#ifdef VV_OPACITY
uniform float u_opacity_stops[MAX_STOPS];
uniform float u_opacity_values[MAX_STOPS];
uniform int u_opacity_count;
#else
uniform float u_opacity;
#endif
#ifdef VV_SIZE
uniform float u_size_stops[MAX_STOPS];
uniform float u_size_values[MAX_STOPS];
uniform int u_size_count;
#else
uniform float u_size;
#endif
uniform float u_featheringOffset;
vec4 getColor(float x) {
#ifdef VV_COLOR
vec4 color = u_color_values[0];
{
for (int i = 1; i < MAX_STOPS; i++) {
if (i >= u_color_count) {
break;
}
float x1 = u_color_stops[i - 1];
if (x < x1) {
break;
}
float x2 = u_color_stops[i];
vec4 y2 = u_color_values[i];
if (x < x2) {
vec4 y1 = u_color_values[i - 1];
color = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
} else {
color = y2;
}
}
}
#else
vec4 color = u_color;
#endif
return color;
}
float getOpacity(float x) {
#ifdef VV_OPACITY
float opacity = u_opacity_values[0];
{
for (int i = 1; i < MAX_STOPS; i++) {
if (i >= u_opacity_count) {
break;
}
float x1 = u_opacity_stops[i - 1];
if (x < x1) {
break;
}
float x2 = u_opacity_stops[i];
float y2 = u_opacity_values[i];
if (x < x2) {
float y1 = u_opacity_values[i - 1];
opacity = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
} else {
opacity = y2;
}
}
}
#else
float opacity = u_opacity;
#endif
return opacity;
}
float getSize(float x) {
#ifdef VV_SIZE
float size = u_size_values[0];
{
for (int i = 1; i < MAX_STOPS; i++) {
if (i >= u_size_count) {
break;
}
float x1 = u_size_stops[i - 1];
if (x < x1) {
break;
}
float x2 = u_size_stops[i];
float y2 = u_size_values[i];
if (x < x2) {
float y1 = u_size_values[i - 1];
size = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
} else {
size = y2;
}
}
}
#else
float size = u_size;
#endif
return size + 2.0 * u_featheringSize * u_featheringOffset;
}`},reproject:{"reproject.frag":`precision mediump float;
varying vec2 v_texcoord;
#include <raster/common/common.glsl>
void main() {
vec2 pixelLocation = getPixelLocation(v_texcoord);
if (isOutside(pixelLocation)) {
gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
return;
}
vec4 currentPixel = getPixel(pixelLocation);
gl_FragColor = vec4(currentPixel.rgb, 1.0) * currentPixel.a * u_opacity;
}`,"reproject.vert":`precision mediump float;
attribute vec2 a_position;
varying highp vec2 v_texcoord;
void main()
{
v_texcoord = a_position;
gl_Position = vec4(2.0 * (a_position - 0.5), 0.0, 1.0);
}`}},stencil:{"stencil.frag":`void main() {
gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`,"stencil.vert":`attribute vec2 a_pos;
uniform mat3 u_worldExtent;
void main() {
gl_Position = vec4(u_worldExtent * vec3(a_pos, 1.0), 1.0);
}`},test:{"TestShader.frag":`precision highp float;
#include <test/TestShader.common.glsl>
void main() {
if (v_offset.x > -.5 && v_offset.y > -.5 && v_offset.x < .5 && v_offset.y < .5) {
discard;
}
#ifdef RETURN_RED
gl_FragColor = vec4(1., 0., 0., 1.);
#else
gl_FragColor = v_color;
#endif
}`,"TestShader.common.glsl":`#ifndef RETURN_RED
varying    vec4      v_color;
#endif
varying    vec2      v_offset;`,"TestShader.vert":`const float POS_PRECISION_FACTOR = 10.;
const float OFFSET_PRECISION_FACTOR = 10.;
const float SIZE_PRECISION_FACTOR = 10.;
attribute  vec2      a_pos_packed;
attribute  vec2      a_offset_packed;
attribute  float     a_size_packed;
#ifdef DATA_DRIVEN_COLOR
const float u_dataDrivenColor_validValues[4] = float[4](0., 0., 1., 0.);
uniform    vec4      u_dataDrivenColor_colorFallback;
uniform    vec4      u_dataDrivenColor_color;
#endif
uniform    float     u_view_zoomLevel;
#include <test/TestShader.common.glsl>
#ifdef DATA_DRIVEN_COLOR
vec4 getColor(float value) {
int index = -1;
for (int i = 0; i < 4; i++) {
if (u_dataDrivenColor_validValues[i] == value) {
index = i;
break;
}
}
if (index == -1) {
return u_dataDrivenColor_colorFallback;
}
return u_dataDrivenColor_color;
}
#endif
void main() {
vec2  a_pos = a_pos_packed / POS_PRECISION_FACTOR;
vec2  a_offset = a_offset_packed / OFFSET_PRECISION_FACTOR;
float a_size = a_size_packed / SIZE_PRECISION_FACTOR;
vec4 color = vec4(1., 0., 0., 1.);
#ifdef DATA_DRIVEN_COLOR
color = getColor(1.);
#endif
vec2 offsetScaled = a_offset * a_size;
vec4 pos = vec4(a_pos.xy + offsetScaled, 0., 1.);
gl_Position = pos;
#ifndef RETURN_RED
v_color = color;
#endif
v_offset = a_offset;
}`},util:{"atan2.glsl":`float atan2(in float y, in float x) {
float t0, t1, t2, t3, t4;
t3 = abs(x);
t1 = abs(y);
t0 = max(t3, t1);
t1 = min(t3, t1);
t3 = 1.0 / t0;
t3 = t1 * t3;
t4 = t3 * t3;
t0 =         - 0.013480470;
t0 = t0 * t4 + 0.057477314;
t0 = t0 * t4 - 0.121239071;
t0 = t0 * t4 + 0.195635925;
t0 = t0 * t4 - 0.332994597;
t0 = t0 * t4 + 0.999995630;
t3 = t0 * t3;
t3 = (abs(y) > abs(x)) ? 1.570796327 - t3 : t3;
t3 = x < 0.0 ?  3.141592654 - t3 : t3;
t3 = y < 0.0 ? -t3 : t3;
return t3;
}`,"encoding.glsl":`const vec4 rgba2float_factors = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgba2float(vec4 rgba) {
return dot(rgba, rgba2float_factors);
}`}};function _a(e){return function(t){let n=e;return t.split(`/`).forEach(e=>{n&&=n[e]}),n}}var va=new Ct(_a(ga));function ya(e){return va.resolveIncludes(e)}var ba={hittestDist:G,hittestPos:H},xa={size:G},Sa={filterFlags:k,animation:k,visualVariableData:k,dataDriven0:k,dataDriven1:k,dataDriven2:k,gpgpu:k},Ca={displayViewScreenMat3:T,displayViewMat3:T,displayMat3:T,viewMat3:T,tileMat3:T,displayZoomFactor:G,requiredZoomFactor:G,tileOffset:H,currentScale:G,currentZoom:G,metersPerSRUnit:G},wa=class extends pa{constructor(){super(...arguments),this.vertexShader=ya(`materials/pie/pie.vert`),this.fragmentShader=ya(`materials/pie/pie.frag`),this.required={...Ca,...xa,outlineWidth:G,colors:M,defaultColor:W,othersColor:W,outlineColor:W,donutRatio:G,sectorThreshold:G},this.textures=Sa,this.options={hittestUniforms:ba,visualVariableSizeMinMaxValue:{minMaxValueAndSize:W},visualVariableSizeScaleStops:{sizes:{type:`array`,elementType:G,size:8},values:{type:`array`,elementType:G,size:8}},visualVariableSizeStops:{sizes:{type:`array`,elementType:G,size:8},values:{type:`array`,elementType:G,size:8}},visualVariableSizeUnitValue:{unitValueToPixelsRatio:G},visualVariableOpacity:{opacities:{type:`array`,elementType:G,size:8},opacityValues:{type:`array`,elementType:G,size:8}},highlightUniforms:{highlightAll:G,activeReasons:G}},this.locations={pos:{index:0,type:H},id:{index:1,type:N},bitset:{index:2,type:G},offset:{index:3,type:H},texCoords:{index:4,type:H},referenceSize:{index:5,type:G},zoomRange:{index:6,type:H}},this.defines={VV_SIZE_MIN_MAX_VALUE:`boolean`,VV_SIZE_SCALE_STOPS:`boolean`,VV_SIZE_FIELD_STOPS:`boolean`,VV_SIZE_UNIT_VALUE:`boolean`,VV_OPACITY:`boolean`,HITTEST:`boolean`,numberOfFields:`number`,highlight:`boolean`,inside:`boolean`,outside:`boolean`}}setNumberOfFields(e){this.required.colors={type:`array`,elementType:W,size:e}}},Ta=class extends Q{constructor(){super(...arguments),this.type=30,this.shaders={geometry:new wa},this.symbologyPlane=2}render(e,t){let{painter:n}=e,{instance:r,target:i}=t,a=this.shaders.geometry,o=r.getInput(),s=o.uniforms.numberOfFields,c=y(e),l=p(e,i),u=v(e);a.setNumberOfFields(s),n.setShader({shader:a,uniforms:{...m(e,t.target,o.uniforms.shader),...l.storage,...l.view,...l.highlight,highlightUniforms:l.highlight,hittestUniforms:l.hittestRequest?{hittestDist:l.hittestRequest?.distance,hittestPos:l.hittestRequest?.position}:null},textures:f(e),defines:{VV_SIZE_MIN_MAX_VALUE:!!o.uniforms.shader.visualVariableSizeMinMaxValue,VV_SIZE_SCALE_STOPS:!!o.uniforms.shader.visualVariableSizeScaleStops,VV_SIZE_FIELD_STOPS:!!o.uniforms.shader.visualVariableSizeStops,VV_SIZE_UNIT_VALUE:!!o.uniforms.shader.visualVariableSizeUnitValue,VV_OPACITY:!!o.uniforms.shader.visualVariableOpacity,HITTEST:c,highlight:+!!l.highlight,...u,numberOfFields:s},optionalAttributes:{},useComputeBuffer:c}),n.setPipelineState(b(e)),n.submitDraw(e,t)}},Ea=class extends Q{constructor(){super(...arguments),this.type=32,this.shaders={geometry:new $},this.symbologyPlane=3}render(e,t){let{painter:n}=e,r=v(e),i=t.instance.getInput(),a={shader:this.shaders.geometry,uniforms:{...m(e,t.target,i.uniforms),...p(e,t.target),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...h(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...r,isBackgroundPass:!0,isLabel:!1,textRenderPassType:0},optionalAttributes:i.optionalAttributes,useComputeBuffer:y(e)};n.setShader(a),n.setPipelineState(b(e)),n.submitDraw(e,t),n.setShader({...a,defines:{...r,isBackgroundPass:!1,isLabel:!1,textRenderPassType:2}}),n.submitDraw(e,t),n.setShader({...a,defines:{...r,isBackgroundPass:!1,isLabel:!1,textRenderPassType:1}}),n.submitDraw(e,t),n.setShader({...a,defines:{...r,isBackgroundPass:!1,isLabel:!1,textRenderPassType:0}}),n.submitDraw(e,t)}},Da={fill:new Dr,patternFill:new Nr,complexFill:new sr,gradientFill:new jr,outlineFill:new Mr,patternOutlineFill:new Pr,complexOutlineFill:new Er,marker:new fa,pieChart:new Ta,line:new na,texturedLine:new aa,gradientStroke:new ta,text:new Ea,label:new Xi,heatmap:new zi,dotDensity:new or,flow:new Ti,animatedMarker:new Un,animatedMarkerShift:new Wn,animatedFill:new Gn,animatedLine:new Kn};function Oa(){for(let e in Da)Da[e].startup()}function ka(e){for(let t in Da)Da[t].shutdown(e)}export{Lr as C,Rr as S,wt as T,Wr as _,wi as a,qr as b,ti as c,ei as d,Yr as f,ii as g,Xr as h,ya as i,Zr as l,$r as m,Oa as n,xi as o,ri as p,Da as r,vi as s,ka as t,ni as u,Kr as v,Br as w,zr as x,Ur as y};