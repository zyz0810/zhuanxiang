<template>
  <div class="app-container">
    <div class="flex" style=" align-items:stretch;">
      <ul class="gird_list" style="width: 260px;">
        <li class="f18 bold text-center mt_10 mb_10">网格列表</li>
        <p class="text-center">
          <el-select v-model="gridType" @change="getCategoryList(gridType)">
            <el-option v-for="item in firstCategory" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </p>
        <p class="text-center"><el-button icon="el-icon-plus" class="mb_10 mt_10" @click="handleOne(gridType)">新 建</el-button></p>
        <el-collapse accordion>
          <el-collapse-item v-for="(item,index) in secondCategory" :key="item.id" class="mb_20">
            <template slot="title">
              <div class="weui-cell gridNav_one f16">
                <div class="weui-cell__hd"><span class="tag block clr_white">{{index}}</span></div>
                <div class="weui-cell__bd">{{item.name}}</div>
                <div class="weui-cell__ft"><i class="el-icon-circle-plus-outline f20 bold" @click.stop="handleCommunity"></i></div>
              </div>
            </template>
            <div class="gridNav_two f14">
              <p v-for="items in item.list" :key="items.id">{{items.name}}</p>
            </div>
          </el-collapse-item>
        </el-collapse>

      </ul>
      <div style="flex:1;" class="mapContent">
        <div id='mapDiv' class="mapDiv"></div>
        <div class="map_info f14 text-center">
          <!--<el-button type="primary" class="btn_blue02" @click="openPolygonTool">画网格</el-button>-->
          <el-button type="primary" class="btn_blue02" @click="aa">画网格</el-button>
          <!--<el-button type="primary" class="btn_blue02" @click="editPolygonTool">编辑网格</el-button>-->
          <el-button type="primary" class="btn_blue02" @click="cc">编辑网格</el-button>
          <el-button type="primary" class="btn_blue02">清除</el-button>
          <el-button type="primary" class="btn_blue02">还原</el-button>
          <!--<el-button type="primary" class="btn_blue02" @click="drawPolygonByPoint">保存</el-button>-->
          <el-button type="primary" class="btn_blue02" @click="bb">保存</el-button>
        </div>
      </div>
      <addStreet :showDialog.sync="showStreetDialog" :viewData="viewData"></addStreet>
      <addCommunity :showDialog.sync="showCommunityDialog" :viewData="viewData"></addCommunity>
    </div>
  </div>
</template>

