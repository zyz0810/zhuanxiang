<template>
  <div class="app-container">
    <div class="bg_white p20">
      <div class="mb_10">
<!--        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>-->
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.app_name" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="应用名称名称" align="center" prop="app_name"></el-table-column>
        <el-table-column label="应用key" align="center" prop="app_key"></el-table-column>
        <el-table-column label="应用Secret" align="center" prop="app_secret"></el-table-column>
        <el-table-column label="生效时间" align="center" prop="start_date"></el-table-column>
        <el-table-column label="是否启用" align="center" prop="status" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_yellow" type="primary" v-if="scope.row.status == 1" @click="handleState(scope.row)">禁用</el-button>
            <el-button class="btn_green" type="primary" v-if="scope.row.status == 2" @click="handleState(scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

  </div>
</template>

<script>
  import {authAppList, authAppStatus, appAuthExport, } from '@/api/system'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      Pagination,
    },
    data() {
      return {
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          app_name: '',
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
        appAuthExport({app_name:this.listQuery.app_name}).then(res => {
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
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        authAppList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },






      handleState(row) {
        if (row.status == 1) {
          this.$confirm('确定禁用吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let para = {id:row.id,status:2}
            authAppStatus(para).then((res) => {
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
            authAppStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                // this.list.splice(index, 1);
                //NProgress.done();
                this.getList();
                this.$message({
                  message: rea.message,
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
