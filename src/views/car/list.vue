<template>
  <div class="app-container">
    <div class="bg_white">
      <!--<el-form :inline="true" :model="listQuery" :label="280">-->
        <!--<el-form-item label="选择类型">-->
          <!--<el-select v-model="listQuery.class" placeholder="请选择" clearable>-->
            <!--&lt;!&ndash;1AI视频、2河道视频、3停车场视频、4普通视频；&ndash;&gt;-->
            <!--<el-option label="AI视频" :value="1"></el-option>-->
            <!--<el-option label="河道视频" :value="2"></el-option>-->
            <!--<el-option label="停车场视频" :value="3"></el-option>-->
            <!--<el-option label="普通视频" :value="4"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<el-divider></el-divider>-->
      <div class="mb_10">
        <el-button class="btn_blue02" type="primary"  @click="">批量导出</el-button>
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
        <el-table-column label="所属公司 " align="center" prop="company" show-overflow-tooltip></el-table-column>
        <el-table-column label="车辆类型" align="center" prop="type" :formatter="formatType"></el-table-column>
        <el-table-column label="车牌号" align="center" prop="car_no"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
  </div>
</template>

<script>
  import {carList} from '@/api/car'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'monitorList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
    },
    data() {
      return {
        showViewDialog:false,
        viewData:{},
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          key_word: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100'
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
    },
    methods: {
      formatType(row, column, cellValue, index) {
        return cellValue == 1
          ? "洒水车"
          : cellValue == 2
            ? "机扫车"
            : "--";
      },




      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        carList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },


    }
  }
</script>
