<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="权限类"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">

      <el-form-item label="父类目" prop="parent_name">
<!--        <el-select v-model="temp.pid" placeholder="选择父类目">-->
<!--          <el-option v-for="option in arr" :label="option.name" :value="option.name"></el-option>-->
<!--        </el-select>-->
        <el-input v-model.trim="temp.parent_name" placeholder="" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>

      <el-form-item label="权限类目名称" prop="auth_name">
        <el-input v-model.trim="temp.auth_name" placeholder="请输入权限类目名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model.trim="temp.url" placeholder="请输入链接" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="权限类目描述" prop="remark">
        <el-input v-model.trim="temp.remark" placeholder="请输入权限类目描述" autocomplete="off" clearable/>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import {authDetail,authAdd,authEdit} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'categoryView',
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
        paraLoading:false,
        arr:[],
        temp: {
          pid:'',
          parent_name:'',
          url:'',
          auth_name:'',
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
      open(){
        this.dialogStatus = this.paraData.operatorType;
        this.temp.pid = this.paraData.pid;
        this.temp.parent_name = this.paraData.pidName;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          pid:'',
          parent_name:'',
          url:'',
          auth_name:'',
          remark:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        authDetail({id:this.paraData.id}).then(res=>{
          const { id, pid,url, parent_name, auth_name, remark,} = res.data;
          this.temp = { id, pid,url, parent_name, auth_name, remark,}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            authAdd(this.temp).then((res) => {
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
            authEdit(this.temp).then((res) => {
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
