import { closeModal, delay } from "./util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class loadingModal extends cc.Component {
  descease: boolean = true;
  progressTimer: number;
  addProgressTimer: number;

  init() {}

  handleProgress() {
    const progess = cc.find("progress", this.node);
    this.progressTimer = setInterval(() => {
      const progressNumber = progess.getComponent(cc.ProgressBar).progress;
      if (!this.descease && progressNumber == 1) {
        this.cleanProgressTimer();
        closeModal();
        return;
      }

      if (this.descease && progressNumber > 0) {
        cc
          .find("progress", this.node)
          .getComponent(cc.ProgressBar).progress = parseFloat(
          (progess.getComponent(cc.ProgressBar).progress - 0.1).toPrecision(1)
        );
        return;
      }
    }, 300);
  }

  handleTouch() {
    this.descease = false;
    const progess = cc.find("progress", this.node);

    progess.getComponent(cc.ProgressBar).progress = parseFloat(
      (progess.getComponent(cc.ProgressBar).progress + 0.1).toPrecision(1)
    );
    this.setAddProgressTimer();
  }

  cleanProgressTimer() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = 0;
    }
    if (this.addProgressTimer) {
      clearInterval(this.addProgressTimer);
      this.addProgressTimer = 0;
    }
  }

  setAddProgressTimer() {
    if (this.addProgressTimer) {
      clearTimeout(this.addProgressTimer);
    }
    this.addProgressTimer = setTimeout(() => {
      this.descease = true;
    }, 600);
  }

  initShapeAction() {
    const target = cc.find("monster", this.node);
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
