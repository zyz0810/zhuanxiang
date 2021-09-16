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
        <el-cascader ref="cascaderPublish" clearable v-model="temp.duty_depart" :options="departmentList" :show-all-levels="false" filterable :props="props" placeholder="请选择违规类型"></el-cascader>
      </el-form-item>
      <el-form-item label="网格名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入网格名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="网格编码" prop="table_code">
        <el-input v-model.trim="temp.table_code" placeholder="请输入网格编码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="起止地址" prop="table_code" v-if="type==2">
        <el-input v-model.trim="temp.table_code" placeholder="请输入起止地址" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="类别" prop="table_code" v-if="type==2">
        <el-input v-model.trim="temp.table_code" placeholder="请输入类别" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="长度" prop="table_code" v-if="type==2">
        <el-input v-model.trim="temp.table_code" placeholder="请输入长度" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="宽度" prop="table_code" v-if="type==2">
        <el-input v-model.trim="temp.table_code" placeholder="请输入宽度" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="面积" prop="table_code" v-if="type==2">
        <el-input v-model.trim="temp.table_code" placeholder="请输入面积" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="单价" prop="table_code" v-if="type==2">
        <el-input v-model.trim="temp.table_code" placeholder="请输入单价" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="起始点" prop="table_code" v-if="type==3">
        <el-input v-model.trim="temp.table_code" placeholder="请输入起始点" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="水域面积" prop="table_code" v-if="type==3">
        <el-input v-model.trim="temp.table_code" placeholder="请输入水域面积" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="河道长度" prop="table_code" v-if="type==3">
        <el-input v-model.trim="temp.table_code" placeholder="请输入河道长度" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="temp.description" placeholder="请输入描述" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="服务时间" prop="service_time" v-if="type==2">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          clearable
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
  import {allDepartmentTreeList,departmentAllList,departmentList} from '@/api/system'
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
        props: {
          checkStrictly: true,
          expandTrigger: "click",
          value: "id",
          label: "department_name",
          children: "list",
          disabled: false,
        },
        type:1,
        firstCategory:[],
        paraLoading:false,
        temp: {
          duty_depart:'',//责任部门
          parent_id:1, //0、一级  1、二级 2、三级
          parent_ids:'',//父级id
          name:'',
          table_code:'',
          description:'',
          service_time:''
        },
        departmentList:[],
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

      getFirstDepartment(){
        departmentList().then(res=>{
          this.departmentList = res.data;
        });
      },
      getFirstCategory(){
        getFirstCategory().then(res=>{
          this.firstCategory = res.data;
        });
      },
      open(){
        if(this.viewData.option.firstId == 1 || this.viewData.option.firstId == 2){
          this.type=1;
        }else if(this.viewData.option.firstId == 6){
          this.type=1;
        }else {
          this.type=2;
        };;
        this.getFirstCategory();
        this.getFirstDepartment();
        this.temp.parent_ids = this.viewData.id;
      },
      close(){},
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            // let parentObj = this.firstCategory.filter(item=>{
            //   if(this.temp.parent_ids == item.id){
            //     return item;
            //   }
            // })
            var temp = Object.assign({},  this.temp);
            // temp.name = parentObj[0].name;
            temp.duty_depart =   temp.duty_depart[temp.duty_depart.length - 1]
            addChildCategory(temp).then((res) => {
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
