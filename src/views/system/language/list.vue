<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_blue01" type="primary"  @click="handleView('create','')">新增</el-button>
<!--        <el-form :inline="true" :model="listQuery" :label="280" class="fr">-->
<!--          <el-form-item label="">-->
<!--            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="表达语" align="center" prop="name"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update',scope.row)">编辑</el-button>
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
  import {languageList,} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'languageList',
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
        viewData:{},
        paraData:{},
        paraLoading:false,
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10
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
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 200;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 200;
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
        languageList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      handleView(type,row){
        this.showViewDialog = true;
        this.viewData = {
          operatorType:type,
          id:type!='create'?row.id:''
        }
      },

    }
  }
</script>
