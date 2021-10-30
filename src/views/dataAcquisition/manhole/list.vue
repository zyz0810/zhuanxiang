<template>
  <div class="app-container">
    <div class="bg_white">
      <div class="mb_10">
        <el-button class="btn_purple fl mr_10" type="primary"  @click="handleView('create','')">添加</el-button>
        <!--<el-button class="btn_blue01" type="primary"  @click="">批量导入</el-button>-->
        <el-upload
          class="upload-demo fl mr_10"
          ref="upload"
          :show-file-list="false"
          action
          :multiple="false"
          name="files"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          v-loading="loading"
          :http-request="uploadFile"
        >
          <el-button slot="trigger" class="btn_blue02" type="primary">批量导入</el-button>
        </el-upload>
        <el-button class="btn_blue02" type="primary"  @click="">批量导出</el-button>
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.key_word" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="编号" type="index" align="center"></el-table-column>
        <el-table-column label="井盖编号" align="center" prop="number_no" show-overflow-tooltip></el-table-column>
        <el-table-column label="IMEI号" align="center" prop="imei"></el-table-column>
        <el-table-column label="井盖状态" align="center" prop="status" :formatter="formatStatus"></el-table-column>
        <el-table-column label="井盖运行状态" align="center" prop="install_status"></el-table-column>
        <el-table-column label="最后更新时间" align="center" prop="update_at"></el-table-column>
        <el-table-column label="自检时间" align="center" prop="create_at"></el-table-column>
        <el-table-column label="井盖地址" align="center" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button class="btn_green" type="primary" @click="handleView('update',scope.row)">更新</el-button>
            <el-button class="btn_blue02" type="primary" @click="handleView('view',scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="viewData" @insertList="getList"></paraView>
  </div>
</template>

<script>
  import {uploadImg} from '@/api/upload'
  import {wellLidList, implodeWellLid,} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,

    },
    data() {
      return {
        fileList:[],
        loading:false,
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
    methods: {
      formatStatus(row, column, cellValue, index) {
        // 1正常 2异常
        return cellValue == 1
          ? "正常"
          : cellValue == 2
            ? "异常"
            : "";
      },
      uploadFile(e) {
        const file = e.file;
        console.log(e)
        // if (file.type != "application/pdf") {
        //   this.$message({ message: "附件仅支持PDF格式", type: "warning" });
        //   this.fileList = [];
        //   return;
        // }
        // if (!(file.size / 1024 / 1024 / 2 <= 1)) {
        //   this.$message({
        //     message: "上传文件大小不能超过 2MB!",
        //     type: "warning",
        //   });
        //   this.fileList = [];
        //   return;
        // }
        this.loading = true;
        uploadImg(file)
          .then((res) => {
            // this.fileList = [{ url: res.images, name: file.name }];
            this.fileList.push({ url: res.images, name: file.name });
            this.loading = false;
            // this.$message({ message:res.message, type: "success" });
            implodeWellLid({ url:this.fileList[0].url }).then((res) => {
              if (res.code == 1) {
                this.$message({ message: "导入成功", type: "success" });
                this.handleFilter();
              } else {
                this.$alert(res.resp_code, "提示", {
                  confirmButtonText: "确定",
                  type: "warning",
                });
              }
              e.target.value = "";
            });
          })
          .catch((e) => {
            this.loading = false;
            this.$message({ message: "上传附件失败", type: "warning" });
          });
      },
      handlePreview(file) {
        console.log(file);
      },
      // 文件删除
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = fileList
        this.temp.url = this.fileList.map(item=>{ return item.url}).join(',')
        // this.temp.url = "";
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        wellLidList(this.listQuery).then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
        });
      },

      handleView(type,row){
        this.showViewDialog = true
        this.viewData = {
          option:row,
          operatorType:type,
          id:type!='create'?row.id:''
        }
      },
      handleState(row) {
        if (row.status == 1) {
          this.$confirm('确定禁用吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            console.log(row)
            let para = {id:row.id,status:2}
            buildStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                this.getList();
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        } else {
          this.$confirm('确定启用吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let para = {id:row.id,status:1}
            buildStatus(para).then((res) => {
              this.listLoading = false;
              if (res.code == 1) {
                this.getList();
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        }

      },

    }
  }
</script>
