import dayjs from 'dayjs';
// npm install dayjs --save
/*
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：6位地区编码
 * yymmdd: 出生年(两位年)月日，如：910215
 * xx: 顺序编码，系统产生，无法确定
 * p: 性别，奇数为男，偶数为女
 *
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：6位地区编码
 * yyyymmdd: 出生年(四位年)月日，如：19910215
 * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 *
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
 */
export function validateId(cardno = '') {
  let flag = false;
  let idCard = cardno;
  if (idCard !== '') {
    // 15位和18位身份证号码的正则表达式
    let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
      if (idCard.length === 18) {
        let idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 将前17位加权因子保存在数组里
        let idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
        let idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
        for (let i = 0; i < 17; i++) {
          idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
        }

        let idCardMod = idCardWiSum % 11; // 计算出校验码所在数组的位置
        let idCardLast = idCard.substring(17); // 得到最后一位身份证号码

        // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod === 2) {
          if (idCardLast === 'X' || idCardLast === 'x') {
            flag = true;
          }
        } else {
          // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
          if (idCardLast === idCardY[idCardMod] + '') {
            flag = true;
          }
        }
      }
    }
  }
  return flag;
}

/**
 * 隐藏字符串中间位数 188****6666
 * @param card
 * @param snum 前段保留的位数
 * @param enumb 后端保留的位数
 * @returns {*}
 */
export function displayNum(card = '', snum = 6, enumb = 4) {
  if (card === '' || card.length < (snum + enumb)) {
    console.log('传入有效位数字符串或修改保留位数')
    return '';
  } else {
    let end = card.length - snum - enumb;
    let str = ''
    for (let i = 0; i < end; i++) {
      str += '*'
    }
    return card.substr(0, snum) + str + card.substr(card.length - enumb);
  }
}

const dateFormat = 'YYYY-MM-DD'

/**
 * 今天
 * @param format
 * @returns {string}
 */
export function getNowDay(format = dateFormat) {
  return dayjs().format(format);
}

/**
 * 格式化日期
 * @param date
 * @param format
 * @returns {string}
 */
export function formatDate(date = getNowDay(), format = dateFormat) {
  return dayjs(date).format(format);
}


/**
 * 获取（含今天）num天的日期
 * @param num ： Number
 * @returns {Array}
 */
export function getDaysSinceNow(num = 0, format = dateFormat) {
  let result = []
  result.push(getNowDay(dateFormat));
  for (let i = 1; i <= num; i++) {
    result.push(dayjs().add(i, 'day').format(dateFormat))
  }
  return result;
}

export function getDaysBetween(begin, end) {
  let result = []
  let num = dayjs(end).diff(dayjs(begin), 'day')
  // TODO 修改选择差限制
  if (num > 31) {
    alert('最多选择31天')
    num = 31
  }
  result.push(begin);
  for (let i = 1; i <= num; i++) {
    result.push(dayjs(begin).add(i, 'day').format(dateFormat))
  }
  return result;
}

export default {
  validateId,
  displayNum,
  getNowDay,
  formatDate,
  getDaysSinceNow,
  getDaysBetween
}
