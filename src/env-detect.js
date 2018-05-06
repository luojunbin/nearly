/**
 * @file node or browser detect
 * @author junbinluo
 * @date 2018/4/21
 */

export const IS_BROWSER = new Function(`
  try {
    return this === window;
  } catch (e) {
    return false;
  }
`)();
