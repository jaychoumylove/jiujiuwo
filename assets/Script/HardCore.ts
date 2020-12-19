const { ccclass, property } = cc._decorator;

@ccclass
export default class HardCore extends cc.Component {
  status: "OFF" | "ON" = "OFF";

  direction: cc.Vec2 = cc.v2(0, 0);

  touchOnce = null;
  onLoad() {
    this.initDirection();
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
  }

  handleTouch() {
    if (this.touchOnce) return;
    const target = this.node;
    const move = {
      x: target.x,
      y: target.y,
    };
    ["x", "y"].map((item) => {
      if (this.direction[item] != 0) {
        const moveNum = this.direction[item] * 100;
        const moveNumber = this.status == "ON" ? -moveNum : moveNum;
        move[item] += moveNumber;
      }
    });
    this.touchOnce = cc
      .tween(target)
      .to(1, move)
      .call(() => {
        this.touchOnce = null;
        this.updateStatus();
      })
      .start();
  }

  initDirection() {
    const number = Math.floor(this.node.parent.angle / 90);

    switch (number) {
      case 0:
      case 2:
        this.direction = cc.v2(-1, 0);
        break;
      case 1:
      case 3:
        this.direction = cc.v2(0, -1);
        break;
      default:
        break;
    }
  }

  updateStatus() {
    this.status = this.status == "ON" ? "OFF" : "ON";
  }
}
