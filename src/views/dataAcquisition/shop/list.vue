<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView">添加</el-button>
        <el-button class="btn_blue01" type="primary"  @click="">批量导入</el-button>
        <el-button class="btn_blue02" type="primary"  @click="">批量导出</el-button>
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
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="编号" type="index" align="center"></el-table-column>
        <el-table-column label="店铺名称" align="center" prop="shop_name"></el-table-column>
        <el-table-column label="违章次数" align="center" prop=""></el-table-column>
        <el-table-column label="排查次数" align="center" prop=""></el-table-column>
        <el-table-column label="地址" align="center" prop="address"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_green" type="primary" @click="">更新</el-button>
            <el-button class="btn_blue02" type="primary" @click="">查看</el-button>
            <el-button class="btn_red" type="primary" @click="">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @insertProduct="getList"></paraView>
  </div>
</template>

<script>
  import {storeList,  } from '@/api/data'
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
          name: '',
          status: undefined,
          page: 1,
          pageSize: 10
        },

        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '禁用', 1: '启用'}
        return StatusArr[value]
      },
      filtersMode: function (value) {
        let StatusArr = {0: '下拉框', 1: '复选框', 2: '输入框'}
        return StatusArr[value]
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

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        storeList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      handleView(row){
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
      },

    }
  }
</script>
