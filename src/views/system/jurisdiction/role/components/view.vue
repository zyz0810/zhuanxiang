<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="角色管理"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="dialog_form">


<!--      <el-form-item label="ID" prop="name">-->
<!--        <el-input v-model.trim="temp.name" placeholder="请输入ID" autocomplete="off" clearable/>-->
<!--      </el-form-item>-->
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model.trim="temp.role_name" placeholder="请输入角色名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="角色说明" prop="description">
        <el-input v-model.trim="temp.description" placeholder="请输入角色说明" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="角色权限" prop="mobile">
        <el-tree v-model="temp.auth_id" :data="menuList" ref="treeMenu" show-checkbox node-key="id" :default-checked-keys="checkedMenu" :props="defaultProps">
        </el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>
  import {menuTreeList,roleAdd,roleEdit,roleDetail} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination
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
        menuList:[],
        checkedMenu:[],
        defaultProps: {
          children: 'childrens',
          label: 'auth_name'
        },
        paraLoading:false,
        temp: {
          role_name:'',
          description:'',
          auth_id:[]
        },
        dialogStatus: '',
        rules: {
          role_name: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
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
        this.getMenu();
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        this.$nextTick(function() {
          this.$refs.dataForm.clearValidate();
        });


      },
      getMenu(){
        menuTreeList({is_all:1}).then(res => {
          this.menuList = res.data
        });
      },

      close(){
        this.menuList=[];
        this.checkedMenu=[];
        this.defaultProps= {
          children: 'childrens',
          label: 'menu_name'
        };
        this.paraLoading=false;
        this.temp= {
          role_name:'',
          description:'',
          auth_id:[]
        };
        this.dialogStatus= '';
        this.$refs.dataForm.clearValidate();
      },
      getView(){
        roleDetail({id:this.paraData.id}).then(res=>{
          // function treeToArray(data) {
          //   const result = [];
          //   data.forEach(item => {// 遍历树
          //     const loop = data => {
          //       let child = data.childrens;
          //       if(child.length>0){// 是否有子节点，有则继续遍历下一级，无则是叶子节点
          //         for(let i = 0; i < child.length; i++){
          //           loop(child[i]);
          //         }
          //       } else {
          //         result.push(data);
          //       }
          //     }
          //     loop(item);
          //   })
          //   return result;
          // }
          if(res.data.auth_id.length>0){
            // this.checkedMenu = treeToArray(res.data.auth_id).map(item=>{return item.id})
            this.checkedMenu = res.data.auth_id;
            this.$refs.treeMenu.setCheckedKeys(this.checkedMenu);
          }
          const { id, role_name, description, auth_id} = res.data;
          this.temp = { id, role_name, description, auth_id}
          console.log(this.temp )
        });
      },
      getCheckedKeys() {
        return this.$refs.treeMenu.getCheckedKeys().join(',')
        // console.log(this.$refs.tree.getCheckedKeys());
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.auth_id = this.getCheckedKeys();
            roleAdd(temp).then((res) => {
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
            this.paraLoading = true
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.auth_id = this.getCheckedKeys();
            roleEdit(temp).then((res) => {
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
