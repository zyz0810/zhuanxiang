<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="text-center user_data">
      <el-form-item label="名称" prop="facility_id">
        <el-input v-model.trim="temp.name" placeholder="请输入名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="胸牌编号" prop="company">
        <el-input v-model.trim="temp.company" placeholder="请输入胸牌编号" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="性别" prop="status">
        <el-select v-model="temp.status">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="simple_name">
        <el-input v-model.trim="temp.simple_name" placeholder="请输入部门名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="职务" prop="credit_code">
        <el-input v-model.trim="temp.credit_code" placeholder="请输入职务" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="身份" prop="organization_code">
        <el-input v-model.trim="temp.organization_code" placeholder="请输入身份" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="联系方式" prop="organization_code">
        <el-input v-model.trim="temp.organization_code" placeholder="请输入身份" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="出生年月" prop="organization_code">
        <el-input v-model.trim="temp.organization_code" placeholder="请输入出生年月" autocomplete="off" clearable/>
      </el-form-item>




      <el-form-item label="文化程度" prop="status">
        <el-select v-model="temp.status">
          <el-option v-for="item in companyStatus" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" prop="company_code">
        <el-input v-model.trim="temp.company_code" placeholder="请输入企业编码" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="籍贯" prop="principal">
        <el-input v-model.trim="temp.principal" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="是否党员" prop="status">
        <el-select v-model="temp.status">
          <el-option label="是" value="0"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="家庭电话" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入家庭电话" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="家庭住址" prop="tel">
        <el-input v-model.trim="temp.tel" placeholder="请输入家庭住址" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="参加工作时间" prop="tel">
        <el-input v-model.trim="temp.tel" placeholder="请输入家庭住址" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="是否驾驶员" prop="status">
        <el-select v-model="temp.status">
          <el-option label="是" value="0"></el-option>
          <el-option label="否" value="0"></el-option>
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
    name: 'parameterList',

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
  }
  .user_data{
    padding: 50px 50px;
  }
</style>
