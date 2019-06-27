<template>
  <el-page-header class="pageheader"
                  :content="title"
                  @back="goBack" />
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["title"],
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

