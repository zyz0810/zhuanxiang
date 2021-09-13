<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView('create','')">添加</el-button>
        <el-button class="btn_blue01" type="primary"  @click="">批量导入</el-button>
        <el-button class="btn_blue02" type="primary"  @click="">批量导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="编号" type="index" align="center"></el-table-column>
        <el-table-column label="工地名称" align="center" prop="building_name"></el-table-column>
        <el-table-column label="工程类别" align="center" prop="building_type"></el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            {{scope.row.valid_start + ' - ' + scope.row.valid_end}}
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="address"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_green" type="primary" @click="handleView('update',scope.row)">更新</el-button>
            <el-button class="btn_blue02" type="primary" @click="handleView('view',scope.row)">查看</el-button>
            <el-button class="btn_red" type="primary" @click="">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertProduct="getList"></paraView>
    <!--<history :showDialog.sync="showHistoryDialog" :historyData="historyData"></history>-->
  </div>
</template>

<script>
  import {buildList, } from '@/api/data'
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
        operationOption: [{
          id: 0,
          name: '下拉框'
        }, {
          id: 1,
          name: '复选框'
        }, {
          id: 2,
          name: '输入框'
        }],
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 0,
        parameterValueList: [{name: ''}],
        list: [{
          id:445,
          name:'列表1',
        },{
          id:232,
          name:'列表4322',
        },],
        listLoading: false,
        listQuery: {
          key_word: '',
          page: 1,
          pageSize: 10
        },
        updateId: undefined,
        dialogFormVisible: false,
        temp: {
          // id: undefined,
          status: 1,
          name: '',
          orders: '',
          isRequired: 0,
          operatingMode: 0,
          parameterValueList: [],
        },
        textMap: {
          update: '编辑参数信息',
          create: '新增参数信息',
          view:'查看'
        },
        dialogStatus: '',
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
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
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        buildList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      handleView(type,row){
        this.showViewDialog = true
        this.viewData = {
          operatorType:type,
          id:type!='create'?row.id:''
        }
      },

    }
  }
</script>
