const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property()
  debug: boolean = false;

  @property()
  G: cc.Vec2 = cc.v2(0, -300);

  onLoad() {
    this.initPhysics();
  }

  initPhysics() {
    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
    if (this.debug) {
      const Bits = cc.PhysicsManager.DrawBits;
      physicsManager.debugDrawFlags =
        Bits.e_aabbBit | Bits.e_jointBit | Bits.e_shapeBit;
    } else {
      physicsManager.debugDrawFlags = 0;
    }
    physicsManager.gravity = this.G;
  }
}
