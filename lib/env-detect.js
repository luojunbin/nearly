"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @file node or browser detect
 * @author junbinluo
 * @date 2018/4/21
 */

var IS_BROWSER = exports.IS_BROWSER = new Function("\n  try {\n    return this === window;\n  } catch (e) {\n    return false;\n  }\n")();