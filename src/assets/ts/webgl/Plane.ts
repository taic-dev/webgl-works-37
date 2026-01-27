import * as THREE from "three";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/plane/fragmentShader.glsl"
import vertexShader from "../../shader/plane/vertexShader.glsl"
import tiledWall from "/assets/images/tiled-wall2.jpg"

import { ElementPositionAndSize, getElementPositionAndSize, getImagePositionAndSize } from "../utils/getElementSize";

export class Plane {
  setup: Setup
  element: HTMLImageElement | null
  mesh: THREE.Mesh | null

  constructor(setup: Setup) {
    this.setup = setup;
    this.element = document.querySelector<HTMLImageElement>('.webgl')
    this.mesh = null
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
      uTexture: { value: this.setup.loader.load(tiledWall) },
      uTextureSize: { value: new THREE.Vector2(info.dom.width, info.dom.height) },
      uOffset: { value: 0 },
      ...commonUniforms,
    }
  }

  setMesh(info: ElementPositionAndSize) {
    const uniforms = this.setUniforms(info);
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })
    this.mesh = new THREE.Mesh(geometry, material);
    this.setup.scene?.add(this.mesh);
    
    this.mesh.scale.x = info.dom.width;
    this.mesh.scale.y = info.dom.height;
    this.mesh.position.x = info.dom.x;
    this.mesh.position.y = info.dom.y;
  }

  updateMesh() {
    if (!this.mesh || !this.element) return;
    const info = getImagePositionAndSize(this.element);
    this.mesh.scale.x = info.dom.width;
    this.mesh.scale.y = info.dom.height;
    this.mesh.position.x = info.dom.x;
    this.mesh.position.y = info.dom.y;
    const material = (this.mesh.material as any);
    material.uniforms.uPlaneSize.value.x = window.innerWidth;
    material.uniforms.uPlaneSize.value.y = window.innerHeight;
  }

  raf() {
    if (!this.mesh) return;
    const material = (this.mesh.material as any);
    material.uniforms.uOffset.value = this.setup.guiValue.offset;
    material.uniforms.uTime.value += 0.01;
  }

  resize() {
    this.updateMesh()
  }
}