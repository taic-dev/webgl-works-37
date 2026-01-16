import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/mv/fragmentShader.glsl"
import vertexShader from "../../shader/mv/vertexShader.glsl"
import { getElementPositionAndSize, ElementPositionAndSize } from "../utils/getElementSize";

export class Caustics {
  setup: Setup
  element: HTMLImageElement | null
  mesh: THREE.Mesh | null
  loader: THREE.TextureLoader | null

  constructor(setup: Setup) {
    this.setup = setup
    this.element = document.querySelector<HTMLImageElement>('.plane')
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
    
    const { r, g, b } = this.setup.guiValue.color;

    return {
      uPlanePos: { value: new THREE.Vector2(info.dom.x, info.dom.y) },
      uPlaneSize: { value: new THREE.Vector2(info.dom.width, info.dom.height)},
      uBackgroundColor: { value: new THREE.Vector3(r, g, b) },
      uR: { value: this.setup.guiValue.uR },
      uG: { value: this.setup.guiValue.uG },
      uB: { value: this.setup.guiValue.uB },
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
    this.setup.scene?.add(this.mesh);

    this.mesh.scale.x = info.dom.width;
    this.mesh.scale.y = info.dom.height;
    this.mesh.position.x = info.dom.x;
    this.mesh.position.y = info.dom.y;
  }

  updateMesh() {
    if(!this.mesh || !this.element) return;
      const { scale, position } = this.mesh;
      const info = getElementPositionAndSize(this.element);
      
      scale.x = info.dom.width;
      scale.y = info.dom.height;
      position.x = info.dom.x;
      position.y = info.dom.y;

      const material = (this.mesh.material as any);
      material.uniforms.uPlaneSize.value = new THREE.Vector2(info.dom.width, info.dom.height);
      material.uniforms.uPlanePos.value = new THREE.Vector2(info.dom.x, info.dom.y);
      material.uniforms.uResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  }

  raf() {
    if (!this.mesh) return;
    const material = (this.mesh.material as any);
    const { r, g, b } = this.setup.guiValue.color;
    material.uniforms.uTime.value += 0.01;
    material.uniforms.uBackgroundColor.value = new THREE.Vector3(r, g, b),
    material.uniforms.uR.value = this.setup.guiValue.uR;
    material.uniforms.uG.value = this.setup.guiValue.uG;
    material.uniforms.uB.value = this.setup.guiValue.uB;
  }

  resize() {
    this.updateMesh()
  }
}