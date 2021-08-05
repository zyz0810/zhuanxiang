<template>
  <div class="app-container">
    <div class="flex" style=" align-items:stretch;">
      <ul class="gird_list" style="width: 260px;">
        <li class="f18 bold text-center mt_10 mb_10">网格列表</li>
        <p class="text-center">
          <el-select v-model="gridType">
            <el-option label="街道-社区" :value="0"></el-option>
            <el-option label="执法中队" :value="1"></el-option>
            <el-option label="市容道路环卫" :value="2"></el-option>
            <el-option label="市政道路养护" :value="3"></el-option>
            <el-option label="市政绿化养护" :value="4"></el-option>
            <el-option label="河道养护" :value="5"></el-option>
          </el-select>
        </p>
        <p class="text-center"><el-button icon="el-icon-plus" class="mb_10 mt_10" @click="handleOne(gridType)">新 建</el-button></p>
        <el-collapse accordion v-show="gridType == 0">
          <el-collapse-item v-for="(item,index) in streetList" :key="index" class="mb_20">
            <template slot="title">
              <div class="weui-cell gridNav_one f16">
                <div class="weui-cell__hd"><span class="tag block clr_white">{{index}}</span></div>
                <div class="weui-cell__bd">{{item.name}}</div>
                <div class="weui-cell__ft"><i class="el-icon-circle-plus-outline f20 bold" @click.stop="handleCommunity"></i></div>
              </div>
            </template>
            <div class="gridNav_two f14">
              <p v-for="items in item.children" :key="items.id">{{items.name}}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse accordion v-show="gridType == 1">
          <el-collapse-item v-for="(item,index) in list1" :key="index" class="mb_20">
            <template slot="title">
              <div class="weui-cell gridNav_one f16">
                <div class="weui-cell__hd"><span class="tag block clr_white">{{index}}</span></div>
                <div class="weui-cell__bd">{{item.name}}</div>
                <div class="weui-cell__ft"><i class="el-icon-circle-plus-outline f20 bold"></i></div>
              </div>
            </template>
            <div class="gridNav_two f14">
              <p v-for="items in item.children" :key="items.id">{{items.name}}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse accordion v-show="gridType == 2 || gridType == 3 || gridType == 4 || gridType == 5">
          <el-collapse-item v-for="(item,index) in list2" :key="index" class="mb_20">
            <template slot="title">
              <div class="weui-cell gridNav_one f16">
                <div class="weui-cell__hd"><span class="tag block clr_white">{{index}}</span></div>
                <div class="weui-cell__bd">{{item.name}}</div>
                <div class="weui-cell__ft"><i class="el-icon-circle-plus-outline f20 bold"></i></div>
              </div>
            </template>
            <div class="gridNav_two f14">
              <p v-for="items in item.children" :key="items.id">{{items.name}}</p>
            </div>
          </el-collapse-item>
        </el-collapse>


        <!--<li v-for="(item,index) in streetList" :key="index" class="mb_20">-->
          <!--<div class="weui-cell gridNav_one f16">-->
            <!--<div class="weui-cell__hd"><span class="tag inlineBlock clr_white">{{index}}</span></div>-->
            <!--<div class="weui-cell__bd">{{item.name}}</div>-->
            <!--<div class="weui-cell__ft"><i class="el-icon-circle-plus-outline f20 bold"></i></div>-->
          <!--</div>-->
          <!--<div class="gridNav_two f14">-->
            <!--<p v-for="items in item.children" :key="items.id">{{items.name}}</p>-->
          <!--</div>-->
        <!--</li>-->
      </ul>
      <div style="flex:1;height: 987px;">
        <div id='mapDiv' class="mapDiv"></div>
        <div class="map_info f14 text-center">
          <el-button type="primary" class="btn_blue02">画风格</el-button>
          <el-button type="primary" class="btn_blue02">清除</el-button>
          <el-button type="primary" class="btn_blue02">还原</el-button>
          <el-button type="primary" class="btn_blue02">保存</el-button>
        </div>
      </div>
      <addStreet :showDialog.sync="showStreetDialog" :viewData="viewData"></addStreet>
      <addCommunity :showDialog.sync="showCommunityDialog" :viewData="viewData"></addCommunity>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import addStreet from "./components/street";
  import addCommunity from "./components/community";
  import point01 from '@/assets/image/point01.png' // 引入刚才的map.js 注意路径
  import point05 from '@/assets/image/point05.png' // 引入刚才的map.js 注意路径
  import LineChart from '@/components/Charts/LineChart'
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  export default {
    name: 'parameterList',
    directives: {waves},
    mixins: [map],
    components: {
      draggable,
      Pagination,
      addStreet,
      addCommunity,
      LineChart
    },
    data() {
      return {
        viewData:{},
        showStreetDialog:false,
        showCommunityDialog:false,
        gridType: 0,
        activeName:'first',
        videoSwitch:true,
        videoSwitch2:false,
        streetList: [{
          id:0,
          name:'浦沿街道',
          children:[{
            id:1,
            name:'西陵社区'
          },{
            id:2,
            name:'水电社区'
          }],
        },{
          id:3,
          name:'西兴街道',
          children:[{
            id:4,
            name:'西兴社区2'
          },{
            id:5,
            name:'水电社区2'
          }],
        },{
          id:6,
          name:'长河街道',
          children:[{
            id:7,
            name:'西陵社区3'
          },{
            id:8,
            name:'水电社区3'
          }],
        },],
        list1:[{
          id:0,
          name:'浦沿中队',
        },{
          id:1,
          name:'西兴中队',
        },{
          id:2,
          name:'长河中队',
        }],
        list2: [{
          id:0,
          name:'养护单位1',
          children:[{
            id:1,
            name:'火炬大道'
          },{
            id:2,
            name:'火炬大道南段'
          }],
        },{
          id:3,
          name:'养护单位2',
          children:[{
            id:4,
            name:'火炬大道2'
          },{
            id:5,
            name:'火炬大道南段2'
          }],
        },{
          id:6,
          name:'养护单位3',
          children:[{
            id:7,
            name:'火炬大道3'
          },{
            id:8,
            name:'火炬大道南段3'
          }],
        },],
        showSearchDialog:false,
        showCompanyDialog:false,
        total:1,
        companyList: [{
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
          status:2
        }],
        companyListLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        temp:{
          area:'',
          name:''
        },
        zoom:12,
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        activeId:'',
        listLoading: false,
      }
    },

    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '未审核', 1: '已审核'}
        return StatusArr[value]
      },
      filtersType: function (value) {
        let StatusArr = {0: '店外经营', 1: '违规撑伞', 2: '流动摊点', 3: '沿街晾晒'}
        return StatusArr[value]
      },
      filtersSource: function (value) {
        let StatusArr = {0: '其它', 1: '滨康二区',}
        return StatusArr[value]
      },
    },
    mounted() {
      this.onLoad()
    },
    methods: {
      handleOne(type){
        if(type == 0){
          this.showStreetDialog = true;
        }
      },
      handleCommunity(){
        this.showCommunityDialog = true;
      },
      companyShow(){

      },
      handleFilter(){

      },
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // 添加地图类型控件
        // this.addCtrl()
        // // 普通标注
        let site = [
          { lng: 117.283042, lat: 31.86119 },
          { lng: 116.41238, lat: 40.07689 },
          { lng: 116.34143, lat: 40.03403 },
        ]
        // this.markerPoint(site)
        //创建图片对象
        var icon01 = new T.Icon({
          iconUrl: point05,
          iconSize: new T.Point(30, 51),
          iconAnchor: new T.Point(34, 59)
        });
        // var icon02 = new T.Icon({
        //   iconUrl: point02,
        //   iconSize: new T.Point(66, 59),
        //   iconAnchor: new T.Point(34, 59)
        // });
        // var icon03 = new T.Icon({
        //   iconUrl: point03,
        //   iconSize: new T.Point(66, 59),
        //   iconAnchor: new T.Point(34, 59)
        // });
        // var icon04 = new T.Icon({
        //   iconUrl: point04,
        //   iconSize: new T.Point(66, 59),
        //   iconAnchor: new T.Point(34, 59)
        // });
        //创建信息窗口对象
        // let marker = new T.Marker(new T.LngLat(117.283042, 31.86119));// 创建标注
        // let marker = new T.Marker(new T.LngLat(this.centerLongitude, this.centerLatitude), {icon: icon});// 创建标注
        // this.map.addOverLay(marker);
        var infoWin1 = new T.InfoWindow();
        let sContent =
          '<ul class="img_list w100"><li> <div class="img_list_top clr_white">' +
          '<img class="img_list_img" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg">' +
          '<span class="block f15 type_tag">暴露垃圾</span>' +
          ' <p class="f15 time">2021-05-05 21:10:50</p>' +
          '</div>' +
          '<div class="weui-cell f15">' +
          '<div class="weui-cell__bd"> <p>报警点位：</p><p>滨江区195号</p></div>' +
          '<div class="weui-cell__ft"> <span class="block ml_20 baseColor bold state_type">未审核</span> </div>' +
          '</div>' +
          '</li>' +
          '</ul>';
        infoWin1.setContent(sContent);
        // 随机向地图添加25个标注
        let bounds = this.map.getBounds();
        let sw = bounds.getSouthWest();
        let ne = bounds.getNorthEast();
        let lngSpan = Math.abs(sw.lng - ne.lng);
        let latSpan = Math.abs(ne.lat - sw.lat);
        var markers = []
        for (let i = 0; i < 12; i++) {
          // var marker

          let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
          console.log(point)
          markers[i]  = drawTMaker(point, icon01,this);
          // marker = new T.Marker(point, {icon: icon01});// 创建标注
          // this.map.addOverLay(marker);

        }

//往地图上添加一个marker。传入参数坐标信息lnglat。传入参数图标信息。
        function drawTMaker(lnglat,icon,that){
          var marker =  new T.Marker(lnglat, {icon: icon});
          that.map.addOverLay(marker);
          marker.addEventListener("click", function (m) {
            console.log(m)
            marker.openInfoWindow(infoWin1);
            that.showSearchDialog = true;
          });// 将标注添加到地图中
          return marker;
        }





        // this.map.setStyle('indigo');
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';

      },
      handleTab(val){
        this.activeId = val;
      }

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
