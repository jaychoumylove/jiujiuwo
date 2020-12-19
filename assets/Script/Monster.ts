const { ccclass, property } = cc._decorator;

@ccclass
export default class Monster extends cc.Component {
  @property(cc.Vec2)
  speed: cc.Vec2 = cc.v2(50, 0);

  contactDict: Object = {};

  weapon: number = 0;

  update() {
    const wps1 = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
    const wps2 = this.node.convertToWorldSpaceAR(cc.v2(-50, 0));
    const wps3 = this.node.convertToWorldSpaceAR(cc.v2(50, 0));

    const left = this.rayTest(wps1, wps2),
      right = this.rayTest(wps1, wps3);
    if (left && right) {
      const rigid = this.node.getComponent(cc.RigidBody);
      rigid.linearVelocity = cc.v2(0, rigid.linearVelocity.y);
    } else {
    }
  }

  rayTest(posFirst: cc.Vec2, posSecond: cc.Vec2) {
    const result = cc.director
      .getPhysicsManager()
      .rayCast(posFirst, posSecond, cc.RayCastType.Any);

    let existBlock = false;
    result.forEach((item: cc.PhysicsRayCastResult) => {
      if (item.collider.tag == 0) {
        existBlock = true;
      }
    });

    return existBlock;
  }

  onBeginContact(
    contact: cc.PhysicsContact,
    selfCollider: cc.BoxCollider,
    otherCollider: cc.Collider
  ) {
    const key = otherCollider.node.uuid;

    if (this.contactDict.hasOwnProperty(key)) return;
    this.contactDict[key] = otherCollider.tag;
    switch (otherCollider.tag) {
      case 0:
        // 墙壁
        this.contactWithBlock(otherCollider);
        break;
    }
  }

  onPostSolve(contact, selfCollider, otherCollider) {
    const key = otherCollider.node.uuid;

    if (this.contactDict.hasOwnProperty(key)) {
      delete this.contactDict[key];
    }
  }

  contactWithBlock(otherCollider: cc.Collider) {
    const otherNode = otherCollider.node;
    let turnAround = false;
    if (otherNode.angle % 180 > 0) {
      if (otherNode.width > otherNode.height) {
        turnAround = true;
      }
    } else {
      if (otherNode.height > otherNode.width) {
        turnAround = true;
      }
    }
    if (turnAround) {
      const rigid = this.node.getComponent(cc.RigidBody);
      this.node.scaleX = -rigid.linearVelocity.x > 0 ? -1 : 1;
      rigid.linearVelocity = cc.v2(
        -rigid.linearVelocity.x,
        rigid.linearVelocity.y
      );
    }
  }
}
