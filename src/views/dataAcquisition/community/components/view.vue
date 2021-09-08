<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="5vh"
    title="小区详情"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="140px" >
      <el-form-item label="小区名称" prop="province">
        <el-input v-model.trim="temp.mobile" placeholder="请输入联系方式" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="小区负责人" prop="province">
        <el-input v-model.trim="temp.mobile" placeholder="请输入联系方式" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="负责人电话" prop="province">
        <el-input v-model.trim="temp.mobile" placeholder="请输入联系方式" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="地址" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入排查结果" autocomplete="off" clearable/>
        <div id='mapDiv' class="mapDiv mt_10" style="width: 100%;height: 100px;"></div>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">保 存</el-button>
    </div>


  </myDialog>
</template>

<script>
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {cityDetail,addCity,updateCity} from '@/api/jurisdiction'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    mixins: [map],
    components: {
      draggable,
      Pagination,
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
          id: ""
        }
      }
    },
    data() {
      return {
        map: '', // 对象
        zoom: 12, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        paraLoading:false,
        dialogFormVisible: false,
        temp: {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        },
        dialogStatus: '',
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
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
        //创建标注工具对象
        let markerTool = new T.MarkTool(this.map, {follow: true});

        function endeditMarker() {
          let markers = markerTool.getMarkers()
          for (let i = 0; i < markers.length; i++) {
            markers[i].disableDragging();
          }
        }
        var cp = new T.CoordinatePickup(this.map, {callback: this.getLngLat})
        cp.addEvent();
        function editMarker() {
          let markers = markerTool.getMarkers()
          console.log(markers)
          for (let i = 0; i < markers.length; i++) {
            markers[i].enableDragging();
          }

        }


        // endeditMarker();
        editMarker();
        markerTool.open();

      },
      getLngLat(lnglat) {
        this.temp.address  = lnglat.lng.toFixed(6) + "," + lnglat.lat.toFixed(6);
        this.temp.log = lnglat.lng.toFixed(6)
        this.temp.lat = lnglat.lat.toFixed(6)
      },
      hasImgSrc(val) {
        this.form.imgUrl = val;
      },
      open(){

        // this.dialogStatus = this.paraData.operatorType;
        // if(this.paraData.operatorType != 'create'){
          // this.getView();
        // }
        this.$nextTick(function() {
          this.onLoad();
        })

      },
      close(){

        this.paraLoading=false;
        this.dialogFormVisible= false;
        this.temp= {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        cityDetail({id:this.paraData.id}).then(res=>{
          const { id, province, city, area, principal, mobile,} = res.data;
          this.temp = { id, province, city, area, principal, mobile,}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addCity(this.temp).then((res) => {
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
            updateCity(this.temp).then((res) => {
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
