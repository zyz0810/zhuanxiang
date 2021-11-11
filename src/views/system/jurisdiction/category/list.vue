<template>
  <div class="app-container">
    <div class="bg_white p20">
<!--      <el-form :inline="true" :model="listQuery" :label="280">-->
<!--        <el-form-item label="系统名称">-->
<!--          <el-select v-model="listQuery.auth_name" placeholder="请选择" clearable>-->
<!--            <el-option label="数字城管2.0" :value="0"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <el-divider></el-divider>-->
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView('create','parent','')">添加</el-button>
        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>
<!--        <el-form :inline="true" :model="listQuery" :label="280" class="fr">-->
<!--          <el-form-item label="">-->
<!--            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" row-key="id" :tree-props="{children: 'child_list', hasChildren: 'hasChildren'}"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="权限类目名称" align="center" prop="name"></el-table-column>
        <el-table-column label="菜单链接" align="center" prop="url" show-overflow-tooltip></el-table-column>
        <el-table-column label="菜单类型" align="center" prop="dictionary_type" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center" prop="status" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update','',scope.row)">编辑</el-button>
<!--            <el-button class="btn_blue01" type="primary" @click="handleView('create','child',scope.row)">添加</el-button>-->
            <el-button class="btn_yellow" type="primary" v-if="scope.row.status == 1" @click="handleState(scope.row)">禁用</el-button>
            <el-button class="btn_green" type="primary" v-if="scope.row.status == 2" @click="handleState(scope.row)">启用</el-button>
<!--            <el-button class="btn_red" type="primary" @click="handleDelete(scope.row)">删除</el-button>-->
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
  import {authList,authStatus,authExport} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,

    },
    data() {
      return {
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
          auth_name: '',
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
        authExport({auth_name:this.listQuery.auth_name}).then(res => {
          const blob = new Blob([res]);
          let myDate = new Date();
          let timename = myDate
            .toLocaleDateString()
            .split("/")
            .join("-");
          const str = "权限类目";
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
      formatStatus(row, column, cellValue, index) {
        return cellValue == 1
          ? "正常"
          : cellValue == 2
            ? "禁用"
              : "";
      },
      // 1、管理平台   2、业务平台  3、BaseData
      formatType(row, column, cellValue, index) {
        return cellValue == 1
          ? "管理平台"
          : cellValue == 2
            ? "业务平台"
            : cellValue == 3
              ? "BaseData"
            : "";
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        authList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      handleView(type,val,row){
        this.showViewDialog = true
        this.viewData = {
          operatorType:type,
          id:row.id,
          pid:val=='child'?row.id:'',
          pidName:val=='child'?row.auth_name:'',
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
            authStatus(para).then((res) => {
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
            authStatus(para).then((res) => {
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
      handleDelete(row, index) {
        console.log(this.rowInfo[0].id)
        this.$confirm('确定删除此记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: this.rowInfo[0].id};
          paraDelete(para).then((res) => {
            this.listLoading = false;
            if (res.resp_code == 0) {
              // this.list.splice(index, 1);
              //NProgress.done();
              this.getList();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          });
        }).catch(() => {

        });
      },


    }
  }
</script>
