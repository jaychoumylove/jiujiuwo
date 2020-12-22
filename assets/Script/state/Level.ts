import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";
import { getCurrentLevel, setCurrentLevel } from "./User";

const maxLevel = 66;
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

export const getNextLevel = () => {
  const current = getCurrentLevel();
  let nextLv = {
    lv: current + 1,
  };

  return getLevelByLvInfo(nextLv.lv);
};

export const unlockNextLevel = () => {
  const currentLevel = getCurrentLevel();
  const nextLv = getNextLevel();
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

  setCurrentLevel(nextLv.lv);

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