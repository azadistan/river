<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 50%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 1">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <!--<l-tile-layer :url="url" :options="subdomains"></l-tile-layer>-->
                    <l-wms-tile-layer :base-url="baseUrl" :layers="layersName"  :format="format" transparent="transparent" ></l-wms-tile-layer>
                    <l-geo-json
                            :geojson="geojson"
                            @click="polygonClick()"
                            :options="{weight: 15}"
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
                        河道等级：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-select
                                v-model="riverLevelSelect"
                                :items="riverLevel"
                                label="请选择"
                                single-line
                                clearable
                        ></v-select>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        流经乡镇：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-autocomplete
                                v-model="riverCountySelect"
                                :items="riverCounty"
                                label="请输入或选择"
                                single-line
                                clearable
                                no-data-text="无此数据"
                        ></v-autocomplete>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <v-btn color="info" @click="riverInformationSearch()">查询</v-btn>
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
                            <tr :active="props.selected" @click="areaShow(props.item.riverId,props.item.riverName,props.item.riverLevels,props.item.riverDrainageArea,
                                props.item.riverTotalLength,props.item.riverLocalLength,props.item.riverFlowingThroughCityCounty,props.item.riverFlowingThroughTownships,props.item.riverGeo)">
                                <td style="color:#3486D7;cursor: pointer" @click="detailRiverInformationClick(props.item.riverId,props.item.riverName,props.item.riverLevels,props.item.riverDrainageArea,
                                props.item.riverTotalLength,props.item.riverLocalLength,props.item.riverFlowingThroughCityCounty,props.item.riverFlowingThroughTownships)">{{ props.item.riverName }}</td>
                                <td>{{ props.item.riverLevels }}</td>
                                <td>{{ props.item.riverDrainageArea }}</td>
                                <td>{{ props.item.riverTotalLength }}</td>
                                <td>{{ props.item.riverLocalLength }}</td>
                                <td>{{ props.item.riverFlowingThroughCityCounty }}</td>
                                <td>{{ props.item.riverFlowingThroughTownships }}</td>
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
        <v-dialog v-model="riverInformationDialog" width="35%" hide-overlay>
            <v-card>
                <v-card-title>
                    <div style="width: 100%;margin-left: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                list
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">河道基本信息</div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="detailRiverInformation[0]" style="width: 33%;"></div>
                            <div v-html="detailRiverInformation[1]" style="width: 33%;"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="detailRiverInformation[2]" style="width: 33%"></div>
                            <div v-html="detailRiverInformation[3]" style="width: 33%"></div>
                            <div v-html="detailRiverInformation[4]" style="width: 33%"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="detailRiverInformation[5]" style="width: 33%"></div>
                            <div v-html="detailRiverInformation[6]" style="width: 66%"></div>
                        </div>
                    </div>

                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <div style="width: 100%;margin-left: 1rem;margin-bottom: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                person
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">河长名录</div>
                        </div>
                        <div style="width: 100%;height: 11rem;text-align:left;display:flex;justify-content:left;align-items:center;margin-top: 1rem">
                            <div style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverManagerList[0][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverManagerList[0][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[0][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[0][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[0][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[0][4]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                            <div style="width: 5%;height: 100%"></div>
                            <div style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverManagerList[1][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverManagerList[1][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[1][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[1][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[1][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[1][4]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                        </div>
                        <div v-show="detailRiverManager34" style="width: 100%;height: 11rem;text-align:left;display:flex;justify-content:left;align-items:center;margin-top: 1rem">
                            <div style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverManagerList[2][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverManagerList[2][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[2][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[2][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[2][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[2][4]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                            <div style="width: 5%;height: 100%"></div>
                            <div v-show="detailRiverManager4" style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverManagerList[3][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverManagerList[3][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[3][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[3][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[3][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[3][4]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                        </div>
                        <div v-show="detailRiverManager56" style="width: 100%;height: 11rem;text-align:left;display:flex;justify-content:left;align-items:center;margin-top: 1rem">
                            <div style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverManagerList[4][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverManagerList[4][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[4][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[4][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[4][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[4][4]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                            <div style="width: 5%;height: 100%"></div>
                            <div v-show="detailRiverManager6" style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverManagerList[5][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverManagerList[5][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[5][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[5][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[5][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverManagerList[5][4]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                        </div>
                    </div>

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
    import { LMap,LGeoJson,LWMSTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'
    import '../lib/L.Control.MousePosition'
    export default {
        name: "river-information",
        components: {
            LMap,
            LGeoJson,
            'l-wms-tile-layer': LWMSTileLayer
        },
        data () {
            return{
                //地图相关data
                zoom: 11,
                center: L.latLng(19.71801, 110.75918),
                bounds:this.$store.state.mapBounds,
                url: this.$store.state.url,
                subdomains: this.$store.state.mapSubdomains,
                option: {zoomControl: false, attributionControl: false},
                baseUrl:this.$store.state.baseUrl,
                layersName:this.$store.state.layersName,
                format: this.$store.state.layerFormat,
                transparent: true,
                polygon:[],
                polygonC:[],
                geojson:'',

                //查询条件相关data
                riverLevel:['省级','市级','镇级'],
                riverLevelSelect:'',
                riverCounty:['文城镇','冯坡镇','东郊镇','东路镇','公坡镇','铺前镇','翁田镇','文教镇','蓬莱镇','锦山镇','昌洒镇','东阁镇','会文镇','抱罗镇','龙楼镇','潭牛镇','重兴镇'],
                riverCountySelect:'',
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
                        text: '河道名称',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    { text: '等级', value: 'riverLevels' },
                    { text: '流域面积(km²)', value: 'riverDrainageArea' },
                    { text: '河流总长(km)', value: 'riverTotalLength' },
                    { text: '本市长度(km)', value: 'riverLocalLength' },
                    { text: '流经市县', value: 'riverFlowingThroughCityCounty' },
                    { text: '流经乡镇', value: 'riverFlowingThroughTownships' }
                ],
                riverDetails: [],

                //详情弹窗相关data
                riverInformationDialog:false,
                detailRiverInformation:['','','','','','',''],
                detailRiverInformation1:['','','','','','',''],
                detailRiverManagerList:[['级别：市级','河长姓名：李娇慧1','河长职务：市委常委 市委宣传部部长','所在地：文昌市','桩号：25+470~30+270','河岸：两岸'],['级别：市级','河长姓名：李娇慧2','河长职务：市委常委 市委宣传部部长','所在地：文昌市','桩号：25+470~30+270','河岸：两岸'],['级别：市级','河长姓名：李娇慧3','河长职务：市委常委 市委宣传部部长','所在地：文昌市','桩号：25+470~30+270','河岸：两岸'],['级别：市级','河长姓名：李娇慧4','河长职务：市委常委 市委宣传部部长','所在地：文昌市','桩号：25+470~30+270','河岸：两岸'],['级别：市级','河长姓名：李娇慧5','河长职务：市委常委 市委宣传部部长','所在地：文昌市','桩号：25+470~30+270','河岸：两岸'],['级别：市级','河长姓名：李娇慧5','河长职务：市委常委 市委宣传部部长','所在地：文昌市','桩号：25+470~30+270','河岸：两岸']],
                detailRiverManagerListLength:2,
                detailRiverManager34:false,
                detailRiverManager4:false,
                detailRiverManager56:false,
                detailRiverManager6:false,
                rId:0,
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
            this.getRiverInformationData('','','')
            this.$refs.map.mapObject.on('click', this.mapClick)
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
            areaShow(riverId,riverName,riverLevels,riverDrainageArea,riverTotalLength,riverLocalLength,riverFlowingThroughCityCounty,riverFlowingThroughTownships,riverGeo){
                if(this.strToJson(riverGeo).type === 'LineString'){
                    this.rId = riverId
                    this.geojson = this.strToJson(riverGeo)
                    this.imgBounds = this.geojson.coordinates
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates))
                    this.detailRiverInformation1=[riverName,riverLevels,riverDrainageArea,riverTotalLength,riverLocalLength,riverFlowingThroughCityCounty,riverFlowingThroughTownships]
                }
                else{
                    this.rId = riverId
                    this.geojson = this.strToJson(riverGeo)
                    this.imgBounds = this.geojson.coordinates
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates[0]))
                    this.detailRiverInformation1=[riverName,riverLevels,riverDrainageArea,riverTotalLength,riverLocalLength,riverFlowingThroughCityCounty,riverFlowingThroughTownships]
                }

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
            detailRiverInformationClick(riverId,riverName,riverLevels,riverDrainageArea,riverTotalLength,riverLocalLength,riverFlowingThroughCityCounty,riverFlowingThroughTownships){
                this.detailRiverInformation[0] = '河流名称：' + riverName
                this.detailRiverInformation[1] = '河流级别：' + riverLevels
                this.detailRiverInformation[2] = '流域面积：' + riverDrainageArea
                this.detailRiverInformation[3] = '河流总长：' + riverTotalLength
                this.detailRiverInformation[4] = '流经本市长度：' + riverLocalLength
                this.detailRiverInformation[5] = '流经市县：' + riverFlowingThroughCityCounty
                this.detailRiverInformation[6] = '流经乡镇：' + riverFlowingThroughTownships
                this.getRiverInformationPersonData(riverId)
            },//点击详情显示信息
            polygonClick(){
            this.detailRiverInformation[0] = '河流名称：' + this.detailRiverInformation1[0]
            this.detailRiverInformation[1] = '河流级别：' + this.detailRiverInformation1[1]
            this.detailRiverInformation[2] = '流域面积：' + this.detailRiverInformation1[2]
            this.detailRiverInformation[3] = '河流总长：' + this.detailRiverInformation1[3]
            this.detailRiverInformation[4] = '流经本市长度：' + this.detailRiverInformation1[4]
            this.detailRiverInformation[5] = '流经市县：' + this.detailRiverInformation1[5]
            this.detailRiverInformation[6] = '流经乡镇：' + this.detailRiverInformation1[6]
            this.getRiverInformationPersonData(this.rId)
    },//点击图层显示信息
            getRiverInformationData(riverLevelSelect,riverCountySelect,riverNameSelect){
                if(riverLevelSelect === null || riverLevelSelect === undefined){
                    riverLevelSelect = ''
                }
                if(riverCountySelect === null || riverCountySelect === undefined){
                    riverCountySelect = ''
                }
                if(riverNameSelect === null || riverNameSelect === undefined){
                    riverNameSelect = ''
                }
                this.$axios.get("api/getAllRiverInfo",{
                    params:{
                        name:riverNameSelect,
                        level:riverLevelSelect,
                        through:riverCountySelect,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination.totalItems = length
                    for(var i=0;i<length;i++){
                        var tmp = res.data.data[i].city
                        if(res.data.data[i].city === ''){
                            tmp = '无'
                        }
                        resultListFormat.push(
                            {
                                riverId:res.data.data[i].num,
                                riverName: res.data.data[i].name,
                                riverLevels: res.data.data[i].level,
                                riverDrainageArea: res.data.data[i].area,
                                riverTotalLength: res.data.data[i].totalLen,
                                riverLocalLength: res.data.data[i].cityLenth,
                                riverFlowingThroughCityCounty: tmp,
                                riverFlowingThroughTownships: res.data.data[i].township,
                                riverGeo:res.data.data[i].geo,

                            })
                    }
                    this.riverDetails = resultListFormat
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容
            getRiverInformationPersonData(num){
                this.$axios.get("api/getRiverDetail",{
                    params:{
                        river_num:num,
                    }
                }).then((res) => {
                    var resultListFormat= [['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','',''],['','','','','','']]
                    var length = res.data.data.length
                    this.detailRiverManagerListLength = length
                    if(length === 2){
                        this.detailRiverManager34 = false
                        this.detailRiverManager4 = false
                        this.detailRiverManager56 = false
                        this.detailRiverManager6 = false
                    }
                    if(length === 3){
                        this.detailRiverManager34 = true
                        this.detailRiverManager4 = false
                        this.detailRiverManager56 = false
                        this.detailRiverManager6 = false
                    }
                    if(length === 4){
                        this.detailRiverManager34 = true
                        this.detailRiverManager4 = true
                        this.detailRiverManager56 = false
                        this.detailRiverManager6 = false
                    }
                    if(length === 5){
                        this.detailRiverManager34 = true
                        this.detailRiverManager4 = true
                        this.detailRiverManager56 = true
                        this.detailRiverManager6 = false
                    }
                    if(length === 6){
                        this.detailRiverManager34 = true
                        this.detailRiverManager4 = true
                        this.detailRiverManager56 = true
                        this.detailRiverManager6 = true
                    }
                    for(var i=0;i<length;i++){
                        resultListFormat[i] = [
                            '级别：'+res.data.data[i].rmPersonInfo.level,
                            '河长姓名：'+res.data.data[i].rmPersonInfo.name,
                            '河长职务：'+res.data.data[i].rmPersonInfo.position,
                            '所在地：'+res.data.data[i].rmRiverPersonRelation.place,
                            '桩号：'+res.data.data[i].rmRiverPersonRelation.stationNum,
                            '河岸：'+res.data.data[i].rmRiverPersonRelation.riverbank
                        ]
                    }
                    this.detailRiverManagerList = resultListFormat
                    this.riverInformationDialog = true
                })
                    .catch(function (err) {
                        alert(err)
                    })
            },//显示river详情中的河长信息
            riverInformationSearch(){
                this.getRiverInformationData(this.riverLevelSelect,this.riverCountySelect,this.riverNameSelect)
            },//河流信息查询
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
                return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
            }
        }
    }
</script>

<style scoped>

</style>