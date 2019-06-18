<template>
  <div class="hotkey">
    <p class="tip">直接按键盘进行设置 (优先级较高,尽量避免冲突.不支持Win键)</p>
    <div class="hk-input">开始：
      <div>
        <el-input v-model="hotkeyStart" />
      </div>
    </div>
    <div class="hk-input">停止：
      <div>
        <el-input v-model="hotkeyStop" />
      </div>
    </div>
    <div class="hk-input">快进一秒：
      <div>
        <el-input v-model="hotkeyForwd" />
      </div>
    </div>
    <div class="hk-input">快退一秒：
      <div>
        <el-input v-model="hotkeyDefer" />
      </div>
    </div>
    <div class="hk-input">下一个P：
      <div>
        <el-input v-model="nextPart" />
      </div>
    </div>
    <el-button type="primary">保存</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hotkeyStart: "",
      hotkeyStop: "",
      hotkeyForwd: "",
      hotkeyDefer: "",
      nextPart: ""
    };
  }
};
</script>
<style lang="scss" scoped>
.hotkey {
  font-size: 14px;
  .tip {
    margin-bottom: 15px;
  }
  .hk-input {
    margin-bottom: 15px;
    & > div {
      width: 200px;
      display: inline-block;
    }
  }
}
</style>


