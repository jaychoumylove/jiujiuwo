import { LevelKey } from "../state/Level";
import { supportNumberGroup } from "../util/Common";
import { getCfgVal } from "../util/Storage";

const { ccclass, property } = cc._decorator;

export type Direction = "left" | "right";

@ccclass
export default class Container extends cc.Component {
  @property(cc.Prefab)
  groupPrefab: cc.Prefab = null;

  onLoad() {
    this.init();
  }

  init() {
    const levels = getCfgVal(LevelKey);
    const groupLevel = supportNumberGroup(levels, 10);
    groupLevel.map((item) => {
      const node = cc.instantiate(this.groupPrefab);
      node.getComponent("GroupLevelItem").init(item);
      this.node.addChild(node);
    });
    this.node.getComponent(cc.Layout).updateLayout();
  }
}
