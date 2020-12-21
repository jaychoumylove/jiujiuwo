const { ccclass, property } = cc._decorator;

@ccclass
export default class Weapon extends cc.Component {
  contactDict: Object = {};
  onBeginContact(
    contact: cc.PhysicsContact,
    selfCollider: cc.BoxCollider,
    otherCollider: cc.Collider
  ) {
    const key = otherCollider.node.uuid;

    if (this.contactDict.hasOwnProperty(key)) return;

    this.contactDict[key] = otherCollider.tag;
    console.log(otherCollider.node.uuid);

    switch (otherCollider.tag) {
      // case 1:
      //   // 碰到玩家
      //   this.contactWithPlayer(otherCollider);
      //   break;
      case 2:
        // 碰到怪物
        this.contactWithMonster(otherCollider);
      default:
        break;
    }
  }
  contactWithPlayer(otherCollider: cc.Collider) {
    this.node.destroy();
  }
  contactWithMonster(otherCollider: cc.Collider) {
    this.node.destroy();
  }
}
