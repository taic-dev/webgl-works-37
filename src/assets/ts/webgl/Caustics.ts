import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/mv/fragmentShader.glsl"
import vertexShader from "../../shader/mv/vertexShader.glsl"
import { getElementPositionAndSize, ElementPositionAndSize } from "../utils/getElementSize";

export class Caustics {
  setup: Setup
  renderTarget: THREE.WebGLRenderTarget
  renderScene: THREE.Scene
  renderCamera: THREE.OrthographicCamera
  element: HTMLImageElement | null
  mesh: THREE.Mesh | null
  loader: THREE.TextureLoader | null
  
  constructor(setup: Setup) {
    this.setup = setup
    this.renderTarget = new THREE.WebGLRenderTarget(1024, 1024)
    this.renderTarget.texture.flipY = false;
    this.renderTarget.texture.generateMipmaps = false;
    this.renderScene = new THREE.Scene();
    this.renderScene.background = new THREE.Color(0x000000);
    this.renderCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);
    this.renderCamera.position.set(0, 0, 1);
    this.renderCamera.lookAt(0, 0, 0);
    this.element = document.querySelector<HTMLImageElement>('.caustics')
    this.mesh = null
    this.loader = null

  }

  init() {
    if(!this.element) return
    const info = getElementPositionAndSize(this.element);
    this.setUniforms(info)
    this.setMesh(info);
  }

  setUniforms(info: ElementPositionAndSize) {
    const commonUniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
    };
    
    // const { r, g, b } = this.setup.guiValue.color;

    return {
      uPlanePos: { value: new THREE.Vector2(info.dom.x, info.dom.y) },
      uPlaneSize: { value: new THREE.Vector2(info.dom.width, info.dom.height)},
      uSpeed: { value: this.setup.guiValue.speed },
      uWave: { value: this.setup.guiValue.wave },
      uEvening: { value: this.setup.guiValue.evening },
      // uBackgroundColor: { value: new THREE.Vector3(r, g, b) },
      // uR: { value: this.setup.guiValue.uR },
      // uG: { value: this.setup.guiValue.uG },
      // uB: { value: this.setup.guiValue.uB },
      ...commonUniforms,
    }
  }

  setMesh(info: ElementPositionAndSize) {
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: THREE.DoubleSide,
      transparent: true,
    })
    this.mesh = new THREE.Mesh(geometry, material);
    this.renderScene.add(this.mesh);

    // レンダーターゲット用のカメラとmeshの位置を調整
    this.mesh.position.set(0, 0, 0);
    this.mesh.scale.set(1, 1, 1);
  }

  updateMesh() {
    if(!this.mesh || !this.element) return;
      const info = getElementPositionAndSize(this.element);
      
      // シェーダーのuniformsを更新（DOM要素の情報はシェーダー内で使用される可能性がある）
      const material = (this.mesh.material as any);
      material.uniforms.uPlaneSize.value = new THREE.Vector2(info.dom.width, info.dom.height);
      material.uniforms.uPlanePos.value = new THREE.Vector2(info.dom.x, info.dom.y);
      material.uniforms.uResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  }

  raf() {
    if (!this.mesh) return;
    const material = (this.mesh.material as any);
    material.uniforms.uTime.value += 0.01;
    material.uniforms.uSpeed.value = this.setup.guiValue.speed;
    material.uniforms.uWave.value = this.setup.guiValue.wave;
    material.uniforms.uEvening.value = this.setup.guiValue.evening;
    // const { r, g, b } = this.setup.guiValue.color;
    // material.uniforms.uBackgroundColor.value = new THREE.Vector3(r, g, b),
    // material.uniforms.uR.value = this.setup.guiValue.uR;
    // material.uniforms.uG.value = this.setup.guiValue.uG;
    // material.uniforms.uB.value = this.setup.guiValue.uB;
  }

  render() {
    if(!this.setup.renderer || !this.mesh) return
    this.setup.renderer.setRenderTarget(this.renderTarget)
    this.setup.renderer.render(this.renderScene, this.renderCamera)
    this.setup.renderer.setRenderTarget(null)
  }

  resize() {
    this.updateMesh()
  }
}