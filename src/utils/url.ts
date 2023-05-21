/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|wss?:|mailto:|tel:)/.test(path);
}
/**
 * 拼接 url
 * @param {*} urls
 */
export function combineURL(...urls: any[]) {
  const ret = urls.map((url) => {
    if (!url) return url;
    if (isExternal(url)) {
      return url.replace(/\/+$/, "");
    }
    return url.replace(/^\/+/, "").replace(/\/+$/, "");
  });
  const url = ret.filter((r) => r).join("/");
  return isExternal(url) ? url : `/${url}`;
}
/**
 * 获取原始类型的值
 * @param {*} val
 */
export function toRawType(val: any) {
  return {}.toString.call(val).slice(8, -1);
}
/**
 * 解析对象为 query { a: 1, b: 2 } => ?a=1&b=2
 * @param {*} data
 */
export function obj2Query(data: any) {
  if (toRawType(data) !== "Object") return "";
  let ret = "";
  Object.keys(data).forEach((key) => {
    const val = data[key];
    if (val || val === 0 || val === false) {
      ret +=
        (ret.indexOf("?") === -1 ? "?" : "&") +
        `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    }
  });
  return ret;
}
export function getQueryParams(url: string) {
  const paramArr = url.slice(url.indexOf("?") + 1).split("&");
  const params = {};
  paramArr.map((param) => {
    const [key, val] = param.split("=");
    // @ts-ignore
    params[key] = decodeURIComponent(val);
  });
  return params;
}
