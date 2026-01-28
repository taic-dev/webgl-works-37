import * as THREE from "three";
import { Setup } from "./Setup";
import { WALL_SIZE, WALL_SIZE_HALF } from "./constants";
import texture from "/assets/images/tiled-wall.webp";
import normalTexture from "/assets/images/normal-map.webp";

export class TiledWall {
  setup: Setup;
  material: THREE.MeshStandardMaterial | null;
  meshRight: THREE.Mesh | null;
  meshLeft: THREE.Mesh | null;
  meshBottom: THREE.Mesh | null;
  modelGroup: THREE.Group;
  loader: THREE.TextureLoader | null

  constructor(setup: Setup) {
    this.setup = setup;
    this.material = null;
    this.meshRight = null;
    this.meshLeft = null;
    this.meshBottom = null;
    this.modelGroup = new THREE.Group();
    this.loader = this.setup.loader
  }

  async init() {
    await this.setMesh();
  }

  setUniforms() {
    const commonUniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
    };

    return {
      uPlaneSize: { value: new THREE.Vector2(WALL_SIZE, WALL_SIZE) },
      uTexture: { value: this.loader?.load(texture) },
      uTextureSize: { value: new THREE.Vector2(WALL_SIZE, WALL_SIZE) },
      uNormalTexture: { value: this.loader?.load(normalTexture) },
      ...commonUniforms,
    }
  }

  setMesh() {
    return new Promise<void>((resolve) => {
      const geometry = new THREE.PlaneGeometry( WALL_SIZE, WALL_SIZE, 1, 1 );;
      const texture = this.setup.loader.load(`${import.meta.env.BASE_URL}/assets/images/tiled-wall.webp`);
      const normalTexture = this.setup.loader.load(`${import.meta.env.BASE_URL}/assets/images/normal-map.webp`);
      this.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('rgba(152, 238, 255, 1)'),
        map: texture,
        normalMap: normalTexture,
        roughness: 0.1,
        metalness: 0.1,
      });
  
      // tiled-wall right
      this.meshRight = new THREE.Mesh(geometry, this.material);
      this.meshRight.rotation.z = Math.PI / 2;
      // tiled-wall left
      this.meshLeft = this.meshRight.clone();
      this.meshLeft.rotation.x = -Math.PI / 2;
      this.meshLeft.position.y = -WALL_SIZE_HALF;
      this.meshLeft.position.z = WALL_SIZE_HALF;
      // tiled-wall bottom
      this.meshBottom = this.meshRight.clone();
      this.meshBottom.rotation.y = Math.PI / 2;
      this.meshBottom.position.x = -WALL_SIZE_HALF;
      this.meshBottom.position.z = WALL_SIZE_HALF;
      // tiled-wall group
      this.modelGroup.add(this.meshRight, this.meshLeft, this.meshBottom)
      this.modelGroup.position.x = WALL_SIZE_HALF
      this.modelGroup.position.y = WALL_SIZE_HALF
      this.setup.subScene?.add(this.modelGroup);

      this.setup.loadingManager.onLoad = () => {
        resolve();
      };
    })
  }

}