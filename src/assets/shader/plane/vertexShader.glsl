uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

#pragma glslify: snoise3d = require('glsl-noise/simplex/3d');
#pragma glslify: cnoise3d = require('glsl-noise/classic/3d');
#pragma glslify: pnoise3d = require('glsl-noise/periodic/3d');

void main() {
  vUv = uv;
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}