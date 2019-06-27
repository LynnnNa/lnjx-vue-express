<template>
  <div class="setting com-radius">
    <TheHeader :title="title" />
    <el-tabs class="tab-settings"
             :tab-position="tabPosition">
      <el-tab-pane label="时间轴">
        <TimelineSetting />
      </el-tab-pane>
      <el-tab-pane label="快捷键">
        <HotkeysSetting />
      </el-tab-pane>
      <el-tab-pane label="外观">
        <AppearSetting />
      </el-tab-pane>
      <el-tab-pane label="关于"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import TheHeader from "@comp/common/TheHeader";
import TimelineSetting from "./TimelineSetting";
import HotkeysSetting from "./HotkeysSetting";
import AppearSetting from "./AppearSetting";
export default {
  data() {
    return {
      title: "设置",
      tabPosition: "left"
    };
  },

  components: {
    TheHeader,
    TimelineSetting,
    HotkeysSetting,
    AppearSetting
  },

  mounted() {},

  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>
<style lang="scss">
.setting {
  max-width: 768px;
  min-width: 360px;
  margin: 0 auto;
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  .tab-settings {
    flex-grow: 1;
    display: flex;
    .el-tabs__header {
      background: rgba(242, 242, 242, 0.7);
    }
    .el-tabs__content {
      flex-grow: 1;
      overflow: auto;
      padding: 20px 20px 20px 10px;
    }
    .timeline {
      .add-boss {
        float: right;
        padding: 8px;
      }
    }
  }
  .parts-wrap {
    textarea:focus {
      border-color: #6b6b6b;
    }
    .error textarea {
      border-color: red;
    }
  }
}
</style>

