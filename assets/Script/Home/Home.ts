const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
  onLoad() {
    this.initStartBtnAction();
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
  }
}
