<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleOne('create','')">添加</el-button>
<!--        <el-button class="btn_blue02" type="primary"  @click="">批量导出</el-button>-->
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="字典表" align="center" prop="name"></el-table-column>
        <el-table-column label="属性值" align="center" prop="list"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update',scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
    <paraOneView :showDialog.sync="showOneViewDialog" :paraData="oneViewData" @insertList="getList"></paraOneView>
    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertList="getList"></paraView>
  </div>
</template>

<script>
  import {dicList,} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import paraOneView from "./components/oneView";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,
      paraOneView,
    },
    data() {
      return {
        showOneViewDialog:false,
        showViewDialog:false,
        oneViewData:{},
        viewData:{},
        paraLoading:false,
        total: 0,
        parameterValueList: [{name: ''}],
        list: [],
        listLoading: false,
        listQuery: {
          key_word:'',
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
        dicList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handleOne(type,row){
        this.showOneViewDialog = true
        this.oneViewData = {
          option: type!='create'?row:{},
          operatorType: type,
          id: type!='create'?row.id:''
        }
      },

      handleView(type,row){
        this.showViewDialog = true
        this.viewData = {
          option: type!='create'?row:{},
          operatorType: type,
          id: type!='create'?row.id:''
        }
      },

    }
  }
</script>
