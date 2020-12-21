import AudioManager from "../Root/AudioManager";

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
