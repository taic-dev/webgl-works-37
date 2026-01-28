import * as THREE from "three";
import { gsap } from "gsap";
import { Setup } from "./Setup";
import fragmentShader from "../../shader/plane/fragmentShader.glsl"
import vertexShader from "../../shader/plane/vertexShader.glsl"
import texture from "/assets/images/tiled-wall.webp";
import { 
  ElementPositionAndSize,
  getElementPositionAndSize
} from "../utils/getElementSize";
import { EASING } from "../utils/constant";

export class Plane {
  setup: Setup
  element: HTMLImageElement | null
  loading: HTMLImageElement
  mesh: THREE.Mesh | null

  constructor(setup: Setup) {
    this.setup = setup;
    this.element = document.querySelector<HTMLImageElement>('.webgl')
    this.loading = document.querySelector('.loading')!;
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
      uTexture: { value: this.setup.loader.load(texture) },
      uTextureSize: { value: new THREE.Vector2(info.dom.width, info.dom.height) },
      uOffset: { value: 0 },
      ...commonUniforms,
    }
  }

  setMesh(info: ElementPositionAndSize) {
    return new Promise<void>((resolve) => {
      const uniforms = this.setUniforms(info);
      const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
      })
      this.mesh = new THREE.Mesh(geometry, material);
      this.setup.scene?.add(this.mesh);
      this.mesh.scale.x = window.innerWidth;
      this.mesh.scale.y = window.innerHeight;
      this.mesh.position.x = 0;
      this.mesh.position.y = 0;

      resolve();
    })
  }

  updateMesh() {
    if (!this.mesh || !this.element) return;
    this.mesh.scale.x = window.innerWidth;
    this.mesh.scale.y = window.innerHeight;
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    // const material = (this.mesh.material as any);
    // material.uniforms.uPlaneSize.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    // material.uniforms.uTexture.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    // material.uniforms.uTextureSize.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  }

  raf() {
    if (!this.mesh) return;
    const material = (this.mesh.material as any);
    // material.uniforms.uOffset.value = this.setup.guiValue.offset;
    material.uniforms.uTime.value += 0.01;
  }

  resize() {
    this.updateMesh()
  }

  animation() {
    if (!this.mesh) return;
    const tl = gsap.timeline();
    const material = (this.mesh.material as any);

    tl.to(this.loading, {
      opacity: 0,
      duration: 0.5,
      ease: EASING.MATERIAL
    }).to(material.uniforms.uOffset, {
      value: 1,
      duration: 1,
      ease: EASING.TRANSFORM,
      onComplete: () => {
        this.loading.style.display = "none"
      }
    })
  }
}