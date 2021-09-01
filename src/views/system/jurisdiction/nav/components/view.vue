<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="辖区信息"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >
      <el-form-item label="菜单名称" prop="menu_name">
        <el-input v-model.trim="temp.menu_name" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单链接" prop="url">
        <el-input v-model.trim="temp.url" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单顺序" prop="sort">
        <el-input v-model.trim="temp.sort" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="信息提醒" prop="remark">
        <el-input v-model.trim="temp.remark" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="temp.role_id" placeholder="选择省" multiple >
          <el-option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button type="primary" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index";
  import {menuAdd, menuDetail, menuEdit,roleAll} from "@/api/system"; // waves directive
  export default {
    name: 'parameterView',
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
        roleList:[],
        paraLoading:false,
        temp: {
          menu_name:'',
          sort:'',
          role_id:[],
          url:'',
          remark:'',
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

      getRole(){
        roleAll({page:1,pageSize:9999}).then(res=>{
        this.roleList = res.data
        });
      },
      open(){
        this.getRole();
        console.log(this.paraData)
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
          menu_name:'',
          sort:'',
          role_id:[],
          url:'',
          remark:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        menuDetail({id:this.paraData.id}).then(res=>{
          const { id, menu_name, sort, url, remark,} = res.data;
          let role_id = res.data.role_id.map(item=>{return Number(item)});
          this.temp = {  id, menu_name, sort, role_id, url, remark,};
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
