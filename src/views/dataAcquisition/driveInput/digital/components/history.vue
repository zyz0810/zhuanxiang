<template>
  <myDialog
    :visible.sync="showHistoryDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="15vh"
    title="历史数据"
    class="dialogContainer"
    @open="open"
  >

<div class="p20">
<!--  <el-form :inline="true" :model="listQuery" :label="280">-->
<!--    <el-form-item label="">-->
<!--      <el-input v-model.trim="temp.mobile" placeholder="智能检索" autocomplete="off" clearable/>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="">-->
<!--      <el-date-picker-->
<!--        v-model="value1"-->
<!--        type="datetimerange"-->
<!--        range-separator="至"-->
<!--        start-placeholder="开始日期"-->
<!--        end-placeholder="结束日期">-->
<!--      </el-date-picker>-->
<!--    </el-form-item>-->
<!--    <el-form-item>-->
<!--      <el-button class="btn_blue02" type="primary" @click="">搜索</el-button>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
<!--  <el-divider></el-divider>-->
  <div class="mb_10">
    <el-button class="btn_blue02" type="primary"  @click="">导出</el-button>
    <el-form :inline="true" :model="listQuery" :label="280" class="fr">
      <el-form-item label="">
        <el-input v-model="listQuery.productSn" placeholder="智能检索" @change="handleFilter" clearable/>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dateTime"
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
    <el-table-column label="时间" align="center" prop="input_time"></el-table-column>
    <el-table-column label="今日未处理量" align="center" prop="undisposed"></el-table-column>
    <el-table-column label="今日黄灯件" align="center" prop="yellow_num"></el-table-column>
    <el-table-column label="今日红灯件" align="center" prop="red_num"></el-table-column>
  </el-table>
  <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" class="text-right"/>
</div>
  </myDialog>
</template>

<script>
  import {lightList,} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index";
  export default {
    name: 'digitalView',
    directives: { waves },
    components: {
      draggable,
      Pagination
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      historyData: {
        required: true,
        type: Object,
        default: {
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        listQuery:{
          start_time:"",
          end_time:"",
          page:1,
          pageSize:10,
        },
        total:0,
        list:[],
        listLoading:false,
        tableHeight:200,
      }
    },
    computed: {
      showHistoryDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
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
    methods: {
      open(){
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
      close(){
        this.listQuery={
          start_time:"",
          end_time:"",
          page:1,
          pageSize:10,
        };
        this.total=0;
        this.list=[];
        this.listLoading=false;
        this.tableHeight=200;

      },
      getList(){
        lightList(this.listQuery).then(res=>{
          // const { id, province, city, area, principal, mobile,} = res.data;
          this.list = res.data.data;
          this.total = res.data.total;
        });
      },
      handleFilter(){},
    }
  }
</script>
