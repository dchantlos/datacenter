import{p as e}from"./oitResolution.glsl-CziGeqeq.js";import{d as t}from"./ManagedTexture-KWyoFc2U.js";import{J as n}from"./doublePrecisionUtils-h2HDg16l.js";import{t as r}from"./ShaderBuilder-CrOLBtCv.js";import{c as i}from"./RealisticTree.glsl-Bffg1X7R.js";import{t as a}from"./calculateUVZShadowFromDepth.glsl-DiFdHWL1.js";var o=255,s=1/255;function c(o){let c=new r,{fragment:l}=c;c.include(t),c.include(a),l.include(i,!1),l.constants.add(`sampleValue`,`float`,s);let u=o.index===1?`vec2`:`float`;return c.outputs.add(`sampleCount`,u),l.uniforms.add(new n(`depthMap`,e=>e.depth?.attachment)).main.add(e`
    sampleCount = ${u}(0.0);

    vec3 uvzShadow = calculateUVZShadowFromDepth(uv, textureSize(shadowMap,0), depthMap);
    // The shadow map sampler returns a value between 0 and 1, we take the midpoint as we count discrete samples
    bool shadow = readShadowMaps(uvzShadow) > 0.5;
    if (shadow) {
      sampleCount = ${u}(sampleValue); // Add 1 to the sample count
    }
  `),c}var l=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastMaxSamples:255,build:c},Symbol.toStringTag,{value:`Module`}));export{c as n,o as r,l as t};