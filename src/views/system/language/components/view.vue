<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="20vh"
    title="详细信息"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item label="表达语" prop="language">
        <el-input v-model.trim="temp.language" placeholder="请输入表达语" autocomplete="off" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button type="" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {languageAdd,languageEdit,} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'languageView',
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
          language:'',
        },
        rules: {
          language: [{ required: true, message: '请输入表达语', trigger: 'change' }],
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
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.dialogStatus = this.paraData.operatorType
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          language:'',
        };
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      getView(){
        const { id, language} = this.paraData.option
        this.temp = {  id, language}
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            languageAdd(this.temp).then((res) => {
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
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            const {id,language} = this.temp;
            let temp = {id,language,status:1,sort:0,}
            languageEdit(temp).then((res) => {
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
