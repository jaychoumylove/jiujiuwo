import { MODAL_ZINDEX } from "./Root/Zindex";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Modal extends cc.Component {
  @property([cc.Prefab])
  container: cc.Prefab[] = [];

  init() {
    cc.find("bg", this.node).active = false;
    this.container.map((item) => {
      const node = cc.instantiate(item);
      node.active = false;
      node.zIndex = MODAL_ZINDEX;
      node.group = "ui";
      this.node.addChild(node);
    });
  }
}
