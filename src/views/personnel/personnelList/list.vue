<template>
  <div class="app-container">
    <div class="bg_white p20">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="选择部门">
          <el-select v-model="listQuery.value" placeholder="请选择" clearable>
            <el-option label="数字城管2.0" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView('create','')">添加</el-button>
        <el-button class="btn_blue02" type="primary"  @click="">导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="姓名" align="center" prop="real_name"></el-table-column>
        <el-table-column label="所属部门" align="center" prop="department_name"></el-table-column>
        <el-table-column label="性别" align="center" prop="gender" :formatter="formatGender"></el-table-column>
        <el-table-column label="职务" align="center" prop="job_title"></el-table-column>
        <el-table-column label="手机号" align="center" prop="mobile"></el-table-column>
        <el-table-column label="操作" align="center" min-width="250">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update',scope.row)">编辑</el-button>
            <el-button class="btn_yellow" type="primary" v-if="scope.row.status == 1" @click="handleState(scope.row)">冻结</el-button>
            <el-button class="btn_red" type="primary" v-if="scope.row.status == 2" @click="handleState(scope.row)">解冻</el-button>
            <el-button class="btn_blue01" type="primary" @click="handlePassword(scope.row)">重置密码</el-button>
<!--            <el-button class="btn_red" type="primary" @click="">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertList="getList"></paraView>
  </div>
</template>

<script>
  import {userList, userStatus,resetPassword, userExport} from '@/api/user'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import {authStatus} from "@/api/system";
  export default {
    name: 'userList',
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
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 220;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 220;
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
      formatGender(row, column, cellValue, index) {
        return cellValue == 1
          ? "男"
          : cellValue == 2
            ? "女"
            : "";
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        userList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handleView(type,row){
        this.showViewDialog = true
        this.viewData = {
          operatorType:type,
          id:type != 'create'?row.id:''
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
            userStatus(para).then((res) => {
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
            userStatus(para).then((res) => {
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
      handlePassword(row) {
        this.$confirm('确定重置吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          resetPassword({id: row.id}).then((res) => {
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
    }
  }
</script>
