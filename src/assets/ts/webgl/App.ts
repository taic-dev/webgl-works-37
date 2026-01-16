import { Caustics } from "./Caustics";
import { Setup } from "./Setup";
import { TiledWall } from "./TiledWall";

export class App {
  setup: Setup
  caustics: Caustics
  tiledWall: TiledWall

  constructor() {
    this.setup = new Setup();
    this.caustics = new Caustics(this.setup);
    this.tiledWall = new TiledWall(this.setup);
  }

  init() {
    // this.caustics.init();
    this.tiledWall.init();
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