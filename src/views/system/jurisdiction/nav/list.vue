<template>
  <div class="app-container">
    <div class="bg_white p20">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="选择应用">
          <el-select v-model="listQuery.app_type" placeholder="请选择" clearable>
            <el-option v-for="item in APPList" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView('create','parent')">添加</el-button>
        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.menu_name" placeholder="" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" row-key="id" :tree-props="{children: 'parent_list'}">
        <el-table-column label="菜单" align="center" prop="menu_name"></el-table-column>
        <el-table-column label="菜单链接" align="center" prop="url"></el-table-column>
        <el-table-column label="角色" align="center" prop="role_name_list"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update','',scope.row)">编辑</el-button>
            <el-button class="btn_blue01" type="primary" @click="handleView('create','child',scope.row)">新增</el-button>
            <!--<el-button class="btn_red" type="primary" @click="handleDelete(scope.row)">删除</el-button>-->
            <el-button class="btn_yellow" type="primary" v-if="scope.row.status == 1" @click="handleState(scope.row)">禁用</el-button>
            <el-button class="btn_green" type="primary" v-if="scope.row.status == 2" @click="handleState(scope.row)">启用</el-button>
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
  import {menuList, menuStatus, menuExport, APPConstants} from '@/api/system'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      Pagination,
      paraView,

    },
    data() {
      return {
        APPList:[],
        showViewDialog:false,
        showHistoryDialog:false,
        historyData:{},
        viewData:{},
        paraData:{},
        paraLoading:false,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          app_type: '',
          menu_name:'',
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

      this.getApp();
    },
    methods: {
      /** 导出按钮操作 */
      handleExport () {
        // let ids = []
        // this.selectList.forEach((item, index) => {
        //   ids.push(item.id);
        // });
        menuExport({app_type:this.listQuery.app_type,menu_name:this.listQuery.menu_name}).then(res => {
          const blob = new Blob([res]);
          let myDate = new Date();
          let timename = myDate
            .toLocaleDateString()
            .split("/")
            .join("-");
          const str = "角色管理";
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
      getApp() {
        APPConstants().then(res => {
          this.APPList = res.data.app_type_list;
          this.listQuery.app_type = res.data.app_type_list[0].id;
          this.getList();
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        menuList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      handleView(type,val,row){
        this.showViewDialog = true
        this.viewData = {
          operatorType:type,
          id:type != 'create'?row.id:'',
          pid:val=='child'?row.id:'',
        }
      },
      handleDelete(row){
        this.showHistoryDialog = true
        this.historyData = {
          id:row.id
        }
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
            menuStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                this.getList();
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
            menuStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                this.getList();
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



    }
  }
</script>
