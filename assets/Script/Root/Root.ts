import { initState } from "../state/Init";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Root extends cc.Component {
  onLoad() {
    cc.game.addPersistRootNode(this.node);
    initState();
  }
}
