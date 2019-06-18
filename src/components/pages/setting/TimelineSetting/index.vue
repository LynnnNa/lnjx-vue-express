<template>
  <div class="timeline">
    <FBName :datas="FBNames"
            :FBIndex.sync="FBIndex" />
    <div class="boss-wrap"
         v-show="bosses.length">
      <BossList :bosses="bosses"
                :bossName.sync="bossName"
                :bossIndex.sync="bossIndex" />
      <BossParts :bossName.sync="bossName"
                 :parts="parts"
                 @newBossParts=saveData />
    </div>
  </div>
</template>
<script>
import FBName from "./FBName";
import BossList from "./BossList";
import BossParts from "./BossParts";
import { getTimelineData, getTutorialData, saveTimline } from "@/axiosData";
import { CopyJson } from "@comp/common/mUtils";
export default {
  data() {
    return {
      tlDataOrigin: "",
      dataVersion: null,
      tlData: [],
      FBNames: [],
      FBIndex: null,
      bosses: [],
      bossIndex: null,
      parts: []
    };
  },
  components: {
    FBName,
    BossList,
    BossParts
  },
  mounted() {
    this.initData();
  },
  computed: {
    FbBossIndex() {
      let { FBIndex, bossIndex } = this;
      return { FBIndex, bossIndex };
    },
    bossName: {
      get() {
        return this.bosses[this.bossIndex];
      },
      set(n) {
        this.$set(this.bosses, this.bossIndex, n);
      }
    }
  },
  watch: {
    FBIndex(FBindex) {
      this.bossIndex = null;
      this.parts = []; //在切换副本时, 隐藏 BossParts组件, 而不是动态注销
      this.tlData[FBindex] = this.tlData[FBindex] || [];
      this.bosses = this.tlData[FBindex].list = this.changeFB(FBindex);
      if (this.bosses.length < 2) this.bossIndex = 0; //如果只有一个boss则初始化 BossParts组件
    },
    FbBossIndex(FbBossIndex) {
      let { FBIndex, bossIndex } = FbBossIndex;
      if (bossIndex == null) return; //未选择boss
      this.parts = this.tlData[FBIndex][bossIndex] = this.changesBoss(
        FBIndex,
        bossIndex
      );
    }
  },
  methods: {
    initData() {
      getTimelineData()
        .then(res => {
          let FBNames = [];
          this.tlDataOrigin = res.data;
          this.dataVersion = res.version;
          res.data.forEach(FBitem => {
            FBNames.push(FBitem.FBname);
          });
          this.tlData.list = this.FBNames = FBNames;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          this.$message.error("获取Timeline数据失败");
          console.log(err);
        });
    },
    addExampleData(data) {
      return new Promise((resolve, reject) => {
        getTutorialData()
          .then(res => {
            let tutorial = res.data[0];
            if (!data[0] || data[0].FBname != "教程实例") {
              data.unshift(tutorial);
            } else data[0] = tutorial;
            resolve(data);
          })
          .catch(() => {
            this.$message.error("获取Tutorial数据失败");
            reject(data);
          });
      });
    },
    /**
     * @description: 保存前进行数据格式化,深拷贝原始数据,添加教程数据,添加数据版本号
     * @param {Array}
     * @return: newArray
     */
    async saveData(newBossParts) {
      let actype = CopyJson(this.tlDataOrigin);
      actype[this.FBIndex].FBbosses[this.bossIndex].bossParts = newBossParts;
      actype = await this.addExampleData(actype);
      actype = { version: this.dataVersion, data: actype };
      saveTimline(actype)
        .then(res => {
          if (res.msg == "success")
            this.$message({
              message: "数据保存成功",
              type: "success",
              duration: 1000
            });
        })
        .catch(err => {
          this.$message.error("数据保存失败");
          console.log(err);
        });
    },
    /**
     * @description: 从 tlDataOrigin, 向 tlData 中装载 list
     * @param {Number} keyindex
     * @return: 当前对应的 list数组
     */
    changeFB(FBindex) {
      let bosses = [],
        fb = this.tlData[FBindex] || [];
      if (!fb.list) {
        //为选择的FB生成list
        let origin = this.tlDataOrigin[FBindex];
        origin.FBbosses.forEach(boss => {
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

