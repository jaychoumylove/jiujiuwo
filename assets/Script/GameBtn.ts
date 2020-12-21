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
    console.log("touch in");

    if (param) {
      this.type = param;
    }
    // getAudioManager().playOnceMusic("button");
    let call: Function;
    switch (this.type) {
      // case "pause":
      //   this.pauseGame();
      //   break;
      // case "resume":
      //   this.resumeGame();
      //   break;
      // case "home":
      //   this.resume();
      //   cc.director.loadScene("home");
      //   break;
      // case "level":
      //   this.resume();
      //   cc.director.loadScene("level");
      //   break;
      case "replay":
        // this.resume();
        // console.log(cc.director.getScene().name);
        // cc.director.loadScene(cc.director.getScene().name);
        cc.director.loadScene("level_1");
        break;
      // case "jump_level":
      //   this.resume();
      //   call = () => {
      //     loadLevelScene("next");
      //   };
      //   if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      //     openVideoWithCb(call);
      //   } else {
      //     call();
      //   }
      //   break;
      // case "go_next_level":
      //   this.resume();
      //   loadLevelScene("next");
      //   break;
      // case "get_reward":
      //   this.resume();
      //   cc.log("get_reward");

      //   call = () => {
      //     const currentLevel = getCurrentLevel();
      //     increaseCoin(currentLevel.reward);
      //     const nextLv = getNextLevel();
      //     if (nextLv) {
      //       loadLevelScene("next");
      //     } else {
      //       this.node.active = false;
      //     }
      //   };
      //   if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      //     openVideoWithCb(call);
      //   } else {
      //     call();
      //   }
      //   break;
      // case "getHeart":
      //   call = () => {
      //     increaseHeartByAd();
      //   };
      //   if (isWx()) {
      //     openVideoWithCb(call);
      //   } else {
      //     call();
      //   }
      //   break;
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
