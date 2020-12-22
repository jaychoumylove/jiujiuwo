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
  return cc.sys.platform == cc.sys.WECHAT_GAME;
};

export const toggleModal = (
  contanier?: string,
  state?: boolean,
  gameState?: boolean
) => {
  if (!state) state = false;

  if (true == state && !contanier) return;

  const modal = cc.find("Canvas/ui/modal");
  if (contanier) {
    const contanierNode = cc.find(contanier, modal);
    if (contanier == "settle") {
      contanierNode.getComponent("Settle").init(gameState ? "win" : "lose");
    }
    contanierNode.active = state;
  } else {
    modal.children.map((childNode) => {
      childNode.active = false;
    });
  }
  modal.active = state;
  cc.find("bg", modal).active = state;
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
