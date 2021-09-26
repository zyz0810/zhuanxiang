<template>
  <div class="app-container">
    <el-tabs type="border-card" class="height_100">
      <el-tab-pane label="基础数据导入">
        <div class="mb_10">
          <!--<el-button class="btn_blue02" type="primary"  @click="">导入</el-button>-->
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
            <el-button slot="trigger" class="btn_blue02" type="primary">导入</el-button>
          </el-upload>
          <el-button class="btn_blue01" type="primary"  @click="">刷新</el-button>
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
          <el-table-column label="办件编号" align="center" prop="number_no"></el-table-column>
          <el-table-column label="联系人" align="center" prop="linkman"></el-table-column>
          <el-table-column label="联系人证件号" align="center" prop="linkman_no"></el-table-column>
          <el-table-column label="电话" align="center" prop="phone"></el-table-column>
          <el-table-column label="地址" align="center" prop="address"></el-table-column>
          <el-table-column label="申请日期" align="center" prop="apply_date"></el-table-column>
          <el-table-column label="办结日期" align="center" prop="end_date"></el-table-column>
          <el-table-column label="办理结果" align="center" prop="result"></el-table-column>
          <el-table-column label="权利名称" align="center" prop="apply_name"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {administrativeCheckList,implodeCheck} from '@/api/data'
  import {uploadImg} from '@/api/upload'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive

  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
    },
    data() {
      return {
        fileList:[],
        loading:false,
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
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
      this.getList();
    },
    methods: {

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        administrativeCheckList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
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
            implodeCheck({ url:this.fileList[0].url }).then((res) => {
              if (res.code == 1) {


                this.$message({ message: "导入成功", type: "success" });
                this.getListOne();
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
