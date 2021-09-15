<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    :title="viewTitle"
    class="dialogContainer"
    @open="open"
  >

    <div class="mr_20 ml_20 mb_20">
      <div class="mb_20">
        <el-button class="btn_blue02" type="primary" @click="handleCreate()">添加选项</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="属性值" align="center" prop="value">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.value" placeholder="请输入属性值" autocomplete="off" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="属性名称" align="center" prop="name">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.name" placeholder="请输入属性名称" autocomplete="off" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
<!--            <el-button class="btn_blue02" type="primary" @click="handleState('update',scope.row)">禁用</el-button>-->
            <el-button class="btn_yellow" type="primary" v-if="scope.row.status == 1" @click="handleState(scope.row)">禁用</el-button>
            <el-button class="btn_green" type="primary" v-if="scope.row.status == 2" @click="handleState(scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>
  </myDialog>
</template>

<script>
  import {dicEdit,dicAddEdit,allDictionary,dicStatus} from '@/api/data'
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
        viewTitle:'',
        temp: {
          id:'',
          key:'',
          arr:[],
        },
        tableHeight:200,
        listLoading:false,
        list:[],
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
      handleCreate(){
        this.list.push({value:'',name:'',});
      },
      open(){
        this.$nextTick(function() {
          // this.$refs.filter-container.offsetHeight
          let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 320;
          if(height>100){
            this.tableHeight = height
          }else{
            this.tableHeight = 100
          }
          // 监听窗口大小变化
          const self = this;
          window.onresize = function() {
            let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 320;
            if(height>100){
              self.tableHeight = height
            }else{
              self.tableHeight = 100
            }
          };
        });
        this.viewTitle =  this.paraData.option.name
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          id:'',
          key:'',
          arr:[],
        };
        this.dialogStatus= '';
      },
      handleState(row) {
        if (row.status == 1) {
          this.$confirm('确定禁用吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            console.log(row)
            let para = {id:row.id,status:2}
            dicStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                this.getView();
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        } else {
          this.$confirm('确定启用吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let para = {id:row.id,status:1}
            dicStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                this.getView();
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        }

      },
      getView(){
        allDictionary({key:this.paraData.option.key}).then((res) => {
          // const { id, name, list,key } = this.paraData.option;
          // this.temp = {  id, name, list,key }
          this.list = res.data
        })
      },
      updateData() {
        // this.$refs['dataForm'].validate((valid) => {
        //   if (valid) {

       let aa = []
        let arr = this.list.filter(item=>{
          if(item.value =='' && item.name != ''){
            this.$confirm('请输入属性值', "提示", {
              type: "warning",
              showCancelButton: false,
            });
            aa.push(item);
            throw new Error("基本信息没有填写完整！");
          }else if(item.value !='' && item.name == ''){
            this.$confirm('请输入属性名称', "提示", {
              type: "warning",
              showCancelButton: false,
            });
            aa.push(item);
            throw new Error("基本信息没有填写完整！");
          }else if(item.value !='' && item.name != ''){
            let json = {value:item.value,name:item.name};
            return json;
          }
        })
        if(aa.length<=0){
          this.paraLoading = true;
          this.temp.id = this.paraData.option.id;
          this.temp.key = this.paraData.option.key;
          this.temp.arr = arr
          dicAddEdit(this.temp).then((res) => {
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
        //   }
        // })
      },
    }
  }
</script>
