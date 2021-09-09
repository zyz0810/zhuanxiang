<template>
  <div class="app-container">
    <el-tabs type="border-card" class="height_100">
      <el-tab-pane label="基础数据导入">
        <div class="mb_10">
          <el-button class="btn_blue02" type="primary"  @click="">导入</el-button>
          <el-button class="btn_blue01" type="primary"  @click="">刷新</el-button>
          <el-form :inline="true" :model="listQuery" :label="280" class="fr">
            <el-form-item label="">
              <el-input v-model="listQuery.productSn" placeholder="智能检索" @change="handleFilter" clearable/>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                  element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
          <el-table-column label="办件编号" align="center" prop="name"></el-table-column>
          <el-table-column label="联系人" align="center" prop="name"></el-table-column>
          <el-table-column label="联系人证件号" align="center" prop="name"></el-table-column>
          <el-table-column label="电话" align="center" prop="name"></el-table-column>
          <el-table-column label="地址" align="center" prop="name"></el-table-column>
          <el-table-column label="申请日期" align="center" prop="name"></el-table-column>
          <el-table-column label="办结日期" align="center" prop="name"></el-table-column>
          <el-table-column label="办理结果" align="center" prop="name"></el-table-column>
          <el-table-column label="权利名称" align="center" prop="name"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {implodeCheck} from '@/api/data'
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
          name: '',
          status: undefined,
          page: 1,
          limit: 10
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
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 360;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 360;
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
        implodeCheck(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },



    }
  }
</script>
<style lang="scss" scoped>
  .digital_form{
    width: 800px;
    margin: 50px auto;
  }
  .width_reset{
    .el-input{
      width: 49.5%;
    }
  }
</style>
