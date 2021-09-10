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
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="140px" class="dialog_form">
      <el-form-item label="小区名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入小区名称" :disabled="paraData.operatorType == 'view'" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="小区负责人" prop="linkman">
        <el-input v-model.trim="temp.linkman" placeholder="请输入小区负责人" :disabled="paraData.operatorType == 'view'" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="负责人电话" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入负责人电话" :disabled="paraData.operatorType == 'view'" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model.trim="temp.address" placeholder="请输入地址" :disabled="paraData.operatorType == 'view'" autocomplete="off" @input="getAddress" clearable/>
        <div id='mapDiv' class="mapDiv mt_10" style="width: 100%;height: 200px;"></div>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" v-if="paraData.operatorType != 'view'" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">保 存</el-button>
    </div>


  </myDialog>
</template>

<script>
  import axios from 'axios'
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {communityDetail,editCommunity} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  let markerTool;
  export default {
    name: 'parameterView',
    directives: { waves },
    mixins: [map],
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
        temp: {
          name:'',
          linkman:'',
          mobile:'',
          address:'',
          log:'120.21194',
          lat:'30.20835',
        },
        dialogStatus: '',
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
          linkman: [{ required: true, message: '请输入小区负责人', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入负责人电话', trigger: 'change' }],
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
        markerTool = new T.MarkTool(this.map, {follow: true});
        this.positionBtn();
      },
      positionBtn() {
        // centerLatitude:'30.20835',//中心纬度
        // centerLongitude:'120.21194',//中心经度
        this.map.clearOverLays();   //清理地图上的覆盖物
        console.log('经纬度')
        console.log(this.temp.log,this.temp.lat)
        let marker = new T.Marker(new T.LngLat(this.temp.log,this.temp.lat)); //e.lnglat，标注点的地理坐标
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
            that.temp.address = data.data.result.addressComponent.address
            that.temp.log = data.data.result.location.lon
            that.temp.lat = data.data.result.location.lat
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
                  console.log(lnglat)
                  that.temp.lat = lnglatArr[0];
                  that.temp.lng = lnglatArr[1];

                  let winHtml = "名称:" + name + "<br/>地址:" + address;

                  //创建标注对象
                  let marker = new T.Marker(lnglat);
                  //地图上添加标注点
                  that.map.addOverLay(marker);
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
      hasImgSrc(val) {
        this.form.imgUrl = val;
      },
      open(){
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        this.$nextTick(function() {
          this.onLoad();
          this.$refs['dataForm'].clearValidate()
        })
      },
      close(){
        this.map= ''; // 对象
        this.zoom= 12; // 地图的初始化级别，及放大比例
        this.centerLatitude='30.20835';//中心纬度
        this.centerLongitude='120.21194';//中心经度
        this.paraLoading=false;
        this.temp= {
          name:'',
          linkman:'',
          mobile:'',
          address:'',
          log:'120.21194',
          lat:'30.20835',
        };
        this.dialogStatus= '';
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      getView(){
        communityDetail({id:this.paraData.id}).then(res=>{
          const { id, name, linkman, mobile, address, log,lat,} = res.data;
          this.temp = { id, name, linkman, mobile, address, log,lat,}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            editCommunity(this.temp).then((res) => {
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
            editCommunity(this.temp).then((res) => {
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
