import { Caustics } from "./Caustics";
import { Setup } from "./Setup";

export class App {
  setup: Setup
  caustics: Caustics

  constructor() {
    this.setup = new Setup();
    this.caustics = new Caustics(this.setup);
  }

  init() {
    this.caustics.init();
  }

  render() {
    if(!this.setup.scene || !this.setup.camera) return
    this.setup.renderer?.render(this.setup.scene, this.setup.camera)
    this.caustics.raf();
  }

  update() {
    this.caustics.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.caustics.resize();
  }
}