<script>
  import {getFirstCategory,getCategoryList, getGps, addGps, lightList,} from '@/api/data'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import addStreet from "./components/street";
  import addCommunity from "./components/community";
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  var polygonTool;
  var PolygonPoints=[];  //保存所画坐标
  // let polygonTool;//矩形工具
  var polygon; //画的矩形
  var mapclick="";//地图点击事件。
  export default {
    name: 'gridManageList',
    directives: {waves},
    mixins: [map],
    components: {
      draggable,
      Pagination,
      addStreet,
      addCommunity,
    },
    data() {
      return {
        firstCategory:[],
        secondCategory:[],
        viewData:{},
        showStreetDialog:false,
        showCommunityDialog:false,
        gridType: 0,
        zoom:12,
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        polygonTool:[],
        pointList:[],
        editMap:false,
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },

    mounted() {
      this.onLoad();
      this.getFirstCategory();
    },
    methods: {
      getGps(id){
        getGps({category_id:id}).then(res=>{

        });
      },
      getFirstCategory(){
        getFirstCategory().then(res=>{
          // const { id, province, city, area, principal, mobile,} = res.data;
          this.firstCategory = res.data;
          this.gridType = res.data[0].id;
          this.getCategoryList(res.data[0].id);
          this.getGps(res.data[0].id);
        });
      },
      getCategoryList(id){
        getCategoryList({parent_ids:id}).then(res=>{
          // const { id, province, city, area, principal, mobile,} = res.data;
          this.secondCategory = res.data;
        });
      },

      handleOne(type){
        this.showStreetDialog = true;
        this.viewData = {
          id:type,
        }
      },
      handleCommunity(){
        this.showCommunityDialog = true;
      },

      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // 添加地图类型控件
        // this.addCtrl()
        //
        // // 随机向地图添加25个标注
        // let bounds = this.map.getBounds();
        // let sw = bounds.getSouthWest();
        // let ne = bounds.getNorthEast();
        // let lngSpan = Math.abs(sw.lng - ne.lng);
        // let latSpan = Math.abs(ne.lat - sw.lat);
        // var points = [];
        // for (let i = 0; i < 5; i++) {
        //   // var marker
        //   let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
        //   points.push(point)
        // }
        // //创建面对象
        // var polygon = new T.Polygon(points,{
        //   color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
        // });
        // //向地图上添加面
        // this.map.addOverLay(polygon);


        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
      },
      aa(){
        //绘制多边形
        let that = this;
        drawPolygon()
        this.pointList = [];
        function drawPolygon(){

          var config = {
            strokeColor:"#000",	//折线颜色
            fillColor:"#000000",	//填充颜色。当参数为空时，折线覆盖物将没有填充效果
            strokeWeight:"30px",	//折线的宽度，以像素为单位
            strokeOpacity:0.5,	//折线的透明度，取值范围0 - 1
            fillOpacity:1,	//填充的透明度，取值范围0 - 1
            showLabel:false     //是否显示页面，默认为true.
          };
          //创建测面工具对象
          polygonTool = new T.PolygonTool(that.map,config);
          // map.clearOverLays();
          polygonTool.open();
          //绑定draw事件 用户双击完成一次折线绘制时触发事件。
          polygonTool.addEventListener("draw",getPoints4);
        }

        function getPoints4(e){
          //用户当前绘制的多边形的点坐标数组
          console.log(e.currentLnglats);
          console.log("用户最后绘制的多边形的地理面积:"+e.currentArea);
          that.pointList = e.currentLnglats;
          console.log(that.pointList)
        }
      },
      // 点击保存（第二版）
      bb(){　//根据点坐标来画多边形

        // if(polygon!=''){
        //   this.map.removeOverLay(polygon);
        // }
        polygonTool.close();
        if (this.editMap==true){
          polygon.disableEdit();
          this.editMap=false;
        }


        console.log(this.pointList);
        if(this.pointList.length!=0){
          for(let i=0;i<this.pointList.length;i++){
            addGps({category_id:1,type:1,lat:this.pointList[i].lat,log:this.pointList[i].lng}).then(res=>{

            });
          }

          //创建面对象
          polygon = new T.Polygon(this.pointList,{strokeColor:"red", strokeWeight:20, strokeOpacity:0.5, fillOpacity:0.5});//向地图上添加面
          this.map.addOverLay(polygon);
          console.log(polygon)

        }else{
          alert("还没有绘制！");
        }
      },
      cc(){
        this.editMap=true;
        polygon.enableEdit();

        console.log(polygon)
      },

      openPolygonTool(){
        let that = this;
        // let PolygonPoints=[];  //保存所画坐标
        // // let polygonTool;//矩形工具
        // let polygon; //画的矩形
        // let mapclick="";//地图点击事件。
        //加载多边形测距工具。
        loadPolygonTool();
        drawPolygon();
        //加载多边形测距工具。
        function loadPolygonTool(){
          var config = {
            strokeColor:"#000",	//折线颜色
            fillColor:"#000000",	//填充颜色。当参数为空时，折线覆盖物将没有填充效果
            strokeWeight:"30px",	//折线的宽度，以像素为单位
            strokeOpacity:0.5,	//折线的透明度，取值范围0 - 1
            fillOpacity:1,	//填充的透明度，取值范围0 - 1
            showLabel:false     //是否显示页面，默认为true.
          };
          //创建测面工具对象
          polygonTool = new T.PolygonTool(that.map,config);
          //注册测面工具绘制完成后的事件
          // TEvent.addListener(polygonTool,"draw",onDrawPolygon);
          // that.map.addEventListener("dblclick",onDrawPolygon);
          // that.map.addEventListener("draw",onDrawPolygon);
          polygonTool.addEventListener("draw",onDrawPolygon);
        }

        //关闭测面工具时触发
        function onDrawPolygon(bounds,line) {
          console.log('面关闭事件')
          // polygonTool.close();
          PolygonPoints.length=PolygonPoints.length-2;//最后双击会把最后一个坐标保存两次。
          // TEvent.removeListener(mapclick);//关闭单击事件（保存坐标）
          that.map.removeEventListener("click",mapclick);
        }
        //绘制多边形
        function drawPolygon() {
          // polygonTool.clear();//清除所画的多边形
          PolygonPoints=[]
          console.log('重新划线')
          console.log(PolygonPoints)
          // that.map.clearOverLays();
          polygonTool.open();
          // PolygonPoints.length=0;  //清零保存的坐标
          if(mapclick!=""){
            // TEvent.removeListener(mapclick); //避免加载多次点击事件
            that.map.removeEventListener("click",mapclick);
            // that.map.addEventListener("dblclick",onDrawPolygon);
          }

          mapclick = that.map.addEventListener("click",function(p){
            // polygonTool.open();
            console.log(p)

            // var lnglat = that.map.fromContainerPixelToLngLat(p);//获取点击处的坐标
            var lnglat = p.lnglat;//获取点击处的坐标
            PolygonPoints.push(lnglat.getLng());
            PolygonPoints.push(lnglat.getLat());
            console.log(lnglat.getLng())
            console.log(lnglat.getLat())
            console.log(PolygonPoints)
            // if(PolygonPoints.length>20){
            //   alert("不能超过10个点！请重新选择范围。");
            //   polygonTool.close();
            //   PolygonPoints.length=0;
            //   // TEvent.removeListener(mapclick);
            //   that.map.removeEventListener("click",mapclick);
            // }
          });
          // drawPolygonByPoint();
        }
        //根据已有坐标组来画一个多边形。
        function  drawPolygonByPoint(){　//根据点坐标来画多边形
          console.log(PolygonPoints)
          that.map.removeOverLay(polygon);
          var points = [];

          if(PolygonPoints.length!=0){
            for(var i=0;i<PolygonPoints.length;i=i+2){
              points.push(new TLngLat(PolygonPoints[i],PolygonPoints[i+1]));
            }
            //创建面对象
            polygon = new TPolygon(points,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5, fillOpacity:0.5});//向地图上添加面
            that.map.addOverLay(polygon);
          }else{
            alert("没有选择电子栅栏！");
          }

        }
      },
      // 点击保存
      drawPolygonByPoint(){　//根据点坐标来画多边形
        console.log('点击地图')
        console.log(mapclick)
        console.log(PolygonPoints)
        // if(polygon!=''){
        //   this.map.removeOverLay(polygon);
        // }
        polygonTool.close();
        this.map.removeEventListener("click",mapclick);
        let points = [];
        if(PolygonPoints.length!=0){
          for(var i=0;i<PolygonPoints.length;i=i+2){
            points.push(new T.LngLat(PolygonPoints[i],PolygonPoints[i+1]));
          }
          //创建面对象
          polygon = new T.Polygon(points,{strokeColor:"red", strokeWeight:20, strokeOpacity:0.5, fillOpacity:0.5});//向地图上添加面
          this.map.addOverLay(polygon);
        }else{
          alert("没有选择电子栅栏！");
        }
      },
      // openPolygonTool(){
      //   var config = {
      //     showLabel: true,
      //     color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
      //   };
      //   //创建标注工具对象
      //   polygonTool = new T.PolygonTool(this.map, config);
      //   polygonTool.open();
      //
      //   this.map.addEventListener("click",MapClick);
      //   let points = [];
      //   function MapClick(e)
      //   {
      //     console.log(e)
      //     points.push(new T.LngLat(e.lnglat.getLng(), e.lnglat.getLat()));
      //     console.log(points)
      //   }
      //
      //
      //   //创建面对象
      //   let polygon = new T.Polygon(points, {
      //     color: "blue",
      //     weight: 5,
      //     opacity: 0.5,
      //     fillColor: "#FFFFFF",
      //     fillOpacity: 0.5
      //   });
      //   //向地图上添加面
      //   this.map.addOverLay(polygon);
      //
      //   // console.log(polygonTool)
      //   // polygonTool.enableEdit();
      //
      //   this.polygonTool.push(polygon)
      // },

      editPolygonTool(){


        console.log(polygon)
        polygon.enableEdit();
        // for(let i = 0;i<this.polygonTool.length;i++){
        //   this.polygonTool[i].enableEdit();
        // }

        //
        // let points = [];
        // points.push(new T.LngLat(116.41136, 39.97569));
        // points.push(new T.LngLat(116.411794, 39.9068));
        // points.push(new T.LngLat(116.32969, 39.92940));
        // points.push(new T.LngLat(116.385438, 39.90610));
        // //创建面对象
        // let polygon = new T.Polygon(points, {
        //   color: "blue",
        //   weight: 5,
        //   opacity: 0.5,
        //   fillColor: "#FFFFFF",
        //   fillOpacity: 0.5
        // });
        // //向地图上添加面
        // this.map.addOverLay(polygon);
        //
        // // console.log(polygonTool)
        // polygonTool.enableEdit();






      },


    }
  }
