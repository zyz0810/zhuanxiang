<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="5vh"
    title="工地详情"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="140px" >
      <el-form-item label="工地名称" prop="building_name">
        <el-input v-model.trim="temp.building_name" placeholder="请输入工地名称" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="工程类别" prop="building_type">
        <el-input v-model.trim="temp.building_type" placeholder="请输入工程类别" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="有效时间" prop="">
        <el-date-picker
          v-model="dataTime"
          type="daterange"
          :disabled="isCanView"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="建设方" prop="construction_name">
        <el-input v-model.trim="temp.construction_name" placeholder="请输入建设方" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="联系人" prop="construction_person">
        <el-input v-model.trim="temp.construction_person" placeholder="请输入联系人" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="联系方式" prop="construction_relation">
        <el-input v-model.trim="temp.construction_relation" placeholder="请输入联系方式" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>

      <el-form-item label="施工方" prop="roadwork">
        <el-input v-model.trim="temp.roadwork" placeholder="请输入施工方" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="联系人" prop="roadwork_person">
        <el-input v-model.trim="temp.roadwork_person" placeholder="请输入联系人" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="联系方式" prop="roadwork_relation">
        <el-input v-model.trim="temp.roadwork_relation" placeholder="请输入联系方式" autocomplete="off" :disabled="isCanView" clearable/>
      </el-form-item>
      <el-form-item label="夜间施工审批时间" prop="build_check_time">
        <el-time-picker
          is-range
          :disabled="isCanView"
          v-model="timeOne"
          value-format="HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="违章次数" prop="break_rules_count" v-if="this.paraData.operatorType != 'create'">
        <el-input v-model.trim="temp.break_rules_count" placeholder="" :disabled="true" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="" prop="" v-if="this.paraData.operatorType != 'create'">
        <el-button type="primary" class="btn_blue02" @click="handleViolation(temp.id)">违章详情</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="140px" class="mr_20">
      <el-form-item label="审批记录表" prop="images">
        <SingleImage
          v-if="!isCanView"
          :tempUrl="temp.images"
          v-on:imgSrc="hasImgSrc"
        ></SingleImage>
        <img :src="temp.images" class="my_img" v-else/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model.trim="temp.address" placeholder="请在地图上选择地址" autocomplete="off" @input="getAddress" :disabled="isCanView" clearable/>
        <div id='mapDiv' class="mapDiv mt_10" style="width: 100%;height: 100px;"></div>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">保 存</el-button>
    </div>

    <violationView :showDialog.sync="dialogViolationVisible" :paraData="violationData"></violationView>
  </myDialog>
</template>

