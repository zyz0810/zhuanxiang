<template>
  <div class="app-container">
    <div class="bg_white">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="执法中队">
          <el-select v-model="listQuery.key_word" placeholder="请选择" clearable>
            <el-option v-for="item in firstCategory" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
        <el-button class="btn_blue02" type="primary"  @click="handleExport">导出</el-button>
<!--        <el-form :inline="true" :model="listQuery" :label="280" class="fr">-->
<!--          <el-form-item label="">-->
<!--            <el-input v-model="listQuery.key_word" placeholder="" @change="handleFilter" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="网格名称" align="center" prop="table_name"></el-table-column>
        <el-table-column label="责任部门" align="center" prop="department_name"></el-table-column>
        <el-table-column label="网格代码" align="center" prop="table_code"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
  </div>
</template>

<script>
  import {getFirstCategory, tableList} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'gridList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,

    },
    data() {
      return {
        firstCategory:[],
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          key_word:'',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        downLoadUrl:'',
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
      this.getFirstCategory();
    },
    methods: {
      // 导出
      getUrl(){
        this.downLoadUrl= this.global.domainName + 'admin/Export/tableList?key_word='+this.listQuery.key_word+'&page='+this.listQuery.page + '&pageSize='+this.listQuery.pageSize;
      },
      async handleExport(){
        await this.getUrl();
        document.getElementById("fileDownload").click();
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        tableList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      getFirstCategory(){
        getFirstCategory().then(res=>{
          // const { id, province, city, area, principal, mobile,} = res.data;
          this.firstCategory = res.data;
        });
      },
    }
  }
</script>
