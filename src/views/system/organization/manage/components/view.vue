<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="20vh"
    title="组织管理"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >

      <el-form-item label="部门名称" prop="department_name">
        <el-input v-model.trim="temp.department_name" placeholder="请输入部门名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="上级部门" prop="parent_id">
        <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
        <el-select v-model="temp.parent_id"  placeholder="选择上级部门">
          <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门地址" prop="address">
                <el-input v-model.trim="temp.address" placeholder="请输入部门地址" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="部门电话" prop="phone">
                <el-input v-model.trim="temp.phone" placeholder="请输入部门电话" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="部门负责人" prop="contact">
        <el-input v-model.trim="temp.contact" placeholder="请输入部门负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="负责人手机" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入负责人手机" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="在地图上显示" prop="is_map">
        <el-select v-model="temp.is_map"  placeholder="选择父类型">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门大类" prop="big_type">
        <el-select v-model="temp.big_type"  placeholder="选择部门大类">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位性质" prop="nature">
        <el-input v-model.trim="temp.nature" placeholder="请输入单位性质" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="111部门人数" prop="">
        <el-input v-model.trim="temp.password" placeholder="请输入部门人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="公务员人数" prop="user_num1">
      <el-input v-model.trim="temp.user_num1" placeholder="请输入公务员人数" autocomplete="off" clearable/>
    </el-form-item>
      <el-form-item label="参公人数" prop="user_num2">
        <el-input v-model.trim="temp.user_num2" placeholder="请输入参公人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="事业编制人数" prop="user_num3">
        <el-input v-model.trim="temp.user_num3" placeholder="请输入事业编制人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="协管人数" prop="user_num4">
        <el-input v-model.trim="temp.user_num4" placeholder="请输入协管人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="111油烟城区" prop="password">
        <el-select v-model="temp.city_id"  placeholder="选择油烟城区">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门职责介绍" prop="duty">
      <el-input type="textarea" v-model.trim="temp.duty" placeholder="请输入密码" autocomplete="off" clearable/>
    </el-form-item>
      <el-form-item label="部门简介" prop="remark">
        <el-input type="textarea" v-model.trim="temp.remark" placeholder="请输入密码" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="部门照片" prop="dept_img">
        <SingleImage
          :tempUrl="temp.imgUrl"
          v-on:imgSrc="hasImgSrc"
        ></SingleImage>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>

    </div>


  </myDialog>
</template>

<script>
  import {departmentAdd,departmentEdit,departmentDetail,bigSmallType} from '@/api/system'
  import {cityList} from '@/api/jurisdiction'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
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
        cityList:[],
        paraLoading:false,
        temp: {
          city_id:'',
          name:'',
          password:'',
          mobile:''
        },
        bigTypeList:[],
        rules: {
          city_id: [{ required: true, message: '请选择所属分组', trigger: 'change' }],
          name: [{ required: true, message: '请输入用户名', trigger: 'change' }],
          password: [{ required: true, message: '请输入密码', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
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
        this.form.imgUrl = val;
      },
      getBigSmallType(){
        bigSmallType().then(res=>{
          this.bigTypeList = res.data
        });
      },
      open(){
        this.dialogStatus = this.paraData.operatorType
        this.getBigSmallType();
        if(this.paraData.operatorType != 'create'){
          // this.getView();
        }
      },
      close(){
        this.cityList=[];
        this.paraLoading=false;
        this.temp= {
          city_id:'',
          name:'',
          password:'',
          mobile:''
        };
      },
      getView(){
        userDetail({id:this.paraData.id}).then(res=>{
          const { id, name, password,mobile} = res.data
          let city_id = res.data.city_id.split(',')
          this.temp = { id, city_id, name, password,mobile}
        });
      },



      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.city_id = temp.city_id.join(',')
            addUser(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.showViewDialog = false;
                this.$emit('insertUser');
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
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.city_id = temp.city_id.join(',')
            editUser(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.showViewDialog = false;
                this.$emit('insertUser');
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
