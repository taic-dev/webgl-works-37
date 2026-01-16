import { MvMesh } from "./MvMesh";
import { Setup } from "./Setup";

export class App {
  setup: Setup
  mvMesh: MvMesh

  constructor() {
    this.setup = new Setup();
    this.mvMesh = new MvMesh(this.setup);
  }

  init() {
    this.mvMesh.init();
  }

  render() {
    if(!this.setup.scene || !this.setup.camera) return
    this.setup.renderer?.render(this.setup.scene, this.setup.camera)
    this.mvMesh.raf();
  }

  update() {
    this.mvMesh.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.mvMesh.resize();
  }
}