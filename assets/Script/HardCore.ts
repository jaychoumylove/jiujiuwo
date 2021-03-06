import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HardCore extends cc.Component {
  @property()
  dir: "left" | "right" | "top" | "bottom" = "left";

  @property(cc.Integer)
  moveNumber: number = 150;

  status: "OFF" | "ON" = "OFF";

  direction: cc.Vec2 = cc.v2(0, 0);

  touchOnce = null;
  onLoad() {
    this.initDirection();
    // this.node.parent.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
  }

  handleTouch() {
    if (this.touchOnce) return;
    const gameScript: Game = cc.find("Canvas").getComponent("Game");
    if (gameScript.state != "pending") {
      return;
    }
    const target = this.node;
    const move = {
      x: target.x,
      y: target.y,
    };
    ["x", "y"].map((item) => {
      if (this.direction[item] != 0) {
        const moveNum = this.direction[item] * this.moveNumber;
        const moveNumber = this.status == "ON" ? -moveNum : moveNum;
        move[item] += moveNumber;
      }
    });
    this.touchOnce = cc
      .tween(target)
      .to(0.3, move)
      .call(() => {
        this.touchOnce = null;
        this.updateStatus();
      })
      .start();
  }

  initDirection() {
    switch (this.dir) {
      case "left":
        this.direction = cc.v2(-1, 0);
        break;
      case "right":
        this.direction = cc.v2(1, 0);
        break;
      case "top":
        this.direction = cc.v2(0, 1);
        break;
      case "bottom":
        this.direction = cc.v2(0, -1);
        break;
      default:
        break;
    }
  }

  updateStatus() {
    this.status = this.status == "ON" ? "OFF" : "ON";
  }

  clean() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
  }

  add() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
  }
}
