<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="5vh"
    title="添加违章"
    :append-to-body="true"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="违章时间" prop="illegal_date">
        <el-date-picker
          v-model="temp.illegal_date"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="违章类型" prop="illegal_type">
        <el-input v-model.trim="temp.illegal_type" placeholder="请输入违章类型" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="处理事项" prop="punish">
        <el-input v-model.trim="temp.punish" placeholder="请输入处理事项" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="处理状态" prop="deal">
        <el-select v-model="temp.deal" placeholder="请选择状态">
          <el-option label="未处理" value="未处理"></el-option>
          <el-option label="已处理" value="已处理"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="createData()" :loading="paraLoading">保 存</el-button>
    </div>

  </myDialog>
</template>

<script>

  import {addBuildIllegal} from '@/api/data'
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
        dialogViolationVisible: false,
        temp: {
          illegal_date:'',
          illegal_type:'',
          punish:'',
          deal:'',
          build_id:'',
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
      handleViolation(){
        this.dialogViolationVisible = true;
      },

      open(){

        // this.dialogStatus = this.paraData.operatorType;
        // if(this.paraData.operatorType != 'create'){
          // this.getView();
        // }
        this.temp.build_id = this.paraData.id
      },
      close(){

        this.paraLoading=false;
        this.dialogFormVisible= false;
        this.temp= {
          illegal_date:'',
          illegal_type:'',
          punish:'',
          deal:'',
          build_id:'',
        };
        this.dialogStatus= '';
      },


      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addBuildIllegal(this.temp).then((res) => {
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
