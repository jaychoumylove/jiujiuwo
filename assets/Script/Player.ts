import Game from "./Game";
import { delay, toggleModal } from "./util/Common";

const { ccclass, property } = cc._decorator;

type PlayerAnimationMapKey =
  | "player_walk"
  | "player_success"
  | "player_stand"
  | "player_fail";
@ccclass
export default class Player extends cc.Component {
  // @property(cc.Vec2)
  speed: cc.Vec2 = cc.v2(100, 0);

  // @property(cc.Integer)
  testNumber: number = 50;

  contactDict: Object = {};

  weapon: number = 0;

  playerWeapon: cc.Node = null;
  playerWeaponTimer: number;

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
      rigid = this.node.getComponent(cc.RigidBody),
      left = this.rayTest(wps0, wps2),
      right = this.rayTest(wps1, wps3);

    if (left && right) {
      rigid.linearVelocity = cc.v2(0, rigid.linearVelocity.y);
      this.animationPlay("player_stand");
    } else {
      if (rigid.linearVelocity.y == 0) {
        if (left) {
          if (!rigid.linearVelocity.x) {
            rigid.linearVelocity = cc.v2(this.speed.x, rigid.linearVelocity.y);
            this.animationPlay("player_walk");
          }
        }
        if (right) {
          if (!rigid.linearVelocity.x) {
            rigid.linearVelocity = cc.v2(-this.speed.x, rigid.linearVelocity.y);
            this.animationPlay("player_walk");
          }
        }
      }
    }
  }

  getLRPoint() {
    const left = cc.v2(-this.node.width / 2, 0);
    const right = cc.v2(this.node.width / 2, 0);
    return { left, right };
  }

  animationPlay(key: PlayerAnimationMapKey) {
    const anim = this.node.getComponent(cc.Animation);

    anim.pause();
    anim.play(key);
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
    const gameScript: Game = cc.find("Canvas").getComponent("Game");
    this.weapon ? gameScript.dispatchSuccess() : gameScript.disptachFail();
    cc.director.getPhysicsManager().enabled = false;
    this.weapon ? this.win() : this.lose();
  }

  async lose() {
    this.animationPlay("player_fail");
    await delay(1000);
    toggleModal("settle", true, false);
  }

  win() {
    this.animationPlay("player_stand");
    this.playerWeapon.setPosition(this.node.position);
    cc.find("Canvas").addChild(this.playerWeapon);
    const monsterNode = cc.find("Canvas/monster");
    this.playerWeaponTimer = setInterval(() => {
      if (this.playerWeapon) {
        this.playerWeapon.angle += 20;
      } else {
        this.cleanPlayerWeaponTimer();
      }
    }, 50);
    cc.tween(this.playerWeapon)
      .to(0.7, { x: monsterNode.x, y: monsterNode.y })
      .call(async () => {
        this.animationPlay("player_success");
        monsterNode.destroy();
        this.playerWeapon.destroy();
        this.playerWeapon = null;
        this.cleanPlayerWeaponTimer();
        await delay(1000);
        toggleModal("settle", true, true);
      })
      .start();
  }

  cleanPlayerWeaponTimer() {
    if (this.playerWeaponTimer) {
      clearInterval(this.playerWeaponTimer);
      this.playerWeaponTimer = null;
    }
  }

  contactWithWeapon(otherCollider: cc.Collider) {
    this.weapon++;
    this.playerWeapon = cc.instantiate(otherCollider.node);
    otherCollider.node.destroy();
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
