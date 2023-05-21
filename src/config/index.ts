/*
 * @Date: 2023-01-05 10:14:43
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-06 19:22:25
 * @FilePath: /assistant-ui/src/config/index.ts
 * @Description: 接口和h5地址
 */

const apiMap = {
  production: {
    base: "https://assistant-api.licaimofang.com/",
    h5: "https://growth.licaimofang.com/",
  },
  pre1: {
    base: "https://assistant-api-kp1.licaimofang.com/",
    h5: "https://growth-kp1.licaimofang.com/",
  },
  testing: {
    base: "http://assistant-api.yitao.mofanglicai.com.cn/",
    h5: "http://ass-growth-ui.yitao.mofanglicai.com.cn/",
  },
  development: {
    base: "http://assistant-api.yitao.mofanglicai.com.cn/", // 测试
    // base: "https://assistant-api-kp1.licaimofang.com/", // pre1
    // base: "https://assistant-api.licaimofang.com/", // 正式
    // base: "http://assistant-api.xiaojun.mofanglicai.com.cn/", // 本地
    h5: "http://ass-growth-ui.yitao.mofanglicai.com.cn/", // 测试
    // h5: "https://growth-kp1.licaimofang.com/", // pre1
    // h5: "https://growth.licaimofang.com/", // 正式
    // h5: "http://localhost:8000/", // 本地
  },
};

console.log("API_ENV:", API_ENV);

export const baseURL: string = apiMap[API_ENV].base;
export const h5BaseURL: string = apiMap[API_ENV].h5;
