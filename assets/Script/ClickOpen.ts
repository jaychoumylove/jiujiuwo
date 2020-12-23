import HardCore from "./HardCore";
import { closeModal } from "./util/Common";

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
    const monster = cc.find("monster", this.node);
    const target = cc.instantiate(monster);
    const dft = {
        scale: 0.7,
        opacity: 255,
      },
      act = {
        scale: 1.4,
        opacity: 0,
      };
    let up = cc
        .tween()
        .to(0.5, act)
        .call(() => {
          Object.keys(dft).map((item) => {
            target[item] = dft[item];
          });
        }),
      action = cc.tween().then(up);
    Object.keys(dft).map((item) => {
      target[item] = dft[item];
    });
    this.node.addChild(target);
    cc.tween(target).repeatForever(action).start();
  }
}
