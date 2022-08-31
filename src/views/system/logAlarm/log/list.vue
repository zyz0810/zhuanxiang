<template>
  <div class="app-container">
    <div class="bg_white">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="按时间段查询">
          <el-date-picker v-model="dateTime"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="接口名称">
          <el-input v-model="listQuery.request_uri" placeholder="" clearable/>
        </el-form-item>
        <el-form-item label="">
          <el-button class="btn_blue02" type="primary"  @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
<!--        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>-->
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="用户" align="center" prop="ua"></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column label="请求接口" align="center" prop="request_uri"></el-table-column>
        <el-table-column label="请求方式" align="center" prop="method"></el-table-column>
        <el-table-column label="请求时间" align="center" prop="addtime" :formatter="formatTime"></el-table-column>
        <el-table-column label="用时" align="center" prop="time"></el-table-column>
        <el-table-column label="操作结果" align="center" prop="status"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>

  </div>
</template>

<script>
  import {logList, } from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive

  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
    },
    data() {
      return {
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          start_time: '',
          end_time: '',
          request_uri:'',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        downLoadUrl:'',
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
      dateTime: {
        get () {
          if (this.listQuery.start_time && this.listQuery.end_time) {
            return [this.listQuery.start_time, this.listQuery.end_time];
          } else {
            return [];
          }
        },
        set (v) {
          if (v) {
            this.listQuery.start_time = v[0];
            this.listQuery.end_time = v[1];
          } else {
            this.listQuery.start_time = "";
            this.listQuery.end_time = "";
          }
        },
      },
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
      getUrl(){
        this.downLoadUrl= this.global.domainName + 'admin/Export/list?start_time='+this.listQuery.start_time+'&end_time='+this.listQuery.end_time+'&request_uri='+this.listQuery.request_uri
          +'&page='+this.listQuery.page + '&pageSize='+this.listQuery.pageSize;
      },
      async handleExport(){
        await this.getUrl();
        document.getElementById("fileDownload").click();
      },
      formatterCode(row, column, cellValue, index) {
        return cellValue != 200
          ? "失败"
          : cellValue == 200
            ? "成功"
                    : "--";
      },
      formatTime (row, column, cellValue, index) {
        return cellValue
          ? this.$moment(Number(cellValue)*1000).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        logList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

    }
  }
</script>
