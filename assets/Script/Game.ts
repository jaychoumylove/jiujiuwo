import HardCore from "./HardCore";
import { unlockNextLevel } from "./state/Level";
import { toggleModal } from "./util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property()
  debug: boolean = false;

  state: "win" | "lose" | "pending" = "pending";

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

  dispatchSuccess() {
    this.state = "win";
    unlockNextLevel();
    this.cleanHardCord();
  }

  disptachFail() {
    this.state = "lose";
    this.cleanHardCord();
  }

  cleanHardCord() {
    cc.find("Canvas/affix").children.map((item: cc.Node) => {
      const script: HardCore = item.getComponent("HardCore");
      script.clean();
    });
  }
}
