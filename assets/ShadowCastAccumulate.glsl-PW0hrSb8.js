import{d as e}from"./floatBlendScale.glsl-BaQhFMcs.js";import{Q as t,pt as n}from"./VertexColor.glsl-nQ4npUUV.js";import{a as r}from"./ReceiveShadowsConfiguration-TZDqAUu3.js";import{a as i}from"./doublePrecisionUtils-BEDeI1Jm.js";import{t as a}from"./calculateUVZShadowFromDepth.glsl-Ob6ovoZO.js";var o=255;function s(o){let s=new i,{fragment:c}=s;s.include(t),s.include(a),c.include(r,!1),c.constants.add(`sampleValue`,`float`,.00392156862745098);let l=o.index===1?`vec2`:`float`;return s.outputs.add(`sampleCount`,l),c.uniforms.add(new n(`depthMap`,e=>e.depth?.attachment)).main.add(e`
    sampleCount = ${l}(0.0);

    vec3 uvzShadow = calculateUVZShadowFromDepth(uv, textureSize(shadowMap,0), depthMap);
    // The shadow map sampler returns a value between 0 and 1, we take the midpoint as we count discrete samples
    bool shadow = readShadowMaps(uvzShadow) > 0.5;
    if (shadow) {
      sampleCount = ${l}(sampleValue); // Add 1 to the sample count
    }
  `),s}var c=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastMaxSamples:255,build:s},Symbol.toStringTag,{value:`Module`}));export{o as n,s as r,c as t};