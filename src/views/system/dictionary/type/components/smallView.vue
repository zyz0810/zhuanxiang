<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="添加事件小类"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" class="dialog_form">
      <el-form-item label="事件大类名称" prop="parent_id">
        <el-input v-model.trim="temp.parent_name" placeholder="请输入事件大类名称" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="事件小类名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入事件小类名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="事件小类编码" prop="code">
        <el-input v-model.trim="temp.code" placeholder="请输入事件小类编码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="海康上报小类" prop="hk_category">
        <el-input v-model.trim="temp.hk_category" placeholder="请输入海康上报小类" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="处理时限" prop="send_time">
        <el-input v-model.trim="temp.send_time" placeholder="请输入处理时限" autocomplete="off" clearable/> 时
      </el-form-item>
      <el-form-item label="处置部门" prop="depart_id">
        <el-select v-model="temp.depart_id" placeholder="请选择" clearable>
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id" :key="item.id"></el-option>
        </el-select>

<!--        <el-cascader ref="cascaderPublish" v-model="temp.depart_id" :options="departmentList" :show-all-levels="false" filterable :props="props" placeholder="请选择部门"></el-cascader>-->
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

  import {cityDetail,addCity,updateCity} from '@/api/jurisdiction'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index";
  import {categoryAdd, categoryEdit, departmentAllList,departmentList} from "@/api/system"; // waves directive
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
        props: {
          expandTrigger: "click",
          value: "id",
          label: "department_name",
          children: "aa_children",
          disabled: false,
        },
        departmentList:[],
        // departmentList:[{id:1,department_name:'11',aa_children:[{id:2,department_name:'1111'}]},{id:3,department_name:'1221',aa_children:[{id:4,department_name:'122111'}]}],
        paraLoading:false,
        dialogFormVisible: false,
        temp: {
          parent_id:'',
          parent_name:'',
          name:'',
          code:'',
          hk_category:'',
          send_time:'',
          depart_id:'',
          status:1,
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
      getList() {
        departmentAllList().then(res => {
          this.departmentList = res.data;
        });
      },
      open(){
        this.getList();
        this.temp.parent_name = this.paraData.option.name;
        this.temp.parent_id = this.paraData.option.id;
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        // this.updateCity();
        // this.updateDistrict();
      },
      close(){
        this.cityArr= [];
        this.districtArr= [];
        this.paraLoading=false;
        this.dialogFormVisible= false;
        this.temp= {
          parent_id:'',
          parent_name:'',
          name:'',
          code:'',
          hk_category:'',
          send_time:'',
          depart_id:'',
          status:1,
        };
        this.dialogStatus= '';
      },
      getView(){
        // cityDetail({id:this.paraData.id}).then(res=>{
        //   const { id, province, city, area, principal, mobile,} = res.data;
        //   this.temp = { id, province, city, area, principal, mobile,}
        // });


        const {id,parent_id,parent_name,name,code,hk_category,depart_id,status} = this.paraData.option;
        let send_time = Number(this.paraData.option.send_time) / Number(3600);
        this.temp={id,parent_id,parent_name,name,code,hk_category,send_time,depart_id,status};
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            // send_time
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.send_time = temp.send_time * 3600;
            categoryAdd(temp).then((res) => {
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
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.send_time = temp.send_time * 3600;
            categoryEdit(temp).then((res) => {
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
