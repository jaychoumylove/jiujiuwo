import { getUser } from "./state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeartLabel extends cc.Component {
  onLoad() {
    const heart = getUser().heart;
    this.node.getComponent(cc.Label).string = heart.toString();
  }
}
