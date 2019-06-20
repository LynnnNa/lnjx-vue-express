<template>
  <div class="timeline">
    <FBName :datas="FBNames"
            :FBIndex.sync="FBIndex"
            @addFBContainer="addFBContainer"
            @deleteFBContainer="deleteFBContainer" />
    <div class="boss-wrap"
         v-show="bosses.length">
      <BossList :FBIndex="FBIndex"
                :bosses="bosses"
                :bossName.sync="bossName"
                :bossIndex.sync="bossIndex"
                @addBoss="addBoss" />
      <BossParts :bossName.sync="bossName"
                 :parts="parts"
                 @deleteBoss=deleteBoss(FBIndex,bossIndex)
                 @newBossParts:newP=newBossParts($event,FBIndex,bossIndex) />

    </div>
    <ImportExport />
  </div>
</template>
<script>
import FBName from "./FBName";
import BossList from "./BossList";
import BossParts from "./BossParts";
import ImportExport from "./ImportExport";
import { getTimelineData, getTutorialData, saveTimline } from "@/axiosData";
import { CopyJson } from "@comp/common/mUtils";
export default {
  data() {
    return {
      origin: { data: null, version: null },
      diff: 0,
      tlData: [],
      FBIndex: null,
      bosses: [],
      bossIndex: null,
      parts: []
    };
  },
  computed: {
    FBNames: {
      get() {
        return this.tlData.list || [];
      },
      set(n) {
        this.$set(this.tlData, "list", n);
      }
    },
    tlDataOrigin: {
      get() {
        return this.origin.data;
      },
      set(n) {
        this.origin.data = n;
      }
    },
    dataVersion: {
      get() {
        return this.origin.version;
      },
      set(n) {
        this.origin.version = n;
      }
    },
    FbBossIndex() {
      let { FBIndex, bossIndex } = this;
      return { FBIndex, bossIndex };
    },
    tutorialIndex() {
      return this.FBNames.length - 1;
    },
    isTutorial() {
      return this.FBIndex == this.tutorialIndex &&
        this.FBNames[this.FBIndex] == "教程实例"
        ? true
        : false;
    },
    bossName: {
      get() {
        return this.bosses[this.bossIndex];
      },
      set(n) {
        this.$set(this.bosses, this.bossIndex, n);
      }
    } /* ,
    FBsLength() {
      return this.FBNames.length;
    } */
  },
  components: {
    FBName,
    BossList,
    BossParts,
    ImportExport
  },
  mounted() {
    getTimelineData()
      .then(res => {
        this.initData(res);
      })
      .catch(() => {
        this.$message.error("获取Timeline数据失败");
      });
  },
  watch: {
    /* FBsLength(length, ol) {
      this.diff = length - ol > 1 ? 0 : length - ol;
      if (this.diff > 0) {
        //增加
      }
      if (this.diff < 0) {
        //减少
      } 
    }, */
    FBIndex(FBindex) {
      if (FBindex === null) {
        //未选择boss
        this.bosses = [];
        this.bossIndex = null;
        return;
      }
      this.tlData[FBindex] = this.tlData[FBindex] || [];
      this.bosses = this.tlData[this.FBIndex].list = this.changeFB(FBindex);
      if (this.bosses && this.bosses.length < 2) this.bossIndex = 0;
      //如果只有一个boss则初始化 BossParts组件
      else this.bossIndex = null;
    },
    FbBossIndex(FbBossIndex) {
      let { FBIndex, bossIndex } = FbBossIndex;
      if (bossIndex === null) {
        //未选择boss
        this.parts = [];
        return;
      }
      this.parts = this.tlData[FBIndex][bossIndex] = this.changesBoss(
        FBIndex,
        bossIndex
      );
    }
  },
  methods: {
    /**
     * @description: 从 tlDataOrigin, 向 tlData 中装载 list
     * @param {Number} keyindex
     * @return: 当前对应的 list数组
     */
    changeFB(FBIndex) {
      let bosses = [],
        fb = this.tlData[FBIndex] || [];
      if (!fb.list && FBIndex != null) {
        //为选择的FB生成list
        let FbOrigin = this.tlDataOrigin[FBIndex];
        FbOrigin.FBbosses.forEach(boss => {
          bosses.push(boss.bossName);
        });
      } else bosses = fb.list; //如果有list则直接加载
      return bosses;
    },
    /**
     * @description: 从 tlDataOrigin, 向 tlData 中装载 parts
     * @param {Object} {keyindex,keyindex}
     * @return: 当前对应的 parts数组
     */
    changesBoss(FBIndex, bossIndex) {
      let bossPs = this.tlData[FBIndex][bossIndex] || [];
      if (!bossPs.length) {
        //从origin加载parts数据
        let FbOrigin = this.tlDataOrigin[FBIndex];
        bossPs = FbOrigin.FBbosses[bossIndex].bossParts;
      }
      return bossPs;
    },
    /**
     * @description: 初始化 origin, FBNames
     */
    initData(origin) {
      let FBNames = [];
      this.origin = origin;
      origin.data.forEach(FBitem => {
        FBNames.push(FBitem.FBname);
      });
      this.FBNames = FBNames; //tldata.list
    },
    /**
     * @description: 保存前进行数据格式化,深拷贝原始数据,添加教程数据,添加数据版本号
     * @param {Array}
     * @return: newArray
     */
    async saveData(newD, originD) {
      let actype = CopyJson(originD),
        newData = [];
      for (let FBIndex in newD.list) {
        let FBname = newD.list[FBIndex],
          // oindex = FBIndex - this.diff,
          FBbosses = [],
          bosses = newD[FBIndex];
        if (bosses) {
          for (let bossIndex in bosses.list) {
            let bossName = bosses.list[bossIndex],
              parts =
                bosses[bossIndex] ||
                actype[FBIndex].FBbosses[bossIndex].bossParts;
            FBbosses.push({ bossName: bossName, bossParts: parts });
          }
        } else {
          FBbosses = actype[FBIndex].FBbosses;
        }
        newData.push({ FBname: FBname, FBbosses: FBbosses });
      }
      newData = await this.addExampleData(newData);
      newData = { version: this.dataVersion, data: newData };
      return await saveTimline(newData)
        .then(res => {
          this.initData(newData);
          if (res.msg == "success") {
            return { msg: true, tlData: newD, origin: newData };
          }
        })
        .catch(err => {
          this.$message.error("数据保存失败");
          return { msg: false, err: err };
        });
    },
    addBoss(name) {
      return new Promise(resolve => {
        this.bossIndex = this.bosses.length;
        this.bossName = name; //bosses bossIndex
        this.$set(this.tlData[this.FBIndex], this.bossIndex, [[], []]);
        /* this.tlDataOrigin[this.FBIndex].FBbosses.unshift({
          bossName: name,
          bossParts: [[], []]
        }); */
        resolve();
      });
    },
    addFBContainer(name) {
      this.$prompt("为新副本添加一个boss", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "Boss名称, 小于10字符",
        inputPattern: /^[\w|\u4e00-\u9fa5]{1,10}$/,
        inputErrorMessage: "小于10字符, 英文,中文,数字,下划线"
      })
        .then(({ value }) => {
          this.FBIndex = 0;
          let fb = [];
          fb.list = [value];
          this.FBNames.unshift(name); //tlData.list
          this.tlData.unshift(fb);
          this.bosses = []; //bossName
          this.tlDataOrigin.unshift({ FBname: name, FBbosses: [] });
          this.addBoss(value);
        })
        .then(() => {
          this.bosses = this.tlData[0].list = this.changeFB(0);
          this.parts = this.tlData[0][0] = this.changesBoss(0, 0);
        })
        .catch(() => {});
    },
    deleteFBContainer(index) {
      if (index == null) return;
      if (this.isTutorial) return this.$alert("请不要删除教程数据");
      let origin = CopyJson(this.tlDataOrigin);
      origin.splice(index, 1);
      this.tlData.splice(index, 1);
      this.FBNames.splice(index, 1);
      this.saveData(this.tlData, origin).then(result => {
        if (result.msg) {
          this.FBIndex = null;
          this.$message({
            message: "数据删除成功",
            type: "success",
            duration: 1000
          });
        }
      });
    },
    /**
     * @description: 删除 bossIndex项, 调用 this.saveData,回执重置 this.tlDataOrigin
     * @param {Number,Number}
     */
    deleteBoss(FBIndex, bossIndex) {
      if (this.isTutorial) return this.$alert("请不要删除教程数据");
      let fb = this.tlData[FBIndex];
      if (fb.list.length < 2) return this.$alert("请保留至少一个boss");
      fb.list.splice(bossIndex, 1);
      fb.splice(bossIndex, 1);
      this.saveData(this.tlData, this.tlDataOrigin).then(result => {
        if (result.msg) {
          this.bossIndex = null;
          this.$message({
            message: "数据删除成功",
            type: "success",
            duration: 1000
          });
        }
      });
    },
    newBossParts(newP, FBIndex, bossIndex) {
      this.tlData[FBIndex][bossIndex] = newP;
      this.saveData(this.tlData, this.tlDataOrigin).then(result => {
        if (result.msg) {
          this.$message({
            message: "数据保存成功",
            type: "success",
            duration: 1000
          });
        }
      });
    },
    addExampleData(data) {
      return new Promise((resolve, reject) => {
        getTutorialData()
          .then(res => {
            let thelast = data[data.length - 1],
              tutorial = res.data[0];
            if (!thelast || thelast.FBname != "教程实例") {
              data.push(tutorial);
            } else data[data.length - 1] = tutorial;
            resolve(data);
          })
          .catch(() => {
            this.$message.error("获取Tutorial数据失败");
            reject(data);
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.boss-wrap {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ebebeb;
}
</style>

