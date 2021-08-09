<template>
  <div class="app-container">
    <ul class="drive_ul">
      <li><router-link to='/dataAcquisition/digital'>数字城管</router-link></li>
      <li><router-link to='/dataAcquisition/letter'>信访投诉</router-link></li>
    </ul>
  </div>
</template>

<script>
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./digital/components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,

    },
    data() {
      return {

      }
    },

    mounted() {

    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .app-container{
    height: calc(100vh - 135px);
    overflow: auto;
    box-sizing: border-box;
  }
  .drive_ul{
    li{
      display: inline-block;
      padding: 10px 20px;
      border-radius: 10px;
      background: rgb(238,238,238);
      margin-right: 20px;
    }

  }
</style>
