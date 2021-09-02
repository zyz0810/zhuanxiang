<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="人员信息"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="firstForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="user_data">
      <el-form-item label="部门" prop="department_id">
        <el-select v-model="temp.department_id">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="0"></el-option>
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
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="temp.gender">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务" prop="job_title">
        <el-input v-model.trim="temp.job_title" placeholder="请输入部门名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入职务" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-input v-model.trim="temp.birthday" placeholder="请输入身份" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="胸牌编号" prop="user_code">
        <el-input v-model.trim="temp.user_code" placeholder="请输入身份" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="文化程度" prop="education">
        <el-select v-model="temp.education">
          <el-option label="小学" :value="1"></el-option>
          <el-option label="初中" :value="2"></el-option>
          <el-option label="高中" :value="3"></el-option>
          <el-option label="中专" :value="4"></el-option>
          <el-option label="大专" :value="5"></el-option>
          <el-option label="本科" :value="6"></el-option>
          <el-option label="硕士" :value="7"></el-option>
          <el-option label="博士" :value="8"></el-option>
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
        <el-input v-model.trim="temp.first_work_time" placeholder="请输入出生年月" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="籍贯" prop="origin">
        <el-input v-model.trim="temp.origin" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="人员身份" prop="social_title">
        <el-input v-model.trim="temp.social_title" placeholder="请输入负责人" autocomplete="off" clearable/>
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

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button type="primary" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import {userAdd,userDetail,userEdit} from '@/api/user'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import SingleImage from "@/components/Upload/SingleImage.vue";
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      SingleImage
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      paraData: {
        required: true,
        type: Object,
        default: {
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {

        cityArr: [],
        districtArr: [],
        paraLoading:false,
        dialogFormVisible: false,
        temp: {
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
        dialogStatus: '',
        rules: {
          province: [{ required: true, message: '请选择省', trigger: 'change' }],
          city: [{ required: true, message: '请选择市', trigger: 'change' }],
          area: [{ required: true, message: '请选择区', trigger: 'change' }],
          principal: [{ required: true, message: '请输入负责人', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        },
      }
    },
    computed: {
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    methods: {
      hasImgSrc(val) {
        this.temp.imageUrl = val;
      },

      open(){
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        // this.updateCity();
        // this.updateDistrict();
      },
      close(){
        this.cityArr= [];
        this.districtArr= [];
        this.paraLoading=false;
        this.dialogFormVisible= false;
        this.temp= {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        userDetail({id:this.paraData.id}).then(res=>{
          const { id, department_id, real_name, user_name, role_id, gender,job_title,mobile,birthday,user_code,education,is_party_member,first_work_time,origin,
            social_title,phone,is_driver,address,remark,head_image} = res.data;
          this.temp = { id, department_id, real_name, user_name, role_id, gender,job_title,mobile,birthday,user_code,education,is_party_member,first_work_time,origin,
            social_title,phone,is_driver,address,remark,head_image}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            userAdd(this.temp).then((res) => {
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
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            userEdit(this.temp).then((res) => {
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
      },
    }
  }
</script>
