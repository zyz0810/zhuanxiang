<template>
  <div class="app-container">
    <div class="bg_white">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="选择类型">
          <el-select v-model="listQuery.class" placeholder="请选择" clearable>
            <!--1AI视频、2河道视频、3停车场视频、4普通视频；-->
            <el-option v-for="item in videoCategory" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
<!--        <el-button class="btn_purple" type="primary"  @click="handleView('create','')">添加</el-button>-->
        <el-button class="btn_blue01" type="primary"  @click="">批量导入</el-button>
        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="监控点编码" align="center" prop="index_code" show-overflow-tooltip></el-table-column>
        <el-table-column label="监控点名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
<!--        <el-table-column label="监控类型" align="center" prop="mobile"></el-table-column>-->
        <el-table-column label="归属区域" align="center" prop="depart_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="来源区域" align="center" prop="community_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否重点视频" align="center" prop="is_importance" :formatter="formatImportant"></el-table-column>
        <el-table-column label="安装地址" align="center" prop="install_place" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否启用" align="center" prop="point_status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.point_status" active-color="#13ce66" :active-value="1" :inactive-value="2" @change="handleState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_green" type="primary" @click="handleView('update',scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertList="getList"></paraView>
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
  </div>
</template>

<script>
  import {pointList,pointStatus} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import {allDictionary} from "@/api/data";
  export default {
    name: 'monitorList',
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
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          key_word:'',
          name: '',
          class: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        videoCategory:[],
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
      this.getVideoCategory();
    },
    methods: {
      // 导出
      getUrl(){
        this.downLoadUrl= this.global.domainName + 'admin/Export/pointList?key_word='+this.listQuery.key_word+'&name='+this.listQuery.name+'&class='+this.listQuery.class
          + '&page='+this.listQuery.page + '&pageSize='+this.listQuery.pageSize;
      },
      async handleExport(){
        await this.getUrl();
        document.getElementById("fileDownload").click();
      },
      getVideoCategory(){
        allDictionary({key:'videoType'}).then((res) => {
          this.videoCategory = res.data
        })
      },
      formatImportant(row, column, cellValue, index) {
        return cellValue == 1
          ? "是"
          : cellValue == 2
            ? "否"
            : "--";
      },
      handleState(row){
        // ：active-value得为true
        // ：inactive-value得为false
        let flag = row.point_status //保存点击之后v-modeld的值(true，false)
        // row.enabled = !row.enabled //保持switch点击前的状态
        if(row.point_status == 1){
          row.point_status = 2
        }else{
          row.point_status = 1
        }
        let paras = {
          id:row.id,
          status:flag,
        };
        this.$confirm('是否确认此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          pointStatus(paras).then(res => {
            if (res.code == 1) {
              this.getList();
              this.$message.success(res.message);

              // this.GetList();
            } else {
              this.$message.error(res.message);
            }
          }).catch(() => {
          });
        }).catch(() => {
          // this.$message.info('取消操作！')
        });
      },



      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        pointList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handleView(type,row){
        this.showViewDialog = true
        this.viewData = {
          option:row,
          operatorType:type,
          id:type!='create'?row.id:'',
        }
      },

    }
  }
</script>
