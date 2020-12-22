import HardCore from "./HardCore";
import { closeModal, delay } from "./util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClickOpen extends cc.Component {
  descease: boolean = true;
  progressTimer: number;
  addProgressTimer: number;
  onLoad() {
    cc.find("CrazyClick", this.node).on("click", this.handleTouch, this);

    this.handleProgress();
    this.initShapeAction();
  }

  handleProgress() {
    const progess = cc.find("progress", this.node);
    this.progressTimer = setInterval(() => {
      if (!progess) {
        this.cleanProgressTimer();
        return;
      }
      const progressNumber = progess.getComponent(cc.ProgressBar).progress;
      if (!this.descease && progressNumber == 1) {
        this.cleanProgressTimer();
            
        cc.find("Canvas/affix").children.map((item: cc.Node) => {
          const script: HardCore = item.getComponent("HardCore");
          script.add();
        });
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
