varying vec3 vPosition;
varying vec2 vUv;

uniform vec2 uPlaneSize;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uOffset;
uniform float uTime;

#pragma glslify: cnoise2d = require('glsl-noise/classic/2d');
#pragma glslify: snoise2d = require('glsl-noise/simplex/2d');
#pragma glslify: cnoise3d = require('glsl-noise/classic/3d');

// リニアカラースペースからsRGBへの変換（ガンマ補正）
vec3 linearToSRGB(vec3 linear) {
  bvec3 cutoff = lessThan(linear, vec3(0.0031308));
  vec3 higher = vec3(1.055) * pow(linear, vec3(1.0 / 2.4)) - vec3(0.055);
  vec3 lower = linear * vec3(12.92);
  return mix(higher, lower, cutoff);
}

void main() {
  vec3 position = vPosition;
  vec2 aspect = vec2(uPlaneSize.x / uPlaneSize.y, 1.0);
  vec2 uv = (vUv * 2. - 1.) * aspect;

  // アスペクトを計算
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  float textureAspect = uTextureSize.x / uTextureSize.y;

  // 画像のアスペクトとプレーンのアスペクトを比較し、短い方に合わせる
  vec2 ratio = vec2(
    min(planeAspect / textureAspect, 1.0),
    min((1.0 / planeAspect) / (1.0 / textureAspect), 1.0)
  );

  // 計算結果を用いて補正後のuv値を生成
  vec2 fixedUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );

  vec4 texture = texture2D(uTexture, fixedUv);

  float l = length(uv * 8. + snoise2d(uv * 5. + uTime));
  
  // リニアカラースペースのテクスチャをsRGBに変換
  vec3 color = linearToSRGB(texture.rgb);

  // gl_FragColor = vec4(color + l, 1.);
  vec3 mix = mix(vec3(l), vec3(color), uOffset);
  gl_FragColor = vec4(mix, 1.);
}