import { getLoadingModal, toggleModal } from "../util/Common";
import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";
import { getCurrentLevel, setCurrentLevel } from "./User";

const maxLevel = 2;
export const LevelKey = "userLevel";

export const initLevel = () => {
  const currentLevelState = getCfgVal(LevelKey);
  if (!currentLevelState) {
    // 第一次进来
    let level = [];
    for (let index = 0; index < maxLevel; index++) {
      const lv = index + 1;
      const item = {
        lv,
        status: index < 1 ? "current" : "lock",
        times: 0, // 挑战次数
        life: 3, // 命
        reward: 300, // 通关金币奖励
      };
      level.push(item);
    }

    initByStorage(LevelKey, level);
    return;
  }
  if (currentLevelState.length < maxLevel) {
    // 需要加关卡
    let level = currentLevelState;
    for (let index = currentLevelState.length; index < maxLevel; index++) {
      const lv = index + 1;
      let status = "lock";
      if (level[currentLevelState.length - 1].status == "pass") {
        status = "current";
      }
      const item = {
        lv,
        status,
        times: 0, // 挑战次数
        life: 3, // 命
        reward: 300, // 通关金币奖励
      };
      level.push(item);
    }

    setCfgVal(LevelKey, level);
  }
  return;
};

export const getNextLevelInfo = () => {
  const current = getCurrentLevel();
  let nextLv = {
    lv: current + 1,
  };

  return getLevelByLvInfo(nextLv.lv);
};

export const getCurrentLevelInfo = () => {
  const current = getCurrentLevel();
  return getLevelByLvInfo(current);
};

const getLevelInfoByType = (type: "current" | "next") => {
  let lvInfo = null;
  switch (type) {
    case "current":
      lvInfo = getCurrentLevelInfo();
      break;
    case "next":
      lvInfo = getNextLevelInfo();
      break;
    default:
      break;
  }
  if (!lvInfo) return false;
  return lvInfo;
};

export const loadLevelScene = (type: "current" | "next") => {
  const lvInfo = getLevelInfoByType(type);
  if (!lvInfo) return false;

  toggleModalWithLoading(lvInfo);
};

let preloadlv = 0;

const toggleModalWithLoading = (lvInfo) => {
  if (!preloadlv) {
    preloadlv = lvInfo.lv;
    toggleModal("loadingBg", true, () => {
      cc.director.preloadScene(
        `level_${lvInfo.lv}`,
        (c, t) => {
          const node = getLoadingModal();
          const target = cc.find("container/ProgressBar", node);
          target.getComponent(cc.ProgressBar).progress = parseFloat(
            (c / t).toPrecision(1)
          );
        },
        (e) => {
          if (!e) {
            cc.director.loadScene(`level_${lvInfo.lv}`);
            setCurrentLevel(lvInfo.lv);
          }
          preloadlv = 0;
        }
      );
    });
  }
};

export const loadLevelSceneByLv = (lv) => {
  const lvInfo = getLevelByLvInfo(lv);
  if (!lvInfo) return false;
  toggleModalWithLoading(lvInfo);
};

export const preLoadLevelScene = (type: "current" | "next") => {
  const lvInfo = getLevelInfoByType(type);
  if (!lvInfo) return false;

  cc.director.preloadScene(`level_${lvInfo.lv}`);
};

export const unlockNextLevel = () => {
  const currentLevel = getCurrentLevel();
  const nextLv = getNextLevelInfo();
  if (!nextLv) return;

  let lv = getCfgVal(LevelKey);

  const newLv = lv.map((item) => {
    if (item.lv == currentLevel && item.status == "current") {
      item.status = "pass";
    }
    if (item.lv == nextLv.lv && item.status == "lock") {
      item.status = "current";
    }
    return item;
  });

  if (lv != newLv) {
    setCfgVal(LevelKey, newLv);
  }
};

export const getLevelByLvInfo = (lv) => {
  let lvs = getCfgVal(LevelKey);

  let hasLv = null;

  for (let index = 0; index < lvs.length; index++) {
    const element = lvs[index];
    if (element.lv == lv) {
      hasLv = element;
      break;
    }
  }

  return hasLv;
};
