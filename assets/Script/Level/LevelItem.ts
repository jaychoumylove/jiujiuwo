import { checkHeart, descreaseHeart, setCurrentLevel } from "../state/User";
import { getAudioManager, toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

export interface LevelInfo {
  status: "lock" | "pass" | "current";
  lv: number;
}

@ccclass
export default class LevelItem extends cc.Component {
  lvInfo: LevelInfo;

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.goLevel, this);
  }

  goLevel() {
    const { lv, status } = this.lvInfo;
    // getAudioManager().playOnceMusic("button");
    if (status == "lock") return;
    // 加留存，不检测体力

    if (!checkHeart()) {
      toggleModal("AdHeart", true);
      return;
    }
    descreaseHeart();
    cc.director.loadScene(`level_${lv}`, () => {
      setCurrentLevel(lv);
    });
  }

  public init(lvInfo) {
    this.lvInfo = lvInfo;
    const { status, lv } = lvInfo;
    if (status == "lock") {
      cc.find("lock", this.node).active = true;
    }

    if (status == "current") {
      cc.find("current", this.node).active = true;
      cc.find("Label", this.node).getComponent(cc.Label).string = lv.toString();
      cc.find("Label", this.node).active = true;
    }

    if (status == "pass") {
      cc.find("pass", this.node).active = true;
      cc.find("Label", this.node).getComponent(cc.Label).string = lv.toString();
      cc.find("Label", this.node).active = true;
    }
  }
}
