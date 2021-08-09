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
    <el-table-column label="时间" align="center" prop="name"></el-table-column>
    <el-table-column label="月受理量" align="center" prop="name"></el-table-column>
    <el-table-column label="同比" align="center" prop="name"></el-table-column>
    <el-table-column label="环比" align="center" prop="name"></el-table-column>
    <el-table-column label="满意率" align="center" prop="name"></el-table-column>
    <el-table-column label="重复投诉件" align="center" prop="name"></el-table-column>
    <el-table-column label="重复投诉情况" align="center" prop="name"></el-table-column>
  </el-table>
  <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
              @pagination="getList" class="text-right"/>
</div>

  </myDialog>
</template>

<script>

  import {cityDetail,addCity,updateCity} from '@/api/jurisdiction'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterView',
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
      paraData: {
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
        total:0,
        listQuery:{
          page:1,
          limit:10,
        },
        list:[],
        listLoading:false,
        paraLoading:false,
        dialogFormVisible: false,
        temp: {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        },
        dialogStatus: '',
        tableHeight:200,
        rules: {
          province: [{ required: true, message: '请选择省', trigger: 'change' }],
          city: [{ required: true, message: '请选择市', trigger: 'change' }],
          area: [{ required: true, message: '请选择区', trigger: 'change' }],
          principal: [{ required: true, message: '请输入负责人', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        },
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
    },
    methods: {
      getList(){},
      open(){
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          // this.getView();
        }
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
      },
      close(){
        this.paraLoading=false;
        this.dialogFormVisible= false;
        this.temp= {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        cityDetail({id:this.paraData.id}).then(res=>{
          const { id, province, city, area, principal, mobile,} = res.data;
          this.temp = { id, province, city, area, principal, mobile,}
        });
      },
    }
  }
</script>
