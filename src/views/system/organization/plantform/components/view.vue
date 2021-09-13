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
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="父类型" prop="parent_type">
        <el-select v-model="temp.parent_type"  placeholder="选择父类型">
          <el-option v-for="item in parentType" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用类型" prop="app_type">
        <el-select v-model="temp.app_type"  placeholder="选择应用类型">
          <el-option v-for="item in appType" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分平台名称" prop="plat_name">
        <el-input v-model.trim="temp.plat_name" placeholder="请输入所属分组" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="temp.role_id" multiple  placeholder="选择角色" @change="$forceUpdate()">
          <el-option v-for="item in roleList" :label="item.role_name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页地址" prop="index_url">
        <el-input v-model.trim="temp.index_url" placeholder="请输入用户名" autocomplete="off" clearable/>
      </el-form-item>
<!--      <el-form-item label="排序" prop="password">-->
<!--        <el-input v-model.trim="temp.password" placeholder="请输入密码" autocomplete="off" clearable/>-->
<!--      </el-form-item>-->
      <el-form-item label="平台照片" prop="mobile">
        <SingleImage
          :tempUrl="temp.img_url"
          v-on:imgSrc="hasImgSrc"
        ></SingleImage>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="updateData()" :loading="paraLoading">确 定</el-button>
    </div>

  </myDialog>
</template>

<script>
  import {platAuthConstants, platAuthDetail, platAuthEdit, roleAll} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  export default {
    name: 'plantformView',
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
          id:'',
          parent_type:'',
          app_type:'',
          plat_name:'',
          role_id:'',
          index_url:'',
          img_url:''
        },
        parentType:[],
        appType:[],
        roleList:[],
        images:'',
        rules: {
          // city_id: [{ required: true, message: '请选择所属分组', trigger: 'change' }],
          // name: [{ required: true, message: '请输入用户名', trigger: 'change' }],
          // password: [{ required: true, message: '请输入密码', trigger: 'change' }],
          // mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
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
      getRole() {
        roleAll().then(res => {
          this.roleList = res.data;
        });
      },
      getConstants() {
        platAuthConstants().then(res => {
          this.parentType = res.data.app_type_list
          this.appType = res.data.parent_type_list
        });
      },
      hasImgSrc(val) {
        this.temp.img_url = val.url;
        this.images = val.images
      },
      open(){
        this.getConstants();
        this.getRole();
        this.dialogStatus = this.paraData.operatorType
        if(this.paraData.operatorType != 'create'){
          this.getView();
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
        platAuthDetail({id:this.paraData.id}).then(res=>{


          const { id, parent_type, app_type,plat_name,role_id,index_url,img_url} = res.data
          // let city_id = res.data.city_id.split(',')
          this.temp = { id, parent_type, app_type,plat_name,role_id,index_url,img_url}
        });
      },

      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.role_id = temp.role_id.join(',');
            this.temp.img_url = this.images;
            platAuthEdit(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.showViewDialog = false;
                this.$emit('insertList');
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
