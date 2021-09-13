<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="数据字典"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >
      <el-form-item label="字典表" prop="principal">
        <el-input v-model.trim="temp.principal" placeholder="请输入字典表" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="属性值" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入属性值" autocomplete="off" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button type="primary" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {cityDetail,addCity,updateCity} from '@/api/jurisdiction'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
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
        dialogFormVisible: false,
        temp: {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
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
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        // this.updateCity();
        // this.updateDistrict();
      },
      close(){
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
        cityDetail({id:this.paraData.id}).then(res=>{
          const { id, province, city, area, principal, mobile,} = res.data;
          this.temp = { id, province, city, area, principal, mobile,}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addCity(this.temp).then((res) => {
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
            updateCity(this.temp).then((res) => {
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
