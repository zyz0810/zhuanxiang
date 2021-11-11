<template>
  <div class="app-container">
    <div class="bg_white">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="选择类型">
          <el-select v-model="listQuery.value" placeholder="请选择" clearable>
            <el-option label="案件件类型" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
        <el-button class="btn_blue02" type="primary"  @click="handleView('create','')">添加</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" row-key="id"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" :tree-props="{children: 'parent_list'}">
        <el-table-column label="案件名称" align="center" prop="name"></el-table-column>
        <el-table-column label="案件编码" align="center" prop="code"></el-table-column>
        <el-table-column label="海康上报小类" align="center" prop="hk_category"></el-table-column>
        <el-table-column label="所属部门" align="center" prop="department_name"></el-table-column>
        <el-table-column label="处置时限" align="center" prop="send_time">
          <template slot-scope="scope">
          <span>{{Number(scope.row.send_time)/Number(3600)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="2" @change="handelState(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="scope.row.parent_id == 0?handleView('update',scope.row):handleSmall('update',scope.row)">编辑</el-button>
            <el-button v-if="scope.row.parent_id == 0" @click="handleSmall('create',scope.row)">添加事件小类</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertList="getList"></paraView>
    <smallView :showDialog.sync="showSmallDialog" :paraData="smallData" @insertList="getList"></smallView>
  </div>
</template>

<script>
  import {categoryList,categoryStatus} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import smallView from "./components/smallView";
  export default {
    name: 'typeList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,
      smallView
    },
    data() {
      return {
        showSmallDialog:false,
        smallData:{},
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
          key_word:'',
          type: 0,
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
      formatStatus(row, column, cellValue, index) {
        return cellValue == 1
          ? "正常"
          : cellValue == 2
            ? "禁用"
            : "";
      },
      handelState(index,row){
        // ：active-value得为true
        // ：inactive-value得为false
        let flag = row.status //保存点击之后v-modeld的值(true，false)
        if(row.status == 1){//保持switch点击前的状态
          row.status = 2
        }else{
          row.status = 1
        }
        let paras = {
          id:row.id,
          status:flag,
        };
        this.$confirm('是否确认此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          categoryStatus(paras).then(res => {
            if (res.code == 1) {
              this.getList();
              if(row.status == 1){//保持switch点击前的状态
                row.status = 2
              }else{
                row.status = 1
              }
              // 逻辑处理

              this.$message.success(res.message);


              // this.GetList();
            } else {
              this.$message.error(res.message);
            }
          }).catch(() => {
          });
        }).catch(() => {
          // this.$message.info('取消操作！')
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        categoryList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      resetList() {
        this.listQuery = {
          name: '',
          status: undefined,
          page: 1,
          pageSize: 10
        }
        this.getList();
      },

      handleView(type,row){
        this.showViewDialog = true
        this.viewData = {
          option:row,
          operatorType:type,
          id:type!='create'?row.id:''
        }
      },
      handleSmall(type,row){
        this.showSmallDialog = true
        this.smallData = {
          option:row,
          operatorType:type,
          id:type!='create'?row.id:''
        }
      },
    }
  }
</script>
