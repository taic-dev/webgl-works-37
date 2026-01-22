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
    this.caustics.init();
    this.tiledWall.init();
  }

  render() {    
    if(!this.setup.scene || !this.setup.camera || !this.setup.spotLight) return
    this.setup.updateHelper();
    this.setup.raf();
    
    // causticsの更新とレンダリング
    this.caustics.raf();
    this.caustics.render();
    
    // SpotLightにテクスチャを設定（レンダリング後に更新）
    const texture = this.caustics.renderTarget.texture;
    texture.needsUpdate = true;
    this.setup.spotLight.map = texture;
    
    // メインシーンのレンダリング
    this.setup.renderer?.render(this.setup.scene, this.setup.camera)
  }

  update() {
    this.caustics.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.caustics.resize();
  }
}