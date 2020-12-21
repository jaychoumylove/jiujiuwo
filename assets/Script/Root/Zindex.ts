const { ccclass, property } = cc._decorator;

export const MODAL_ZINDEX = 2;
@ccclass
export default class Zindex extends cc.Component {
  onLoad() {
    this.node.zIndex = MODAL_ZINDEX;
    this.node.parent.zIndex = MODAL_ZINDEX;
  }
}
