<template>
  <div class="appear">
    <p class="tip">至少选择一种显示方式</p>

    <el-checkbox-group class="appear-input"
                       v-model="appearGroup">
      <el-checkbox label="时间轴"
                   border></el-checkbox>
      <el-checkbox class="appear-input"
                   label="时间列表"
                   border></el-checkbox>
    </el-checkbox-group>

  </div>
</template>
<script>
export default {
  data() {
    return {
      appearGroup: ["时间轴", "时间列表"]
    };
  }
};
</script>
<style lang="scss" scoped>
.appear {
  font-size: 14px;
  .tip {
    margin-bottom: 15px;
  }
  .appear-input {
    margin-bottom: 15px;
  }
}
</style>


