/**
 * @file node or browser detect
 * @author junbinluo
 * @date 2018/4/21
 */

const IS_BROWSER = new Function(`
  try {
    console.log(this === window, this);
    return this === window;
  } catch (e) {
    return false;
  }
`)();

module.exports = {
  isBrowser: IS_BROWSER
};
