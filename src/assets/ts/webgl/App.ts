import { Caustics } from "./Caustics";
import { Plane } from "./Plane";
import { Setup } from "./Setup";
import { TiledWall } from "./TiledWall";

export class App {
  setup: Setup
  plane: Plane
  caustics: Caustics
  tiledWall: TiledWall

  constructor() {
    this.setup = new Setup();
    this.plane = new Plane(this.setup);
    this.caustics = new Caustics(this.setup);
    this.tiledWall = new TiledWall(this.setup);
  }

  async init() {
    this.plane.init();
    this.caustics.init();
    await this.tiledWall.init();

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('complete:loaded'));
    }, 1000)
  }

  render() {    
    if(
      !this.setup.renderTarget ||
      !this.setup.scene ||
      !this.setup.subScene ||
      !this.setup.camera || 
      !this.setup.subCamera ||
      !this.setup.spotLight
    ) return

    this.setup.updateHelper();
    this.setup.raf();
    
    // causticsの更新とレンダリング
    this.caustics.raf();
    this.caustics.render();
    
    // SpotLightにテクスチャを設定（レンダリング後に更新）
    const texture = this.caustics.renderTarget.texture;
    texture.needsUpdate = true;
    this.setup.spotLight.map = texture;
    
    // planeの更新とレンダリング
    this.plane.raf();

    // メインシーンのレンダリング
    // this.setup.renderer?.render(this.setup.scene, this.setup.camera)
    this.setup.renderer?.setRenderTarget(this.setup.renderTarget);
    
    this.setup.renderer?.render(this.setup.subScene, this.setup.subCamera);
    
    const mainTexture = this.setup.renderTarget.texture
    mainTexture.needsUpdate = true;

    (this.plane.mesh!.material as any).uniforms.uTexture.value = mainTexture;

    // 通常描画に戻す
    this.setup.renderer?.setRenderTarget(null);
    this.setup.renderer?.render(this.setup.scene, this.setup.camera);
  }

  update() {
    this.caustics.updateMesh();
  }

  resize() {
    this.setup.resize();
    this.caustics.resize();
    this.plane.resize();
  }
}