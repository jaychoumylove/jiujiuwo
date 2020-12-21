import { MODAL_ZINDEX } from "./Root/Zindex";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UI extends cc.Component {
  @property(cc.Prefab)
  modal: cc.Prefab = null;

  onLoad() {
    const modalNode = cc.instantiate(this.modal);
    modalNode.zIndex = MODAL_ZINDEX;
    modalNode.group = "ui";
    this.node.addChild(modalNode);
    modalNode.getComponent("Modal").init();
  }
}
