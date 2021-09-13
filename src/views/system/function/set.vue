<template>
  <div class="app-container">
    <p class="f18 baseColor mb_10">处置时间设置</p>
    <el-divider></el-divider>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="user_password">
      <el-form-item label="时间间隔" prop="event_time">
        <el-select v-model="temp.event_time">
          <el-option v-for="item in timeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="text-center">
        <el-button type="primary" class="btn_blue02" :loading="paraLoading" @click="onSubmit">保 存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {setConstants,eventDetail,updateEventSetting} from '@/api/system'
  export default {
    name: 'functionSet',
    data() {
      return {
        isChange:false,
        paraData:{},
        paraLoading:false,
        temp: {
          event_time: '',
        },
        timeList:[],
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
        },
      }
    },
    mounted() {
      this.getTimeList();
      this.getTimeView();
    },
    methods: {

      getTimeView() {
        eventDetail().then(res => {
          this.temp.event_time = res.data.event_time
        });
      },
      getTimeList() {
        setConstants().then(res => {
          this.timeList = res.data.event_time_list
        });
      },
      onSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            updateEventSetting(this.temp).then((res) => {
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
