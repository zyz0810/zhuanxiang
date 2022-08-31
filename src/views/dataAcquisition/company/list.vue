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
        <el-button class="btn_blue02" type="primary"  @click="handleExport">批量导出</el-button>
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
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="company" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" align="center" prop="type"></el-table-column>
        <el-table-column label="联系人" align="center" prop="link_man"></el-table-column>
        <el-table-column label="电话" align="center" prop="mobile"></el-table-column>
        <el-table-column label="养护范围" align="center" prop="content" show-overflow-tooltip></el-table-column>
        <el-table-column label="地址" align="center" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" min-width="80">
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
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
  </div>
</template>

<script>
  import {uploadImg} from '@/api/upload'
  import {implodeConserve, conserveList,} from '@/api/data'
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
      // 导出
      getUrl(){
        this.downLoadUrl= this.global.domainName + 'admin/Export/conserveList?key_word='+this.listQuery.key_word + '&page='+this.listQuery.page + '&pageSize='+this.listQuery.pageSize;
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
        conserveList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
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
            implodeConserve({ url:this.fileList[0].url }).then((res) => {
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

    }
  }
</script>
