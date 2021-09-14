<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="10vh"
    title="视频详情"
    class="dialogContainer"
    @open="open"
  >

    <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="dialog_form">

      <el-form-item label="监控点编码" prop="name">
        <el-input v-model.trim="name" placeholder="请输入监控点编码" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="监控点名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入监控点名称" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="监控类型" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入监控类型" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="视频型号" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入视频型号" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>
      <el-form-item label="归属区域" prop="depart_id">
        <el-select v-model="temp.depart_id" placeholder="请选择" clearable>
<!--          浦沿中队，长河中队，西兴中队-->
          <el-option label="浦沿中队" :value="1"></el-option>
          <el-option label="长河中队" :value="2"></el-option>
          <el-option label="西兴中队" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源区域" prop="community_id">
        <el-select v-model="temp.community_id" placeholder="请选择" clearable>
          <el-option label="其它小区" :value="0"></el-option>
          <el-option v-for="item in communityList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否重点" prop="is_importment">
        <el-select v-model="temp.is_importment" placeholder="请选择" clearable>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安装地址" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入安装地址" autocomplete="off" :disabled="true" clearable/>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="updateData()" :loading="paraLoading">确 定</el-button>
    </div>


  </myDialog>
</template>

<script>
  import {editPoint} from '@/api/monitor'
  import {communityList} from "@/api/data"; // waves directive
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  export default {
    name: 'monitorView',
    directives: { waves },
    components: {
      draggable,
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      paraData: {
        required: true,
        type: Object,
        default: {
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        communityList:[],
        temp: {
          id:'',
          depart_id:'',
          is_importment:'',
          community_id:''
        },
        rules: {
          // name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        },
      }
    },
    computed: {
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    filters:{
      filtersStatus: function(value) {
        let StatusArr = {0:'禁用', 1:'启用'}
        return StatusArr[value]
      }
    },

    methods: {
      open(){
        this.temp.id = this.paraData.id;
        this.getView();
        this.getList();
      },
      getList() {
        communityList({page:1,pageSize:99999}).then(res => {
          this.communityList = res.data.data
        });
      },
      getView() {
       const {id,depart_id,is_importment,community_id} = this.paraData.option;
       this.temp = {id,depart_id,is_importment,community_id};
      },
      close(){
        this.paraLoading=false;
        this.communityList=[];
        this.temp= {
          id:'',
          depart_id:'',
          is_importment:'',
          community_id:''
        };
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            const tempData = Object.assign({}, this.temp);
            editPoint(tempData).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList')
                this.showViewDialog = false;
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
