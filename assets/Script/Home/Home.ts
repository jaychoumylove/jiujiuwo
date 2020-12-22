import { loadLevelScene } from "../state/Level";
import { checkHeart, descreaseHeart } from "../state/User";
import { toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
  onLoad() {
    this.initStartBtnAction();
    cc.director.preloadScene("level");
  }

  initStartBtnAction() {
    const target = cc.find("Canvas/start");
    const dft = {
        scale: this.node.scale,
      },
      act = {
        scale: 0.8,
      };
    let up = cc.tween().to(0.6, act),
      down = cc.tween().to(0.6, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(target).repeatForever(action).start();
    target.on(cc.Node.EventType.TOUCH_START, this.handleStart, this);
  }

  handleStart() {
    // if (!checkHeart()) {
    //   toggleModal("AdHeart", true);
    //   return;
    // }
    // descreaseHeart();
    loadLevelScene("current");
  }
}
