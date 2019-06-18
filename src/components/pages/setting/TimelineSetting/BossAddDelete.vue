<template>
  <div class="add-delete">
    <el-button class="delete-boss"
               @click="dialogDeleteBoss = true">删除当前boss</el-button>
    <el-dialog title="提示"
               :visible.sync="dialogDeleteBoss">
      <p v-html="deleteMsg"></p>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogDeleteBoss = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogDeleteBoss = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-button @click="dialogAddBoss = true">添加boss</el-button>
    <el-dialog :visible.sync="dialogAddBoss">
      <el-input v-model="inputBossName"
                placeholder="Boss名称"></el-input>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogAddBoss = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogAddBoss = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      deleteMsg: '确认删除该boss吗? <br /> 确认后, 点击 "保存" 键永久删除.',
      inputBossName: "",
      dialogAddBoss: false,
      dialogDeleteBoss: false
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.add-delete {
  display: inline-block;
  .delete-boss {
    margin-right: 10px;
  }
}
</style>

