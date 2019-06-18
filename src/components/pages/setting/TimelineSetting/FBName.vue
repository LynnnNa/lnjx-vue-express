<template>
  <div class="fb-name">
    <el-select class="fb-container"
               filterable
               placeholder="选择副本集"
               v-model="index"
               @change="changeFB($event)">
      <el-option v-for="(data,FBindex) in datas"
                 :key="FBindex"
                 :label="data"
                 :value="FBindex"></el-option>
    </el-select>
    <el-button class="add-fb-container"
               @click="dialogAddFBcontainer = true">添加副本集</el-button>
    <el-dialog :visible.sync="dialogAddFBcontainer">
      <el-input v-model="inputFBname"
                placeholder="副本名称"></el-input>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogAddFBcontainer = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogAddFBcontainer = false">确 定</el-button>
      </div>
    </el-dialog>
    <BossAddDelete />
  </div>
</template>
<script>
import BossAddDelete from "./BossAddDelete";
export default {
  data() {
    return {
      index: null,
      inputFBname: "",
      dialogAddFBcontainer: false
    };
  },
  props: {
    datas: Array
  },
  components: {
    BossAddDelete
  },
  methods: {
    changeFB(e) {
      this.$emit("update:FBIndex", e);
      // this.$emit("changeFB", this.FBindex);
    }
  }
};
</script>
<style lang="scss" scoped>
.fb-name {
  .fb-container {
    margin-right: 10px;
  }
  .add-fb-container {
    margin-right: 10px;
  }
}
</style>

