/**
 * 防抖函数(可用于防止重复提交)
 * 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，
 * 如果设定时间到来之前，又触发了事件，就重新开始延时。也就是说当一个用户一直触发这个函数，
 * 且每次触发函数的间隔小于既定时间，那么防抖的情况下只会执行一次。
 *
 * @param func 执行函数
 * @param delay 间隔时间 (可选) 默认300ms
 * @param immediate 立即执行 (可选) 默认true
 */
 export function debounce<T> (fn:(...arg: any)=>T, delay:number = 300, immediate:boolean = true) {
  let debounceTimer: NodeJS.Timeout | null
  return function() {
    let self = this // 事件源this
    let args = arguments // 接收事件源的event
    if (debounceTimer) clearTimeout(debounceTimer) // 存在就清除执行fn的定时器
    if (immediate) { // 立即执行
      let callNow = !debounceTimer // 执行fn的状态
      debounceTimer = setTimeout(function () {
        debounceTimer = null
      }, delay)
      if (callNow) {
        fn.apply(self, args)
      }
    } else { // 非立即执行
      debounceTimer = setTimeout(function () { // 或者使用箭头函数将this指向dom
        fn.apply(self, args)
      }, delay)
    }
  }
}
/**
 * 节流函数
 * 当持续触发事件时，保证在一定时间内只调用一次事件处理函数，意思就是说，假设一个用户一直触发这个函数，且每次触发
 * 小于既定值，函数节流会每隔这个时间调用一次
 * 用一句话总结防抖和节流的区别：防抖是将多次执行变为最后一次执行，节流是将多次执行变为每隔一段时间执行
 * 实现函数节流我们主要有两种方法：时间戳和定时器
 *
 * @param func 执行函数
 * @param wait 间隔时间
 * @param options 立即执行
 * options中  leading：false 表示禁用第一次执行 trailing: false 表示禁用停止触发的回调
 */
 export function throttle<T> (fn:(...arg: any)=>T, wait:number = 300, options?: {
  leading?: boolean,
  trailing?: boolean
 }) {
  let timer: NodeJS.Timeout | null
  let previous = 0
  let throttled = function () {
    let now = +new Date()
    // remaining 不触发下一次函数的剩余时间
    if (!previous && options?.leading === false) previous = now
    let remaining = wait - (now - previous)
    if (remaining < 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      previous = now
      fn.apply(this, arguments)
    } else if (!timer && options?.trailing !== false) {
      timer = setTimeout(() => {
        previous = options?.leading === false ? 0 : new Date().getTime()
        timer = null
        fn.apply(this, arguments)
      }, remaining)
    }
  }
  return throttled
}