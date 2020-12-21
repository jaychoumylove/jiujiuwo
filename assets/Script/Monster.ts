const { ccclass, property } = cc._decorator;

@ccclass
export default class Monster extends cc.Component {
  // @property(cc.Vec2)
  speed: cc.Vec2 = cc.v2(100, 0);

  // @property(cc.Integer)
  testNumber: number = 50;

  contactDict: Object = {};

  weapon: number = 0;

  onLoad() {
    const rigid = this.node.getComponent(cc.RigidBody);
    this.node.scaleX = -rigid.linearVelocity.x > 0 ? -1 : 1;
  }

  update() {
    const point = this.getLRPoint();
    const wps0 = this.node.convertToWorldSpaceAR(point.left);
    const wps1 = this.node.convertToWorldSpaceAR(point.right);
    const wps2 = this.node.convertToWorldSpaceAR(
      cc.v2(point.left.x - this.testNumber, 0)
    );
    const wps3 = this.node.convertToWorldSpaceAR(
      cc.v2(point.right.x + this.testNumber, 0)
    );

    const left = this.rayTest(wps0, wps2),
      right = this.rayTest(wps1, wps3);

    if (left && right) {
      const rigid = this.node.getComponent(cc.RigidBody);
      rigid.linearVelocity = cc.v2(0, rigid.linearVelocity.y);
    } else {
      if (left) {
        const rigid = this.node.getComponent(cc.RigidBody);
        if (!rigid.linearVelocity.x) {
          rigid.linearVelocity = cc.v2(this.speed.x, rigid.linearVelocity.y);
        }
      }
      if (right) {
        const rigid = this.node.getComponent(cc.RigidBody);
        if (!rigid.linearVelocity.x) {
          rigid.linearVelocity = cc.v2(-this.speed.x, rigid.linearVelocity.y);
        }
      }
    }
  }

  getLRPoint() {
    const collider = this.node.getComponent(cc.PhysicsPolygonCollider).points;
    const colliderX = collider.map((item) => {
      return item.x;
    });

    const leftX = Math.min(...colliderX);
    const rightX = Math.max(...colliderX);

    const leftPos = collider.find((item) => item.x == leftX);
    const rightPos = collider.find((item) => item.x == rightX);

    return {
      left: leftPos,
      right: rightPos,
    };
  }

  rayTest(posFirst: cc.Vec2, posSecond: cc.Vec2) {
    const result = cc.director
      .getPhysicsManager()
      .rayCast(posFirst, posSecond, cc.RayCastType.Closest);

    let existBlock = false;
    result.forEach((item: cc.PhysicsRayCastResult) => {
      if (true == existBlock) return;
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
