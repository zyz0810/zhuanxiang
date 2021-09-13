<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="添加案件"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="事件大类名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入事件大类名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="事件大类编码" prop="code">
        <el-input v-model.trim="temp.code" placeholder="请输入事件大类编码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-switch v-model="temp.status" active-color="#13ce66" :active-value="1" :inactive-value="2"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import {categoryAdd,categoryEdit,} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
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
          id: ""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        temp: {
          id:'',
          name:'',
          code:'',
          status:1,
        },
        dialogStatus: '',
        rules: {
          // mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
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
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        // this.updateCity();
        // this.updateDistrict();
      },
      close(){

        this.paraLoading=false;
        this.temp= {
          id:'',
          name:'',
          code:'',
          status:1,
        };
        this.dialogStatus= '';
      },
      getView(){
        // id:'',
        //   name:'',
        //   code:'',
        //   status:'',
        const {id,name,code,status} = this.paraData.option;
        this.temp={id,name,code,status};

        // cityDetail({id:this.paraData.id}).then(res=>{
        //   const { id, province, city, area, principal, mobile,} = res.data;
        //   this.temp = { id, province, city, area, principal, mobile,}
        // });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            categoryAdd(this.temp).then((res) => {
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
            categoryEdit(this.temp).then((res) => {
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
