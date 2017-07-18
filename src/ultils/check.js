/**
 * Created by Amg on 2016/11/12.
 */

// 表单验证
const regs = {
  number: /^(0|[1-9][0-9]*)$/,
  char: /^[A-Za-z]+$/,
  chinese: /^[\u4e00-\u9fa5]+$/gi,
  mobile: /^1[34578]{1}[0-9]{9}$/,
  numChar: /^[A-Za-z0-9]+$/,
  blankSpace: /\s/,
};

export default class CheckForm {
  // 验证非空
  static notEmpty(str) {
    return (typeof str !== 'undefined' && str.trim() !== '');
  }

  // 限制长度
  static lengthLimit(str, minLen, maxLen) {
    let len = 0;
    const strLen = str.length;
    for (let i = 0; i < strLen; i += 1) {
      if (str[i].match(/[^x00-xff]/ig) != null) { // 全角
        len += 2;
      } else {
        len += 1;
      }
    }
    return (len >= minLen && len <= maxLen);
  }

  // 包含空格
  static hasBlankSpace(str) {
    return regs.blankSpace.test(str);
  }

  /** 基本格式验证**/
  // 验证数字（非 0 开头）

  static isNumber(str) {
    return regs.number.test(str);
  }

  // 验证字母
  static isChar(str) {
    return regs.char.test(str);
  }

  // 验证汉字
  static isChinese(str) {
    return regs.chinese.test(str);
  }

  // 验证邮箱格式
  // static isEmail(str) {}
  // 验证手机号码格式
  static isMobile(str) {
    return regs.mobile.test(str);
  }

  /** 项目定制**/
  // 验证账号格式（数字，字母）
  static checkUname(str) {
    return regs.numChar.test(str);
  }

  // 验证密码格式（数字，字母）
  static checkPwd(str) {
    return regs.numChar.test(str);
  }
}
