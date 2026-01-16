uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uPlanePos;
uniform vec2 uPlaneSize;

uniform float uR;
uniform float uG;
uniform float uB;
uniform vec3 uBackgroundColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOldPosition;
varying vec3 vNewPosition;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 position = vPosition;
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv = uv - 0.5;
  uv.x *= (uResolution.x / uResolution.y);

  float l = length(position) * 2.;

  float oldArea = length(dFdx(vOldPosition)) * length(dFdy(vOldPosition));
  float newArea = length(dFdx(vNewPosition)) * length(dFdy(vNewPosition));
  float fianlArea = oldArea / newArea * 2.0;
  fianlArea = fianlArea * 10.;

  float intensity = clamp(fianlArea, 0.0, 1.0);
  intensity = pow(intensity, 1.4); // 線が締まる

  float core = smoothstep(0.6, 1.0, intensity);
  float glow = smoothstep(0.1, 0.6, intensity);

  vec3 coreColor = vec3(uR, uG, uB) * core * 3.0;
  vec3 glowColor = vec3(uR, uG, uB) * glow * 1.0;
  // vec3 color = coreColor + glowColor;

  // gl_FragColor = vec4(color + uBackgroundColor, 1.0);


  // 線として残したい閾値
  float threshold = 0.1;

  // 滑らかに出す
  float alpha = smoothstep(threshold, threshold + 0.9, intensity);

  // gl_FragColor = vec4(vec3(color), alpha);


  // gl_FragColor = vec4(vec3(fianlArea), 1.);
  // if(color.r < 0.4 && color.g < 0.4 && color.b < 0.4) {
  //   discard;
  // }

  vec3 bg = vec3(0.639, 0.502, 0.0);
  vec3 fianlAreas = vec3(fianlArea * uR, fianlArea * uG, fianlArea * uB);

  vec3 color = (fianlAreas + uBackgroundColor) + l;
  // if(color.r >= 1. && color.g >= 1. && color.b >= 1.) {
  //   discard;
  // }
  gl_FragColor = vec4(vec3(color), 1.);

}