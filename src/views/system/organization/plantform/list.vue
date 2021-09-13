<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView('create','')">添加</el-button>
        <el-button class="btn_blue02" type="primary"  @click="">批量导出</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="应用类型" align="center" prop="app_type_name"></el-table-column>
        <el-table-column label="平台名称" align="center" prop="plat_name"></el-table-column>
        <el-table-column label="角色" align="center" prop="role_name_list"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_blue02" type="primary" @click="handleView('update',scope.row)">编辑</el-button>
            <el-button class="btn_red" type="primary" @click="">删除</el-button>
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
  import {platAuthConstants,platAuthList, } from '@/api/system'
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
        viewData:{},
        paraData:{},
        total: 0,
        list: [{
          name:'列表1',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:1
        },{
          name:'列表2',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:2
        }],
        listLoading: false,
        listQuery: {
          plat_name: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        constantsList:[]
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
      this.getConstants();
    },
    methods: {
      getConstants() {
        platAuthConstants().then(res => {
          this.constantsList = res.data
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        platAuthList(this.listQuery).then(res => {
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
    }
  }
</script>
