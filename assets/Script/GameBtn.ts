import { openVideoWithCb } from "./platform/wxVideo";
import {
  getCurrentLevelInfo,
  getLevelByLvInfo,
  getNextLevelInfo,
  loadLevelScene,
} from "./state/Level";
import {
  checkHeart,
  getCurrentLevel,
  increaseCoin,
  increaseHeartByAd,
} from "./state/User";
import { closeModal, isWx, toggleModal } from "./util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBtn extends cc.Component {
  @property()
  type = "";

  @property()
  handle: "touch" | "click" = "click";

  onLoad() {
    let eventType: string;
    if (this.handle == "click") {
      eventType = this.handle;
    }
    if (this.handle == "touch") {
      eventType = cc.Node.EventType.TOUCH_START;
    }
    this.node.on(eventType, this.handleClick, this);
  }

  handleClick(evt, param) {
    if (param) {
      this.type = param;
    }
    let call: Function;
    switch (this.type) {
      // case "pause":
      //   this.pauseGame();
      //   break;
      // case "resume":
      //   this.resumeGame();
      //   break;
      case "home":
        cc.director.loadScene("home");
        break;
      case "level":
        cc.director.loadScene("level");
        break;
      case "replay":
        const currentLevel = getCurrentLevel();
        cc.director.loadScene(`level_${currentLevel}`);
        break;
      case "jumpLevel":
        call = () => {
          const res = loadLevelScene("next");
          if (!res) {
            this.node.destroy();
          }
        };
        if (isWx()) {
          openVideoWithCb(call);
        } else {
          call();
        }
        break;
      case "goNextLevel":
        loadLevelScene("next");
        break;
      case "getReward":
        cc.log("get_reward");
        call = () => {
          const currentInfo = getCurrentLevelInfo();
          increaseCoin(currentInfo.reward);
          const res = loadLevelScene("next");
          if (!res) {
            const currentLevel = getCurrentLevel();
            cc.director.loadScene(`level_${currentLevel}`);
          }
        };
        if (isWx()) {
          openVideoWithCb(call);
        } else {
          call();
        }
        break;
      case "closeModal":
        // toggleModal("AdHeart", false);
        closeModal();
        break;
      default:
        break;
    }
  }

  pauseGame() {
    cc.director.pause();
  }

  resumeGame() {
    this.resume();
  }

  resume() {
    cc.director.resume();
  }
}
