<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="新建街道"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="责任部门" prop="parent_ids">
        <el-select v-model="temp.parent_ids" :disabled="true">
          <el-option v-for="item in firstCategory" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网格名称" prop="table_name">
        <el-input v-model.trim="temp.table_name" placeholder="请输入网格名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="网格编码" prop="table_code">
        <el-input v-model.trim="temp.table_code" placeholder="请输入网格编码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="temp.description" placeholder="请输入描述" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="" class="text-right">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" class="btn_blue02" @click="onSubmit">保 存</el-button>
      </el-form-item>
    </el-form>


  </myDialog>
</template>

<script>
  import {addChildCategory, getFirstCategory} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index";
  import {languageAdd} from "@/api/system"; // waves directive
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
      viewData: {
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
        firstCategory:[],
        paraLoading:false,
        temp: {
          depart_id:'',
          type:'',
          parent_ids:'',
          name:'',
          table_name:'',
          table_code:'',
          description:'',
          parent_id:1, //二级传1   三级传2
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
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
      getFirstCategory(){
        getFirstCategory().then(res=>{
          this.firstCategory = res.data;
        });
      },
      open(){
        this.getFirstCategory();
        this.temp.parent_ids = this.viewData.id;
        this.temp.type = this.viewData.id;
        this.temp.depart_id = this.viewData.id;
      },
      close(){},
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            let parentObj = this.firstCategory.filter(item=>{
              if(this.temp.parent_ids == item.id){
                return item;
              }
            })
            this.temp.name = parentObj[0].name;
            addChildCategory(this.temp).then((res) => {
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
