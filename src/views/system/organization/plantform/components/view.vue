<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="20vh"
    title="编辑分平台名称"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" style="width: 400px; margin-left:50px;">

      <el-form-item label="父类型" prop="city_id">
        <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
        <el-select v-model="temp.city_id"  placeholder="选择父类型">
          <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用类型" prop="city_id">
        <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
        <el-select v-model="temp.city_id"  placeholder="选择应用类型">
          <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分平台名称" prop="city_id">
        <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
        <el-select v-model="temp.city_id" multiple  placeholder="选择分平台名称">
          <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="city_id">
        <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
        <el-select v-model="temp.city_id" multiple  placeholder="选择角色" @change="$forceUpdate()">
          <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页地址" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入用户名" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="排序" prop="password">
        <el-input v-model.trim="temp.password" placeholder="请输入密码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="平台照片" prop="mobile">
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
  import {addUser,editUser,userDetail} from '@/api/user'
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
      open(){
        this.dialogStatus = this.paraData.operatorType
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
