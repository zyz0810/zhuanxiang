<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="菜单管理"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >
      <el-form-item label="菜单名称" prop="menu_name">
        <el-input v-model.trim="temp.menu_name" placeholder="请输入菜单名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单链接" prop="url">
        <el-input v-model.trim="temp.url" placeholder="请输入菜单链接" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单顺序" prop="sort">
        <el-input v-model.trim="temp.sort" placeholder="请输入菜单顺序" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="信息提醒" prop="remark">
        <el-input v-model.trim="temp.remark" placeholder="请输入信息提醒" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="选择应用" prop="app_type">
        <el-select v-model="temp.app_type" placeholder="选择应用" >
          <el-option v-for="item in APPList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="temp.role_id" placeholder="选择角色" multiple >
          <el-option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="唯一标识" prop="url_key">
        <el-input v-model.trim="temp.url_key" placeholder="请输入唯一标识" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="temp.type" clearable>
          <el-radio :label="1">页面</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index";
  import {menuAdd, menuDetail, menuEdit,roleAll,APPConstants} from "@/api/system"; // waves directive
  export default {
    name: 'navView',
    directives: { waves },
    components: {
      draggable,
      Pagination
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
          id: "",
          pid:""
        }
      }
    },
    data() {
      return {
        APPList:[],
        roleList:[],
        paraLoading:false,
        temp: {
          app_type:'',
          pid:'',
          menu_name:'',
          sort:'',
          role_id:[],
          url:'',
          remark:'',
          url_key:'',
          type:1
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
      getApp() {
        APPConstants().then(res => {
          this.APPList = res.data.app_type_list
        });
      },
      getRole(){
        roleAll({page:1,pageSize:9999}).then(res=>{
        this.roleList = res.data
        });
      },
      open(){
        this.getRole();
        this.getApp();
        console.log(this.paraData)
        this.temp.pid = this.paraData.pid;
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.cityArr= [];
        this.districtArr= [];
        this.paraLoading=false;
        this.temp= {
          app_type:'',
          menu_name:'',
          sort:'',
          role_id:[],
          url:'',
          remark:'',
          url_key:'',
          type:1
        };
        this.dialogStatus= '';
      },
      getView(){
        menuDetail({id:this.paraData.id}).then(res=>{
          const { id, menu_name, sort, url, remark,app_type, url_key, type} = res.data;
          let role_id = res.data.role_id.map(item=>{return Number(item)});
          this.temp = {  id, menu_name, sort, role_id, url, remark,app_type,url_key, type};
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            let temp = JSON.parse(JSON.stringify(this.temp));
            console.log(temp)
            temp.role_id = temp.role_id.join(',')
            menuAdd(temp).then((res) => {
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
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.role_id = temp.role_id.join(',')
            menuEdit(temp).then((res) => {
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
