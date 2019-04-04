<template>

  <div :style="{'margin-left':1.8+'rem',height:  autoHeight+'px',width:autoWidth+'px'}"style="background:#FFF;margin-top:20px">
    <v-dialog v-model="dialog1" width="500">
      <v-card>
        <v-card-title class="headline primary white--text  "  primary-title>详情提示
        </v-card-title>
        <v-card-text primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">归档失败!
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog1 = false">关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" width="500">
      <v-card>
        <v-card-title class="headline primary white--text  "  primary-title>详情提示
        </v-card-title>
        <v-card-text primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">正在归档中，请稍后查看!
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog2 = false">关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title class="headline">
        目标点列表
        <v-spacer></v-spacer>
        <div >
        <v-text-field
          v-model="search"
          append-icon="search"
          label="关键词搜索"
          single-line
          hide-details
          :style="{width:autoWidth*0.25+'px'}"
        ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="archivalRecordsItems"
        hide-actions
        :loading=loading
        :pagination.sync="pagination"
        headers-length="8"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.targetName }}</td>
          <td>{{ props.item.gmtCreate }}</td>

          <td>{{ props.item.targetLat }}</td>
          <td >{{ props.item.targetLng }}</td>
          <td   class="blue--text" ><div @click="details(props.item.targetLat,props.item.targetLng)"  style="cursor:pointer">{{ props.item.details }}</div></td>
          <td v-if="false" >{{ props.item.targetId }}</td>
        </template>
        <v-alert slot="no-data" :value="true" color="error" icon="warning">
          找不到关于"{{ search }}" 的数据！
        </v-alert>
      </v-data-table>
    </v-card>




  <div class="text-xs-center" style="">
    <v-pagination v-model="page" :length="pageTotal" :total-visible="7"></v-pagination>
  </div>

  </div>
</template>

<script>
    import axios from 'axios'
// import MenuIcon from "vue-material-design-icons/Menu.vue"

