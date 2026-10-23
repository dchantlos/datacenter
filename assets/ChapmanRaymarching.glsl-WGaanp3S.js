import{r as e}from"./Ellipsoid-Co4rBm1M.js";import{T as t}from"./mathUtils-D79yUFwW.js";import{D as n}from"./vec3-C5q_s_3T.js";import{o as r}from"./vec2f64-IO40D2xB.js";import{f as i,p as a}from"./oitResolution.glsl-CziGeqeq.js";import{t as o}from"./NoParameters-XZJ-8n06.js";import{I as s,R as c,p as l,z as u}from"./ManagedTexture-CoIW9HsA.js";import{B as d,Lt as f}from"./doublePrecisionUtils-BljtQ88P.js";import{t as p}from"./SphereIntersect.glsl-DoEmNSbP.js";var m=class extends o{constructor(){super(...arguments),this.radii=r()}};function h(t){t.code.add(a`float chapmanApproximation(float thickness, float height, float cosZenith) {
float c = sqrt(thickness + height);
float cExpH = c * exp(-height);
if (cosZenith >= 0.0) {
return cExpH / (c * cosZenith + 1.0);
} else {
float x0 = sqrt(1.0 - cosZenith * cosZenith) * (thickness + height);
float c0 = sqrt(x0);
return 2.0 * c0 * exp(thickness - x0) - cExpH / (1.0 - c * cosZenith);
}
}`),t.constants.add(`scaleHeight`,`float`,e.scaleHeight*e.atmosphereHeight).uniforms.add(new l(`radii`,e=>e.radii)).code.add(a`float getOpticalDepth(vec3 position, vec3 dir, float h) {
return scaleHeight * chapmanApproximation(radii[0] / scaleHeight, h, dot(normalize(position), dir));
}`),t.include(p),t.constants.add(`planetRadiusReduction`,`float`,_).uniforms.add(new d(`heightParameters`,5,(e,t)=>g(t,e)),new f(`cameraPosition`,e=>e.camera.eye)).code.add(a`vec4 planetIntersect(vec3 rayDir) {
float rayPlanetDistanceReduced = heightParameters[4];
vec2 rayPlanetIntersect = sphereIntersect(cameraPosition, rayDir, rayPlanetDistanceReduced);
vec2 rayAtmosphereIntersect = sphereIntersect(cameraPosition, rayDir, heightParameters[1]);
bool hitsAtmosphere = (rayAtmosphereIntersect.x <= rayAtmosphereIntersect.y) && rayAtmosphereIntersect.x > 0.0;
bool insideAtmosphere = heightParameters[0] < radii[1];
if (!hitsAtmosphere && !insideAtmosphere) {
return vec4(1.0, 0.0, 0.0, 0.0);
}
bool hitsPlanet = (rayPlanetIntersect.x <= rayPlanetIntersect.y) && rayPlanetIntersect.x > 0.0;
float start = insideAtmosphere ? 0.0 : rayAtmosphereIntersect.x;
if (heightParameters[0] < radii[0] - planetRadiusReduction) {
if (dot(rayDir, normalize(cameraPosition)) < -0.01) {
return vec4(1.0, 0.0, 0.0, 0.0);
}
start = rayPlanetIntersect.y;
}
float end = hitsPlanet ? rayPlanetIntersect.x : rayAtmosphereIntersect.y;
return vec4(0.0, hitsPlanet ? 1.0 : 0.0, start, end);
}`)}function g({camera:r},{radii:i}){let a=n(r.eye),o=Math.sqrt(a);return v[0]=o,v[1]=a-i[1]**2,v[2]=t((o-i[0])/e.atmosphereHeight,0,1),v[3]=a-i[0]**2,v[4]=a-(i[0]-_)**2,v}var _=2e4,v=[];function y(e,t){e.include(h),e.constants.add(`betaRayleigh`,`vec3`,c),e.constants.add(`betaCombined`,`vec3`,s),e.constants.add(`betaMie`,`float`,u),e.constants.add(`steps`,`int`,6),e.uniforms.add(new f(`cameraPosition`,e=>e.camera.eye)).code.add(a`
    vec3 raymarchAtmosphere(vec3 rayDir, vec3 lightDir, float terrainDepth) {
      vec4 ray = planetIntersect(rayDir);
      if(ray.x == 1.0) {
        return vec3(0);
      }
      ${i(t,`if (terrainDepth != -1.0) { ray.w = terrainDepth; }`)}

      vec3 samplePoint = cameraPosition + rayDir * ray.w;
      float multiplier = ray.y == 1.0 ? -1.0 : 1.0;

      vec3 scattering = vec3(0);
      float scaleFract = (length(samplePoint) - radii[0]) / scaleHeight;
      float lastOpticalDepth = getOpticalDepth(samplePoint, rayDir, scaleFract);
      float stepSize = (ray.w - ray.z) / float(steps);

      for (int i = 0; i < steps; i++) {
        samplePoint -= stepSize * rayDir;
        scaleFract = (length(samplePoint) - radii[0]) / scaleHeight;
        float opticalDepth = multiplier * getOpticalDepth(samplePoint, rayDir * multiplier, scaleFract);

        if (i > 0) {
          scattering *= exp(-(mix(betaCombined, betaRayleigh, 0.5) + betaMie) * max(0.0, (opticalDepth - lastOpticalDepth)));
          ${i(!t,`scattering *= mix(2.5, 1.0, clamp((length(cameraPosition) - radii[0]) / 50e3, 0.0, 1.0))`)};
        }

        if (dot(normalize(samplePoint), lightDir) > -0.3) {
          float scale = exp(-scaleFract);
          float lightDepth = getOpticalDepth(samplePoint, lightDir, scaleFract);
          scattering += scale * exp(-(betaCombined + betaMie) * lightDepth);
          ${i(!t,`scattering += scale * exp(-(0.25 * betaCombined ) * lightDepth);`)}
        }
        lastOpticalDepth = opticalDepth;
      }

      float mu = dot(rayDir, lightDir);
      float mumu = 1.0 + mu * mu;
      float phaseRayleigh = 0.0596831 * mumu;
      ${i(t,`return 3.0 * scattering * stepSize * phaseRayleigh * betaRayleigh;`,a`
          const float g = 0.8;
          const float gg = g * g;
          float phaseMie = 0.1193662 * ((1.0 - gg) * mumu) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg));
          phaseMie = clamp(phaseMie, 0.0, 128.0);
          return 3.0 * scattering * stepSize * (phaseRayleigh * betaRayleigh + 0.025 * phaseMie * betaMie);`)}
    }`)}export{g as n,m as r,y as t};