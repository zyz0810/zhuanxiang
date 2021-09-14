<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="5vh"
    title="排查详情"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <div class="p20">
      <div class="mb_10">
        <el-button class="btn_purple" type="primary"  @click="handleView">添加</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="排查时间" align="center" prop="check_date"></el-table-column>
        <el-table-column label="排查内容" align="center" prop="check_content"></el-table-column>
        <el-table-column label="排查结果" align="center" prop="check_result"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
    <checkAdd :showDialog.sync="dialogAddVisible" :paraData="viewData" @insertList="getList"></checkAdd>
  </myDialog>
</template>

<script>

  import {storeCheckList,addStoreCheck} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {storeList} from "@/api/data"; // waves directive
  import checkAdd from "./checkViewView";
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      checkAdd
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
        viewData:{},
        dialogAddVisible: false,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          store_id:'',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
      }
    },
    computed: {
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    methods: {
      getList() {
        storeCheckList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handleView(){
        this.dialogAddVisible = true;
        this.viewData = {
          id:this.paraData.id
        }
      },

      open(){
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
        // this.dialogStatus = this.paraData.operatorType;
        // if(this.paraData.operatorType != 'create'){
          // this.getView();
        // }
        this.listQuery.store_id=this.paraData.id
        this.getList();

      },
      close(){
        this.viewData={};
        this.dialogAddVisible= false;
        this.total= 0;
        this.list= [];
        this.listLoading= false;
        this.listQuery= {
          store_id:'',
          page: 1,
          pageSize: 10
        };
        this.tableHeight='100';
      },

    }
  }
</script>
