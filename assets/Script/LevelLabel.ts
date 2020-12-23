import { getCurrentLevel } from "./state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelLabel extends cc.Component {
  onLoad() {
    this.node.getComponent(cc.Label).string = getCurrentLevel().toString();
  }
}
