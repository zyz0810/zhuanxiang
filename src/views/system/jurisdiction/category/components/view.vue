<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="菜单管理"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">

      <el-form-item label="菜单名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入菜单名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单链接" prop="url">
        <el-input v-model.trim="temp.url" placeholder="请输入菜单链接" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单顺序" prop="sort">
        <el-input v-model.trim="temp.sort" placeholder="请输入数字" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="temp.type">
          <el-option v-for="item in menuTypeList" :label="item.name" :value="item.value"></el-option>
<!--          // 1、管理平台   2、业务平台  3、BaseData-->
<!--          <el-option label="管理平台" :value="1"></el-option>-->
<!--          <el-option label="业务平台" :value="2"></el-option>-->
<!--          <el-option label="BaseData" :value="3"></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="temp.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标" prop="ico_images">
        <SingleImage :tempUrl="temp.ico_images" v-on:imgSrc="hasImgSrc"></SingleImage>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import {authDetail,authAdd,authEdit} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {allDictionary} from "@/api/data";
  export default {
    name: 'categoryView',
    directives: { waves },
    components: {
      draggable,
      SingleImage
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
          id: "",
          pid:""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        arr:[],
        temp: {
          name:'',
          url:'',
          sort:'',
          type:'',
          status:'',
          ico_images:'',
        },
        menuTypeList:[],
        dialogStatus: '',
        images:'',
        rules: {
          province: [{ required: true, message: '请选择省', trigger: 'change' }],
          city: [{ required: true, message: '请选择市', trigger: 'change' }],
          area: [{ required: true, message: '请选择区', trigger: 'change' }],
          principal: [{ required: true, message: '请输入负责人', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
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
    methods: {
      open(){
        this.getType();
        this.dialogStatus = this.paraData.operatorType;
        this.temp.pid = this.paraData.pid;
        this.temp.parent_name = this.paraData.pidName;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          name:'',
          url:'',
          sort:'',
          type:'',
          status:'',
          ico_images:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        authDetail({id:this.paraData.id}).then(res=>{
          const { id, name,url, sort, type, status,} = res.data;
          this.images = res.data.ico_images;
          let ico_images = res.data.ico_images_url;
          this.temp = { id, name,url, sort, type, status,ico_images}
        });
      },
      getType(){
        allDictionary({key:'indexMenuType'}).then((res) => {
          this.menuTypeList = res.data
        })
      },
      hasImgSrc(val) {
        this.temp.ico_images = val.url;
        this.images = val.images;
        console.log(this.images)
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.ico_images = this.images;
            this.paraLoading = true
            authAdd(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList');
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
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.ico_images = this.images;
            this.paraLoading = true
            authEdit(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList');
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
