<template>
  <div class="boss-list">
    <div class="boss-list-item"
         v-for="(boss, index) in bosses"
         :key="index">
      <el-radio :class="{'acitve':bindex == index}"
                v-model="bindex"
                :label="index"
                @change='changeBoss($event)'>{{boss}}</el-radio>
      <el-input v-if="bindex == index"
                v-model="_bossName"></el-input>
    </div>
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
    changeBoss(e) {
      this.$emit("update:bossIndex", e);
      // this.bossIndex = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.boss-list {
  .boss-list-item {
    display: inline-block;
    padding-right: 30px;
    align-items: center;
    .el-radio {
      line-height: 30px;
    }
    .acitve .el-radio__label {
      display: none;
    }
  }
}
</style>
