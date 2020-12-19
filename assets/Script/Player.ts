const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property(cc.Vec2)
  speed: cc.Vec2 = cc.v2(50, 0);

  // @property(cc.Integer)
  testNumber: number = 100;

  contactDict: Object = {};

  weapon: number = 0;

  update() {
    const rigid = this.node.getComponent(cc.RigidBody),
      wps1 = this.node.convertToWorldSpaceAR(cc.v2(0, 0)),
      wps2 = this.node.convertToWorldSpaceAR(cc.v2(-this.testNumber, 0)),
      wps3 = this.node.convertToWorldSpaceAR(cc.v2(this.testNumber, 0)),
      left = this.rayTest(wps1, wps2),
      right = this.rayTest(wps1, wps3);
    if (left && right) {
      rigid.linearVelocity = cc.v2(0, rigid.linearVelocity.y);
    } else {
      if (rigid.linearVelocity.y == 0) {
        if (left) {
          if (!rigid.linearVelocity.x) {
            rigid.linearVelocity = cc.v2(this.speed.x, rigid.linearVelocity.y);
          }
        }
        if (right) {
          if (!rigid.linearVelocity.x) {
            rigid.linearVelocity = cc.v2(-this.speed.x, rigid.linearVelocity.y);
          }
        }
      }
    }
  }

  rayTest(posFirst: cc.Vec2, posSecond: cc.Vec2) {
    const result = cc.director
      .getPhysicsManager()
      .rayCast(posFirst, posSecond, cc.RayCastType.Closest);

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
      case 2:
        // 怪物
        this.contactWithMonster(otherCollider);
        break;
      case 3:
        // 武器-乾坤袋-符
        this.contactWithWeapon(otherCollider);
        break;
      default:
        break;
    }
  }

  contactWithMonster(otherCollider: cc.Collider) {
    console.log(this.weapon ? "win" : "die");
    console.log(this.weapon);
    cc.director.getPhysicsManager().enabled = false;
  }

  contactWithWeapon(otherCollider: cc.Collider) {
    this.weapon++;
  }

  onPostSolve(
    contact: cc.PhysicsContact,
    selfCollider: cc.BoxCollider,
    otherCollider: cc.Collider
  ) {
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
      rigid.linearVelocity = cc.v2(
        -rigid.linearVelocity.x,
        rigid.linearVelocity.y
      );
    }
  }
}
