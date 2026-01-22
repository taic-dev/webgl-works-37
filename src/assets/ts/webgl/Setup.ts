import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PARAMS } from "./constants";
import GUI from "lil-gui";

export class Setup {
  renderer: THREE.WebGLRenderer | null
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  ambientLight: THREE.AmbientLight | null
  directionalLight: THREE.DirectionalLight | null;
  spotLight: THREE.SpotLight | null;
  spotLight2: THREE.SpotLight | null;
  spotLightHelper: THREE.SpotLightHelper | null;
  loader: THREE.TextureLoader
  guiValue: any
  controls: OrbitControls | null

  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.ambientLight = null;
    this.directionalLight = null;
    this.spotLight = null;
    this.spotLight2 = null;
    this.spotLightHelper = null;
    this.controls = null;
    this.guiValue = null
    this.loader = new THREE.TextureLoader();

    this.init();
  }

  init() {
    this.setRenderer();
    this.setScene();
    this.setCamera();
    // this.setAmbientLight();
    this.setDirectionalLight();
    this.setSpotLight();
    this.setGui();
    this.setHelper();
  }

  setRenderer() {
    const element = document.querySelector('.webgl');
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(PARAMS.WINDOW.W, PARAMS.WINDOW.H);
    this.renderer.shadowMap.enabled = true;
    element?.appendChild(this.renderer.domElement);
  }

  updateRenderer() {
    this.renderer?.setSize(window.innerWidth, window.innerHeight);
    this.renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  }

  setScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('rgba(97, 176, 255, 1)')
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      PARAMS.CAMERA.FOV,
      PARAMS.CAMERA.ASPECT,
      PARAMS.CAMERA.NEAR,
      PARAMS.CAMERA.FAR
    );
    this.camera.position.set(5, 1, 10);
    this.camera.lookAt(new THREE.Vector3());
  }

  updateCamera() {
    if (!this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera?.updateProjectionMatrix();
    this.camera.position.set(5, 1, 10);
    this.camera.lookAt(new THREE.Vector3());
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight('rgba(61, 85, 90, 1)', 1);
    this.directionalLight.position.set(2, 2, 2);
    this.scene?.add(this.directionalLight);
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 10)
    this.scene?.add(this.ambientLight);
  }

  setSpotLight() {
    this.spotLight = new THREE.SpotLight('rgba(255, 255, 255, 1)', 3000)
    this.spotLight.position.set(10.5, 10, 10.5);
    this.spotLight.castShadow = true
    this.spotLight.penumbra = Math.PI / 6
    this.spotLight.angle = Math.PI / 6
    this.spotLight.shadow.mapSize = new THREE.Vector2(1000, 1000)

    this.scene?.add(this.spotLight);

    this.spotLight2 = new THREE.SpotLight('rgba(255, 255, 255, 1)', 3000)
    this.spotLight2.position.set(50.5, 50, 50.5);
    this.spotLight2.castShadow = true
    this.spotLight2.penumbra = Math.PI / 6
    this.spotLight2.angle = Math.PI / 8
    this.spotLight2.shadow.mapSize = new THREE.Vector2(0);
    
    // this.spotLightHelper2 = new THREE.SpotLightHelper( this.spotLight );

    this.scene?.add(this.spotLight2);
    // this.scene?.add(this.spotLightHelper2);
  }

  setGui() {
    const gui = new GUI();
    this.guiValue = {
      // color: { r: 0, g: 0, b: 0 },
      dark: false,
      speed: 1.5,
      wave: 15,
      lightPositionX: 3.5,
      lightPositionY: 16.5,
      lightPositionZ: 1.5,
    };
    gui.add(this.guiValue, "dark");
    gui.add(this.guiValue, "speed", 1, 5, 0.1);
    gui.add(this.guiValue, "wave", 5, 25, 1);
    gui.add(this.guiValue, "lightPositionX", 0, 30, 0.5);
    gui.add(this.guiValue, "lightPositionY", 0, 30, 0.5);
    gui.add(this.guiValue, "lightPositionZ", 0, 30, 0.5);
  }


  setHelper() {
    if (!this.camera) return;
    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer?.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;

    // AxesHelper
    const axesHelper = new THREE.AxesHelper(2000);
    this.scene?.add(axesHelper);
  }

  updateHelper() {
    if (this.spotLightHelper) {
      this.spotLightHelper.update();
    }
  }

  raf() {
    if(this.guiValue.dark) {
      this.directionalLight?.color.set('rgba(0, 33, 65, 1)');
    } else {
      this.directionalLight?.color.set('rgba(146, 134, 0, 1)');
    }

    this.spotLight?.position.set(
      this.guiValue.lightPositionX,
      this.guiValue.lightPositionY,
      this.guiValue.lightPositionZ
    );
  }

  resize() {
    this.updateRenderer();
    this.updateCamera();
  }
}