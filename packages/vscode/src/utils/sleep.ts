/**
 * 延时
 * @param {number} time 时间
 * @returns
 */
export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
