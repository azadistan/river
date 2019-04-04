<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 50%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 1">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <!--<l-tile-layer :url="url" :options="subdomains"></l-tile-layer>-->
                    <l-wms-tile-layer :base-url="baseUrl" :layers="layersName"  :format="format" transparent="transparent" ></l-wms-tile-layer>
                    <l-marker
                            :lat-lng="position"
                            @click="markerClick()"
                            >
                    </l-marker>
                </l-map>
            </v-card>
        </div>
        <div style="width: 50%;height: 100%;float: right">
            <div class="elevation-1" style="height: 10%;width: 100%;">
                <div style="float: left;height: 100%;width: 30%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        污染源：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-text-field
                                label="输入污染源关键字"
                                v-model="riverPollutionSourceKeyword"
                        ></v-text-field>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        河道名称：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-autocomplete
                                :items="riverName"
                                label="请输入或选择"
                                single-line
                                v-model="riverNameSelect"
                                no-data-text="无此数据"
                                clearable
                        ></v-autocomplete>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        类型：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-select
                                v-model="riverPollutionTypeSelect"
                                :items="riverPollutionType"
                                label="请选择"
                                single-line
                                clearable
                        ></v-select>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 14%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <v-btn color="info" @click="getRiverSewageOutletInformationDataSearch()">查询</v-btn>
                </div>
            </div>
            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem;overflow-y:scroll;overflow-x:scroll">
                <div class="elevation-2" >
                    <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="riverDetails"
                            :search="search"
                            hide-actions
                            :pagination.sync="pagination"
                            class="elevation-1"
                            item-key="riverPollutionSource"
                    >
                        <template slot="items" slot-scope="props">
                            <tr :active="props.selected" @click="areaShow(props.item.riverPollutionSource,props.item.riverName,props.item.riverCode,props.item.riverPollutionType,props.item.riverPollutionScale,
                                props.item.resourceZone,props.item.river2Name,props.item.waterFunctionId,props.item.waterFunctionOne,props.item.waterFunctionTwo,
                                props.item.setTime,props.item.longitude,props.item.latitude,props.item.setPalce,props.item.pollutionWay,
                                props.item.dischargeWay,props.item.personInfo)">
                                <td style="color:#3486D7;cursor: pointer" @click="riverSewageOutletInformationClick(
                                props.item.riverPollutionSource,props.item.riverName,props.item.riverCode,props.item.riverPollutionType,props.item.riverPollutionScale,
                                props.item.resourceZone,props.item.river2Name,props.item.waterFunctionId,props.item.waterFunctionOne,props.item.waterFunctionTwo,
                                props.item.setTime,props.item.longitude,props.item.latitude,props.item.setPalce,props.item.pollutionWay,
                                props.item.dischargeWay,props.item.personInfo
                                )">{{ props.item.riverPollutionSource }}</td>
                                <td>{{ props.item.riverName }}</td>
                                <td>{{ props.item.riverCode }}</td>
                                <td>{{ props.item.riverPollutionType }}</td>
                                <td>{{ props.item.riverPollutionScale }}</td>
                            </tr>
                        </template>
                        <v-alert slot="no-data" :value="true" color="error" icon="warning">
                            找不到相关的数据！
                        </v-alert>
                    </v-data-table>

                </div>
            </div>
            <div class="elevation-1" style="height: 10%;width: 100%;text-align:center;display:flex;justify-content:center;align-items:center;">
                <div class="text-xs-center pt-2" style="width: 100%;">
                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                </div>
            </div>
        </div>

        <v-dialog v-model="riverSewageOutletDialog" width="50%" hide-overlay>
            <v-card>
                <v-card-text>
                    <div style="width: 100%;margin-left: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                list
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">污染源基本信息</div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletInformation[0]" style="width: 50%;"></div>
                            <div v-html="riverSewageOutletInformation[1]" style="width: 20%;"></div>
                            <div v-html="riverSewageOutletInformation[2]" style="width: 25%"></div>
                        </div>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <div style="width: 100%;margin-left: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                list
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">排入水体</div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletWaterInformation[0]" style="width: 50%;"></div>
                            <div v-html="riverSewageOutletWaterInformation[1]" style="width: 20%;"></div>
                            <div v-html="riverSewageOutletWaterInformation[2]" style="width: 25%"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletWaterInformation[3]" style="width: 50%;"></div>
                            <div v-html="riverSewageOutletWaterInformation[4]" style="width: 20%;"></div>
                        </div>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <div style="width: 100%;margin-left: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                list
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">污染源详细信息</div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletInformation[3]" style="width: 50%;"></div>
                            <div v-html="riverSewageOutletInformation[4]" style="width: 50%;"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletDetailsInformation[0]" style="width: 50%;"></div>
                            <div v-html="riverSewageOutletDetailsInformation[1]" style="width: 50%;"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletDetailsInformation[2]" style="width: 50%;"></div>
                            <div v-html="riverSewageOutletDetailsInformation[3]" style="width: 50%;"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="riverSewageOutletDetailsInformation[4]" style="width: 50%;"></div>
                        </div>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="riverSewageOutletDialog = false">关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { LMap,LTileLayer,LMarker,LWMSTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'
    import '../lib/L.Control.MousePosition'
    export default {
        name: "river-sewage-outlet",
        components: {
            LMap,
            LTileLayer,
            LMarker,
            'l-wms-tile-layer': LWMSTileLayer
        },
        data () {
            return{
                //地图相关data
                zoom: 11,
                center: L.latLng(19.71801, 110.75918),
                bounds:this.$store.state.mapBounds,
                url: this.$store.state.mapUrl,
                subdomains: this.$store.state.mapSubdomains,
                baseUrl: this.$store.state.baseUrl,
                layersName:this.$store.state.layersName,
                format: this.$store.state.layerFormat,
                transparent: true,
                option: {zoomControl: false, attributionControl: false},
                position:[0,0],

                //查询条件相关data
                riverPollutionSourceKeyword:'',
                riverName:['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖'],
                riverNameSelect:'',
                riverPollutionType:['企业（工厂）入河排污口','生活污染','农业污染'],
                riverPollutionTypeSelect:'',

                //图表相关data
                test:false,
                search: '',
                pagination: {
                    rowsPerPage:12,
                    totalItems:4,
                },
                selected: [],
                headers: [
                    {
                        text: '污染源',
                        align: 'left',
                        sortable: false,
                        value: 'riverPollutionSource'
                    },
                    { text: '河道名称', value: 'riverName' },
                    { text: '编码', value: 'riverCode' },
                    { text: '类型', value: 'riverPollutionType' },
                    { text: '规模', value: 'riverPollutionScale' },

                ],
                riverDetails: [
                    {
                        riverId:1,
                        riverPollutionSource: '文昌市文城污水处理厂工业废污水入河排污口',
                        riverName: '文清河1',
                        riverCode: '469005A01',
                        riverPollutionType: '企业（工厂）入河排污口',
                        riverPollutionScale: 1,
                    },
                    {
                        riverId:1,
                        riverPollutionSource: '文昌市文城污水处理厂工业废污水入河排污口',
                        riverName: '文清河2',
                        riverCode: '469005A01',
                        riverPollutionType: '企业（工厂）入河排污口',
                        riverPollutionScale: 1,
                    },{
                        riverId:1,
                        riverPollutionSource: '文昌市文城污水处理厂工业废污水入河排污口',
                        riverName: '文清河3',
                        riverCode: '469005A01',
                        riverPollutionType: '企业（工厂）入河排污口',
                        riverPollutionScale: 1,
                    },
                    {
                        riverId:1,
                        riverPollutionSource: '文昌市文城污水处理厂工业废污水入河排污口',
                        riverName: '文清河4',
                        riverCode: '469005A01',
                        riverPollutionType: '企业（工厂）入河排污口',
                        riverPollutionScale: 1,
                    },

                ],

                //详情data
                riverSewageOutletDialog:false,
                riverSewageOutletInformation:['','','','',''],
                riverSewageOutletWaterInformation:['所在水资源分区：珠江区海南岛及海南各岛诸区','河湖名称：文清河','水功能区编码：无','水功能一级区：','水功能二级区：'],
                riverSewageOutletDetailsInformation:['设置时间：不详','所在地：文城镇福堂村','污水入河方式：不详','排放方式：连续','所在河段河长信息：邓海闻（副市长）'],
                markerList:[],
            }
        },
        watch:{
            selected:{
                handler:function(val){
                    alert(val)
                }
            },
        },
        mounted () {
            this.$refs.map.mapObject.on('click', this.mapClick)
            this.getRiverSewageOutletInformationData('','','')
            L.control.mousePosition({
                position : 'bottomleft',
                emptyString: '0º N0º E',
                //   separator: '<br>',
                lngFormatter: function(num) {
                    var direction = (num < 0) ? 'W' : 'E';
                    var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
                    return formatted;
                },
                latFormatter: function(num) {
                    var direction = (num < 0) ? 'S' : 'N';
                    var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
                    return formatted;
                }
            }).addTo(this.$refs.map.mapObject);
        },
        methods:{
            areaShow(riverPollutionSource,riverName,riverCode,riverPollutionType,riverPollutionScale,
                     resourceZone,river2Name,waterFunctionId,waterFunctionOne,waterFunctionTwo,
                     setTime,longitude,latitude,setPalce,pollutionWay,
                     dischargeWay,personInfo){
                this.position = [latitude,longitude]
                this.center = this.position
                this.markerList = [riverPollutionSource,riverName,riverCode,riverPollutionType,riverPollutionScale,
                    resourceZone,river2Name,waterFunctionId,waterFunctionOne,waterFunctionTwo,
                    setTime,longitude,latitude,setPalce,pollutionWay,
                    dischargeWay,personInfo]
                // this.$refs.map.mapObject.fitBounds([123,44])
            },//点击显示区域
            lngToLat(arr){
                var length = arr.length
                var tmp = ''
                for(var i=0;i<length;i++){
                    for(var j=0;j<arr[i].length;j++){
                        tmp = arr[i][j][0]
                        arr[i][j][0] = arr[i][j][1]
                        arr[i][j][1] = tmp
                    }
                }
                return arr
            },//经纬度转换
            riverSewageOutletInformationClick(riverPollutionSource,riverName,riverCode,riverPollutionType,riverPollutionScale,
                                              resourceZone,river2Name,waterFunctionId,waterFunctionOne,waterFunctionTwo,
                                              setTime,longitude,latitude,setPalce,pollutionWay,
                                              dischargeWay,personInfo){
                this.riverSewageOutletInformation[0] = '入河排污口名称：' + riverPollutionSource
                this.riverSewageOutletInformation[1] = '河流名称：' + riverName
                this.riverSewageOutletInformation[2] = '编号：' + riverCode
                this.riverSewageOutletInformation[3] = '入河排污口类型：' + riverPollutionType
                this.riverSewageOutletInformation[4] = '入河排污口规模：' + riverPollutionScale
                this.riverSewageOutletWaterInformation[0] = '所在水资源分区：' + resourceZone
                this.riverSewageOutletWaterInformation[1] = '河湖名称：' + river2Name
                this.riverSewageOutletWaterInformation[2] = '水功能区编码：' + waterFunctionId
                this.riverSewageOutletWaterInformation[3] = '水功能一级区：' + waterFunctionOne
                this.riverSewageOutletWaterInformation[4] = '水功能二级区：' + waterFunctionTwo
                this.riverSewageOutletDetailsInformation[0] = '设置时间：' + setTime
                this.riverSewageOutletDetailsInformation[1] = '所在地：' + setPalce
                this.riverSewageOutletDetailsInformation[2] = '污水入河方式：' + pollutionWay
                this.riverSewageOutletDetailsInformation[3] = '排放方式：' + dischargeWay
                this.riverSewageOutletDetailsInformation[4] = '所在河段河长信息：' + personInfo

                this.riverSewageOutletDialog = true
            },//排污口详情点击
            getRiverSewageOutletInformationData(riverPollutionSource,riverName,riverPollutionType){
                if(riverPollutionSource === null || riverPollutionSource === undefined){
                    riverPollutionSource = ''
                }
                if(riverName === null || riverName === undefined){
                    riverName = ''
                }
                if(riverPollutionType === null || riverPollutionType === undefined){
                    riverPollutionType = ''
                }
                this.$axios.get("api/getPollutionList",{
                    params:{
                        pollutionName:riverPollutionSource,
                        river:riverName,
                        pollutionType:riverPollutionType,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination.totalItems = length
                    for(var i=0;i<length;i++){
                        resultListFormat.push(
                            {
                                riverId:res.data.data[i].pollutionId,
                                riverPollutionSource: res.data.data[i].pollutionName,
                                riverName: res.data.data[i].river1Name,
                                riverCode: res.data.data[i].pollutionId,
                                riverPollutionType: res.data.data[i].pollutionType,
                                riverPollutionScale: res.data.data[i].pollutionScale,
                                resourceZone:res.data.data[i].resourceZone,
                                river2Name:res.data.data[i].river2Name,
                                waterFunctionId:res.data.data[i].waterFunctionId,
                                waterFunctionOne:res.data.data[i].waterFunctionOne,
                                waterFunctionTwo:res.data.data[i].waterFunctionTwo,
                                setTime:res.data.data[i].setTime,
                                longitude:res.data.data[i].longitude,
                                latitude:res.data.data[i].latitude,
                                setPalce:res.data.data[i].setPalce,
                                pollutionWay:res.data.data[i].pollutionWay,
                                dischargeWay:res.data.data[i].dischargeWay,
                                personInfo:res.data.data[i].personInfo,


                            })
                    }
                    this.riverDetails = resultListFormat
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容
            getRiverSewageOutletInformationDataSearch(){
              this.getRiverSewageOutletInformationData(this.riverPollutionSourceKeyword,this.riverNameSelect,this.riverPollutionTypeSelect)
            },//查询
            markerClick(){
               this.riverSewageOutletInformationClick(this.markerList[0],this.markerList[1],this.markerList[2],this.markerList[3],this.markerList[4],
                   this.markerList[5],this.markerList[6],this.markerList[7],this.markerList[8],this.markerList[9],
                   this.markerList[10],0,0,this.markerList[11],this.markerList[12],this.markerList[13],this.markerList[14],)

            },//点击marker
        },
        computed:{
            pageHeight(){
                return document.documentElement.clientHeight
            },
            pageWidth(){
                return document.documentElement.clientWidth
            },
            pages () {
                return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
            }
        }
    }
</script>

<style scoped>

</style>