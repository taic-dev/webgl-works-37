import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/caustics/fragmentShader.glsl"
import vertexShader from "../../shader/caustics/vertexShader.glsl"
import { getElementPositionAndSize, ElementPositionAndSize } from "../utils/getElementSize";

export class Caustics {
  setup: Setup
  renderTarget: THREE.WebGLRenderTarget
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  element: HTMLImageElement | null
  mesh: THREE.Mesh | null
  loader: THREE.TextureLoader | null
  
  constructor(setup: Setup) {
    this.setup = setup
    this.renderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    })
    this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);
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
    
    return {
      uPlanePos: { value: new THREE.Vector2(info.dom.x, info.dom.y) },
      uPlaneSize: { value: new THREE.Vector2(info.dom.width, info.dom.height)},
      uSpeed: { value: this.setup.guiValue.speed },
      uWave: { value: this.setup.guiValue.wave },
      uDark: { value: this.setup.guiValue.dark },
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
    this.scene.add(this.mesh);

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
    material.uniforms.uDark.value = this.setup.guiValue.dark;
  }

  render() {
    if(!this.setup.renderer || !this.mesh) return
    this.setup.renderer.setRenderTarget(this.renderTarget)
    this.setup.renderer.render(this.scene, this.camera)
    this.setup.renderer.setRenderTarget(null)
  }

  resize() {
    this.updateMesh()
  }
}