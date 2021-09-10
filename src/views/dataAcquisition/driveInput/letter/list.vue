<template>
  <div class="app-container">
    <el-tabs type="border-card" class="height_100">
      <el-tab-pane label="页面数据录入">
        <el-form ref="dataForm" :rules="rules" :model="temp" class="digital_form" label-width="200px" >
          <el-form-item label="月受理件" prop="month_deal_num">
            <el-input v-model="temp.month_deal_num" placeholder="请输入月受理件" clearable/>
          </el-form-item>
          <el-form-item label="同比" prop="basis_num" class="width_reset">
            <el-select v-model="temp.basis_direction" placeholder="请选择">
              <el-option label="同比上升" :value="1"></el-option>
              <el-option label="同比下降" :value="2"></el-option>
            </el-select>
            <el-input v-model="temp.basis_num" placeholder="请输入数字" clearable/>
          </el-form-item>
          <el-form-item label="环比" prop="comparative_num" class="width_reset">
            <el-select v-model="temp.comparative_direction" placeholder="请选择">
              <el-option label="同比上升" :value="1"></el-option>
              <el-option label="同比下降" :value="2"></el-option>
            </el-select>
            <el-input v-model="temp.comparative_num" placeholder="请输入数字" clearable/>
          </el-form-item>
          <el-form-item label="满意率" prop="satisfaction_rate">
            <el-input v-model.trim="temp.satisfaction_rate" placeholder="请输入满意率" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="重复投诉件" prop="rep_num">
            <el-input v-model.trim="temp.rep_num" placeholder="请输入重复投诉件" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="重复投诉情况" prop="rep_detail">
          <el-input v-model.trim="temp.rep_detail" placeholder="请输入重复投诉情况" autocomplete="off" clearable/>
        </el-form-item>
          <el-form-item label="录入时间" prop="input_time">
            <el-date-picker
              v-model="temp.input_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" class="f14 baseColor text-right" ><span @click="handleHistory">历史数据</span></el-form-item>
          <el-form-item label="" prop="mobile" class="text-center">
            <el-button class="btn_blue02" type="primary" @click="onSubmit">确定</el-button>
            <el-button class="" @click="">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="基础数据导入">
        <div class="mb_10">
          <el-button class="btn_blue02" type="primary"  @click="">导入</el-button>
          <el-form :inline="true" :model="listQuery" :label="280" class="fr">
            <el-form-item label="">
              <el-input v-model="listQuery.productSn" placeholder="智能检索" @change="handleFilter" clearable/>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="listQuery.value1"
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
          <el-table-column label="任务号" align="center" prop="name"></el-table-column>
          <el-table-column label="任务来源" align="center" prop="name"></el-table-column>
          <el-table-column label="案件类型" align="center" prop="name"></el-table-column>
          <el-table-column label="案件状态" align="center" prop="name"></el-table-column>
          <el-table-column label="上报时间" align="center" prop="name"></el-table-column>
          <el-table-column label="案件描述" align="center" prop="name"></el-table-column>
          <el-table-column label="受理部门" align="center" prop="name"></el-table-column>
          <el-table-column label="承办部门" align="center" prop="name"></el-table-column>
          <el-table-column label="地址描述" align="center" prop="name"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </el-tab-pane>
      <el-tab-pane label="重复件导入">
        <div class="mb_10">
          <el-button class="btn_blue02" type="primary"  @click="">导入</el-button>
          <el-form :inline="true" :model="listQuery" :label="280" class="fr">
            <el-form-item label="">
              <el-input v-model="listQuery.productSn" placeholder="智能检索" @change="handleFilter" clearable/>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="listQuery.value1"
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
          <el-table-column label="序号" type="index" align="center"></el-table-column>
          <el-table-column label="重复投诉点位" align="center" prop="name"></el-table-column>
          <el-table-column label="重复投诉类型" align="center" prop="name"></el-table-column>
          <el-table-column label="重复投诉次数" align="center" prop="name"></el-table-column>
          <el-table-column label="承办单位" align="center" prop="name"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </el-tab-pane>
    </el-tabs>

    <historyList :showDialog.sync="showHistoryDialog" :historyData="historyData"></historyList>
  </div>
</template>

<script>
  import {addDigital, addLetter,} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import historyList from "./components/history";
  export default {
    name: 'letterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      historyList
    },
    data() {
      return {
        showHistoryDialog:false,
        historyData:{},
        paraLoading:false,
        total: 0,
        list: [{
          id:445,
          name:'列表1',
        },{
          id:232,
          name:'列表4322',
        },],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        temp: {
          month_deal_num: '',
          basis_direction: 1,
          basis_num: '',
          comparative_direction: 1,
          comparative_num: '',
          satisfaction_rate: '',
          input_time:'',
          rep_num:'',
          rep_detail:''
        },
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
      // this.getList();
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        // paraList(this.listQuery).then(res => {
        //   this.list = res.data.data
        //   this.total = res.data.count
        // });
      },
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addDigital(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1){
                this.getList();
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
      resetList() {
        this.listQuery = {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        }
        this.getList();
      },




      resetTemp() {
        this.temp = {
          month_deal_num: '',
          basis_direction: 1,
          basis_num: '',
          comparative_direction: 1,
          comparative_num: '',
          satisfaction_rate: '',
          input_time:'',
          rep_num:'',
          rep_detail:''
        }
      },
      handleHistory(row){
        console.log(11111)
        this.showHistoryDialog = true
        this.historyData = {
          // id:row.id
        }
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
