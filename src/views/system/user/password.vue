<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules":model="temp" label-width="120px" class="text-center user_password">
      <el-form-item label="旧密码" prop="password">
        <el-input v-model.trim="temp.password" type="password" placeholder="请输入旧密码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="新密码" prop="repwd">
        <el-input v-model.trim="temp.repwd" type="password" placeholder="请输入新密码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="确认密码" prop="conpwd">
        <el-input v-model.trim="temp.conpwd" type="password" placeholder="请再次输入新密码" autocomplete="off" clearable/>
      </el-form-item>

      <div class="text-center">
        <el-button type="primary" class="btn_blue02" :loading="paraLoading" @click="onSubmit">保 存</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  import { getId,removeId,} from '@/utils/auth'
  import {editPassword} from '@/api/user'

  export default {
    name: 'password',

    components: {

    },
    data() {
      return {
        paraLoading:false,
        temp: {
          user_id: getId(),
          password: '',
          repwd: '',
          conpwd:''
        },
        rules: {
          password: [{required: true, message: '请输入原密码', trigger: 'change'}],
          repwd: [{required: true, message: '请输入新密码', trigger: 'change'}],
          conpwd: [{required: true, message: '请再次输入新密码', trigger: 'change'}],
        },

      }
    },
    methods: {
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            const {user_id,password,repwd} = this.temp;
            let temp = {user_id,password,repwd};
            editPassword(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
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
