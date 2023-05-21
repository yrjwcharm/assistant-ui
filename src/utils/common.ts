export function desensitizationMobile(str: string | null | undefined) {
  if (null != str) {
    let pat = /(\d{3})\d*(\d{4})/;
    return str.replace(pat, "$1****$2");
  } else {
    return "";
  }
}

export function desensitizationIdCard(str: string | null | undefined) {
  if (null != str) {
    let pat = /(\w{2})\w*(\w{2})/;
    return str.replace(pat, "$1**************$2");
  } else {
    return "";
  }
}
/**
 * 修饰收益颜色
 * @param profit
 */
export const decorationColor = (profit: string | number | undefined) => {
  if (typeof profit == "string") {
    return +profit?.replace(/%/g, "") > 0
      ? "#E74949"
      : +profit?.replace(/%/g, "") < 0
      ? "#4BA471"
      : "#121D3A";
  }
};
