import request from "@/utils/request";
import { setStorage } from "./local";
function getDidApi(params: { scene_code: number }) {
  return request(`/assistant/layer/mini/getDid`, {
    method: "GET",
    params,
  });
}

// const dispatch = useStoreDispatch();

export const getDid = async (scene: number) => {
  try {
    const res = await getDidApi({
      scene_code: scene,
    });
    // console.log("getDid_scene", scene);
    if (res.did) {
      setStorage("did", `${res.did}`);
    }
  } catch (error) {}
};
