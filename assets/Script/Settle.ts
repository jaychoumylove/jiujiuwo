import { MODAL_ZINDEX } from "./Root/Zindex";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Settle extends cc.Component {
  adjustZIndex: boolean = true;

  init(state: "win" | "lose") {
    if (this.adjustZIndex) {
      this.node.zIndex = MODAL_ZINDEX + 1;
    }

    this.node.active = true;
    switch (state) {
      case "win":
        this.initWinLable();
        break;
      case "lose":
        this.initLoseLable();
        break;
      default:
        break;
    }
  }

  initWinLable() {
    cc.find("title/Label", this.node).getComponent(cc.Label).string =
      "通关奖励";
    cc.find("getReward/Label", this.node).getComponent(cc.Label).string =
      "马上领取";
    cc.find("goNext", this.node).getComponent(cc.Label).string = "不了，谢谢";
    const monsterNode = cc.find("monster", this.node);
    monsterNode.angle = 270;
    monsterNode.y = 0;
  }

  initLoseLable() {
    cc.find("title/Label", this.node).getComponent(cc.Label).string =
      "重新再来";
    cc.find("getReward/Label", this.node).getComponent(cc.Label).string =
      "马上领取";
    cc.find("goNext", this.node).getComponent(cc.Label).string = "不了，谢谢";
    const playerNode = cc.find("player", this.node);
    playerNode.angle = 90;
    playerNode.y = 0;
  }
}
