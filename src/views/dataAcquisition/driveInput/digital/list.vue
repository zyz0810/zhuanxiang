<template>
  <div class="app-container">
    <el-tabs type="border-card" class="height_100">
      <el-tab-pane label="页面数据录入">
        <el-form ref="dataForm" :rules="rules" :model="temp" class="digital_form" label-width="200px" >
          <el-form-item label="今日未处理量" prop="undisposed">
            <el-input v-model="temp.undisposed" placeholder="请输入今日未处理量" clearable/>
          </el-form-item>
          <el-form-item label="今日黄灯件" prop="yellow_num">
            <el-input v-model="temp.yellow_num" placeholder="请输入今日黄灯件" clearable/>
          </el-form-item>
          <el-form-item label="黄灯件情况" prop="yellow_detail">
            <el-input v-model="temp.yellow_detail" placeholder="请输入黄灯件情况" clearable/>
          </el-form-item>
          <el-form-item label="今日红灯件" prop="red_num">
            <el-input v-model.trim="temp.red_num" placeholder="请输入今日红灯件" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="红灯件情况" prop="red_detail">
            <el-input v-model.trim="temp.red_detail" placeholder="请输入红灯件情况" autocomplete="off" clearable/>
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
          <el-button class="btn_blue02" type="primary" @click="importFile">导入</el-button>
          <el-form :inline="true" :model="listQuery" :label="280" class="fr">
            <el-form-item label="">
              <el-input v-model="listQuery.productSn" placeholder="智能检索" @change="handleFilter" clearable/>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="temp.value1"
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

        <el-table v-loading="listLoading" :data="listOne" :height="tableHeight"
                  element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
          <el-table-column label="任务号" align="center" prop="name"></el-table-column>
          <el-table-column label="任务来源" align="center" prop="name"></el-table-column>
          <el-table-column label="事件类型" align="center" prop="name"></el-table-column>
          <el-table-column label="案件状态" align="center" prop="name"></el-table-column>
          <el-table-column label="上报时间" align="center" prop="name"></el-table-column>
          <el-table-column label="案件描述" align="center" prop="name"></el-table-column>
          <el-table-column label="受理部门" align="center" prop="name"></el-table-column>
          <el-table-column label="处置部门" align="center" prop="name"></el-table-column>
          <el-table-column label="地址描述" align="center" prop="name"></el-table-column>
          <el-table-column label="照片" align="center" prop="name"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getListOne" class="text-right"/>
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
                v-model="temp.value1"
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

        <el-table v-loading="listLoading" :data="listTwo" :height="tableHeight"
                  element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
          <el-table-column label="序号" type="index" align="center"></el-table-column>
          <el-table-column label="重复投诉点位" align="center" prop="name"></el-table-column>
          <el-table-column label="重复投诉类型" align="center" prop="name"></el-table-column>
          <el-table-column label="重复投诉次数" align="center" prop="name"></el-table-column>
          <el-table-column label="承办单位" align="center" prop="name"></el-table-column>
        </el-table>
        <pagination v-show="totalTwo>0" :total="totalTwo" :page.sync="listQueryTwo.page" :limit.sync="listQueryTwo.pageSize"
                    @pagination="getListTwo" class="text-right"/>
      </el-tab-pane>
    </el-tabs>
    <input type="file" @change="fileChange" id="fileImport" v-show="false" />
    <historyList :showDialog.sync="showHistoryDialog" :historyData="historyData"></historyList>
  </div>
</template>

<script>
  import {addDigital, implodeCityManage,cityManagementList,cityRepManagementList, implodeRepCityManage} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import historyList from "./components/history";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,
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
          page: 1,
          pageSize: 10
        },
        totalTwo:0,
        listQueryTwo: {
          page: 1,
          pageSize: 10
        },
        temp: {
          undisposed: '',
          yellow_num: '',
          yellow_detail: '',
          red_num: '',
          red_detail: '',
          input_time: '',
        },
        listOne:[],
        listTwo:[],
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
      this.getListOne();
      this.getListTwo();
    },
    methods: {
      importFile () {
        document.getElementById("fileImport").click();
      },
      fileChange (e) {
        const url = e.target.files[0];
        const name = e.target.files[0].name;
        const fileTypes = ["xls", "xlsx"];
        if (name) {
          const type = name.split(".").pop();

          if (fileTypes.includes(type)) {
            implodeCityManage({ url }).then((res) => {
              if (res.code == 1) {
                this.$message({ message: "导入成功", type: "success" });
              } else {
                this.$alert(res.code, "提示", {
                  confirmButtonText: "确定",
                  type: "warning",
                });
              }
              e.target.value = "";
            });
          } else {
            this.$alert("文件类型不匹配，请重新选择", "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        }
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getListOne() {
        cityManagementList(this.listQuery).then(res => {
          this.listOne = res.data.data
          this.total = res.data.total
        });
      },
      getListTwo() {
        cityRepManagementList(this.listQueryTwo).then(res => {
          this.listTwo = res.data.data
          this.totalTwo = res.data.total
        });
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
          undisposed: '',
          yellow_num: '',
          yellow_detail: '',
          red_num: '',
          red_detail: '',
          input_time: '',
        }
      },

      handleHistory(row){
        console.log(11111)
        this.showHistoryDialog = true
        this.historyData = {
          // id:row.id
        }
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

    }
  }
</script>
<style lang="scss" scoped>
  .digital_form{
    width: 800px;
    margin: 50px auto;
  }
</style>
