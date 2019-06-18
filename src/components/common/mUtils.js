export const DataConvert = {
  /**
   * @description: Json对象数组 转换成 字符串数组, sec转换成 min:sec格式
   * @param {Array}
   * @return: String
   */
  partsJsonToString: function(arr) {
    if (!arr || !arr.length) return ""
    let str = "",
      sec_str
    for (let i = 0; i < arr.length; i++) {
      let tts
      if (arr[i].tts != undefined) {
        tts = ""
        arr[i].tts.forEach(function(ctts) {
          tts +=
            "[" +
            (parseInt(ctts.ttscd) >= 0 ? ctts.ttscd : "") +
            (ctts.ttsstr ? "," + ctts.ttsstr : "") +
            "]"
        })
      }
      sec_str = "" + parseInt(arr[i].sec / 60) + ":" + (arr[i].sec % 60)
      str +=
        (i > 0 ? "\n" : "") +
        sec_str +
        " " +
        arr[i].skillname +
        (tts ? tts : "") +
        ";"
    }
    return str
  },
  /**
   * @description: min:sec格式转换成 sec (单条)
   * @param {String} "0:15 XXX;"
   * @return: {sec: 115, skillname: "XXX"}
   */
  tojsonstr(str) {
    let a = str.split(":"),
      // tsec = a[1][0] + typeof(+a[1][1]) == "number"?a[1][1]:'',
      tsec = a[1][0] + (/^[0-9]$/.test(a[1][1]) ? a[1][1] : ""),
      b = a[1].replace(/]\[|\[|];|]/g, ",").split(","),
      jsonobj,
      tts = []
    b[0] = /^[0-9]$/.test(b[0][1])
      ? b[0].substring(2, b[0].length)
      : b[0].substring(1, b[0].length)
    jsonobj = {
      sec: parseInt(a[0] * 60 + +tsec),
      skillname: b[0].replace(/^ +/, "")
      // ttscd:(parseInt(b[1])>=0?parseInt(b[1]):undefined),
      // ttsstr:b[2]
    }
    b.forEach(function(str, i, _b) {
      if (i > 0 && str != "" && i % 2 == 1) {
        let obj = {}
        obj.ttscd = parseInt(str)
        obj.ttsstr = _b[i + 1]
        tts.push(obj)
      }
    })
    jsonobj.tts = tts.length > 0 ? tts : undefined
    return JSON.stringify(jsonobj)
    //return ('{"sec":'+str.replace(/:/g, ",\"skillname\":\"") +'"}');
  },
  /**
   * @description: 字符串栓换成JSON对象
   * @param {String} "0:15 XXX;0:115 XXX;"
   * @return: [0: {sec: 115, skillname: "XXX"}...]
   */
  stringToPartsJson: function(str) {
    if (!str || str === "") return []
    var arr = str.split(";") //180:月影,3,驱散准备;
    var arrC = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].trim()) arrC[i] = JSON.parse(DataConvert.tojsonstr(arr[i]))
    }
    return arrC
  },
  /**
   * @description: 排序去重
   * @param {Array}
   * @return: newArray
   */
  sortUnique: function(array) {
    let newArray = [],
      item,
      temp,
      flag
    for (let i = 0; i < array.length; i++) {
      flag = 0
      item = array[i]
      if (item == undefined) {
        continue
      }
      let isec = item.ttscd || item.sec
      flag = 1
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] == undefined) {
          continue
        }
        isec = item.ttscd || item.sec
        let jsec = array[j].ttscd || array[j].sec
        if (jsec < isec) {
          temp = item
          item = array[j]
          array[j] = temp
          flag = 2
        }
        if (jsec == isec) {
          item = array[j]
          array[j] = null
          flag = 2
        }
      }
      if (flag) newArray.push(item)
    }
    return newArray
  }
}
export const CopyJson = function(jsonobj) {
  return JSON.parse(JSON.stringify(jsonobj))
}
export const CopyObj = function(obj) {
  if (typeof obj != "object") return obj
  // if (Object.prototype.toString.call(obj) == "[object Array]") {
  if (obj.constructor === Array) {
    let newobj = [],
      i = 0
    for (let item of obj) {
      newobj[i] = CopyObj(item)
      i++
    }
    return newobj
  }
  let newobj = {}
  for (let attr in obj) {
    newobj[attr] = CopyObj(obj[attr])
  }
  return newobj
}
