uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOldPosition;
varying vec3 vNewPosition;

#pragma glslify: snoise3d = require('glsl-noise/simplex/3d');
#pragma glslify: cnoise3d = require('glsl-noise/classic/3d');
#pragma glslify: pnoise3d = require('glsl-noise/periodic/3d');

void main() {
  vUv = uv;
  vPosition = position;

  vec3 pos = position;

  pos.z += cnoise3d(pos * 2. + uTime * 0.2) * 10.;

  vOldPosition = position;
  vNewPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}