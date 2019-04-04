<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 50%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 1">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <!--<l-tile-layer :url="url" :options="subdomains"></l-tile-layer>-->
                    <l-wms-tile-layer :base-url="baseUrl" :layers="layersName"  :format="format" transparent="transparent" ></l-wms-tile-layer>
                    <l-geo-json
                            :geojson="geojson1"
                            @click="geojson1Click()"
                            :options="{weight: 10}"
                    />
                    <l-geo-json
                            :geojson="geojson2"
                            @click="geojson2Click()"
                            :options="{weight: 10}"
                    />
                    <l-geo-json
                            :geojson="geojson3"
                            @click="geojson3Click()"
                            :options="{weight: 10}"
                    />
                </l-map>
            </v-card>
        </div>
        <div style="width: 50%;height: 100%;float: right">
            <div class="elevation-1" style="height: 10%;width: 100%;">
                <div style="float: left;height: 100%;width: 40%;text-align:center;display:flex;justify-content:center;align-items:center;">
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
                <div style="float: left;height: 100%;width: 40%;text-align:center;display:flex;justify-content:center;align-items:center;">
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
                <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <v-btn color="info" @click="riverManagerInformationDataSearch()">查询</v-btn>
                </div>
            </div>
            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem;overflow-y:scroll;overflow-x:scroll">
                <div class="elevation-2" >
                    <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="riverManagerDetails"
                            :search="search"
                            hide-actions
                            :pagination.sync="pagination"
                            class="elevation-1"
                            item-key="riverManagerName"
                    >
                        <template slot="items" slot-scope="props">
                            <tr :active="props.selected" @click="areaShow(props.item.riverManagerId)">
                                <td style="color:#3486D7;cursor: pointer" @click="getRiverManagerInformationDataClick(props.item.riverManagerId,props.item.riverManagerName,props.item.riverManagerLevels,props.item.riverManagerPhoneNumber,props.item.riverManagerRivers)">{{ props.item.riverManagerName }}</td>
                                <td>{{ props.item.riverManagerLevels }}</td>
                                <td>{{ props.item.riverManagerPhoneNumber }}</td>
                                <td>{{ props.item.riverManagerRivers }}</td>
                            </tr>
                        </template>
                        <v-alert slot="no-data" :value="true" color="error" icon="warning">
                            找不到相关的数据！
                        </v-alert>
                    </v-data-table>

                </div>
            </div>
            <div class="elevation-1" style="height: 10%;width: 100%;text-align:center;display:flex;justify-content:center;align-items:center;">
                <div class="text-xs-center pt-2" style="height:100%;width: 100%;">
                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                </div>
            </div>
        </div>

        <v-dialog v-model="riverManagerDialog" width="35%" hide-overlay>
            <v-card>
                <v-card-title>
                    <div style="width: 100%;margin-left: 1rem">
                        <div style="width: 100%;height: 2.5rem;text-align:center;display:flex;justify-content:left;align-items:center;">
                            <v-icon
                                    color="grey lighten-1"
                            >
                                person
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">河长基本信息</div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="detailRiverManager[0]" style="width: 33%;"></div>
                            <div v-html="detailRiverManager[1]" style="width: 33%;"></div>
                        </div>
                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                            <div v-html="detailRiverManager[2]" style="width: 33%"></div>
                            <div v-html="detailRiverManager[3]" style="width: 33%"></div>
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
                                list
                            </v-icon>
                            <div style="font-size: 16px;margin-left:1rem;">负责河流信息</div>
                        </div>
                        <div v-show="detailRiverInformation12"  style="width: 100%;height: 12.5rem;text-align:left;display:flex;justify-content:left;align-items:center;margin-top: 1rem">
                            <div style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverInformationList[0][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverInformationList[0][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[0][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[0][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[0][4]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[0][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[0][6]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                            <div style="width: 5%;height: 100%"></div>
                            <div v-show="detailRiverInformation2" style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverInformationList[1][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverInformationList[1][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[1][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[1][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[1][4]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[1][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[1][6]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                        </div>
                        <div v-show="detailRiverInformation34" style="width: 100%;height: 12.5rem;text-align:left;display:flex;justify-content:left;align-items:center;margin-top: 1rem">
                            <div style="width: 45%;height: 100%;border: 1px solid #d8d8d8;padding-left: 0.5rem">
                                <div v-html="detailRiverInformationList[2][0]" style="height: 1.5rem;width: 100%;margin-top: 0.5rem"></div>
                                <div v-html="detailRiverInformationList[2][1]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[2][2]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[2][3]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[2][4]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[2][5]" style="height: 1.5rem;width: 100%"></div>
                                <div v-html="detailRiverInformationList[2][6]" style="height: 1.5rem;width: 100%"></div>
                            </div>
                        </div>
                    </div>

                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="riverManagerDialog = false">关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog >
        <v-dialog v-model="riverInformationDialog" width="35%">
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
    </div>
</template>

<script>
    import { LMap,LPolygon,LMarker,LPopup,LLayerGroup,LGeoJson,LTileLayer,LWMSTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'
    import '../lib/L.Control.MousePosition'
    export default {
        name: "river-manager-information",
        components: {
            LMap,
            LTileLayer,
            LMarker,
            LPopup,
            LPolygon,
            LLayerGroup,
            LGeoJson,
            'l-wms-tile-layer': LWMSTileLayer
        },
        data () {
            return{
                //地图相关data
                zoom:11,
                center: L.latLng(19.71801, 110.75918),
                bounds:this.$store.state.mapBounds,
                url: this.$store.state.url,
                subdomains: this.$store.state.mapSubdomains,
                option: {zoomControl: false, attributionControl: false},
                baseUrl: this.$store.state.baseUrl,
                layersName:this.$store.state.layersName,
                format: this.$store.state.layerFormat,
                transparent: true,
                geojson1:'',
                geojson2:'',
                geojson3:'',

                //查询条件相关data
                riverManager:['钟鸣明','王晓桥','何欢宝','李娇慧','吴小洪','任怀锋','张毅','符策万','符永高','王茀甫','许环峰','杜冰','刘庆棠','徐健超','吕烈炜',
                              '邢艳','王宏伟','杨兹农','陈文慧','陈文强', '朱兴育','黄心奋','邢福健','林勉','韩松元','陈东明','郑鸿雁','林方江','杨兹富','符斌','王云',
                              '陈文学','郑有雷','张光润','严世巍','符日伟', '李湘燕','邓德雄','符方利','唐甸远','郑学','邢彩虹','范高满','孙人培','王兰英','陈丹','陈明泽',
                              '林明恺','韩锐光','李道俊','韩红光','吴清雄','邓海闻', '符力','陈少波','凌波','甘大韧'],
                riverManagerSelect:'',
                riverName:['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖'],
                riverNameSelect:'',

                //图表相关data
                search: '',
                pagination: {
                    rowsPerPage:12,
                    totalItems:57,
                },
                selected: [],
                headers: [
                    {
                        text: '河长姓名',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    { text: '职务', value: 'riverManagerLevels' },
                    { text: '联系方式', value: 'riverManagerPhoneNumber' },
                    { text: '负责河流', value: 'riverManagerRivers' },
                ],
                riverManagerDetails: [
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市委常委 市委宣传部部长',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市级',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市委常委 市委宣传部部长',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                    {
                        riverId:1,
                        riverManagerName: '李娇慧',
                        riverManagerLevels: '市委常委 市委宣传部部长',
                        riverManagerPhoneNumber: 13112345678,
                        riverManagerRivers: '永丰水',
                    },
                ],

                //河长详情弹窗相关data
                riverManagerDialog:false,
                detailRiverManager:[],
                detailRiverInformationList:[['河流名称：文教河1','河流级别：省级','流域面积：110.76km2','河流总长：30.27km','流经本市长度：4.8km','流经市县：海口 安定 文昌','流经乡镇：蓬莱镇'],['河流名称：文教河2','河流级别：省级','流域面积：110.76km2','河流总长：30.27km','流经本市长度：4.8km','流经市县：海口 安定 文昌','流经乡镇：蓬莱镇'],['河流名称：文教河3','河流级别：省级','流域面积：110.76km2','河流总长：30.27km','流经本市长度：4.8km','流经市县：海口 安定 文昌','流经乡镇：蓬莱镇']],
                detailRiverInformationListLength:0,
                detailRiverInformation12:true,
                detailRiverInformation2:true,
                detailRiverInformation34:true,

                //河流详情弹窗相关data
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
            this.$refs.map.mapObject.on('click', this.mapClick)
            this.getRiverManagerInformationData('','')
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
            areaShow(riverManagerId){
                this.$axios.get("api/getPersonRiverDetail",{
                    params:{
                        num:riverManagerId,
                    }
                }).then((res) => {
                    var length = res.data.data.length
                    if(length === 0){
                        this.geojson1 = ''
                        this.geojson2 = ''
                        this.geojson3 = ''
                    }
                    if(length === 1){
                        if(this.strToJson(res.data.data[0].geo).type === 'LineString'){
                            this.geojson1 = this.strToJson(res.data.data[0].geo)
                            this.geojson2 = ''
                            this.geojson3 = ''
                            this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson1.coordinates))
                        }
                        else{
                            this.geojson1 = this.strToJson(res.data.data[0].geo)
                            this.geojson2 = ''
                            this.geojson3 = ''
                            this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson1.coordinates[0]))
                        }

                    }
                    if(length === 2){
                        if(this.strToJson(res.data.data[0].geo).type === 'LineString' && this.strToJson(res.data.data[1].geo).type === 'Polygon'){
                            this.geojson1 = this.strToJson(res.data.data[0].geo)
                            this.geojson2 = this.strToJson(res.data.data[1].geo)
                            this.geojson3 = ''
                            var a = this.geoJsonLngToLat(this.geojson1.coordinates).concat(this.geoJsonLngToLat(this.geojson2.coordinates[0]))
                            this.$refs.map.mapObject.fitBounds(a)
                        }
                        else{
                            this.geojson1 = this.strToJson(res.data.data[0].geo)
                            this.geojson2 = this.strToJson(res.data.data[1].geo)
                            this.geojson3 = ''
                            var a = this.geoJsonLngToLat(this.geojson2.coordinates).concat(this.geoJsonLngToLat(this.geojson1.coordinates))
                            this.$refs.map.mapObject.fitBounds(a)
                        }

                    }
                    if(length === 3){
                        this.geojson1 = this.strToJson(res.data.data[0].geo)
                        this.geojson2 = this.strToJson(res.data.data[1].geo)
                        this.geojson3 = this.strToJson(res.data.data[2].geo)
                        var a = this.geoJsonLngToLat(this.geojson1.coordinates).concat(this.geoJsonLngToLat(this.geojson2.coordinates))
                        var b = a.concat(this.geoJsonLngToLat(this.geojson3.coordinates))
                        this.$refs.map.mapObject.fitBounds(b)
                    }
                })
                    .catch(function (err) {
                        console.log(err)
                    })
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
            getRiverManagerInformationDataClick(riverManagerId,riverManagerName,riverManagerLevels,riverManagerPhoneNumber,riverManagerRivers){
                this.detailRiverManager[0] = '河长姓名：' + riverManagerName
                this.detailRiverManager[1] = '职务：' + riverManagerLevels
                this.detailRiverManager[2] = '联系方式：' + riverManagerPhoneNumber
                this.detailRiverManager[3] = '负责河流：' + riverManagerRivers
                this.getRiverInformationPersonData(riverManagerId)
            },
            getRiverInformationPersonData(num){
                this.$axios.get("api/getPersonRiverDetail",{
                    params:{
                        num:num,
                    }
                }).then((res) => {
                    var resultListFormat= [['','','','','',''],['','','','','',''],['','','','','','']]
                    var length = res.data.data.length
                    this.detailRiverInformationListLength = length
                    if(length === 0){
                        this.detailRiverInformation12 = false
                        this.detailRiverInformation2 = false
                        this.detailRiverInformation34 = false
                    }
                    if(length === 1){
                        this.detailRiverInformation12 = true
                        this.detailRiverInformation2 = false
                        this.detailRiverInformation34 = false
                    }
                    if(length === 2){
                        this.detailRiverInformation12 = true
                        this.detailRiverInformation2 = true
                        this.detailRiverInformation34 = false
                    }
                    if(length === 3){
                        this.detailRiverInformation12 = true
                        this.detailRiverInformation2 = true
                        this.detailRiverInformation34 = true
                    }
                    for(var i=0;i<length;i++){
                        resultListFormat[i] = [
                            '河流名称：'+res.data.data[i].name,
                            '河流级别：'+res.data.data[i].level,
                            '流域面积：'+res.data.data[i].area,
                            '河流总长：'+res.data.data[i].totalLen,
                            '流经本市长度：'+res.data.data[i].cityLenth,
                            '流经市县：'+res.data.data[i].city,
                            '流经乡镇：'+res.data.data[i].township,
                        ]
                    }
                    this.detailRiverInformationList = resultListFormat
                    this.riverManagerDialog = true
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//显示manager详情中的河流信息
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
            riverManagerInformationDataSearch(){
                this.getRiverManagerInformationData(this.riverManagerSelect,this.riverNameSelect)
            },//河长信息查询
            getRiverManagerInformationData(name,river){
                if(name === null || name === undefined){
                    name = ''
                }
                if(river === null || river === undefined){
                    river = ''
                }
                this.$axios.get("api/getPersonList",{
                    params:{
                        name:name,
                        river:river,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination.totalItems = length
                    for(var i=0;i<length;i++){
                        resultListFormat.push(
                            {
                                riverManagerId:res.data.data[i].num,
                                riverManagerName:res.data.data[i].name,
                                riverManagerLevels: res.data.data[i].position,
                                riverManagerPhoneNumber: res.data.data[i].phone,
                                riverManagerRivers: res.data.data[i].manageRiver,
                            })
                    }
                    this.riverManagerDetails = resultListFormat
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容
            geojson1Click(){

            },//河流1点击显示
            geojson2Click(){},//河流2点击显示
            geojson3Click(){},//河流3点击显示
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