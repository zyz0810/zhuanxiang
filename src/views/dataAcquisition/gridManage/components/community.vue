<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="三级"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="责任部门" prop="duty_depart">
        <el-cascader ref="cascaderPublish" clearable v-model="temp.duty_depart" :options="departmentList" :show-all-levels="false" filterable :props="props" placeholder="请选择责任部门"></el-cascader>
      </el-form-item>
      <el-form-item label="网格名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入网格名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="网格编码" prop="table_code">
        <el-input v-model.trim="temp.table_code" placeholder="请输入网格编码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="起止地址" prop="address" v-if="type==2">
        <el-input v-model.trim="temp.address" placeholder="请输入起止地址" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="类别" prop="type" v-if="type==2">
        <el-input v-model.trim="temp.type" placeholder="请输入类别" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="长度" prop="length" v-if="type==2">
        <el-input v-model.trim="temp.length" placeholder="请输入长度" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="宽度" prop="width" v-if="type==2">
        <el-input v-model.trim="temp.width" placeholder="请输入宽度" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="面积" prop="area" v-if="type==2">
        <el-input v-model.trim="temp.area" placeholder="请输入面积" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="单价" prop="price" v-if="type==2">
        <el-input v-model.trim="temp.price" placeholder="请输入单价" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="起始点" prop="address" v-if="type==3">
        <el-input v-model.trim="temp.address" placeholder="请输入起始点" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="水域面积" prop="area" v-if="type==3">
        <el-input v-model.trim="temp.area" placeholder="请输入水域面积" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="河道长度" prop="length" v-if="type==3">
        <el-input v-model.trim="temp.length" placeholder="请输入河道长度" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="temp.description" placeholder="请输入描述" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="服务时间" prop="service_end_time" v-if="type==2">
        <el-date-picker
          v-model="dataTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          clearable
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="" class="text-right">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" class="btn_blue02" @click="viewData.operatorType ==='create'?createData():updateData()">保 存</el-button>
      </el-form-item>
    </el-form>
  </myDialog>
</template>

<script>
  import {addChildCategory, getCategoryDetail, getFirstCategory,editChildCategory} from '@/api/data'
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
          // option: {},
          // operatorType: "view",
          // id: ""
          parentId:'=',
          firstId:'',
          id:'',
          operatorType:'view',
          option:{}
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
          parent_id:2, //0、一级  1、二级 2、三级
          parent_ids:'',//父级id
          name:'',
          table_code:'',
          address:'',
          length:'',
          width:'',
          area:'',
          price:'',
          type:'',
          description:'',
          service_start_time:'',
          service_end_time:''
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
      dataTime: {
        get () {
          if (this.temp.service_start_time && this.temp.service_end_time) {
            return [this.temp.service_start_time, this.temp.service_end_time];
          } else {
            return [];
          }
        },
        set (v) {
          if (v) {
            this.temp.service_start_time = v[0];
            this.temp.service_end_time = v[1];
          } else {
            this.temp.service_start_time = "";
            this.temp.service_end_time = "";
          }
        },
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
        if(this.viewData.firstId == 1 || this.viewData.firstId == 2){
          this.type=1;
        }else if(this.viewData.firstId == 6){
          this.type=1;
        }else {
          this.type=2;
        }
        this.getFirstCategory();
        this.getFirstDepartment();
        console.log(this.viewData)
        this.temp.parent_ids = this.viewData.parentId;
        if(this.viewData.operatorType != 'create'){
          this.getView();
        }
      },
      getView(){
        getCategoryDetail({category_id:this.viewData.id}).then(res=>{
          const {id,duty_depart,name,table_code,address,length,width,area,price,type,description,service_start_time,service_end_time,} = res.data
          let parent_ids = this.viewData.parentId;
          this.temp = {id,duty_depart,name,table_code,address,length,width,area,price,type,description,service_start_time,service_end_time,parent_id:2,parent_ids}
        });
      },
      close(){
        this.type=1;
        this.firstCategory=[];
        this.paraLoading=false;
        this.temp= {
          duty_depart:'',//责任部门
          parent_id:2, //0、一级  1、二级 2、三级
          parent_ids:'',//父级id
          name:'',
          table_code:'',
          address:'',
          length:'',
          width:'',
          area:'',
          price:'',
          type:'',
          description:'',
          service_start_time:'',
          service_end_time:''
        };
        this.departmentList=[];
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            // let parentObj = this.firstCategory.filter(item=>{
            //   if(this.temp.parent_ids == item.id){
            //     return item;
            //   }
            // })
            let temp = Object.assign({},  this.temp);
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
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            // let parentObj = this.firstCategory.filter(item=>{
            //   if(this.temp.parent_ids == item.id){
            //     return item;
            //   }
            // })
            let temp = Object.assign({},  this.temp);
            // temp.name = parentObj[0].name;
            temp.duty_depart =   temp.duty_depart[temp.duty_depart.length - 1]
            editChildCategory(temp).then((res) => {
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
