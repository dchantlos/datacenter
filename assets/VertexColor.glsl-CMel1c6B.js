import"./typedArrayUtil-8Eur52Mg.js";import{c as e}from"./vec3f64-DIOQknMY.js";import{t}from"./mat3f64-B6tTkprt.js";import{A as n,P as r,d as i,n as a,s as o,y as s}from"./vec3-C5q_s_3T.js";import{W as c,c as l,l as u}from"./aaBoundingBox-PisESpXU.js";import{E as d,a as f,c as p,f as m,l as h,p as g,u as _}from"./oitResolution.glsl-CziGeqeq.js";import{t as v}from"./NoParameters-XZJ-8n06.js";import{Ft as y,It as b,K as x,S,m as C,ot as w,z as T}from"./doublePrecisionUtils-CvPW6smK.js";import{J as E}from"./BufferView-CDwF6SxX.js";function D(e,t=!1){return e<=1024?t?Array(e).fill(0):Array(e):new Float32Array(e)}function O(e){return Array.isArray(e)?e.length<1024?e:new Float32Array(e):e.length<1024?Array.from(e):e}function k(e){return(Array.isArray(e)?e.length:e.byteLength/8)<=1024?Array.from(e):new Float32Array(e)}function A(e,t,n){return Array.isArray(e)?e.slice(t,t+n):e.subarray(t,t+n)}function j(e){return`byteLength`in e?e.byteLength:8*e.length}var M=class{constructor(e=0,t=!1,n=!0){this.tolerance=e,this.isVerticalRay=t,this.normalRequired=n}},N=c();function P(e,t,n,r,i,a){if(!e.visible)return;let s=o(oe,r,n),{tolerance:c}=t,l=new M(c,!1,t.options.normalRequired);if(e.boundingInfo)E(e.type===0),I(e.boundingInfo,n,s,c,i,l,a);else{let t=e.positionAttribute,r=e.primitivePositionIndices;W(n,s,0,r.length/3,r,t.data,t.stride,i,l,a)}}var F=e();function I(e,t,n,r,i,a,o){if(e==null)return;let s=Z(n,F);if(l(N,e.bbMin),u(N,e.bbMax),i?.applyToAabb(N),Q(N,t,s,r)){let{primitiveIndices:s,position:c}=e,l=s?s.length:c.indices.length/3;if(l>re){let s=e.getChildren();if(s!==void 0){for(let e of s)I(e,t,n,r,i,a,o);return}}U(t,n,0,l,c.indices,c.data,c.stride,s,i,a,o)}}var L=e();function R(e,t,n,r,i,a,s,c,l){let{data:u,stride:d}=a;W(e,o(oe,t,e),n,r,i,u,d,s,c,l)}function z(e,t,n,r){if(!n.visible)return;let{boundingInfo:i}=n;if(i){let{bbMin:n,bbMax:r}=i;if(e<n[0]||e>r[0]||t<n[1]||t>r[1])return}let a=n.positionAttribute,o=n.primitivePositionIndices;B(e,t,0,o.length/3,o,a,r)}function B(e,t,n,r,i,a,o){let{data:s,stride:c}=a;for(let a=n;a<r;++a){let n=3*a,r=c*i[n],l=c*i[n+1],u=c*i[n+2],d=s[r+0]-e,f=s[r+1]-t,p=s[l+0]-e,m=s[l+1]-t,h=s[u+0]-e,g=s[u+1]-t,_=h*m-g*p,v=d*g-f*h,y=p*f-m*d;(_<0||v<0||y<0)&&(_>0||v>0||y>0)||o(0,0,null,a)}}function V(e,t,n,r,i,a,o,s,c,l=null,u=0){let d=e[0],f=e[1],p=e[2],m=t[0],h=t[1],g=t[2];for(let e=n;e<r;++e){let t=u+(l?.[e]??e),n=3*t,r=o*i[n],_=a[r],v=a[r+1],y=a[r+2],b=o*i[n+1],x=a[b],S=a[b+1],C=a[b+2],w=o*i[n+2],T=x-_,E=S-v,D=C-y,O=a[w]-_,k=a[w+1]-v,A=a[w+2]-y,j=h*A-k*g,M=g*O-A*m,N=m*k-O*h,P=T*j+E*M+D*N,F=P*P;if(F<=ae)continue;let I=d-_,R=f-v,z=p-y,B=(I*j+R*M+z*N)*P;if(B<0||B>F)continue;let V=R*D-E*z,H=z*T-D*I,U=I*E-T*R,W=(m*V+h*H+g*U)*P;if(W<0||B+W>F)continue;let G=(O*V+k*H+A*U)/P;G>=0&&c(G,G,s?ee(T,E,D,O,k,A,L):null,t)}}function H(e,t,n,r,i,a,o,s,c,l,u,d=null,f=0){let p=e[0],m=e[1],h=e[2],g=t[0],_=t[1],v=t[2];for(let e=n;e<r;++e){let t=f+(d?.[e]??e),n=3*t,r=o*i[n],y=a[r],b=a[r+1],x=a[r+2],S=o*i[n+1],C=a[S],w=a[S+1],T=a[S+2],E=o*i[n+2],D=a[E],O=a[E+1],k=a[E+2],A=x-c,j=s/Math.sqrt(y*y+b*b+A*A),M=y+y*j,N=b+b*j,P=x+A*j,F=T-c,I=s/Math.sqrt(C*C+w*w+F*F),R=C+C*I,z=w+w*I,B=T+F*I,V=k-c,H=s/Math.sqrt(D*D+O*O+V*V),U=R-M,W=z-N,G=B-P,K=D+D*H-M,q=O+O*H-N,J=k+V*H-P,Y=_*J-q*v,X=v*K-J*g,te=g*q-K*_,Z=U*Y+W*X+G*te,Q=Z*Z;if(Q<=ae)continue;let ne=p-M,re=m-N,ie=h-P,oe=(ne*Y+re*X+ie*te)*Z;if(oe<0||oe>Q)continue;let se=re*G-W*ie,ce=ie*U-G*ne,le=ne*W-U*re,$=(g*se+_*ce+v*le)*Z;if($<0||oe+$>Q)continue;let ue=(K*se+q*ce+J*le)/Z;ue>=0&&u(ue,ue,l?ee(U,W,G,K,q,J,L):null,t)}}function U(e,t,n,r,i,a,o,s,c,l,u){let d=e[0],f=e[1],p=e[2],m=t[0],h=t[1],g=t[2],{normalRequired:_}=l;for(let e=n;e<r;++e){let t=s[e],n=3*t,r=o*i[n],l=a[r],v=a[r+1],y=a[r+2],b=o*i[n+1],x=a[b],S=a[b+1],C=a[b+2],w=o*i[n+2],T=a[w],E=a[w+1],D=a[w+2];c!=null&&([l,v,y]=c.applyToVertex(l,v,y,e),[x,S,C]=c.applyToVertex(x,S,C,e),[T,E,D]=c.applyToVertex(T,E,D,e));let O=x-l,k=S-v,A=C-y,j=T-l,M=E-v,N=D-y,P=h*N-M*g,F=g*j-N*m,I=m*M-j*h,R=O*P+k*F+A*I,z=R*R;if(z<=ae)continue;let B=d-l,V=f-v,H=p-y,U=(B*P+V*F+H*I)*R;if(U<0||U>z)continue;let W=V*A-k*H,G=H*O-A*B,K=B*k-O*V,q=(m*W+h*G+g*K)*R;if(q<0||U+q>z)continue;let J=(j*W+M*G+N*K)/R;J>=0&&u(J,J,_?ee(O,k,A,j,M,N,L):null,t)}}function W(e,t,i,a,s,c,l,u,d,f){let p=t,m=se,h=Math.abs(p[0]),g=Math.abs(p[1]),_=Math.abs(p[2]),v=h>=g?h>=_?0:2:g>=_?1:2,y=v,b=p[y]<0?2:1,x=(v+b)%3,S=(v+(3-b))%3,C=p[x]/p[y],w=p[S]/p[y],T=1/p[y],E=G,D=K,O=q,{normalRequired:k}=d;for(let t=i;t<a;++t){let i=3*t,a=l*s[i];r(m[0],c[a+0],c[a+1],c[a+2]);let d=l*s[i+1];r(m[1],c[d+0],c[d+1],c[d+2]);let p=l*s[i+2];r(m[2],c[p+0],c[p+1],c[p+2]),u&&(n(m[0],u.applyToVertex(m[0][0],m[0][1],m[0][2],t)),n(m[1],u.applyToVertex(m[1][0],m[1][1],m[1][2],t)),n(m[2],u.applyToVertex(m[2][0],m[2][1],m[2][2],t))),o(E,m[0],e),o(D,m[1],e),o(O,m[2],e);let h=E[x]-C*E[y],g=E[S]-w*E[y],_=D[x]-C*D[y],v=D[S]-w*D[y],b=O[x]-C*O[y],A=O[S]-w*O[y],j=b*v-A*_,M=h*A-g*b,N=_*g-v*h;if((j<0||M<0||N<0)&&(j>0||M>0||N>0))continue;let P=j+M+N;if(P===0)continue;let F=j*(T*E[y])+M*(T*D[y])+N*(T*O[y]);if(F*Math.sign(P)<0)continue;let I=F/P;I>=0&&f(I,I,k?J(m):null,t)}}var G=e(),K=e(),q=e();function ee(e,t,n,a,o,c,l){return r(Y,e,t,n),r(X,a,o,c),i(l,Y,X),s(l,l),l}function J(e){return o(Y,e[1],e[0]),o(X,e[2],e[0]),i(L,Y,X),s(L,L),L}var Y=e(),X=e();function te(e,t,n){return r(n,1/(t[0]-e[0]),1/(t[1]-e[1]),1/(t[2]-e[2]))}function Z(e,t){return r(t,1/e[0],1/e[1],1/e[2])}function Q(e,t,n,r){return ne(e,t,n,r,1/0)}function ne(e,t,n,r,i){let a=(e[0]-r-t[0])*n[0],o=(e[3]+r-t[0])*n[0],s=Math.min(a,o),c=Math.max(a,o),l=(e[1]-r-t[1])*n[1],u=(e[4]+r-t[1])*n[1];if(c=Math.min(c,Math.max(l,u)),c<0||(s=Math.max(s,Math.min(l,u)),s>c))return!1;let d=(e[2]-r-t[2])*n[2],f=(e[5]+r-t[2])*n[2];return c=Math.min(c,Math.max(d,f)),!(c<0)&&(s=Math.max(s,Math.min(d,f)),!(s>c)&&s<i)}var re=1e3,ie=1e-7,ae=ie*ie,oe=e(),se=[e(),e(),e()],ce=class{constructor(e){this.layout=e}elementCount(e){return e.get(`position`).indices.length}write(e,t,n,r,i){i!=null&&w(n,r,this.layout,e,t,i)}};function le(e,t,n,r){$.output=+!!t.transparent,$.polygonOffset=t.polygonOffset,$.enableOITOffset=t.enableOITOffset;let i=S($);if(!i)return e;let c=de*i.units,l=s(fe,o(fe,r,n));return(t,n,r,o)=>e(t,n+((r?1-Math.abs(a(l,r)):0)*i.factor*ue+c),r,o)}var $=new C,ue=2e-5,de=2e-6,fe=e();function pe(e){e.uniforms.add(new b(`dpDummy`,()=>1)).code.add(g`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 hiD = hiA + hiB;
vec3 loD = loA + loB;
return  dpDummy * hiD + loD;
}`)}var me=class extends _{constructor(e,t){super(e,`int`,2,(n,r,i)=>n.setUniform1i(e,t(r,i)))}},he=class extends _{constructor(e,t,n){super(e,`mat3`,2,(r,i,a)=>r.setUniformMatrix3fv(e,t(i,a),n))}};function ge(e,t){let{attributes:n,vertex:r,varyings:i,fragment:a}=e;r.include(pe),n.add(`position`,`vec3`),i.add(`vPositionWorldCameraRelative`,`vec3`),i.add(`vPosition_view`,`vec3`,{invariant:!0}),r.uniforms.add(new p(`transformWorldFromViewTH`,e=>e.transformWorldFromViewTH),new p(`transformWorldFromViewTL`,e=>e.transformWorldFromViewTL),new T(`transformViewFromCameraRelativeRS`,e=>e.transformViewFromCameraRelativeRS),new y(`transformProjFromView`,e=>e.camera.projectionMatrix));let{vertexPositionRotationType:o,useTransformationTexture:s}=t,c=o===1,l=o===2,u=c||l;s?r.uniforms.add(new me(`transformationDrawId`,e=>e.transformationDrawId),new f(`transformationTexture`,e=>e.transformationTexture)):(r.uniforms.add(new h(`transformWorldFromModelTH`,e=>e.transformWorldFromModelTH),new h(`transformWorldFromModelTL`,e=>e.transformWorldFromModelTL)),u&&r.uniforms.add(new he(`transformWorldFromModelRS`,e=>e.transformWorldFromModelRS))),r.code.add(g`
      ${m(u,g`
          mat3 modelTransformation() {
          ${m(s,g`
                return mat3(
                  texelFetch(transformationTexture, ivec2(2, transformationDrawId), 0).xyz,
                  texelFetch(transformationTexture, ivec2(3, transformationDrawId), 0).xyz,
                  texelFetch(transformationTexture, ivec2(4, transformationDrawId), 0).xyz
                );`,g`return transformWorldFromModelRS;`)}
          }
        `)}

      vec3 originL() {
        return ${m(s,g`texelFetch(transformationTexture, ivec2(0, transformationDrawId), 0).xyz;`,g`transformWorldFromModelTL;`)}
      }

      vec3 originH() {
        return ${m(s,g`texelFetch(transformationTexture, ivec2(1, transformationDrawId), 0).xyz;`,g`transformWorldFromModelTH;`)};
      }

      vec3 positionWorldCameraRelative() {

      vec3 rotatedModelPosition = ${m(c,g`modelTransformation() *`)} position;

      vec3 transform_CameraRelativeFromModel = dpAdd(
        originL(),
        originH(),
        -transformWorldFromViewTL,
        -transformWorldFromViewTH
      );

      return transform_CameraRelativeFromModel + rotatedModelPosition;
    }

    vec3 positionForDraping() {
      return ${m(l,g`modelTransformation() *`)} position;
    }
  `),r.code.add(g`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${t.spherical?g`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:g`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),a.uniforms.add(new p(`transformWorldFromViewTL`,e=>e.transformWorldFromViewTL)),r.code.add(g`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),a.code.add(g`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}var _e=class extends v{constructor(){super(...arguments),this.transformWorldFromViewTH=e(),this.transformWorldFromViewTL=e(),this.transformViewFromCameraRelativeRS=t()}},ve=class extends v{constructor(){super(...arguments),this.transformWorldFromModelRS=t(),this.transformWorldFromModelTH=e(),this.transformWorldFromModelTL=e(),this.transformationDrawId=0}};function ye(e){e.varyings.add(`linearDepth`,`float`,{invariant:!0})}function be(e,t){t&&ye(e),e.vertex.code.add(g`
    void forwardLinearDepth(float _linearDepth) { ${m(t,`linearDepth = _linearDepth;`)} }
  `)}function xe(e){e.vertex.uniforms.add(new x(`nearFar`,e=>e.camera.nearFar))}function Se(e){e.vertex.code.add(g`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function Ce(e,t){let{vertex:n}=e,r=d(t.output);r&&(e.include(ge,t),be(e,!0),xe(e),Se(e)),n.code.add(g`
    void forwardLinearDepthToWriteShadowMap() {
      ${m(r,`forwardLinearDepth(calculateLinearDepth(nearFar, vPosition_view.z));`)}
    }
  `)}function we(e){Se(e),e.vertex.code.add(g`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),e.vertex.code.add(g`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}function Te(e,t){t.hasVertexColors?(e.attributes.add(`color`,`vec4`),e.varyings.add(`vColor`,`vec4`),e.vertex.code.add(g`void forwardVertexColor() { vColor = color; }`)):e.vertex.code.add(g`void forwardVertexColor() {}`)}export{A as C,j as D,O as E,te as S,D as T,R as _,ye as a,P as b,ge as c,pe as d,le as f,M as g,Q as h,Ce as i,_e as l,z as m,we as n,be as o,ce as p,xe as r,ve as s,Te as t,me as u,V as v,k as w,H as x,ne as y};