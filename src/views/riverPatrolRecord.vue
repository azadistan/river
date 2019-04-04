<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 50%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 1">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <!--<l-tile-layer :url="url" :options="subdomains"></l-tile-layer>-->
                    <l-wms-tile-layer :base-url="baseUrl" :layers="layersName"  :format="format" transparent="transparent" ></l-wms-tile-layer>
                    <l-geo-json
                            :geojson="geojson"
                            :options="{weight: 10}"
                    />
                </l-map>
            </v-card>
        </div>
        <div style="width: 50%;height: 100%;float: right">
            <div class="elevation-1" style="height: 10%;width: 100%;">
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
                        河长姓名：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-autocomplete
                                v-model="riverManagerSelect"
                                :items="riverManager"
                                label="请输入或选择"
                                single-line
                                clearable
                                no-data-text="无此数据"
                        ></v-autocomplete>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        巡河日期：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-menu
                                :close-on-content-click="false"
                                v-model="startDateMenu"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    readonly
                                    v-model="startDate"
                                    prepend-inner-icon="date_range"
                            ></v-text-field>
                            <v-date-picker v-model="startDate" v-if="startDateMenu" @input="startDateMenu = false" no-title  locale="zh-cn">
                            </v-date-picker>
                        </v-menu>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <v-btn color="info" @click="getRiverPatrolRecordDataSearch()">查询</v-btn>
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
                            item-key="riverName"
                    >
                        <template slot="items" slot-scope="props">
                            <tr :active="props.selected" @click="areaShow(props.item.riverName,props.item.riverManagerName,props.item.riverPatrolDate,props.item.riverPatrolStartTime,props.item.riverPatrolEndTime,
                            props.item.riverPatrolTotalTime,props.item.riverPatrolTotalDistance,props.item.riverGeo)">
                                <td>{{ props.item.riverName }}</td>
                                <td>{{ props.item.riverManagerName }}</td>
                                <td>{{ props.item.riverPatrolDate }}</td>
                                <td>{{ props.item.riverPatrolStartTime }}</td>
                                <td>{{ props.item.riverPatrolEndTime }}</td>
                                <td>{{ props.item.riverPatrolTotalTime }}</td>
                                <td>{{ props.item.riverPatrolTotalDistance }}</td>
                            </tr>
                        </template>
                        <v-alert slot="no-data" :value="true" color="error" icon="warning">
                            找不到相关的数据！
                        </v-alert>
                    </v-data-table>

                </div>
            </div>
            <div class="elevation-1" style="height: 10%;width: 100%;text-align:center;display:flex;justify-content:center;align-items:center;">
                <div class="text-xs-center pt-2" style="">
                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                </div>
            </div>
        </div>

        <v-dialog v-model="riverInformationDialog" width="500" hide-overlay>
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>河流信息
                </v-card-title>
                <v-card-text v-html="riverInformationHtml" primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="riverInformationDialog = false">关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { LMap,LGeoJson,LTileLayer,LWMSTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'
    import '../lib/L.Control.MousePosition'
    export default {
        name: "river-patrol-record",
        components: {
            LMap,
            LTileLayer,
            LGeoJson,
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
                option: {zoomControl: false, attributionControl: false},
                baseUrl: this.$store.state.baseUrl,
                layersName:this.$store.state.layersName,
                format: this.$store.state.layerFormat,
                transparent: true,
                geojson:'',

                //查询条件相关data
                riverManager:['钟鸣明','王晓桥','何欢宝','李娇慧','吴小洪','任怀锋','张毅','符策万','符永高','王茀甫','许环峰','杜冰','刘庆棠','徐健超','吕烈炜',
                    '邢艳','王宏伟','杨兹农','陈文慧','陈文强', '朱兴育','黄心奋','邢福健','林勉','韩松元','陈东明','郑鸿雁','林方江','杨兹富','符斌','王云',
                    '陈文学','郑有雷','张光润','严世巍','符日伟', '李湘燕','邓德雄','符方利','唐甸远','郑学','邢彩虹','范高满','孙人培','王兰英','陈丹','陈明泽',
                    '林明恺','韩锐光','李道俊','韩红光','吴清雄','邓海闻', '符力','陈少波','凌波','甘大韧'],
                riverManagerSelect:'',
                riverCounty:['文城镇','冯坡镇','东郊镇','东路镇','公坡镇','铺前镇','翁田镇','文教镇','蓬莱镇','锦山镇','昌洒镇','东阁镇','会文镇','抱罗镇','龙楼镇','潭牛镇','重兴镇'],
                riverCountySelect:'',
                startDateMenu:false,
                startDate:'',
                riverName:['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖'],
                riverNameSelect:'',

                //图表相关data
                test:false,
                search: '',
                pagination: {
                    rowsPerPage:12,
                    totalItems:13,
                },
                selected: [],
                headers: [
                    {
                        text: '河流名称',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    { text: '河长姓名', value: 'riverManagerName' },
                    { text: '巡河日期', value: 'riverPatrolDate' },
                    { text: '开始时间', value: 'riverPatrolStartTime' },
                    { text: '结束时间', value: 'riverPatrolEndTime' },
                    { text: '总时长(时分秒)', value: 'riverPatrolTotalTime' },
                    { text: '总路程(km)', value: 'riverPatrolTotalDistance' }
                ],
                riverDetails: [],
                //其他data
                riverInformationDialog:false,
                riverInformationHtml:'河流信息详情',
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
            this.getRiverPatrolRecordData('','','')
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
            areaShow(riverName,riverManagerName,riverPatrolDate,riverPatrolStartTime,riverPatrolEndTime, riverPatrolTotalTime,riverPatrolTotalDistance,riverGeo){
                this.geojson = this.strToJson(riverGeo)
                this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates))
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
            getRiverPatrolRecordData(riverName,personName,patrolDate){
                if(riverName === null || riverName === undefined){
                    riverName = ''
                }
                if(personName === null || personName === undefined){
                    personName = ''
                }
                if(patrolDate === null || patrolDate === undefined){
                    patrolDate = ''
                }
                this.$axios.get("api/getRiverPatrol",{
                    params:{
                        riverName:riverName,
                        personName:personName,
                        patrolDate:patrolDate,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination.totalItems = length
                    for(var i=0;i<length;i++){
                        resultListFormat.push(
                            {
                                riverName: res.data.data[i].riverName,
                                riverManagerName: res.data.data[i].personName,
                                riverPatrolDate: res.data.data[i].patrolDate,
                                riverPatrolStartTime: res.data.data[i].startTime,
                                riverPatrolEndTime: res.data.data[i].endTime,
                                riverPatrolTotalTime: res.data.data[i].timeLong,
                                riverPatrolTotalDistance:res.data.data[i].distance,
                                riverGeo:res.data.data[i].geoJson,
                            })
                    }
                    this.riverDetails = resultListFormat
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容
            getRiverPatrolRecordDataSearch(){
                this.getRiverPatrolRecordData(this.riverNameSelect,this.riverManagerSelect,this.startDate)
            },
            strToJson:function(str){
                var json = eval('(' + str + ')');
                return json;
            },//string转json
            geoJsonLngToLat(arr){
                var length = arr.length
                var arr2 =[]
                for(var i=0;i<length;i=i+1){
                    arr2.push([arr[i][1],arr[i][0]])
                }
                return arr2
            },//geojson的经度纬度转换
        },
        computed:{
            pageHeight(){
                return document.documentElement.clientHeight
            },
            pageWidth(){
                return document.documentElement.clientWidth
            },
            pages () {
                if (this.pagination.rowsPerPage == null ||
                    this.pagination.totalItems == null
                ) return 0

                return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
            }
        }
    }
</script>

<style scoped>

</style>