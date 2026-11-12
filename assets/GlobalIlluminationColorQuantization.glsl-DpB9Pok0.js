import{d as e}from"./floatBlendScale.glsl-BaQhFMcs.js";function t(t){t.code.add(e`
    vec4 quantizeGlobalIlluminationColor(vec4 color) {
      vec4 clampedColor = clamp(color, vec4(0.0), vec4(1.0));
      return floor(clampedColor * ${e.float(255)} + 0.5) * ${e.float(1/255)};
    }
  `)}export{t};