// import Qs from 'qs'
// import uploadButton from "./uploadButton";
export default {
      name: 'upload',
      components: {
          // MenuIcon
            // uploadButton
      },
      data () {
        return {
           // aaa:48,
          pagination: {
            sortBy: 'requirementSubmitTime',
            rowsPerPage: 20,
            descending:true
          },
          valueDeterminate: 0,
          showPrise: false,
          showAll: true,
          file: document.getElementById('file'),
          message: '',
          loader: null,
          loading1: false,
          loading2: false,
          loading3: false,
          loading4: false,
          suss: 0,
          open: ['public'],
          files: {
            html: 'mdi-language-html5',
            js: 'mdi-nodejs',
            json: 'mdi-json',
            md: 'mdi-markdown',
            pdf: '../assets/upload.png',
            png: 'mdi-file-image',
            txt: 'mdi-file-document-outline',
            xls: 'mdi-file-excel'
          },
          tree: [],
          items: [],

          search: '',
          headers: [
              {text: '目标名称', align: 'left',  value: 'targetName'},
              { text: '录入时间',  value: 'gmtCreate' },

              { text: '目标点经度', value: 'targetLat' },
              { text: '目标点纬度', value: 'targetLng' },
              { text: '  ', value: 'details' }
          ],
          archivalRecordsItems: [],
          page: 1,
          pageTotal: 15,
          loading: false,
          dialog1: false,
          dialog2: false
            // filename:""
        }
      },

  mounted: function () {
    this.upload( 1, 20,'')
  },
      methods: {

        details: function (a,b) {
          // alert(a);
          // alert(b);
              //this.$router.push('/AdvancedProduct?lng=' + a?)
              let routeUrl = this.$router.resolve({
                path: '/',query:{lng:a,lat:b}
              });
              window.open(routeUrl .href, '_blank');

            // alert(a);
        },
        changeFn: function () {
                // alert("aa");
                // `this` 在方法里指向当前 Vue 实例
          files.click()
            // this.showPrise=true;
            // `event` 是原生 DOM 事件
        },
        upload: function (curPageNum, maxResult,condition) {
          this.loading = true
        // alert("aa");
          axios.get('/api/getTargetListDetail', {
            params: {

              curPageNum: curPageNum,
              maxResult: maxResult,
              condition:condition
            }
          })
                .then(response => {
                  // alert(response);
                  var archiveInfo = []
                  this.pageTotal = response.data.data.totalPageNum
                  for (var i = 0; i < response.data.data.urmTargetInfodtoList.length; i++) {

                    var lat=response.data.data.urmTargetInfodtoList[i].pointGeo.split("[")[1].split("]")[0].split(",")[0];
                    var lng=response.data.data.urmTargetInfodtoList[i].pointGeo.split("[")[1].split("]")[0].split(",")[1];
                    var targetTime=response.data.data.urmTargetInfodtoList[i].gmtCreate.substring(0,10)+" "+response.data.data.urmTargetInfodtoList[i].gmtCreate.substring(11,19)

                    // var lat=response.data.data.urmTargetInfodtoList[i].pointGeo.coordinates[0];
                    // var lng=response.data.data.urmTargetInfodtoList[i].pointGeo.coordinates[1];
                    archiveInfo.push({
                      targetName: response.data.data.urmTargetInfodtoList[i].targetName,
                      gmtCreate: targetTime,



                        targetLat: lat,
                        targetLng: lng,
                        details: '从此目标点录入需求',
                        targetId:response.data.data.urmTargetInfodtoList[i].targetId
                      })
                  }
                  // alert(archiveInfo);
                  this.archivalRecordsItems = archiveInfo
                  this.loading = false
              // archivalRecordsItems=archiveInfo;
                })
                .catch(function (error) {
                  alert(error)
                })
        },
        importFile: function () {
          var selectedFile = document.getElementById('files').files[0]// 获取读取的File对象
          var filename = selectedFile.name
            // alert(filename);
          this.message = filename
            // alert(this.message);
            // console.log(filename);
            // fileReader(selectedFile);
            // `this` 在方法里指向当前 Vue 实例
            // files.click();
          this.showPrise = true
            // `event` 是原生 DOM 事件
        },
        aa: function (a) {
             // alert(this.items);
            // alert( this.items.indexOf(a,0));
          var index = this.items.indexOf(a, 0)
          this.$store.commit('archivalRecordsInfoShowChange', index)
        // alert(a);
        }

      },
      watch: {
        search: {
          handler () {
              // alert("aa");
              // alert(this.page);
              // alert(this.search);
            this.page = 1
            this.upload(1, 20, this.search)
          // this.pageTotal=5;
          }},
        page: {
          handler () {
              // alert("aa");
            // alert(this.page);
            // alert(this.search);
            this.upload( this.page, 20, this.search)
          }},
        loader () {
          const l = this.loader
          this[l] = !this[l]

                // setTimeout(() => (this[l] = false), 3000)

               // this.loader = null
        },
        suss: {
          handler () {
                    // alert("aa");
            const l = this.loader
            this[l] = !this[l]
            this.loader = null
          }
        }
      },
      computed: {
        autoTop () {
          // alert(this.$store.state.archivalRecordsScrollTop1);
          // if(this.$store.state.archivalRecordsScrollTop1>100)
         // {
           // this.aaa=54;
           // return this.$store.state.archivalRecordsScrollTop1 +140;
         // }
         // else {
            // this.aaa=48;
          return this.$store.state.scrollTop + 20
        //  }
        },
        autoWidth () {
          // this.aaa=(this.$store.state.archivalRecordsClientWidth1-1519)/175*(-1)-3.2;
          // alert(this.$store.state.archivalRecordsClientWidth1);
          return this.$store.state.clientWidth - 100
        },
        autoHeight () {
          return this.$store.state.clientHeight - 140
    }
      }
    }
</script>

<style>
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .whitetemp{
      height: 2px;
      width: 650px;
      float: left;
    }
    .page_button{
      height: 34px;
      width: 150px;
      float: left;
    }
    .page_front,.page_next{
      background:#ffffff;
      border:1px solid rgba(0,0,0,0.15);
      border-radius:4px;
      width:30px;
      height:30px;
      float: left;
    }
    .front,.next{
      margin-left: 8px;
      margin-top: 8px;
    }
</style>
