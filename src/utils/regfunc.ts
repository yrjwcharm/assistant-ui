export const regPhone =
  /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
export const regCNName = /^[\u4e00-\u9fa5]+$/;
export const regIDCard = /^(\d{18,18}|\d{17,17}X|\d{17,17}x)$/;

/** 验证验证码正确性
 * @method regCode
 */
export const regCode = (code: string) => {
  return code.length === 4 && !isNaN(Number(code));
};
/** 验证手机号正确性
 * @method regMobile
 */
export const regMobile = (mobile: string) => {
  return regPhone.test(mobile) && !isNaN(Number(mobile));
};
/** 验证中文姓名
 * @method regName
 */
export const regName = (name: string) => {
  return name && regCNName.test(name);
};
/** 验证中文姓名
 * @method regIDCard
 */
export const regIDcard = (idCard: string) => {
  return idCard && regIDCard.test(idCard);
};
