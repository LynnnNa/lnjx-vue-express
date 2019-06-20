<template>
  <div class="container-index"
       id="app">
    <el-row type="flex"
            class="menu-index">
      <el-col :span="12">
        <router-link :to="{name:'SettingApp'}">
          <el-button>设置</el-button>
        </router-link>
      </el-col>
      <el-col :span="12">
        <el-button>生活技能</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "App"
};
</script>
<style lang="scss">
.container-index {
  padding: 20% 15px 15px 15px;
  text-align: center;
  /* @media screen and(max-height:756px) {
      padding-top:15px;
      height:100%; display: flex; align-items: center;
      & > div {flex:1;}
      } */
}
.menu-index {
  button {
    width: 80%;
  }
}
</style>
