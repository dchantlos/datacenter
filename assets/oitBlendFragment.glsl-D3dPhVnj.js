import{f as e,r as t,t as n}from"./floatBlendScale.glsl-BaQhFMcs.js";import{n as r}from"./NoParameters-DoG40WO7.js";import{q as i}from"./VertexColor.glsl-DBvnzl1f.js";var a=class extends r{};function o(r,a){let{frontFaceMask:o,useFloatBlend:s}=a;r.include(n,a),r.include(i),r.uniforms.add(new t(`colorTexture`,e=>e.colorTexture),new t(`alphaTexture`,e=>e.alphaTexture),new t(`frontFaceTexture`,e=>e.frontFaceTexture)).code.add(`
    vec4 oitBlendFragment(sampler2D colorTex, sampler2D frontFaceTex, float frontFaceScale) {
      float srcAlpha = texture(alphaTexture, uv).r * floatBlendInputScale;
      if(srcAlpha < alphaCutoff) {
        return vec4(0.0);
      }
      vec4 frontFace = texture(frontFaceTex, uv);
      ${e(o,`if (frontFace.a == 0.0) return vec4(0.0);`)}

      vec4 srcColor = texture(colorTex, uv);
      srcColor.rgb *= floatBlendInputScale / srcAlpha;

      ${e(!s,`float frontWeight = srcAlpha * floatBlendOutputScale;
         frontWeight = clamp((frontWeight - 0.9) * 10.0, 0.0, 1.0);

         float toAlpha = (1.0 + frontFace.a) * 0.5;
         frontFace.a = mix(frontFace.a, toAlpha, frontWeight);`)}
      return vec4(mix(srcColor.rgb, frontFace.rgb * frontFaceScale, frontFace.a), 1.0 - srcColor.a);
    }

    vec4 oitBlendFragment() {
      return oitBlendFragment(colorTexture, frontFaceTexture, 1.0);
    }
  `)}export{o as n,a as t};