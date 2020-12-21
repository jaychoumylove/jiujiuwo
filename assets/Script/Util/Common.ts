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
