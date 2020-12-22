const { ccclass, property } = cc._decorator;

@ccclass
export default class GroupLevelItem extends cc.Component {
  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  public init(group) {
    const itemsContainer = this.node;
    group.map((item) => {
      const node = cc.instantiate(this.itemPrefab);
      node.getComponent("LevelItem").init(item);
      itemsContainer.addChild(node);
    });
    itemsContainer.getComponent(cc.Layout).updateLayout();
  }
}
