<template>
  <div class="app-container">
    <div class="bg_white">
      <el-form :inline="true" :model="listQuery" :label="280">
        <el-form-item label="按时间段查询">
          <el-date-picker v-model="imgSixTime"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="服务名称">
          <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>
        </el-form-item>
        <el-form-item label="日志类型">
          <el-select v-model="value" placeholder="请选择" clearable>
            <el-option label="全部" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="mb_10">
<!--        <el-button class="btn_blue02" type="primary"  @click="">导出</el-button>-->
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit border ref="tableList" :header-cell-style="{background:'rgb(245,245,253)',}" >
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="日志类型" align="center" prop="name"></el-table-column>
        <el-table-column label="服务名称" align="center" prop="name"></el-table-column>
        <el-table-column label="服务地址" align="center" prop="name"></el-table-column>
        <el-table-column label="请求时间" align="center" prop="name"></el-table-column>
        <el-table-column label="响应（s）" align="center" prop="name"></el-table-column>
        <el-table-column label="返回值" align="center" prop="name"></el-table-column>
        <el-table-column label="操作结果" align="center" prop="name"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @insertProduct="getList"></paraView>
    <!--<history :showDialog.sync="showHistoryDialog" :historyData="historyData"></history>-->
  </div>
</template>

<script>
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
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
        showViewDialog:false,
        showHistoryDialog:false,
        historyData:{},
        viewData:{},
        paraData:{},
        paraLoading:false,
        operationOption: [{
          id: 0,
          name: '下拉框'
        }, {
          id: 1,
          name: '复选框'
        }, {
          id: 2,
          name: '输入框'
        }],
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 0,
        parameterValueList: [{name: ''}],
        list: [],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        updateId: undefined,
        dialogFormVisible: false,
        temp: {
          // id: undefined,
          status: 1,
          name: '',
          orders: '',
          isRequired: 0,
          operatingMode: 0,
          parameterValueList: [],
        },
        textMap: {
          update: '编辑参数信息',
          create: '新增参数信息',
          view:'查看'
        },
        dialogStatus: '',
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
      // this.getList();
    },
    methods: {
      handleValue(val){
        // this.temp.parameterValueList.map(item=>{
        //   if(item.name == val.srcElement.value){
        //     this.$confirm(
        //       '参数值重复，请重新输入',
        //       "提示",
        //       {
        //         type: "warning",
        //         showCancelButton: false
        //       }
        //     )
        //       .then(() => {
        //
        //       })
        //       .catch(() => {});
        //   }
        // })
      },
      handleOperating(val){
        console.log(val.srcElement.value)

      },
      deleteParam(index) {
        this.parameterValueList.splice(index, 1)
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        paraList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.count
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

      addSpecifications() {
        this.parameterValueList.push({name: ''})
      },
      goView() {
        // this.$router.push('/product/view')
        // this.$router.push({path: "/product/paramView", query: {id: this.rowInfo[0].id, name: this.rowInfo[0].name,operatingMode: this.rowInfo[0].operatingMode}})
        this.showViewDialog = true
        this.paraData = {
          option: {
            name: this.rowInfo[0].name,
            operatingMode: this.rowInfo[0].operatingMode
          },
          operatorType: 'view',
          id: this.rowInfo[0].id
        }
      },

      resetTemp() {
        this.temp = {
          // id: undefined,
          status: 1,
          name: '',
          orders: '',
          isRequired: 0,
          operatingMode: 0,
          parameterValueList: [],
        }
      },
      handleView(row){
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
      },
      handleHistory(row){
        this.showHistoryDialog = true
        this.historyData = {
          id:row.id
        }
      },
      handleCreate() {
        this.resetTemp();
        this.parameterValueList = [{name: ''}];
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.temp.operatingMode != 2){
              let parameterValueList = this.parameterValueList.filter(item=>item.name!='')
              console.log(parameterValueList)
              if(parameterValueList.length<1){
                this.$confirm('请输入参数值', "提示", {
                  type: "warning",
                  showCancelButton: false
                })
                  .then(() => {

                  })
                  .catch(() => {});
              }else{
                this.paraLoading = true
                this.temp.parameterValueList = parameterValueList
                paraSave(this.temp).then((res) => {
                  setTimeout(()=>{
                    this.paraLoading = false
                  },1000)
                  if(res.resp_code == 0){
                    this.list.unshift(res.data);
                    this.dialogFormVisible = false;
                    this.getList();
                    this.$message({
                      message: '增加成功',
                      type: 'success'
                    });
                  }
                }).catch(() => {
                  this.paraLoading = false;
                });
              }
            }else{
              this.paraLoading = true
              paraSave(this.temp).then((res) => {
                setTimeout(()=>{
                  this.paraLoading = false
                },1000)
                if(res.resp_code == 0){
                  this.list.unshift(res.data);
                  this.dialogFormVisible = false;
                  this.getList();
                  this.$message({
                    message: '增加成功',
                    type: 'success'
                  });
                }
              }).catch(() => {
                this.paraLoading = false;
              });
            }
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, this.rowInfo[0]); // copy obj

        if (this.temp.parameterValueList) {
          this.parameterValueList = this.temp.parameterValueList
        } else {
          this.parameterValueList = [{name: ''}]
        }
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            this.$delete(tempData, 'updateTime')
            this.$delete(tempData, 'updateUser')
            this.$delete(tempData, 'createTime')
            this.$delete(tempData, 'createUser')
            this.$delete(tempData, 'remarks')
            this.$delete(tempData, 'status')
            if(tempData.operatingMode != 2){
              tempData.parameterValueList = this.parameterValueList
              let arr = tempData.parameterValueList.filter(item=>item.name!='')
              if(arr.length<1){
                this.$confirm('请输入参数值', "提示", {
                  type: "warning",
                  showCancelButton: false
                })
                  .then(() => {

                  })
                  .catch(() => {});
              }else{
                arr = arr.map(item=>{
                  let json={}
                  json.id=item.id;
                  json.name=item.name;
                  json.parameterId=item.parameterId;
                  return json
                })
                tempData.parameterValueList = arr
                this.paraLoading = true
                paraUpdate(tempData).then((res) => {
                  // const index = this.list.findIndex(v => v.id === this.temp.id);
                  // this.list.splice(index, 1, res.data);
                  setTimeout(()=>{
                    this.paraLoading = false
                  },1000)
                  if (res.resp_code == 0) {
                    this.getList();
                    this.dialogFormVisible = false;
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                  }
                }).catch(() => {
                  this.paraLoading = false;
                });
              }
            }else{
              this.$delete(tempData, 'parameterValueList')
              this.paraLoading = true
              paraUpdate(tempData).then((res) => {
                setTimeout(()=>{
                  this.paraLoading = false
                },1000)
                // const index = this.list.findIndex(v => v.id === this.temp.id);
                // this.list.splice(index, 1, res.data);
                if (res.resp_code == 0) {
                  this.getList();
                  this.dialogFormVisible = false;
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                }
              }).catch(() => {
                this.paraLoading = false;
              });
            }
          }
        })
      },
      handleState(val) {
        console.log(this.rowInfo[0].id)
        if (val == 0) {
          this.$confirm('确定禁用此参数吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let tempData = Object.assign({}, this.rowInfo[0]);
            tempData.status = 0;
            let para = {id:this.rowInfo[0].id,status:0}
            this.$delete(tempData,'createTime')
            this.$delete(tempData,'updateTime')
            this.$delete(tempData,'createUser')
            this.$delete(tempData,'updateUser')
            if(tempData.operatingMode != 2){
              tempData.parameterValueList = tempData.parameterValueList.map(item=>{
                let obj = {}
                obj.id = item.id
                obj.name = item.name
                return obj
              })
            }else{
              this.$delete(tempData, 'parameterValueList')
            }
            paraUpdate(tempData).then((res) => {
              this.listLoading = false;
              if (res.resp_code == 0) {
                // this.list.splice(index, 1);
                //NProgress.done();
                this.getList();
                this.$message({
                  message: '禁用成功',
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        } else {
          this.$confirm('确定启用此参数吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let tempData = Object.assign({}, this.rowInfo[0]);
            tempData.status = 1;
            this.$delete(tempData,'createTime')
            this.$delete(tempData,'updateTime')
            this.$delete(tempData,'createUser')
            this.$delete(tempData,'updateUser')
            if(tempData.operatingMode != 2){
              if(tempData.parameterValueList){
                tempData.parameterValueList = tempData.parameterValueList.map(item=>{
                  let obj = {}
                  obj.id = item.id
                  obj.name = item.name
                  return obj
                })
              }
            }else{
              this.$delete(tempData, 'parameterValueList')
            }
            // let para = {id:this.rowInfo[0].id,status:1}
            paraUpdate(tempData).then((res) => {
              this.listLoading = false;
              if (res.resp_code == 0) {
                // this.list.splice(index, 1);
                //NProgress.done();
                this.getList();
                this.$message({
                  message: '启用成功',
                  type: 'success'
                });
              }
            });
          }).catch(() => {

          });
        }

      },
      handleDelete(row, index) {
        console.log(this.rowInfo[0].id)
        this.$confirm('确定删除此记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: this.rowInfo[0].id};
          paraDelete(para).then((res) => {
            this.listLoading = false;
            if (res.resp_code == 0) {
              // this.list.splice(index, 1);
              //NProgress.done();
              this.getList();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          });
        }).catch(() => {

        });
      },


    }
  }
</script>
