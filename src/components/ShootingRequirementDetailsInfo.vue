<template>

  <div style="background-color: white;width:103rem" :style="{'width':autoWidth+'px','height':autoHeight+'px','margin-top':  1+'rem','margin-left':autoWidth*0.01+'px' }" v-show=showthis>
    <v-dialog v-model="alertDialog" width="500">
      <v-card>
        <v-card-title class="headline primary white--text  " primary-title>操作提示
        </v-card-title>
        <v-card-text v-html="alertDialogHtml" primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="alertDialog = false">关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" width="500">
      <v-card>
        <v-card-title class="headline primary white--text  "  primary-title>操作提示
        </v-card-title>
        <v-card-text primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">上传过程中禁止操作!
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog1 = false">关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div  :style="{'width':autoWidth+'px','margin-top':  1+'rem','margin-left':autoWidth*0.015+'px','min-height':autoHeight+'px' }" style=" background:#FFF;text-align:center" >
      <div  style="width: 50rem;height:2rem;margin-left: 10rem;background:#FFF;text-align:center"></div>
      <div style="float: left">
        <v-toolbar color="white" class="elevation-1 mt-2" :style="{'width':autoWidth*0.6+'px','margin-left':autoWidth*0.02+'px'}"  style="height:40px; margin-left: 2rem">
          <v-toolbar-title style="margin-top: -25px">基本信息</v-toolbar-title>
          <v-spacer ></v-spacer>
        </v-toolbar>
        <div class="elevation-1" :style="{'width':autoWidth*0.6+'px','margin-left':autoWidth*0.02+'px','height':autoHeight*0.25+'px'}"  style="position:relative;overflow-x:hidden;overflow-y:auto;width:48rem;margin-left: 2rem">


          <p  :style="{'left':autoWidth*0.035+'px','top':(autoHeight-150)/25+'px'}" style="position:absolute; float: left ;" >需求名称</p>
          <p :style="{'left':(autoWidth*0.025+100)+'px','top':(autoHeight-150)/25+'px'}" style=" position:absolute; float: left ;" >:</p>
          <p  :style="{'left':(autoWidth*0.025+120)+'px','top':(autoHeight-150)/25+'px'}"style="position:absolute; float: left" v-html="requiremengName"></p>

          <p :style="{'left':autoWidth*0.195+'px','top':(autoHeight-150)/25+'px'}"  style="position:absolute;  float: left ;" >目标点经度</p>
          <p  :style="{'left':(autoWidth*0.195+100)+'px','top':(autoHeight-150)/25+'px'}"style=" position:absolute;float: left ;" >:</p>
          <p :style="{'left':(autoWidth*0.195+120)+'px','top':(autoHeight-150)/25+'px'}"  style="position:absolute; float: left" v-html="requiremenglat"></p>

          <p :style="{'left':autoWidth*0.4+'px','top':(autoHeight-150)/25+'px'}" style="position:absolute;  float: left ;" >目标点纬度</p>
          <p  :style="{'left':(autoWidth*0.4+100)+'px','top':(autoHeight-150)/25+'px'}"style="position:absolute; float: left ;" >:</p>
          <p   :style="{'left':(autoWidth*0.4+120)+'px','top':(autoHeight-150)/25+'px'}"style="position:absolute; float: left ;" v-html="requiremenglng"></p>

          <!--<p :style="{'left':autoWidth*0.25+'px','top':(autoHeight-150)/10+'px'}" style="position:absolute;  float: left ;" >需求状态</p>-->
          <!--<p  :style="{'left':(autoWidth*0.25+100)+'px','top':(autoHeight-150)/10+'px'}"style="position:absolute; float: left ;" >:</p>-->
          <!--<p :style="{'left':(autoWidth*0.25+120)+'px','top':(autoHeight-150)/10+'px'}" style=" position:absolute;" v-html="requirementStatus"></p>-->

          <p :style="{'left':autoWidth*0.035+'px','top':(autoHeight-150)/25*2.5+'px'}"  style="position:absolute;  float: left ;" >拍摄次数</p>
          <p  :style="{'left':(autoWidth*0.025+100)+'px','top':(autoHeight-150)/25*2.5+'px'}"style=" position:absolute;float: left ;" >:</p>
          <p :style="{'left':(autoWidth*0.025+120)+'px','top':(autoHeight-150)/25*2.5+'px'}"  style="position:absolute; float: left" v-html="imagingTimes"></p>

          <p :style="{'left':autoWidth*0.195+'px','top':(autoHeight-150)/25*2.5+'px'}"  style="position:absolute;  float: left ;" >开始拍摄时间</p>
          <p  :style="{'left':(autoWidth*0.195+100)+'px','top':(autoHeight-150)/25*2.5+'px'}"style=" position:absolute;float: left ;" >:</p>
          <p :style="{'left':(autoWidth*0.195+120)+'px','top':(autoHeight-150)/25*2.5+'px'}"  style="position:absolute; float: left" v-html="requirementStartTime"></p>

          <p :style="{'left':autoWidth*0.4+'px','top':(autoHeight-150)/25*2.5+'px'}" style="position:absolute;  float: left ;" >结束拍摄时间</p>
          <p  :style="{'left':(autoWidth*0.4+100)+'px','top':(autoHeight-150)/25*2.5+'px'}"style="position:absolute; float: left ;" >:</p>
          <p   :style="{'left':(autoWidth*0.4+120)+'px','top':(autoHeight-150)/25*2.5+'px'}"style="position:absolute; float: left ;" v-html="requirementEndTime"></p>

          <p :style="{'left':autoWidth*0.035+'px','top':(autoHeight-150)/25*4+'px'}"  style="position:absolute;  float: left ;" >云量</p>
          <p  :style="{'left':(autoWidth*0.025+100)+'px','top':(autoHeight-150)/25*4+'px'}"style=" position:absolute;float: left ;" >:</p>
          <p :style="{'left':(autoWidth*0.025+120)+'px','top':(autoHeight-150)/25*4+'px'}"  style="position:absolute; float: left" v-html="cloudPercent"></p>

          <p :style="{'left':autoWidth*0.195+'px','top':(autoHeight-150)/25*4+'px'}" style="position:absolute;  float: left ;" >侧摆角</p>
          <p  :style="{'left':(autoWidth*0.195+100)+'px','top':(autoHeight-150)/25*4+'px'}"style="position:absolute; float: left ;" >:</p>
          <p   :style="{'left':(autoWidth*0.195+120)+'px','top':(autoHeight-150)/25*4+'px'}"style="position:absolute; float: left ;" v-html="rollSatelliteAngle"></p>

          <p :style="{'left':autoWidth*0.4+'px','top':(autoHeight-150)/25*4+'px'}"  style="position:absolute;  float: left ;" >分辨率</p>
          <p  :style="{'left':(autoWidth*0.4+100)+'px','top':(autoHeight-150)/25*4+'px'}"style=" position:absolute;float: left ;" >:</p>
          <p :style="{'left':(autoWidth*0.4+120)+'px','top':(autoHeight-150)/25*4+'px'}"  style="position:absolute; float: left" v-html="resolution"></p>

          <p :style="{'left':autoWidth*0.035+'px','top':(autoHeight-150)/25*5.5+'px'}" style="position:absolute;  float: left ;" >交付类型</p>
          <p  :style="{'left':(autoWidth*0.025+100)+'px','top':(autoHeight-150)/25*5.5+'px'}"style="position:absolute; float: left ;" >:</p>
          <p   :style="{'left':(autoWidth*0.025+120)+'px','top':(autoHeight-150)/25*5.5+'px'}"style="position:absolute; float: left ;" v-html="requiremengType"></p>

          <p :style="{'left':autoWidth*0.195+'px','top':(autoHeight-150)/25*5.5+'px'}" style="position:absolute;  float: left ;" >备注</p>
          <p  :style="{'left':(autoWidth*0.195+100)+'px','top':(autoHeight-150)/25*5.5+'px'}"style="position:absolute; float: left ;" >:</p>
          <p   :style="{'left':(autoWidth*0.195+120)+'px','top':(autoHeight-150)/25*5.5+'px'}"style="position:absolute; float: left ;" v-html="requirementRemark"></p>

          <!--<p   style=" white-space:pre;float: left"  v-html="requiremenglat"></p>-->
          <!--<p  style=" white-space:pre;"  v-html="requiremenglng"></p>-->
          <!--<p   style=" white-space:pre;float: left" v-html="imagingTimes"></p>-->
          <!--<p  style=" white-space:pre;" v-html="requiremengType"></p>-->
          <!--<p   style=" white-space:pre;float: left" v-html="cloudPercent"></p>-->
          <!--<p style=" white-space:pre;" v-html="rollSatelliteAngle"></p>-->
          <!--<p   style=" white-space:pre;float: left" v-html="resolution"></p>-->
          <!--<p  style=" white-space:pre;" v-html="requirementRemark"></p>-->


      </div>
      </div>




    <div  style="float: right">
      <v-toolbar  color="white" class="elevation-1 mt-2" :style="{'width':autoWidth*0.3+'px','margin-right':autoWidth*0.03+'px'}" style="height: 40px; margin-top: 15rem;margin-left: 2rem">
        <v-toolbar-title style="margin-top: -25px">地理信息</v-toolbar-title>
        <v-spacer ></v-spacer>
      </v-toolbar>
      <div class="elevation-1" :style="{'width':autoWidth*0.3+'px','margin-right':autoWidth*0.03+'px','height':autoHeight*0.25+'px'}"  style="overflow-x:hidden;overflow-y:auto;width:48rem;margin-left: 2rem">
        <!--<v-data-table-->
          <!--:headers="headers"-->
          <!--:items="archivalRecordsItems"-->
          <!--hide-actions-->
          <!--:loading=loading-->
          <!--:pagination.sync="pagination"-->
          <!--headers-length="3"-->
        <!--&gt;-->
          <!--<template slot="items" slot-scope="props">-->
            <!--<td>{{ props.item.startTime }}</td>-->
            <!--<td>{{ props.item.endTime }}</td>-->
            <!--<td>{{ props.item.status }}</td>-->

          <!--</template>-->
        <!--</v-data-table>-->
        <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
          <l-tile-layer :url="url" :options="subdomains"></l-tile-layer>
          <l-marker :lat-lng="marker" v-if="markerShow">
          </l-marker>
        </l-map>

      </div>



    </div>
      <div  style="width: 50rem;height:2rem;margin-left: 10rem;background:#FFF;text-align:center"></div>
      <div style="width:127rem;" :style="{'margin-top': (autoHeight*0.25+60)+'px'}">
      <v-stepper v-model="e1" style="height: 50px" :style="{width: autoWidth*0.95+'px','margin-left': autoWidth*0.02+'px'}">
        <v-stepper-header  >
          <v-stepper-step :complete="e1 > 1" step="1" style="margin-top: -20px">已受理</v-stepper-step>

          <v-divider  style="margin-top: -20px"></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2" style="margin-top: -20px">处理中</v-stepper-step>

          <v-divider style="margin-top: -20px"></v-divider>

          <v-stepper-step :complete="e1 > 3" step="3" style="margin-top: -20px">生产完成</v-stepper-step>
          <v-divider style="margin-top: -20px"></v-divider>

          <v-stepper-step :complete="e1 >4" step="4" style="margin-top: -20px">数据准备完毕</v-stepper-step>
        </v-stepper-header>

      </v-stepper>
    </div>
      <div  style="width: 50rem;height:3rem;margin-left: 10rem;background:#FFF;text-align:center"></div>

      <v-expansion-panel  v-model="panel"   :style="{'width':autoWidth*0.95+'px','margin-left': autoWidth*0.02+'px','height':(autoHeight*0.75-250)+'px'}"  style="overflow-x:hidden;overflow-y:auto;height: 21rem; margin-left:2rem;width:48rem">
        <!--<v-expansion-panel-content v-for="(item,i) in imageItems" :key="i" style="position:relative;">-->
          <!--<div style="font-size: 20px" slot="header">{{imageInfo[i]}}</div>-->

          <v-expansion-panel-content v-for="(item,i) in 5" :key="i" style="">
            <div style="font-size: 20px" slot="header">第{{i+1}}次拍摄任务信息</div>
            <div>
              <div style="float: left":style="{'margin-left':autoWidth*0.05+'px','width':autoWidth*0.14+'px'}">
          <p :style="{'margin-left':0+'px','top':70+'px'}" style=" float: left ; " >拍摄卫星信息</p>
          <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;">:</p>
          <!--<p :style="{'left':(autoWidth*0.05+120)+'px','top':70+'px'}" style="position:absolute; float: left ;"  v-html="resolution"></p>-->
            <p :style="{'margin-left':10+'px','top':70+'px'}" style="  float: left ;"  >JL101A</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
          <p :style="{'margin-left':0+'px','top':70+'px'}" style=" float: left ;" >地面接收站点</p>
          <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;">:</p>
          <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;"  >长春站</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':70+'px'}" style=" float: left ;" >当前所在状态</p>
            <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;">:</p>
            <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;"  >已受理</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':70+'px'}" style=" float: left ;" >开始拍摄时间</p>
            <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;">:</p>
            <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;"  >2018-06-10 44:44:44</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':70+'px'}" style=" float: left ;" >结束拍摄时间</p>
            <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;">:</p>
            <p :style="{'margin-left':10+'px','top':70+'px'}" style=" float: left ;"  >2018-06-10 44:44:44</p>
                  </div>

            </div>

            <div style="clear:both">

            <div style="float: left":style="{'margin-left':autoWidth*0.05+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px'}" style=" float: left ;margin-top: 20px" >数传开始时间</p>
            <p :style="{'margin-left':10+'px'}" style=" float: left ;margin-top: 20px">:</p>
            <!--<p :style="{'left':(autoWidth*0.05+120)+'px','top':70+'px'}" style="position:absolute; float: left ;"  v-html="resolution"></p>-->
            <p  :style="{'margin-left':10+'px'}" style=" float: left ;margin-top: 20px"  >2018-06-10 44:44:44</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':120+'px'}" style=" float: left ;margin-top: 20px" >数传结束时间</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px">:</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px"  >2018-06-10 44:44:44</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':120+'px'}" style=" float: left ;margin-top: 20px" >开始生产时间</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px">:</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px"  >2018-06-10 44:44:44</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':120+'px'}" style=" float: left ;margin-top: 20px" >结束生产时间</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px">:</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px"  >2018-06-10 44:44:44</p>
              </div>

              <div style="float: left":style="{'margin-left':autoWidth*0.03+'px','width':autoWidth*0.14+'px'}">
            <p :style="{'margin-left':0+'px','top':120+'px'}" style=" float: left ;margin-top: 20px" >预计交付时间</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px">:</p>
            <p :style="{'margin-left':10+'px','top':120+'px'}" style=" float: left ;margin-top: 20px"  >2018-06-10 44:44:44</p>
            </div>
            </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      </div>

  </div>
