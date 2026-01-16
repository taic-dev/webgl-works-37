import * as THREE from "three";
import { Setup } from "./Setup";

export class TiledWall {
  setup: Setup;
  material: THREE.MeshBasicMaterial | null;
  meshRight: THREE.Mesh | null;
  meshLeft: THREE.Mesh | null;
  meshBottom: THREE.Mesh | null;
  modelGroup: THREE.Group;

  constructor(setup: Setup) {
    this.setup = setup;
    this.material = null;
    this.meshRight = null;
    this.meshLeft = null;
    this.meshBottom = null;
    this.modelGroup = new THREE.Group();
  }

  init() {
    this.setMesh();
  }

  setMesh() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(`${import.meta.env.BASE_URL}/assets/images/tiled-wall.jpg`);
    const SIZE = 1000;
    const SIZE_HALF = SIZE / 2;
    const geometry = new THREE.PlaneGeometry( SIZE, SIZE, 1, 1 );
    this.material = new THREE.MeshBasicMaterial( { map: texture } );
    // tiled-wall right
    this.meshRight = new THREE.Mesh(geometry, this.material);
    this.meshRight.rotation.z = Math.PI / 2;
    // tiled-wall left
    this.meshLeft = this.meshRight.clone();
    this.meshLeft.rotation.x = -Math.PI / 2;
    this.meshLeft.position.y = -SIZE_HALF;
    this.meshLeft.position.z = SIZE_HALF;
    // tiled-wall bottom
    this.meshBottom = this.meshRight.clone();
    this.meshBottom.rotation.y = Math.PI / 2;
    this.meshBottom.position.x = -SIZE_HALF;
    this.meshBottom.position.z = SIZE_HALF;
    // tiled-wall group
    this.modelGroup.add(this.meshRight, this.meshLeft, this.meshBottom)
    this.modelGroup.position.x = SIZE_HALF
    this.modelGroup.position.y = SIZE_HALF
    this.setup.scene?.add(this.modelGroup);
  }

}