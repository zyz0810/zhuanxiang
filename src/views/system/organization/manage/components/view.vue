<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="6vh"
    title="组织管理"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >

      <el-form-item label="部门名称" prop="department_name">
        <el-input v-model.trim="temp.department_name" placeholder="请输入部门名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="上级部门" prop="parent_id">
        <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
        <el-select v-model="temp.parent_id"  placeholder="选择上级部门" :disabled="true">
          <el-option v-for="item in departmentList" :label="item.department_name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mr_20">
      <el-form-item label="部门地址" prop="address">
        <el-input v-model.trim="temp.address" placeholder="请在地图上选择" autocomplete="off" @input="getAddress" clearable/>
        <div id='mapDiv' class="mapDiv mt_10" style="width: 100%;height: 200px"></div>
      </el-form-item>
      </el-form>
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >
      <el-form-item label="部门电话" prop="phone">
        <el-input v-model.trim="temp.phone" placeholder="请输入部门电话" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="部门负责人" prop="contact">
        <el-input v-model.trim="temp.contact" placeholder="请输入部门负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="负责人手机" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入负责人手机" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="在地图上显示" prop="is_map">
        <el-select v-model="temp.is_map"  placeholder="选择父类型">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="部门大类" prop="big_type">-->
<!--        <el-select v-model="temp.big_type"  placeholder="选择部门大类">-->
<!--          <el-option v-for="(item,index) in bigTypeList" :label="item" :value="index" :key="index"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="部门小类" prop="big_type">-->
<!--        <el-select v-model="temp.big_type"  placeholder="选择部门大类">-->
<!--          <el-option v-for="(item,index) in bigTypeList" :label="item" :value="index" :key="index"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="单位性质" prop="nature">
        <el-input v-model.trim="temp.nature" placeholder="请输入单位性质" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="部门人数" prop="user_num">
        <el-input v-model.trim="temp.user_num" placeholder="请输入部门人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="公务员人数" prop="user_num1">
      <el-input v-model.trim="temp.user_num1" placeholder="请输入公务员人数" autocomplete="off" clearable/>
    </el-form-item>
      <el-form-item label="参公人数" prop="user_num2">
        <el-input v-model.trim="temp.user_num2" placeholder="请输入参公人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="事业编制人数" prop="user_num3">
        <el-input v-model.trim="temp.user_num3" placeholder="请输入事业编制人数" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="协管人数" prop="user_num4">
        <el-input v-model.trim="temp.user_num4" placeholder="请输入协管人数" autocomplete="off" clearable/>
      </el-form-item>
      <!--<el-form-item label="111油烟城区" prop="password">-->
        <!--<el-select v-model="temp.city_id"  placeholder="选择油烟城区">-->
          <!--<el-option label="是" :value="1"></el-option>-->
          <!--<el-option label="否" :value="2"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="部门职责介绍" prop="duty">
      <el-input type="textarea" v-model.trim="temp.duty" placeholder="请输入密码" autocomplete="off" clearable/>
    </el-form-item>
      <el-form-item label="部门简介" prop="remark">
        <el-input type="textarea" v-model.trim="temp.remark" placeholder="请输入密码" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="部门照片" prop="dept_img">
        <SingleImage :tempUrl="temp.dept_img" v-on:imgSrc="hasImgSrc"></SingleImage>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" class="btn_blue02" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>

    </div>


  </myDialog>
</template>

<script>
  import axios from 'axios'
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {departmentAdd, departmentEdit, departmentDetail, bigSmallType, departmentAllList} from '@/api/system'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  let markerTool;
  export default {
    name: 'organizationView',
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
        zoom: 14, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        paraLoading:false,
        temp: {
          department_name:'',
          parent_id:'',
          address:'',
          phone:'',
          contact:'',
          mobile:'',
          is_map:'',
          nature:'',
          user_num:'',
          user_num1:'',
          user_num2:'',
          user_num3:'',
          user_num4:'',
          duty:'',
          remark:'',
          dept_img:'',
          longitude:'120.21194',
          latitude:'30.20835',
        },
        images:'',
        bigTypeList:[],
        smallTypeList:[],
        departmentList:[],
        rules: {
          // city_id: [{ required: true, message: '请选择所属分组', trigger: 'change' }],
          // name: [{ required: true, message: '请输入用户名', trigger: 'change' }],
          // password: [{ required: true, message: '请输入密码', trigger: 'change' }],
          // mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
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
      // big_type
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
                  that.temp.latitude = lnglatArr[0];
                  that.temp.longitude = lnglatArr[1];

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
        let lnglat = new T.LngLat(this.temp.longitude,this.temp.latitude);
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
            that.temp.longitude = data.data.result.location.lon
            that.temp.latitude = data.data.result.location.lat
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
        console.log(this.temp)
        this.temp.dept_img = val.url;
        this.images = val.images
      },
      getBigSmallType(){
        bigSmallType().then(res=>{
          this.bigTypeList = res.data.big_type_list;
        });
        bigSmallType({big_type: 1}).then(res=>{
          this.smallTypeList = res.data.small_type_list;
        });
      },
      getList() {
        departmentAllList(this.listQuery).then(res => {
          this.departmentList = res.data;
          // this.total = res.data.total;
        });
      },
      open(){
        console.log(this.paraData)
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.option.parent == 'child'){
          this.temp.parent_id = this.paraData.option.pId;
        }
        this.getBigSmallType();
        this.getList();

        this.$nextTick(() => {
          this.onLoad();
          // this.$refs['dataForm'].clearValidate()
        })
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.paraLoading=false;
        this.temp= {
          department_name:'',
          parent_id:'',
          address:'',
          phone:'',
          contact:'',
          mobile:'',
          is_map:'',
          nature:'',
          user_num:'',
          user_num1:'',
          user_num2:'',
          user_num3:'',
          user_num4:'',
          duty:'',
          remark:'',
          dept_img:'',
          longitude:'120.21194',
          latitude:'30.20835',
        };
      },
      getView(){
        departmentDetail({id:this.paraData.id}).then(res=>{
          const { id,latitude,longitude, department_name, address,phone,contact,parent_id,mobile,is_map,big_type,nature,user_num,user_num1,user_num2,user_num3,user_num4,duty,remark,dept_img} = res.data
          // let parent_id = res.data.parent_id == 0?'':res.data.parent_id;
          this.temp = { id, department_name,latitude,longitude, parent_id,address,phone,contact,mobile,is_map,big_type,nature,user_num,user_num1,user_num2,user_num3,user_num4,duty,remark,dept_img}
        });
      },

      createData() {
        this.temp.dept_img = this.images;
        console.log(this.temp)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            let temp = JSON.parse(JSON.stringify(this.temp));
            if(this.paraData.option.parent == 'parent'){
              temp.parent_id = 0;
            }
            temp.dept_img = this.images;
            departmentAdd(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.showViewDialog = false;
                this.$emit('insertList');
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
            if(this.paraData.option.parent == 'parent'){
              temp.parent_id = 0;
            }
            temp.dept_img = this.images;
            departmentEdit(temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.showViewDialog = false;
                this.$emit('insertList');
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
