<template>
    <div style="width: 100%; height: 100%;">
        <div style="width: 67%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 88">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <l-wms-tile-layer :base-url="baseUrl" :layers="layersName" :format="format" transparent="transparent" zIndex="3"></l-wms-tile-layer>
                    <l-wms-tile-layer :base-url="baseUrl" layers="WCXT:wcj_uav_image" :format="format" transparent="transparent" zIndex="10"  v-if="legendShow[1]"></l-wms-tile-layer>
                    <l-geo-json
                            v-for="(latlngNow,index) in geojson"
                            :geojson="latlngNow"
                            :options="{weight: 10,opacity:0.5}"
                            @click = "polygonClick(index)"
                            v-if="legendShow[0]"
                    />
                    <l-geo-json
                            v-for="(latlngNow,index) in geojson1"
                            :geojson="latlngNow"
                            :options="{weight: 5,opacity:1,color:red}"
                            :optionsStyle="styleFunction"
                            @click = "garbageClick(index)"
                            v-if="legendShow[2]"
                    />
                </l-map>
            </v-card>
        </div>
        <div style="width: 33%;height: 100%;float: right;background-color: #1B1B1B">
            <div style="width: 94%;height: 31.3%;margin-left: 3%;margin-top: 1%">
                <div style="width: 100%;height: 20%;text-align:center;display:flex;justify-content:center;align-items:center;" @click="pointGarbage()">
                    <div style="position: absolute;color: #00C2C3">文昌市河长制上报问题统计分析</div>
                    <img src="../assets/homePageBorder.svg"  style="width: 100%;height: 100%">
                </div>
                <div style="width: 100%;height: 80%;border: 1px solid #00C2C3;box-shadow: 0 0 6px 0 #00C2C3, inset 0 0 6px 2px #4FD3D7;padding: 1rem">
                    <div id="riverHomePagePie" style="width: 100%;height: 100%;">
                    </div>
                </div>
            </div>
            <div style="width: 94%;height: 31.3%;margin-left: 3%;margin-top: 1%">
                <div style="width: 100%;height: 20%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="position: absolute;color: #00C2C3">文昌市河长制打卡记录统计</div>
                    <img src="../assets/homePageBorder.svg"  style="width: 100%;height: 100%">
                </div>
                <div style="width: 100%;height: 80%;border: 1px solid #00C2C3;box-shadow: 0 0 6px 0 #00C2C3, inset 0 0 6px 2px #4FD3D7;">
                    <div id="riverHomePageLine" style="width: 100%;height: 100%;">
                    </div>
                </div>
            </div>
            <div style="width: 94%;height: 31.3%;margin-left: 3%;margin-top: 1%">
                <div style="width: 100%;height: 20%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="position: absolute;color: #00C2C3">文昌市河长制巡河记录统计</div>
                    <img src="../assets/homePageBorder.svg"  style="width: 100%;height: 100%">
                </div>
                <div style="width: 100%;height: 80%;border: 1px solid #00C2C3;box-shadow: 0 0 6px 0 #00C2C3, inset 0 0 6px 2px #4FD3D7;">
                    <div id="riverHomePageBar" style="width: 100%;height: 100%;">
                    </div>
                </div>
            </div>
        </div>
        <div style="position: absolute;z-index: 100;width: 14rem;height: 12rem;margin: 0.5rem">
            <v-select
                    v-model="layerItemsSelect"
                    :items="layerItems"
                    attach
                    chips
                    label="图层选择"
                    multiple
            ></v-select>
        </div>
        <div style="position: absolute;z-index: 100;width: 14rem;bottom:0;background-color: white;padding-left: 1rem" v-show="legendShow[3]">
            <div style="width:12rem;height:2rem;padding-left: 1rem;padding-top: 0.5rem">
                图例
            </div>
            <div style="width:12rem;height:1rem;">
            </div>
            <div style="width:12rem;height:2rem;" v-show="legendShow[2]">
                <div style="width:2rem;height:2rem;text-align:center;display:flex;justify-content:center;align-items:center;background-color: red;float: left;margin-left: 1rem">

                </div>
                <div style="width:8rem;height:2rem;text-align:center;display:flex;justify-content:center;align-items:center;float: left">
                    露天垃圾堆放
                </div>
            </div>
            <!--<div style="width:12rem;height:2rem;margin-top: 0.5rem">-->
                <!--<div style="width:2rem;height:2rem;text-align:center;display:flex;justify-content:center;align-items:center;background-color: yellow;float: left;margin-left: 1rem">-->

                <!--</div>-->
                <!--<div style="width:8rem;height:2rem;text-align:center;display:flex;justify-content:center;align-items:center;float: left">-->
                    <!--无人机-->
                <!--</div>-->
            <!--</div>-->
            <div style="width:12rem;height:2rem;margin-top: 0.5rem" v-show="legendShow[0]">
                <div style="width:2rem;height:2rem;text-align:center;display:flex;justify-content:center;align-items:center;background-color: #1976d2;float: left;margin-left: 1rem">

                </div>
                <div style="width:8rem;height:2rem;text-align:center;display:flex;justify-content:center;align-items:center;float: left">
                    河流
                </div>
            </div>
            <div style="width:12rem;height:1rem;background-color: white">
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
                            <div v-show="detailRiverManager6"style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
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
        <v-dialog v-model="garbageDialog" width="15%" hide-overlay>
            <v-card>
                <v-card-text>
                    <div style="width: 100%;margin-left: 1rem;margin-bottom: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                list
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">垃圾露天堆放基本信息</div>
                        </div>
                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;margin-top: 1rem">
                            <div style="width: 90%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="garbageInformation[0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div style="height: 1rem;width: 100%"></div>
                                <div v-html="garbageInformation[1]" style="height: 1.5rem;width: 100%"></div>
                                <div style="height: 1rem;width: 100%"></div>
                                <div v-html="garbageInformation[2]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                        </div>
                    </div>

                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="garbageDialog = false">关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
    import {LMap,LTileLayer,LGeoJson,LWMSTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'
    import '../lib/L.Control.MousePosition'
    export default {
        name: "river-home-page",
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
                url: this.$store.state.url,
                subdomains: this.$store.state.mapSubdomains,
                baseUrl: this.$store.state.baseUrl,
                baseUrl2: this.$store.state.baseUrl2,
                option: {zoomControl: false, attributionControl: false},
                layersName:this.$store.state.layersName,
                format: this.$store.state.layerFormat,
                transparent: true,

                tileLayerList:[
                    {
                        tileLayer:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
                        tileShow:true,
                        zindex:'1',
                    },
                    {
                        tileLayer:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
                        tileShow:true,
                        zindex:'1',
                    },
                    {
                        tileLayer:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
                        tileShow:true,
                        zindex:'5',
                    },
                    {
                        tileLayer:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}',
                        tileShow:true,
                        zindex:'1',
                    },
                    {
                        tileLayer:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
                        tileShow:true,
                        zindex:'1',
                    },
                ],
                layerItems:['无人机','河流','露天垃圾堆放'],
                layerItemsSelect:[],
                legendShow:[false,false,false,false],


                pieX:[],
                pieY:[],
                lineX:[],
                lineY:[],
                barX:[],
                barY:[],
                geojson:[],
                geojson1:[],
                xzmc:[],
                xzcmc:[],
                area:[],

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

                garbageDialog:false,
                garbageInformation:['乡镇：111','社区：222','面积：333'],
                fillColor:'red',

            }
        },
        watch:{
            selected:{
                handler:function(val){
                    alert(val)
                }
            },
            layerItemsSelect:{
                handler:function(val,oldVal){
                    this.legendShow = [false,false,false,false]
                    for(var i=0;i<val.length;i++){
                        if(val[i] === '河流'){
                            var judgeRiver = true
                            this.legendShow[0] = true
                            this.legendShow[3] = true
                            for(var k=0;k<oldVal.length;k++){
                                if(oldVal[k] === '河流'){
                                    judgeRiver = false
                                }
                            }
                            if(judgeRiver === true){
                                this.pointRiver()
                            }
                        }
                        if(val[i] === '无人机'){
                            var judgeAirplane = true
                            this.legendShow[1] = true
                            for(var l=0;l<oldVal.length;l++){
                                if(oldVal[l] === '无人机'){
                                    judgeAirplane = false
                                }
                            }
                            if(judgeAirplane === true){
                                this.pointAirplane()
                            }

                        }
                        if(val[i] === '露天垃圾堆放'){
                            var judgeGarbage = true
                            this.legendShow[2] = true
                            this.legendShow[3] = true
                            for(var j=0;j<oldVal.length;j++){
                                if(oldVal[j] === '露天垃圾堆放'){
                                    judgeGarbage = false
                                }
                            }
                            if(judgeGarbage === true){
                                this.pointGarbage()
                            }
                        }
                    }

                }
            }
        },
        mounted () {
            this.getGeoJsonFromRiverInformationData()//初始化河流geojson
            this.getGeoJsonFromGarbageData()
            this.getPieData();
            this.getLineData();
            this.getBarData();
            this.$refs.map.mapObject.on('click', this.mapClick)
            L.control.mousePosition({
                position : 'bottomright',
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
            drawPie(x1,x2,x3,x4,x5){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('riverHomePagePie'))
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        textStyle:{
                            color:'white',
                            fontSize:12
                        },
                        data:['待审核','待转办','待整改','待复核','待确认'],
                    },
                    series: [
                        {
                            name:'数量',
                            type:'pie',
                            radius: ['50%', '70%'],
                            hoverAnimation:false,
                            avoidLabelOverlap: false,
                            color:['#fdf688','#609efb','#efad87','#b3e083','grey'],
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                        fontWeight: 'white'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:x1, name:'待审核'},
                                {value:x2, name:'待转办'},
                                {value:x3, name:'待整改'},
                                {value:x4, name:'待复核'},
                                {value:x5, name:'待确认'},
                            ]
                        }
                    ]
                })
            },
            drawLine(x,y){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('riverHomePageLine'))
                // 绘制图表
                myChart.setOption(
                    {
                        tooltip : {
                            trigger: 'axis',
                        },
                        calculable : true,
                        textStyle:{
                            fontSize:15,
                            color:'#fff'
                        },
                        backgroundColor: '#1b1b1b',
                        xAxis: {
                            axisLabel: {
                                interval:0,
                                rotate:50
                            },
                            type: 'category',
                            boundaryGap: false,
                            data: x,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series : [
                            {
                                type:'line',
                                data: y,
                                smooth:true,
                            }
                        ]
                    }
                    )
            },
            drawBar(x,y){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('riverHomePageBar'))
                // 绘制图表
                myChart.setOption(
                    {
                        color: ['#3398DB'],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        textStyle:{
                            fontSize:15,
                            color:'#fff'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                axisLabel: {
                                    interval:0,
                                    rotate:50
                                },
                                type : 'category',
                                data : x,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'',
                                type:'bar',
                                barWidth: '60%',
                                data:y
                            }
                        ]
                    })
            },
            getPieData(){
                this.$axios.get("api/getStatusList").then((res) => {
                    this.drawPie(res.data.data[0],res.data.data[1],res.data.data[2],res.data.data[3],res.data.data[4])
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            getLineData(){
                this.$axios.get("api/countClock").then((res) => {
                    this.lineX = res.data.data.day
                    this.lineY = res.data.data.times
                    this.drawLine(this.arrayReverse(this.lineX),this.arrayReverse(this.lineY))
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            getBarData(){
                this.$axios.get("api/countRiverPatrol").then((res) => {
                    this.barX = res.data.data.month
                    this.barY = res.data.data.times
                    this.drawBar(this.arrayReverse(this.barX),this.arrayReverse(this.barY))
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            arrayReverse(originArray){
                var length = originArray.length
                var reverseArray = []
                for (var i = 0; i < length; i++) {
                    reverseArray[i] = originArray[length - i - 1];
                }
                return reverseArray
            },
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
            strToJson:function(str){
                var json = eval('(' + str + ')');
                return json;
            },//string转json
            arrStrToJson:function(arr){
                var length =arr.length
                for(var i = 0 ; i < length ; i++ ){
                    arr[i] = eval('(' + arr[i] + ')');
                }
                return arr;
            },//数组的string转json
            getGeoJsonFromRiverInformationData(){
                this.$axios.get("api/getAllRiverInfo",{
                    params:{
                        name:'',
                        level:'',
                        through:'',
                    }
                }).then((res) => {

                    var geojsonListFormat= []
                    var length = res.data.data.length
                    for(var i=0;i<length;i++){
                        geojsonListFormat.push(res.data.data[i].geo)
                    }
                    this.geojson = this.arrStrToJson(geojsonListFormat)
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容//获取geojson列表
            getGeoJsonFromGarbageData(){
                this.$axios.get("api/getRubbishInfoList").then((res) => {
                    var geojsonListFormat= []
                    var geojsonListFormat1= []
                    var geojsonListFormat2= []
                    var geojsonListFormat3= []
                    var length = res.data.data.length
                    for(var i=0;i<length;i++){
                        geojsonListFormat.push(res.data.data[i].geom)
                        geojsonListFormat1.push(res.data.data[i].xzmc)
                        geojsonListFormat2.push(res.data.data[i].xzcmc)
                        geojsonListFormat3.push(res.data.data[i].area)
                    }
                    this.geojson1 = this.arrStrToJson(geojsonListFormat)
                    this.xzmc = geojsonListFormat1
                    this.xzcmc = geojsonListFormat2
                    this.area = geojsonListFormat3
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取垃圾的geojson列表
            polygonClick(num){
                num = num+1
                this.getRiverInformationData(num)
            },//点击图层显示信息
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
                        console.log(err)
                    })
            },//显示river详情中的河长信息
            getRiverInformationData(num){
                this.$axios.get("api/getAllRiverInfo",{
                    params:{
                        name:'',
                        level:'',
                        through:'',
                    }
                }).then((res) => {
                    var length = res.data.data.length
                    for(var i=0;i<length;i++){
                        if(num === res.data.data[i].num){
                            this.detailRiverInformation[0] = '河流名称：' + res.data.data[i].name
                            this.detailRiverInformation[1] = '河流级别：' + res.data.data[i].level
                            this.detailRiverInformation[2] = '流域面积：' + res.data.data[i].area
                            this.detailRiverInformation[3] = '河流总长：' + res.data.data[i].totalLen
                            this.detailRiverInformation[4] = '流经本市长度：' + res.data.data[i].cityLenth
                            this.detailRiverInformation[5] = '流经市县：' + res.data.data[i].city
                            this.detailRiverInformation[6] = '流经乡镇：' + res.data.data[i].township
                        }
                    }
                    this.getRiverInformationPersonData(num)
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容
            pointGarbage() {
                this.$refs.map.mapObject.fitBounds([[19.618, 110.736], [19.623, 110.763]])
            },//跳转到垃圾
            pointRiver() {
                this.$refs.map.mapObject.fitBounds([[19.356, 110.463], [20.132, 111.044]])
            },//跳转到河流
            pointAirplane() {
                this.$refs.map.mapObject.fitBounds([[19.602, 110.734], [19.627, 110.777]])
            },//跳转到无人机
            garbageClick(index){
                    this.garbageInformation[0] = '乡镇名称：' + this.xzmc[index]
                    this.garbageInformation[1] = '行政村名称：' + this.xzcmc[index]
                    this.garbageInformation[2] = '面积(m²)：' + this.area[index]
                    this.garbageDialog = true
            },//垃圾点击
        },
        computed:{
            pageHeight(){
                return document.documentElement.clientHeight
            },
            pageWidth(){
                return document.documentElement.clientWidth
            },
            styleFunction () {
                const fillColor = this.fillColor // important! need touch fillColor in computed for re-calculate when change fillColor
                return () => {
                    return {
                        weight: 2,
                        color: 'red',
                        opacity: 1,
                        fillColor: fillColor,
                        fillOpacity: 0
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>