</script>
<style lang="scss" scoped>
  @import './../../../styles/variables.scss';
  .app-container{
    height: calc(100vh - 110px);
    padding: 10px;
    overflow: auto;
    background: #fff;
    box-sizing: border-box;
  }
  .mapContent{
    height: calc(100vh - 130px);
  }
  /deep/.tdt-infowindow-content p{
    margin: 0;
  }

  /*/deep/.el-tab-pane{*/
  /*  width: 500px;*/
  /*}*/
  .mapDiv {
    width: 100%;
    height: 716px;
  }
  .map_info{
    width: 300px;
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 2000;

    p{
      &:nth-child(1){
        background: #0a76a4;
        border-bottom: 1px solid #0a76a4;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      &:nth-child(2){
        border-bottom: 1px solid #0a76a4;
      }
    }

  }

.gird_list{
  margin-right: 20px;
  .gridNav_one{
    flex: 1;
    padding: 5px;
    /*border-bottom: 1px dotted #ccc;*/
    .tag{
      padding: 0 10px;
      border-radius: 5px;
      background: #0a76a4;
      margin-right: 10px;
      height: 30px;
      line-height: 30px;
    }
  }
  .gridNav_two{
    padding: 10px 0;
    line-height: 2;
    padding-left: 40px;
  }
}

</style>
