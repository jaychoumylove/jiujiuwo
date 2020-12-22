import { getAudioManager } from "./Common";

const { ccclass, property } = cc._decorator;

export const MODAL_ZINDEX = 2;
@ccclass
export default class MusicControllBtn extends cc.Component {
  status: boolean = true;
  onLoad() {
    const manger = getAudioManager(),
      muteNode = cc.find("mute", this.node);
    muteNode.active = !manger.getBgMusicStatus();

    this.node.on(cc.Node.EventType.TOUCH_START, this.handleTouch, this);
  }

  handleTouch() {
    getAudioManager().toggleBgMusicStatus();
    this.toogleMuteNode();
  }

  toogleMuteNode() {
    const manger = getAudioManager(),
      muteNode = cc.find("mute", this.node);
    muteNode.active = !manger.getBgMusicStatus();
  }
}
