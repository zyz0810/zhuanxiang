<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules":model="temp" label-width="120px" class="text-center user_password">
      <el-form-item label="旧密码" prop="facility_id">
        <el-input v-model.trim="temp.name" placeholder="请输入名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="新密码" prop="company">
        <el-input v-model.trim="temp.company" placeholder="请输入胸牌编号" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="确认密码" prop="company">
        <el-input v-model.trim="temp.company" placeholder="请输入胸牌编号" autocomplete="off" clearable/>
      </el-form-item>

      <div class="text-center">
        <el-button type="primary" class="btn_blue02" :loading="paraLoading">保 存</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  import {resetPassword} from '@/api/user'

  export default {
    name: 'password',

    components: {

    },
    data() {
      return {
        paraLoading:false,
        temp: {
          // id: undefined,
          status: 1,
          name: '',
          orders: '',
          isRequired: 0,
          operatingMode: 0,
          parameterValueList: [],
        },
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
        },

      }
    },

    mounted() {
      this.$nextTick(function() {

      });
      // this.getList();
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .app-container{
    height: calc(100vh - 135px);
    overflow: auto;
    box-sizing: border-box;
    padding-top: 100px!important;
  }
  .user_password{
    width: 500px;
    margin: 0 auto;
  }
</style>
