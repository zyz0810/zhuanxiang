<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="新增一级"
    class="dialogContainer"
    @open="open"
  >

    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入菜单名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input v-model.trim="temp.key" placeholder="请输入key" autocomplete="off" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {dicEdit,dicAdd,allDictionary,dicStatus} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'dataView',
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
          name:'',
          key:''
        },
        rules: {
          province: [{ required: true, message: '请选择省', trigger: 'change' }],
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
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          name:'',
          key:''
        };

      },
      getView(){
        allDictionary({key:this.paraData.option.key}).then((res) => {
          // const { id, name, list,key } = this.paraData.option;
          // this.temp = {  id, name, list,key }
          this.list = res.data
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          this.paraLoading = true;
            dicAdd(this.temp).then((res) => {
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
