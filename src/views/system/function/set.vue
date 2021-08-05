<template>
  <div class="app-container">
    <p class="f18 baseColor">处置时间设置</p>
    <el-divider></el-divider>
    <el-form ref="dataForm" :rules="rules":model="temp" label-width="120px" class="user_password">
      <el-form-item label="时间间隔" prop="facility_id">
        <el-select v-model="temp.status">
          <el-option label="1小时" value="0"></el-option>
          <el-option label="6小时" value="0"></el-option>
        </el-select>
      </el-form-item>

      <div class="text-center">
        <el-button type="primary" class="btn_blue02" :loading="paraLoading">保 存</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  import {userList} from '@/api/user'

  export default {
    name: 'password',

    components: {

    },
    data() {
      return {
        escription:'',
        isChange:false,
        showViewDialog:false,
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
        list: [{
          name:'列表1',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:1
        },{
          name:'列表2',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:1
        }],
        listLoading: false,
        listQuery: {
          key_word: '',
          page: 1,
          pageSize: 10
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
      handleExport(){},

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        userList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      resetList() {
        this.listQuery = {
          key_word: '',
          page: 1,
          pageSize: 10
        }
        this.getList();
      },
      clickRow(row){
        this.$refs.tableList.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        console.log(val)
        this.rowInfo = val;
        if (val.length == 1) {
          this.updateBtn = false
          this.deleteBtn = false
          if(val[0].status == 0){
            this.enableBtn = false
            this.disableBtn = true
          }else{
            this.enableBtn = true
            this.disableBtn = false
          }
        } else {
          this.updateBtn = true
          this.deleteBtn = true
          this.enableBtn = true
          this.disableBtn = true
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
    }
  }
</script>
<style lang="scss" scoped>
  .app-container{
    height: calc(100vh - 135px);
    overflow: auto;
    box-sizing: border-box;
    padding-top: 100px!important;
  }
  .user_password{
    width: 500px;
    margin: 0 auto;
  }
</style>
