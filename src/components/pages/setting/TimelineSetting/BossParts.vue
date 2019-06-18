<template>
  <div class="parts-wrap"
       v-show="parts.length">
    <!-- <div class="boss-name">
      <el-divider content-position="left">
        <el-input v-model="_bossName"></el-input>
      </el-divider>
    </div> -->
    <el-input :autosize="{minRows:1,maxRows:5}"
              :class="error[0]"
              v-model="globlePart"
              placeholder="关键技能(全局)"
              type="textarea"
              @keyup.native="changePart(globlePart,0)"></el-input>

    <el-input :autosize="{minRows:2,maxRows:20}"
              :class="error[i+1]"
              v-for="(p,i) of partCore"
              :key="i"
              v-model="partCore[i]"
              :placeholder="'p'+(i+1)"
              type="textarea"
              @keyup.native="changePart(p,i+1)"></el-input>
    <div class="clearfix">
      <el-button class="add-part"
                 type="info"
                 icon="el-icon-plus"
                 circle
                 @click="addPart">
      </el-button>
      <el-button type=""></el-button>
    </div>
    <div class="clearfix">
      <ImportExport class="import-export" />
      <el-button type="primary"
                 class="save"
                 @click="dataSave">保存
      </el-button>
    </div>
  </div>
</template>
<script>
import { DataConvert } from "@comp/common/mUtils";
import ImportExport from "./ImportExport";
export default {
  data() {
    return {
      globlePart: "",
      partCore: [],
      error: []
    };
  },
  props: {
    parts: Array,
    bossName: String
  },
  components: { ImportExport },
  computed: {
    fullPart: {
      get() {
        return [this.globlePart, ...this.partCore];
      },
      set(f) {
        this.globlePart = f[0];
        this.partCore = f.slice(1, f.length);
      }
    } /* ,
    _bossName: {
      get() {
        return this.bossName;
      },
      set(n) {
        this.$emit("update:bossName", n);
      }
    } */
  },
  watch: {
    parts(nparts) {
      //切换 boss动作
      this.partCore = [];
      this.error = [];
      nparts.forEach((part, i) => {
        let jsonstr = DataConvert.partsJsonToString(part);
        if (i > 0) {
          this.$set(this.partCore, i - 1, jsonstr);
        } else this.globlePart = jsonstr;
        // this.fullPart.push(jsonstr);
      });
    }
  },
  methods: {
    addPart() {
      this.partCore.push("");
    },
    changePart(str, i) {
      let res = this.checkPartStr(str);
      let className = res ? "" : "error";
      this.$set(this.error, i, className);
      // str = res;
    },
    /**
     * @description: part string格式验证
     * @param {String|[String]}
     * @return: 验证通过返回 str, 不通过返回false
     */
    checkPartStr(str) {
      let reg = /^[0-9]{1,2}:[0-9]{1,2}[^:^,^[^\]^\n]+(\[(0|[1-9][0-9]*),[^:^,^[^\]]+\])*$/;
      if (str.constructor === Array) str = str.join(";");
      let strarr = str
        .replace(/\s*\n\s*/g, "")
        .replace(/(; *)+/g, ";")
        .trim()
        .split(";");
      for (let s of strarr) {
        if (s == "") continue;
        if (!reg.test(s)) return false;
      }
      return true;
    },
    /**
     * @description: 保存前进行数据格式化,对单个part进行排序去重,去多余空格分号
     * @param {Array|[...String]} 单个boss的 parts string组成的数组
     * @return:Json
     */
    formatData(arr) {
      let arrayTofile = [],
        arrayFullPart = [];
      let i = -1;
      for (let str of arr) {
        i++;
        str = str
          .replace(/\n/g, "")
          .replace(/;+/g, ";")
          .replace(/ +/g, " ");
        let strToArray = DataConvert.stringToPartsJson(str);
        if (i > 0 && !strToArray.length) continue;
        strToArray = DataConvert.sortUnique(strToArray);
        arrayTofile.push(strToArray);
        arrayFullPart.push(DataConvert.partsJsonToString(strToArray));
      }
      this.fullPart = arrayFullPart;
      // return JSON.stringify(arrayTofile);
      return arrayTofile;
    },
    dataSave() {
      if (!this.checkPartStr(this.fullPart))
        return this.$message.error({
          type: "error",
          message: "数据格式有误",
          showClose: true,
          duration: 1000
        });
      let stringTofile = this.formatData(this.fullPart);
      this.$emit("newBossParts", stringTofile);
    }
  }
};
</script>
<style lang="scss" scoped>
.parts-wrap {
  margin-top: 15px;
  & > div {
    margin-bottom: 15px;
  }
  .boss-name {
    padding-top: 15px;
  }
  .add-part {
    padding: 10px;
    float: right;
  }
  .save {
    float: right;
  }
  .import-export {
    float: left;
  }
}
</style>


