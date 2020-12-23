import HardCore from "./HardCore";
import { increaseHeartByAd } from "./state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdHeart extends cc.Component {
  onLoad() {
    const node = cc.find("Get", this.node);
    node.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
  }

  call: Function = () => {};

  public init(func: Function) {
    this.call = func;
  }

  handleTouch() {
    increaseHeartByAd(this.call);
  }
}
