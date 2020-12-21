const { ccclass, property } = cc._decorator;

type MonsterAnimationMapKey = "monster_walk" | "monster_stand" | null;
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
    const point = this.getLRPoint(),
      wps0 = this.node.convertToWorldSpaceAR(point.left),
      wps1 = this.node.convertToWorldSpaceAR(point.right),
      wps2 = this.node.convertToWorldSpaceAR(
        cc.v2(point.left.x - this.testNumber, 0)
      ),
      wps3 = this.node.convertToWorldSpaceAR(
        cc.v2(point.right.x + this.testNumber, 0)
      ),
      left = this.rayTest(wps0, wps2),
      right = this.rayTest(wps1, wps3);

    if (left && right) {
      const rigid = this.node.getComponent(cc.RigidBody);
      rigid.linearVelocity = cc.v2(0, rigid.linearVelocity.y);
      this.animationPlay("monster_stand");
    } else {
      if (left) {
        const rigid = this.node.getComponent(cc.RigidBody);
        if (!rigid.linearVelocity.x) {
          rigid.linearVelocity = cc.v2(this.speed.x, rigid.linearVelocity.y);
          this.animationPlay("monster_walk");
        }
      }
      if (right) {
        const rigid = this.node.getComponent(cc.RigidBody);
        if (!rigid.linearVelocity.x) {
          rigid.linearVelocity = cc.v2(-this.speed.x, rigid.linearVelocity.y);
          this.animationPlay("monster_walk");
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
      case 1:
        this.contactWithPlayer(otherCollider);
        break;
    }
  }

  onPostSolve(contact, selfCollider, otherCollider) {
    const key = otherCollider.node.uuid;

    if (this.contactDict.hasOwnProperty(key)) {
      delete this.contactDict[key];
    }
  }

  animationPlay(key?: MonsterAnimationMapKey) {
    const anim = this.node.getComponent(cc.Animation);
    anim.pause();
    if (key) {
      anim.play(key);
    }
  }

  contactWithPlayer(otherCollider: cc.Collider) {
    this.animationPlay();
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
