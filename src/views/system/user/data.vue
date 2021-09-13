<template>
  <div class="app-container">
    <el-form ref="firstForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="user_data">
      <el-form-item label="部门" prop="department_id">
        <el-select v-model="temp.department_id">
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id" :key="item.id"></el-option>
        </el-select>
<!--        <el-input v-model.trim="temp.name" placeholder="请输入名称" autocomplete="off" clearable/>-->
      </el-form-item>
      <el-form-item label="姓名" prop="real_name">
        <el-input v-model.trim="temp.real_name" placeholder="请输入姓名" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="登录名" prop="user_name">
        <el-input v-model.trim="temp.user_name" placeholder="请输入登录名" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="temp.role_id">
          <el-option v-for="item in roleList" :label="item.role_name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="temp.gender">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务" prop="job_title">
        <el-input v-model.trim="temp.job_title" placeholder="请输入部门名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入职务" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker v-model="temp.birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="胸牌编号" prop="user_code">
        <el-input v-model.trim="temp.user_code" placeholder="请输入胸牌编号" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="文化程度" prop="education">
        <el-select v-model="temp.education">
          <el-option v-for="item in userConstantsList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否党员" prop="is_party_member">
        <el-select v-model="temp.is_party_member">
          <el-option label="未定义" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参加工作时间" prop="first_work_time">
        <el-date-picker v-model="temp.first_work_time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
<!--        <el-input v-model.trim="temp.first_work_time" placeholder="请输入身份" autocomplete="off" clearable/>-->
      </el-form-item>
      <el-form-item label="籍贯" prop="origin">
        <el-input v-model.trim="temp.origin" placeholder="请输入籍贯" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="人员身份" prop="social_title">
        <el-input v-model.trim="temp.social_title" placeholder="请输入籍贯" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="家庭电话" prop="phone">
        <el-input v-model.trim="temp.phone" placeholder="请输入家庭电话" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="是否驾驶员" prop="is_driver">
        <el-select v-model="temp.is_driver">
          <el-option label="未定义" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <el-form ref="secondForm" :rules="rules" :model="temp" label-width="120px">
      <el-form-item label="家庭住址" prop="address">
        <el-input v-model.trim="temp.address" placeholder="请输入家庭住址" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model.trim="temp.remark" placeholder="请输入备注" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="照片" prop="head_image">
        <SingleImage :tempUrl="temp.head_image" v-on:imgSrc="hasImgSrc"></SingleImage>
      </el-form-item>

      <div class="text-center">
        <el-button type="primary" class="btn_blue02" :loading="paraLoading" @click="onSubmit">保 存</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  import { getId} from '@/utils/auth'
  import {userEdit, userConstants, userDetail} from '@/api/user';
  import {departmentAllList,roleList} from '@/api/system';
  import SingleImage from "@/components/Upload/SingleImage.vue";
  export default {
    name: 'userList',
    components: {
      SingleImage
    },
    data() {
      return {
        paraLoading:false,
        temp: {
          id:getId(),
          department_id:'',
          real_name:'',
          user_name:'',
          role_id:'',
          gender:'',
          job_title:'',
          mobile:'',
          birthday:'',
          user_code:'',
          education:'',
          is_party_member:'',
          first_work_time:'',
          origin:'',
          social_title:'',
          phone:'',
          is_driver:'',
          address:'',
          remark:'',
          head_image:'',
        },
        rules: {
          user_name: [{required: true, message: '请输入名称', trigger: 'change'}],
        },
        departmentList:[],
        roleList:[],
        userConstantsList:[],
        images:'',
      }
    },
    mounted() {
      this.getDepartment();
      this.getRole();
      this.getUserConstants();
      this.getView();
    },
    methods: {
      getView(){
        userDetail({id:getId()}).then(res=>{
          const { id, department_id, real_name, user_name, role_id, gender,job_title,mobile,birthday,user_code,education,is_party_member,first_work_time,origin,
            social_title,phone,is_driver,address,remark,head_image} = res.data;
          this.temp = { id, department_id, real_name, user_name, role_id, gender,job_title,mobile,birthday,user_code,education,is_party_member,first_work_time,origin,
            social_title,phone,is_driver,address,remark,head_image}
        });
      },
      getDepartment(){
        departmentAllList().then((res) => {
         this.departmentList = res.data
        })
      },
      getRole(){
        roleList({page:1,pageSize:999999}).then((res) => {
          this.roleList = res.data.data
        })
      },
      getUserConstants(){
        userConstants().then((res) => {
          this.userConstantsList = res.data.education_list
        })
      },

      hasImgSrc(val) {
        this.temp.head_image = val.url;
        this.images = val.images;
      },
      onSubmit(){
        this.$refs['firstForm'].validate((valid) => {
          if (valid) {
            this.$refs['secondForm'].validate((valid) => {
              if (valid) {
                this.paraLoading = true
                let temp = JSON.parse(JSON.stringify(this.temp));
                temp.head_image = this.images;
                userEdit(temp).then((res) => {
                  setTimeout(()=>{
                    this.paraLoading = false
                  },1000)
                  if(res.code == 1) {
                    this.$emit('insertList');
                    this.showViewDialog = false;
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
          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .app-container{
    height: calc(100vh - 135px);
    overflow: auto;
    box-sizing: border-box;
  }
  .user_data{
    padding: 50px 50px 0 0;
  }
</style>
