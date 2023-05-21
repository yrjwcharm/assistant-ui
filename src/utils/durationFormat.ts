/*
 * @Date: 2023-01-04 16:45:59
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-04 16:46:34
 * @FilePath: /assistant-ui/src/utils/durationFormat.js
 * @Description:  
 */


// 将秒数转换为 分:秒 格式
export const durationFormat = (duration:number):string  => {
  let minute = Math.floor(duration / 60)
  let second = Math.floor((duration - minute * 60)%60)

  const toFixed = (num:number) => num >= 10 ? `${num}` : `0${num}`
  return `${toFixed(minute)}:${toFixed(second)}`

}

export default durationFormat