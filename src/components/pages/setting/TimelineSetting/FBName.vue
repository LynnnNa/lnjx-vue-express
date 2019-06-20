<template>
  <div class="fb-name clearfix">
    <el-select class="fb-container"
               filterable
               placeholder="选择副本集"
               v-model="index">
      <el-option v-for="(data,i) in datas"
                 :key="i"
                 :label="data"
                 :value="i"></el-option>
    </el-select>
    <el-button v-if="FBIndex != null"
               class="delete-fb-container"
               @click="deleteFBContainer(FBIndex)">删除副本集</el-button>
    <el-button class="add-fb-container"
               @click="addFBContainer">添加副本集</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    datas: Array,
    FBIndex: Number
  },
  computed: {
    index: {
      get() {
        return this.datas[this.FBIndex];
      },
      set(n) {
        this.$emit("update:FBIndex", n);
      }
    }
  },
  methods: {
    deleteFBContainer(index) {
      this.$confirm("此操作将永久删除当前副本集, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("deleteFBContainer", index);
        })
        .catch(() => {});
    },
    addFBContainer() {
      this.$prompt("", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "副本集名称, 小于10字符",
        inputPattern: /^[\w|\u4e00-\u9fa5]{1,10}$/,
        inputErrorMessage: "小于10字符, 英文,中文,数字,下划线"
      })
        .then(({ value }) => {
          this.$emit("addFBContainer", value);
        })
        .catch(() => {});
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
    float: right;
  }
}
</style>

