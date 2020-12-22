import AudioManager from "../Root/AudioManager";
import { getNextLevelInfo } from "../state/Level";
import { getCurrentLevel } from "../state/User";

export const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

export async function delay(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      return resolve();
    }, time);
  });
}

export const getAudioManager: () => AudioManager = () => {
  return cc.find("root").getComponent("AudioManager");
};

export const isWx = () => {
  // return cc.sys.platform == cc.sys.WECHAT_GAME;
  return false;
};

export const closeModal = () => {
  const modal = cc.find("Canvas/ui/modal");
  modal.children.map((childNode) => {
    childNode.active = false;
  });
  modal.active = false;
  cc.find("bg", modal).active = false;
};

export const toggleModal = (
  contanier?: string,
  state?: boolean,
  gameState?: boolean | Function
) => {
  if (!state) state = false;

  if (true == state && !contanier) return;

  const modal = cc.find("Canvas/ui/modal");
  if (!modal) return;
  if (contanier) {
    if (state) {
      modal.children.map((childNode) => {
        childNode.active = false;
      });
    }
    const contanierNode = cc.find(contanier, modal);
    if (contanierNode.active == state) return;
    if (contanier == "settle") {
      contanierNode.getComponent("Settle").init(gameState ? "win" : "lose");
    }
    contanierNode.active = state;
    if (contanier == "loadingBg") {
      if (typeof gameState == "function") {
        gameState && gameState();
      }
    }
  } else {
    modal.children.map((childNode) => {
      childNode.active = false;
    });
  }
  modal.active = state;
  if (contanier !== "loadingBg") {
    cc.find("bg", modal).active = state;
  } else {
    cc.find("bg", modal).active = false;
  }
};

export const getLoadingModal = () => {
  return cc.find("Canvas/ui/modal/loadingBg");
};

export const supportNumberGroup = (list: [], number: number) => {
  if (!list.length) return [];
  if (!number || number < 1) return list;
  let newList = [];
  const length = list.length,
    lineNum =
      length % number === 0 ? length / number : Math.floor(length / number + 1);

  for (let i = 0; i < lineNum; i++) {
    let item = list.slice(i * number, i * number + number);
    newList.push(item);
  }
  return newList;
};
