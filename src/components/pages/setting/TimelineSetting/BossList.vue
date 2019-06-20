<template>
  <div class="boss-list">
    <div class="boss-list-item"
         v-for="(boss, index) in bosses"
         :key="index">
      <el-radio :class="{'acitve':bindex == index}"
                v-model="bindex"
                :label="index"
                @change='changeBoss($event)'>{{boss}}</el-radio>
      <el-input class="boss-name"
                v-if="bindex == index"
                v-model="_bossName"></el-input>
    </div>
    <el-tooltip content="添加新boss"
                effect="light"
                placement="left">
      <el-button class="add-boss"
                 icon="el-icon-plus"
                 circle
                 @click="addBoss"></el-button>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bindex: this.bossIndex
      // FBbosses: [{ bossName: "一个最简单的倒计时" }, { bossName: "语音提示" }]
    };
  },
  props: {
    FBIndex: Number,
    bossIndex: Number,
    bosses: Array,
    bossName: String
  },
  watch: {
    bossIndex: function() {
      this.bindex = this.bossIndex;
    }
  },
  computed: {
    _bossName: {
      get() {
        return this.bossName;
      },
      set(n) {
        this.$emit("update:bossName", n);
      }
    }
  },
  methods: {
    addBoss() {
      this.$prompt("", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "Boss名称, 小于10字符",
        inputPattern: /^[\w|\u4e00-\u9fa5]{1,10}$/,
        inputErrorMessage: "小于10字符, 英文,中文,数字,下划线"
      })
        .then(({ value }) => {
          this.$emit("addBoss", value);
        })
        .catch(() => {});
    },
    changeBoss(e) {
      this.$emit("update:bossIndex", e);
      // this.bossIndex = e;
    }
  }
};
</script>
<style lang="scss">
.boss-list {
  .boss-list-item {
    display: inline-block;
    padding-right: 30px;
    align-items: center;
    .el-radio {
      margin-right: 0;
      line-height: 30px;
    }
    .acitve {
      .el-radio__label {
        display: none;
      }
    }
    .boss-name {
      padding-left: 10px;
      width: auto;

      .el-input__inner {
        height: 30px;
      }
    }
  }
}
</style>
