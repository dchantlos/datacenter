import{Cn as e,Dn as t}from"./VertexColor.glsl-DBvnzl1f.js";function n(n,r={needUVs:!0,needEyeDirection:!0}){n.attributes.add(`position`,`vec2`),n.varyings.add(`worldRay`,`vec3`);let{needUVs:i,needEyeDirection:a}=r;n.vertex.uniforms.add(e,t).main.add(`
    gl_Position = vec4(position, 1, 1);

    vec3 posViewNear = (inverseProjectionMatrix * vec4(position, -1.0, 1.0)).xyz;
    worldRay = (inverseViewMatrix * vec4(posViewNear, 0)).xyz;
  `),i&&(n.varyings.add(`uv`,`vec2`),n.vertex.main.add(`uv = position * 0.5 + vec2(0.5);`)),a&&(n.varyings.add(`eyeDir`,`vec3`),n.vertex.main.add(`eyeDir = posViewNear;`))}export{n as t};