</template>

<script>
    import axios from 'axios'
    import { LMap,LMarker,LTileLayer,LPopup } from 'vue2-leaflet'
    import L from 'leaflet'
var selectedFile
// import MenuIcon from "vue-material-design-icons/Menu.vue"

// import Qs from 'qs'
// import uploadButton from "./uploadButton";
export default {
      name: 'upload',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
    },
      data () {
        return {
            zoom: 5,
            center: L.latLng(43.978292, 125.395057),
            url: this.$store.state.mapUrl,
            subdomains: this.$store.state.mapSubdomains,
            option: {zoomControl: false, attributionControl: false},
            marker:L.latLng(43.978292, 125.395057),
            markerShow:true,
           // aaa:48,
          alertDialog:false,
          alertDialogHtml:'',
          disabled1: true,
          showthis: true,
          valueDeterminate: 0,
          showPrise: false,
          showAll: true,
          file: document.getElementById('file'),
          message: '',
          loader: null,
          loading: false,
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
          filename: '',
          message_length: 0,
          uploadStatus: false,
          dialog1: false,
          dialog2: false,
          requiremengName:'',
          requirementStatus:'',
          requirementStartTime:'',
          requirementEndTime:'',
          requiremenglat:'',
          requiremenglng:'',
          imagingTimes:'',
          requiremengType:'',
          cloudPercent:'',
          rollSatelliteAngle:'',
          resolution:'',
          requirementRemark:'',
          search: '',
          headers: [
            { text: '开始拍摄时间',align: 'center', value: 'startTime' },
            { text: '结束拍摄时间',align: 'center', value: 'endTime' },
            { text: '拍摄状态', align: 'center', value: 'status' },
          ],
          archivalRecordsItems: [],
          page: 1,
          pageTotal: 15,
            panel:[true],
            imageItems:1,
            imageInfo:[],
            e1:1
          // filename:""
        }
      },

      methods: {

        getInfo: function (a) {
          this.alertDialogHtml = '载入中，请稍后'
          this.alertDialog = true
          axios.get('/api/userRequirementDetail', {
            params: {
              requirementId: a
            }
          })
            .then(response => {

                this.requiremengName=response.data.data.requirementName;
                this.requirementStatus=response.data.data.requirementStatus;
                this.requirementStartTime=response.data.data.requirementStartTime;
                this.requirementEndTime=response.data.data.requirementEndTime;
                var lat=response.data.data.imageGeometry.split("[")[1].split("]")[0].split(",")[0];
                var lng=response.data.data.imageGeometry.split("[")[1].split("]")[0].split(",")[1];
                this.requiremenglat=lat;
                this.requiremenglng=lng;
                this.marker=L.latLng(lng, lat)
                this.center = L.latLng(lng, lat)
               //alert(lat);
              // alert(lng);
                   // this.$refs.map.Object.setView([lat,lng],5);
                   // this.center=L.latLng(lng,lat);
               // alert(lat);
                this.imagingTimes=response.data.data.imagingTimes;
                this.requiremengType=response.data.data.type;
                var cloud="小于"+response.data.data.cloudPercent.split(".")[0]+"%";
                this.cloudPercent=cloud;
                var angle="-"+response.data.data.rollSatelliteAngle.split(".")[0]+"~"+response.data.data.rollSatelliteAngle.split(".")[0];
                this.rollSatelliteAngle=angle;
                this.resolution="优于"+response.data.data.resolution+"m";
                if(response.data.data.requirementRemark=="")
                { this.requirementRemark="无"}
                else
                {  this.requirementRemark=response.data.data.requirementRemark;}

                switch (response.data.data.requirementStatus) {
                    case "已受理":
                        this.e1=1;
                        break;
                    case "处理中":
                        this.e1=2;
                        break;
                    case "生产完成":
                        this.e1=3;
                        break;
                    case "数据准备完毕":
                        this.e1=3;
                        break;
                }
               // this.imageItems=response.data.data.imagingRequirement.length;
               // this.imageInfo=
               // if(response.data.data.requirementRemark;)
               //  for (var i = 0; i <response.data.data.imagingRequirement.length; i++) {
               //      // alert(response.data.data.imagingRequirement[i].imagingRequirementStatus);
               //      //this.imageInfo[i]="开始拍摄时间"+ response.data.data.imagingRequirement[i].imagingStartTime+" 结束拍摄时间"+response.data.data.imagingRequirement[i].imagingEndTime+" 拍摄状态"+"待获取"
               //      this.imageInfo[i]="第"+(i+1)+"次拍摄（"+response.data.data.imagingRequirement[i].imagingId+"）"
               //          //status: response.data.data.imagingRequirement[i].imagingRequirementStatus,
               //  }
                // var archiveInfo = []
                // for (var i = 0; i <response.data.data.imagingRequirement.length; i++) {
                //    // alert(response.data.data.imagingRequirement[i].imagingRequirementStatus);
                //     archiveInfo.push({
                //         startTime: response.data.data.imagingRequirement[i].imagingStartTime,
                //         endTime: response.data.data.imagingRequirement[i].imagingEndTime,
                //         //status: response.data.data.imagingRequirement[i].imagingRequirementStatus,
                //         status:"待获取",
                //     })
                // }
                // // alert(archiveInfo);
                // this.archivalRecordsItems = archiveInfo
                 this.alertDialog = false
                //alert(document.getElementById("aaa").offsetWidth);

            }).catch(function (error) {
            alert("获取信息失败")
          })



          //this.requiremengName= this.list.data.requirementName;
          //this.requirementStatus=this.list.data.requirementStatus;
          //this.requirementStartTime=this.list.data.requirementStartTime;
          //this.requirementEndTime=this.list.data.requirementEndTime;
          // var lat=this.list.data.imageGeometry.split("[")[1].split("]")[0].split(",")[0];
          // var lng=this.list.data.imageGeometry.split("[")[1].split("]")[0].split(",")[1];
          // this.requiremenglat=lat;
          // this.requiremenglng=lng;
          // this.imagingTimes=this.list.data.imagingTimes;
          // this.requiremengType='融合影像';
          // var cloud="小于"+this.list.data.cloudPercent.split(".")[0]+"%";
          // this.cloudPercent=cloud;
          // var angle="-"+this.list.data.rollSatelliteAngle.split(".")[0]+"~"+this.list.data.rollSatelliteAngle.split(".")[0];
          // this.rollSatelliteAngle=angle;
          // this.resolution=this.list.data.resolution+"m";
          // if(this.list.data.requirementRemark=="")
          // { this.requirementRemark="无"}
          // else
          // {  this.requirementRemark=this.list.data.requirementRemark;}

          // var archiveInfo = []
          // for (var i = 0; i <this.list.data.imagingRequirement.length; i++) {
          //   archiveInfo.push({
          //     startTime: this.list.data.imagingRequirement[i].imagingStartTime,
          //     endTime: this.list.data.imagingRequirement[i].imagingEndTime,
          //     status: this.list.data.imagingRequirement[i].imagingRequirementStatus,
          //
          //   })
          // }
          // // alert(archiveInfo);
          // this.archivalRecordsItems = archiveInfo

        },


      },
  created: function () {
// `this` 指向 vm 实例
    // alert("aa")
    //this.$store.commit('changeSpecialArchiveShow', 3);
      this.getInfo(this.$route.query.rListId);

  },
      watch: {

      },
      mounted: function () {

      },

      computed: {
        autoTop () {
          // alert(this.$store.state.seniorArchiveScrollTop1);
          // if(this.$store.state.seniorArchiveScrollTop1>100)
         // {
           // this.aaa=54;
           // return this.$store.state.seniorArchiveScrollTop1 +140;
         // }
         // else {
            // this.aaa=48;
          return this.$store.state.scrollTop + 140
        //  }
        },
        autoWidth () {
          // this.aaa=(this.$store.state.seniorArchiveClientWidth1-1519)/175*(-1)-3.2;
          // alert(this.$store.state.seniorArchiveClientWidth1);
          // alert((this.$store.state.seniorArchiveClientWidth1-1519)/14.795+103);
          // return (this.$store.state.seniorArchiveClientWidth1-1519)/14.795+103
          return this.$store.state.clientWidth * 0.95
        },
        autoHeight () {
          return this.$store.state.clientHeight - 130
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
</style>
