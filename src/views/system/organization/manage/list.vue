<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView('create','parent','')">添加</el-button>
        <!--<el-button class="btn_blue01" type="primary"  @click="">批量导入</el-button>-->
        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" row-key="id" :tree-props="{children: 'list'}">
        <el-table-column label="部门名称" align="center" prop="department_name"></el-table-column>
        <el-table-column label="部门电话" align="center" prop="phone"></el-table-column>
        <el-table-column label="主要负责人" align="center" prop="contact"></el-table-column>
        <el-table-column label="负责人电话" align="center" prop="mobile"></el-table-column>
        <el-table-column label="地址" align="center" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update','',scope.row)">编辑</el-button>
            <el-button class="btn_blue01" type="primary" @click="handleView('create','child',scope.row)">新增</el-button>
            <el-button class="btn_yellow" type="primary" @click="handleUser">人员</el-button>
<!--            <el-button class="btn_red" type="primary" @click="">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertList="getList"></paraView>
    <!--<history :showDialog.sync="showHistoryDialog" :historyData="historyData"></history>-->
  </div>
</template>

<script>
  import {departmentList,departmentAllList, departmentStatus, departmentExport,} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'manageList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,
    },
    data() {
      return {
        showViewDialog:false,
        viewData:{},
        paraLoading:false,
        total: 0,
        parameterValueList: [{name: ''}],
        list: [],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          pageSize: 10
        },
        tableHeight:'100'
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 260;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 260;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      this.getList();
    },
    methods: {

      /** 导出按钮操作 */
      handleExport () {
        // let ids = []
        // this.selectList.forEach((item, index) => {
        //   ids.push(item.id);
        // });
        departmentExport({department_name:this.listQuery.department_name}).then(res => {
          const blob = new Blob([res]);
          let myDate = new Date();
          let timename = myDate
            .toLocaleDateString()
            .split("/")
            .join("-");
          const str = "组织管理";
          const fileName = str + timename + ".xls";
          const linkNode = document.createElement("a");
          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = "none";
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click(); //模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        departmentList(this.listQuery).then(res => {
          this.list = res.data;
          // this.total = res.data.total;
        });
      },






      handleView(type,parent,row){
        this.showViewDialog = true
        this.viewData = {
          option:{
            parent:parent,
            pId:parent=='child'?row.id:''
          },
          operatorType: type,
          id:type != 'create'?row.id:''
        }
      },
      handleUser(){
        this.$router.push({path:'/personnel/personnelList',query:{}});
      },
      handleState(val) {
        console.log(this.rowInfo[0].id)
        if (val == 0) {
          this.$confirm('确定禁用此参数吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let tempData = Object.assign({}, this.rowInfo[0]);
            tempData.status = 0;
            let para = {id:this.rowInfo[0].id,status:0}
            this.$delete(tempData,'createTime')
            this.$delete(tempData,'updateTime')
            this.$delete(tempData,'createUser')
            this.$delete(tempData,'updateUser')
            if(tempData.operatingMode != 2){
              tempData.parameterValueList = tempData.parameterValueList.map(item=>{
                let obj = {}
                obj.id = item.id
                obj.name = item.name
                return obj
              })
            }else{
              this.$delete(tempData, 'parameterValueList')
            }
            paraUpdate(tempData).then((res) => {
              this.listLoading = false;
              if (res.resp_code == 0) {
                // this.list.splice(index, 1);
                //NProgress.done();
                this.getList();
                this.$message({
                  message: '禁用成功',
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        } else {
          this.$confirm('确定启用此参数吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let tempData = Object.assign({}, this.rowInfo[0]);
            tempData.status = 1;
            this.$delete(tempData,'createTime')
            this.$delete(tempData,'updateTime')
            this.$delete(tempData,'createUser')
            this.$delete(tempData,'updateUser')
            if(tempData.operatingMode != 2){
              if(tempData.parameterValueList){
                tempData.parameterValueList = tempData.parameterValueList.map(item=>{
                  let obj = {}
                  obj.id = item.id
                  obj.name = item.name
                  return obj
                })
              }
            }else{
              this.$delete(tempData, 'parameterValueList')
            }
            // let para = {id:this.rowInfo[0].id,status:1}
            paraUpdate(tempData).then((res) => {
              this.listLoading = false;
              if (res.resp_code == 0) {
                // this.list.splice(index, 1);
                //NProgress.done();
                this.getList();
                this.$message({
                  message: '启用成功',
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        }

      },


    }
  }
</script>
