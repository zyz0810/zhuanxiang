<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="5vh"
    title="添加排查"
    :append-to-body="true"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="排查时间" prop="check_date">
        <el-date-picker
          v-model="temp.check_date"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="排查内容" prop="check_content">
        <el-input v-model.trim="temp.check_content" placeholder="请输入排查内容" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="排查结果" prop="check_result">
        <el-input v-model.trim="temp.check_result" placeholder="请输入排查结果" autocomplete="off" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="createData()" :loading="paraLoading">保 存</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {addStoreCheck} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'checkViewView',
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
        temp: {
          check_date:'',
          check_content:'',
          check_result:'',
          store_id:'',
        },
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
        this.temp.store_id = this.paraData.id
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          check_date:'',
            check_content:'',
            check_result:'',
            store_id:'',
        };
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addStoreCheck(this.temp).then((res) => {
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
