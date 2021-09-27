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
          <!--<el-button class="btn_blue02" type="primary" @click="importFile">导入</el-button>-->
          <el-upload
            class="upload-demo fl"
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
          <el-table-column label="任务号" align="center" prop="number_no"></el-table-column>
          <el-table-column label="问题来源" align="center" prop="source"></el-table-column>
          <el-table-column label="问题状态" align="center" prop="status"></el-table-column>
          <el-table-column label="问题类型" align="center" prop="type"></el-table-column>
          <el-table-column label="大类名称" align="center" prop="big_category"></el-table-column>
          <el-table-column label="小类名称" align="center" prop="small_category"></el-table-column>
          <el-table-column label="上报时间" align="center" prop="create_at"></el-table-column>
          <el-table-column label="处置部门" align="center" prop="deal_department"></el-table-column>
          <el-table-column label="所属街道" align="center" prop="street"></el-table-column>
          <el-table-column label="问题描述" align="center" prop="description"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getListOne" class="text-right"/>
      </el-tab-pane>
      <el-tab-pane label="反复发生件">
        <div class="mb_10">
          <!--<el-button class="btn_blue02" type="primary"  @click="">导入</el-button>-->

          <el-upload
            class="upload-demo fl"
            ref="upload"
            :show-file-list="false"
            action
            :multiple="false"
            name="files"
            :on-preview="handlePreviewRep"
            :on-remove="handleRemoveRep"
            :file-list="fileListRep"
            v-loading="loading"
            :http-request="uploadFileRep"
          >
            <el-button slot="trigger" class="btn_blue02" type="primary">导入</el-button>
          </el-upload>



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
          <el-table-column label="反复发生点位" align="center" prop="description"></el-table-column>
          <el-table-column label="反复发生类型" align="center" prop="small_category"></el-table-column>
          <el-table-column label="反复发生次数" align="center" prop="num"></el-table-column>
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
  import {addDigital,addLetter, implodeCityManage,cityManagementList,cityRepManagementList, implodeRepCityManage,importExcel} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import {uploadImg} from '@/api/upload'
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
        fileListRep:[],
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
        loading:false,
        fileList:[],
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
            implodeCityManage({ url:this.fileList[0].url }).then((res) => {
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
      uploadFileRep(e) {
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
            this.fileListRep.push({ url: res.images, name: file.name });
            this.loading = false;
            // this.$message({ message:res.message, type: "success" });
            implodeRepCityManage({ url:this.fileListRep[0].url }).then((res) => {
              if (res.code == 1) {


                this.$message({ message: "导入成功", type: "success" });
                this.getListTwo();
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
      handlePreviewRep(file) {
        console.log(file);
      },
      // 文件删除
      handleRemoveRep(file, fileList) {
        console.log(file, fileList);
        this.fileListRep = fileList
      },
      importFile (e) {

        uploadImg(file)
          .then((res) => {
            // this.fileList = [{ url: res.images, name: file.name }];
            this.fileList.push({ url: res.images, name: file.name });
            console.log(this.fileList)
            this.temp.url = this.fileList.map(item=>{ return item.url}).join(',')
            this.loading = false;
            this.$message({ message:res.message, type: "success" });
          })
          .catch((e) => {
            this.loading = false;
            this.$message({ message: "上传附件失败", type: "warning" });
          });

        document.getElementById("fileImport").click();
      },
      fileChange (e) {
        const file = e.target.files[0];
        const name = e.target.files[0].name;
        const fileTypes = ["xls", "xlsx"];
        if (name) {
          const type = name.split(".").pop();
          const sn = 1111;
          const createTime = 2020;
          if (fileTypes.includes(type)) {
            implodeCityManage({ file, }).then((res) => {
              if (res.resp_code == 0) {
                const current = this.dataList.map((item) => item.skuId);
                const data = res.data.skuList.filter(
                  (item) => !current.includes(item.skuId)
                );
                data.forEach((item) => {
                  item.totalPrice = this.sumPrice(
                    item.quantity,
                    item.costPrice
                  ).toFixed(2);
                });
                this.dataList = this.dataList.concat(data);
                this.$message({ message: "导入成功", type: "success" });
              } else {
                this.$alert(res.resp_code, "提示", {
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
          this.listTwo = res.data;
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
            addLetter(this.temp).then((res) => {
                  setTimeout(()=>{
                    this.paraLoading = false
                  },1000)
                  if(res.code == 1){
                    this.resetTemp();
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