<script>
  import axios from 'axios'
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {buildDetail,buildAdd,buildEdit} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  import violationView from "./violation";
  let markerTool;
  export default {
    name: 'parameterView',
    directives: { waves },
    mixins: [map],
    components: {
      draggable,
      Pagination,
      SingleImage,
      violationView
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
        dialogViolationVisible: false,
        violationData:{},
        temp: {
          building_name:'',
          building_type:'',
          construction_name:'',
          construction_person:'',
          construction_relation:'',
          roadwork:'',
          roadwork_person:'',
          roadwork_relation:'',
          build_check_start_time:'',
          build_check_end_time:'',
          images:'',
          address:'',
          valid_start:'',
          valid_end:'',
          lat:'30.20835',
          log:'120.21194',
        },
        images:'',
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
      isCanView() {
        return this.paraData.operatorType == "view";
      },
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
      dataTime: {
        get () {
          if (this.temp.valid_start && this.temp.valid_end) {
            return [this.temp.valid_start, this.temp.valid_end];
          } else {
            return [];
          }
        },
        set (v) {
          if (v) {
            this.temp.valid_start = v[0];
            this.temp.valid_end = v[1];
          } else {
            this.temp.valid_start = "";
            this.temp.valid_end = "";
          }
        },
      },
      timeOne: {
        get () {
          if (this.temp.build_check_start_time && this.temp. build_check_end_time) {
            return [this.temp.build_check_start_time, this.temp. build_check_end_time];
          } else {
            console.log('4444')
            return null;
          }
        },
        set (v) {
          if (v) {
            this.temp.build_check_start_time = v[0];
            this.temp. build_check_end_time = v[1];
          } else {
            this.temp.build_check_start_time = "";
            this.temp. build_check_end_time = "";
          }
        },
      },
    },
    methods: {
      handleViolation(id){
        this.dialogViolationVisible = true;
        this.violationData = {
          id:id
        }
      },
      getAddress(val){
        let  that = this;
        console.log(val)
        let config = {
          pageCapacity: 10,	//每页显示的数量
          onSearchComplete: localSearchResult	//接收数据的回调函数
        };
        //创建搜索对象
        let localsearch = new T.LocalSearch(that.map, config);
        //清空地图及搜索列表
        // function clearAll() {
        //   this.map.clearOverLays();
        // }
        function localSearchResult(result) {
          console.log('调用')
          //清空地图及搜索列表
          // clearAll();

          //添加提示词
          // prompt(result);
          //解析点数据结果
          function pois(obj) {
            console.log('带大的pois')
            if (obj) {
              //显示搜索列表
              var divMarker = document.createElement("div");
              //坐标数组，设置最佳比例尺时会用到
              var zoomArr = [];
              for (var i = 0; i < 1; i++) {
                // console.log('收到')
                //闭包
                (function (i) {
                  console.log(obj)
                  //名称
                  let name = obj[i].name;
                  //地址
                  let address = obj[i].address;
                  //坐标
                  let lnglatArr = obj[i].lonlat.split(" ");
                  let lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                  console.log('haodehaode ')
                  console.log(lnglat)
                  that.temp.lat = lnglatArr[0];
                  that.temp.log = lnglatArr[1];

                  let winHtml = "名称:" + name + "<br/>地址:" + address;

                  // //创建标注对象
                  let marker = new T.Marker(lnglat);
                  // //地图上添加标注点
                  // that.map.addOverLay(marker);
                  that.positionBtn(lnglat);
                  //注册标注点的点击事件
                  let markerInfoWin = new T.InfoWindow(winHtml, {autoPan: true});
                  marker.addEventListener("click", function () {
                    marker.openInfoWindow(markerInfoWin);
                  });

                  zoomArr.push(lnglat);

                  //在页面上显示搜索的列表
                  let a = document.createElement("a");
                  a.href = "javascript://";
                  a.innerHTML = name;
                  a.onclick = function () {
                    showPosition(marker, winHtml);
                  }
                  divMarker.appendChild(document.createTextNode((i + 1) + "."));
                  divMarker.appendChild(a);
                  divMarker.appendChild(document.createElement("br"));
                })(i);
              }
              //显示地图的最佳级别
              that.map.setViewport(zoomArr);
              //显示搜索结果
              // divMarker.appendChild(document.createTextNode('共' + localsearch.getCountNumber() + '条记录，分' + localsearch.getCountPage() + '页,当前第' + localsearch.getPageIndex() + '页'));
              // document.getElementById("searchDiv").appendChild(divMarker);
              // document.getElementById("resultDiv").style.display = "block";
            }
          }

          //根据返回类型解析搜索结果
          switch (parseInt(result.getResultType())) {
            case 1:
              //解析点数据结果
              pois(result.getPois());
              break;
            case 2:
              //解析推荐城市
              statistics(result.getStatistics());
              break;
            case 3:
              //解析行政区划边界
              area(result.getArea());
              break;
            case 4:
              //解析建议词信息
              suggests(result.getSuggests());
              break;
            case 5:
              //解析公交信息
              lineData(result.getLineData());
              break;
          }
        }
        //显示信息框
        function showPosition(marker, winHtml) {
          var markerInfoWin = new T.InfoWindow(winHtml, {autoPan: true});
          marker.openInfoWindow(markerInfoWin);
        }

        //解析推荐城市
        function statistics(obj) {
          if (obj) {
            //坐标数组，设置最佳比例尺时会用到
            var pointsArr = [];
            var priorityCitysHtml = "";
            var allAdminsHtml = "";
            var priorityCitys = obj.priorityCitys;
            if (priorityCitys) {
              //推荐城市显示
              priorityCitysHtml += "在中国以下城市有结果<ul>";
              for (var i = 0; i < priorityCitys.length; i++) {
                priorityCitysHtml += "<li>" + priorityCitys[i].name + "(" + priorityCitys[i].count + ")</li>";
              }
              priorityCitysHtml += "</ul>";
            }

            var allAdmins = obj.allAdmins;
            if (allAdmins) {
              allAdminsHtml += "更多城市<ul>";
              for (var i = 0; i < allAdmins.length; i++) {
                allAdminsHtml += "<li>" + allAdmins[i].name + "(" + allAdmins[i].count + ")";
                var childAdmins = allAdmins[i].childAdmins;
                if (childAdmins) {
                  for (var m = 0; m < childAdmins.length; m++) {
                    allAdminsHtml += "<blockquote>" + childAdmins[m].name + "(" + childAdmins[m].count + ")</blockquote>";
                  }
                }
                allAdminsHtml += "</li>"
              }
              allAdminsHtml += "</ul>";
            }
            // document.getElementById("statisticsDiv").style.display = "block";
            // document.getElementById("statisticsDiv").innerHTML = priorityCitysHtml + allAdminsHtml;
            console.log(priorityCitysHtml + allAdminsHtml)
          }
        }

        //解析行政区划边界
        function area(obj) {
          if (obj) {
            if(obj.points){
              //坐标数组，设置最佳比例尺时会用到
              var pointsArr = [];
              var points = obj.points;
              for (var i = 0; i < points.length; i++) {
                var regionLngLats = [];
                var regionArr = points[i].region.split(",");
                for (var m = 0; m < regionArr.length; m++) {
                  var lnglatArr = regionArr[m].split(" ");
                  var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                  regionLngLats.push(lnglat);
                  pointsArr.push(lnglat);
                }
                //创建线对象
                var line = new T.Polyline(regionLngLats, {
                  color: "blue",
                  weight: 3,
                  opacity: 1,
                  lineStyle: "dashed"
                });
                //向地图上添加线
                this.map.addOverLay(line);
              }
              //显示最佳比例尺
              this.map.setViewport(pointsArr);
            }
            if(obj.lonlat){
              var regionArr = obj.lonlat.split(",");
              that.map.panTo(new T.LngLat(regionArr[0], regionArr[1]));
            }
          }
        }

        //解析建议词信息
        function suggests(obj) {
          if (obj) {
            //建议词提示，如果搜索类型为公交规划建议词或公交站搜索时，返回结果为公交信息的建议词。
            var suggestsHtml = "建议词提示<ul>";
            for (var i = 0; i < obj.length; i++) {
              suggestsHtml += "<li>" + obj[i].name + "&nbsp;&nbsp;<font style='color:#666666'>" + obj[i].address + "</font></li>";
            }
            suggestsHtml += "</ul>";
            document.getElementById("suggestsDiv").style.display = "block";
            document.getElementById("suggestsDiv").innerHTML = suggestsHtml;
          }
        }

        //解析公交信息
        function lineData(obj) {
          if (obj) {
            //公交提示
            var lineDataHtml = "公交提示<ul>";
            for (var i = 0; i < obj.length; i++) {
              lineDataHtml += "<li>" + obj[i].name + "&nbsp;&nbsp;<font style='color:#666666'>共" + obj[i].stationNum + "站</font></li>";
            }
            lineDataHtml += "</ul>";
            // document.getElementById("lineDataDiv").style.display = "block";
            // document.getElementById("lineDataDiv").innerHTML = lineDataHtml;
          }
        }

        localsearch.search(val);
      },
      onLoad() {
        let T = window.T;
        this.map = new T.Map('mapDiv');
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom); // 设置显示地图的中心点和级别
        // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
        //创建标注工具对象
        markerTool = new T.MarkTool(this.map, {follow: true});
        // lnglat
        let lnglat = new T.LngLat(this.temp.log,this.temp.lat);
        this.positionBtn(lnglat);
      },
      positionBtn(lnglat) {
        this.map.clearOverLays();   //清理地图上的覆盖物
        console.log('经纬度')
        // console.log(this.temp.log,this.temp.lat)
        let marker = new T.Marker(lnglat); //e.lnglat，标注点的地理坐标
        this.map.addOverLay(marker); //addOverLay方法，将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次。
        marker.addEventListener("dragend", overlay_style); //添加事件监听函数。
        marker.enableDragging(); //开启标注拖拽功能
        let that = this;
        function overlay_style(e) {
          let p = e.target;
          console.log(e)
          axios({
            url:"http://api.tianditu.gov.cn/geocoder",
            method:'get',
            params:{
              tk:"09c212e85ea968b8789e2111963c819a",
              type:"geocode",
              postStr:"{'lon':" +p.getLngLat().lng+",'lat':" +p.getLngLat().lat+",'ver':1}"
            }
          }).then((data)=>{
            // var addressdata = eval("("+data+")");
            //弹出的就是地址信息
            console.log('98888')

            console.log(data.data.result)
            that.temp.address = data.data.result.addressComponent.address
            that.temp.log = data.data.result.location.lon
            that.temp.lat = data.data.result.location.lat
            console.log(that.temp)
            // alert(addressdata.result.formatted_address);
            // if(addressdata.msg =="ok" && addressdata.status ==0){
            //   //dosomething
            // }else{
            //   //dosomething
            // }
          }).catch((err) => {
            console.log(err)
            // alert("获取失败");
          })
        }
      },
      hasImgSrc(val) {
        this.temp.images = val.url;
        this.images = val.images
      },
      open(){

        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        this.$nextTick(function() {
          this.onLoad();
        })

      },
      close(){
        this.map= ''; // 对象
        this.zoom= 12; // 地图的初始化级别，及放大比例
        this.centerLatitude='30.20835';//中心纬度
        this.centerLongitude='120.21194';//中心经度
        this.paraLoading=false;
        this.temp= {
          building_name:'',
          building_type:'',
          construction_name:'',
          construction_person:'',
          construction_relation:'',
          roadwork:'',
          roadwork_person:'',
          roadwork_relation:'',
          build_check_start_time:'',
          build_check_end_time:'',
          images:'',
          address:'',
          valid_start:'',
          valid_end:'',
          lat:'30.20835',
          log:'120.21194',
        };
        this.paraLoading=false;
        this.dialogStatus= '';
      },
      getView(){
        buildDetail({id:this.paraData.id}).then(res=>{
          const { id, building_name, building_type, construction_name, construction_person, construction_relation,roadwork,
            roadwork_person,roadwork_relation,build_check_time,images,address,valid_start,valid_end,lat,log,break_rules_count,build_check_start_time,
            build_check_end_time,} = res.data;
          this.temp = {id, building_name, building_type, construction_name, construction_person, construction_relation,roadwork,
            roadwork_person,roadwork_relation,build_check_time,images,address,valid_start,valid_end,lat,log,break_rules_count,build_check_start_time,
            build_check_end_time,}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            let temp = JSON.parse(JSON.stringify(this.temp));
            temp.images = this.images;
            buildAdd(temp).then((res) => {
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
            if(this.images != ''){
              temp.images = this.images;
            }
            buildEdit(temp).then((res) => {
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
