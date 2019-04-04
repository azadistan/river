<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 50%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 1">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <l-tile-layer :url="url" :options="subdomains"></l-tile-layer>
                    <l-geo-json
                            :geojson="geojson"
                            @click="polygonClick()"
                            :options="{weight: 15}"
                    />
                </l-map>
            </v-card>
        </div>
        <div style="width: 50%;height: 100%;float: right">
            <v-tabs id="pmSearchResultTab"
                    color="white"
                    show-arrows
                    height="50px"
                    style=""
                    value="r1"
                    fixed-tabs
            >
                <v-tabs-slider color="blue"style="margin-left: 0px;"></v-tabs-slider>

                <v-tab href="#r1">
                    巡 河 问 题 上 报
                </v-tab>
                <v-tab href="#r2">
                    公 众 号 投 诉
                </v-tab>
                <v-tabs-items style="margin-top:0.25rem;">
                    <v-tab-item
                            id="r1"
                            key="1"
                    >
                        <div :style="'height:'+(pageHeight-120)+'px'">
                            <div class="elevation-1" style="height: 10%;width: 100%;">
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        处理状态：
                                    </div>
                                    <div style="width: 52%;float: left;">
                                        <v-select v-model="riverLevelSelect"   style="" :items="riverLevel" label="处理状态" single-line clearable></v-select>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        河道名称：
                                    </div>
                                    <div style="width: 50%;float: left;">
                                        <v-text-field
                                                single-line
                                                label="河道名称"
                                        ></v-text-field>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        上报日期：
                                    </div>
                                    <div style="width: 50%;float: left;">
                                        <v-menu
                                                ref="startDateMenu"
                                                :close-on-content-click="false"
                                                v-model="startDateMenu"
                                                :nudge-right="40"
                                                :return-value.sync="startDate"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px"
                                        >
                                            <v-text-field
                                                    single-line
                                                    slot="activator"
                                                    label="巡河日期"
                                                    readonly
                                                    v-model="startDate"
                                            ></v-text-field>
                                            <v-date-picker v-model="startDate" locale="zh-cn">
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="startDateMenu = false">取消</v-btn>
                                                <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">保存修改</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <v-btn color="info" disabled>查询</v-btn>
                                </div>
                            </div>
                            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem">
                                <div class="elevation-2" >
                                    <v-data-table
                                            v-model="selected"
                                            :headers="headers"
                                            :items="riverDetails"
                                            :search="search"
                                            hide-actions
                                            :pagination.sync="pagination"
                                            class="elevation-1"
                                            item-key="riverEventReportingTime"
                                    >
                                        <template slot="items" slot-scope="props">
                                            <tr :active="props.selected" @click="areaShow(props.item.riverId)">
                                                <td>{{ props.item.riverEventReportingTime }}</td>
                                                <td>{{ props.item.riverEventReportingAddress }}</td>
                                                <td>{{ props.item.riverEventReportingPerson }}</td>
                                                <td>{{ props.item.riverEventDetails }}</td>
                                                <td>{{ props.item.riverEventStatus }}</td>
                                            </tr>
                                        </template>
                                    </v-data-table>

                                </div>
                            </div>
                            <div class="elevation-1" style="height: 10%;width: 100%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                <div class="text-xs-center pt-2" style="width: 100%;">
                                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                                </div>
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tab-item
                            id="r2"
                            key="2"
                    >
                        <div :style="'height:'+(pageHeight-120)+'px'">
                            <div class="elevation-1" style="height: 10%;width: 100%;">
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        处理状态：
                                    </div>
                                    <div style="width: 52%;float: left;">
                                        <v-select
                                                v-model="riverLevelSelect"
                                                :items="riverLevel"
                                                label="处理状态"
                                                single-line
                                                clearable
                                        ></v-select>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        河道名称：
                                    </div>
                                    <div style="width: 50%;float: left;">
                                        <v-text-field
                                                label="河道名称"
                                                single-line
                                        ></v-text-field>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        上报日期：
                                    </div>
                                    <div style="width: 50%;float: left;">
                                        <v-menu
                                                ref="startDateMenu1"
                                                :close-on-content-click="false"
                                                v-model="startDateMenu1"
                                                :nudge-right="40"
                                                :return-value.sync="startDate1"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px"
                                        >
                                            <v-text-field
                                                    single-line
                                                    slot="activator"
                                                    label="请选择巡河日期"
                                                    readonly
                                                    v-model="startDate1"
                                            ></v-text-field>
                                            <v-date-picker v-model="startDate1" locale="zh-cn">
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="startDateMenu1 = false">取消</v-btn>
                                                <v-btn flat color="primary" @click="$refs.startDateMenu1.save(startDate1)">保存修改</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <v-btn color="info" disabled>查询</v-btn>
                                </div>
                            </div>
                            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem">
                                <div class="elevation-2" >
                                    <v-data-table
                                            v-model="selected2"
                                            :headers="headers2"
                                            :items="riverDetails2"
                                            :search="search2"
                                            hide-actions
                                            :pagination.sync="pagination2"
                                            class="elevation-1"
                                            item-key="riverEventReportingTime"
                                    >
                                        <template slot="items" slot-scope="props">
                                            <tr :active="props.selected2" @click="areaShow(props.item.riverId)">
                                                <td>{{ props.item.riverEventReportingTime }}</td>
                                                <td>{{ props.item.riverEventReportingAddress }}</td>
                                                <td>{{ props.item.riverEventReportingPerson }}</td>
                                                <td>{{ props.item.riverEventDetails }}</td>
                                                <td>{{ props.item.riverEventStatus }}</td>
                                            </tr>
                                        </template>
                                    </v-data-table>

                                </div>
                            </div>
                            <div class="elevation-1" style="height: 10%;width: 100%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                <div class="text-xs-center pt-2" style="height:100%;width: 100%;">
                                    <v-pagination v-model="pagination2.page" :length="pages2"></v-pagination>
                                </div>
                            </div>
                        </div>
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
        </div>

        <v-dialog v-model="riverInformationDialog1" width="1000">
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>事件信息
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-stepper vertical="true">
                            <v-stepper-step step="1" complete>
                                问题上报
                            </v-stepper-step>

                            <v-stepper-content  step="1">
                                <v-card color="white lighten-1" class=" elevation-2" >

                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation[0]" style="width: 32%;"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation[1]" style="width: 32%"></div>
                                            <div v-html="detailRiverInformation[2]" style="width: 32%"></div>
                                            <div v-html="detailRiverInformation[3]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation[4]" style="width: 64%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <v-stepper-step step="1" complete>已撤销</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" >

                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation2[0]" style="width: 32%;"></div>
                                            <div v-html="detailRiverInformation2[1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation2[2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                        </v-stepper>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="riverInformationDialog1 = false">关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="riverInformationDialog" width="1000">
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>事件信息
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-stepper vertical="true">
                            <v-stepper-step step="1" complete>
                                问题上报
                            </v-stepper-step>

                            <v-stepper-content  step="1">
                                <v-card color="white lighten-1" class=" elevation-2" >

                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation[0]" style="width: 32%;"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation[1]" style="width: 32%"></div>
                                            <div v-html="detailRiverInformation[2]" style="width: 32%"></div>
                                            <div v-html="detailRiverInformation[3]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation[4]" style="width: 64%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <v-stepper-step step="1" complete>已审核</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" >

                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation2[0]" style="width: 32%;"></div>
                                            <div v-html="detailRiverInformation2[1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>

                                            <div v-html="detailRiverInformation2[2]" style="width: 32%"></div>
                                            <div v-html="detailRiverInformation2[3]" style="width: 64%"></div>
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <v-stepper-step step="1" complete>已整改</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" >

                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation3[0]" style="width: 32%;"></div>
                                            <div v-html="detailRiverInformation3[1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>

                                            <div v-html="detailRiverInformation3[2]" style="width: 32%"></div>
                                            <div v-html="detailRiverInformation3[3]" style="width: 64%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/after1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/after2.jpg">
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <v-stepper-step step="4" >待确认</v-stepper-step>

                            <v-stepper-content step="1" >
                                <v-card color="white lighten-1" class=" elevation-2" >

                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation4[0]" style="width: 32%;"></div>
                                            <div v-html="detailRiverInformation4[1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="detailRiverInformation4[2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                        </v-stepper>
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
    import { LMap,LGeoJson,LLayerGroup,LTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'
    export default {
        name: "river-event-list",
        components: {
            LMap,
            LTileLayer,
            LGeoJson,
            LLayerGroup,
        },
        data () {
            return{
                e13: 1,
                detailRiverInformation:['问题来源：河长上报','上报时间：2018-10-17 10:12:23','上报人：沙荖河-重兴镇河长 符策万','上报地点：沙荖河重兴镇','问题描述：沙荖河流经重兴镇河段有异常气味，疑似周围堆放过多垃圾及污水排放'],
                detailRiverInformation1:['操作时间：2018-10-30 09:10:42','经办人：文昌市河长 任怀锋','操作：问题撤销','原因：重新整理问题再上报'],
                detailRiverInformation2:['操作时间：2018-10-20 09:20:22','经办人：文昌市河长 任怀锋','操作：转镇级处理'],
                detailRiverInformation3:['操作时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：整改处理','内容：整改处理河水污染情况'],
                detailRiverInformation4:['操作时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回'],
                //地图相关data
                zoom:11,
                center: L.latLng(19.71801, 110.75918),
                url: this.$store.state.mapUrl,
                subdomains: this.$store.state.mapSubdomains,
                option: {zoomControl: false, attributionControl: false},
                geojson:'',
                geojson1:"{\"type\":\"LineString\",\"coordinates\":[[110.69959,19.81612],[110.70063,19.815592],[110.70133,19.815334],[110.70208,19.815228],[110.70246,19.81535],[110.70278,19.815197],[110.70319,19.81483],[110.70345,19.814632],[110.704056,19.814495],[110.70442,19.814314],[110.704544,19.814238],[110.70488,19.814314],[110.705185,19.814405],[110.70552,19.814253],[110.70575,19.814085],[110.70589,19.813948],[110.7063,19.81413],[110.70659,19.81448],[110.70697,19.814678],[110.70811,19.814754],[110.70858,19.814678],[110.70913,19.814663],[110.70957,19.814785],[110.70986,19.814754],[110.71018,19.81474],[110.71041,19.814754],[110.710686,19.814693],[110.71104,19.814632],[110.71128,19.814602],[110.71152,19.814602],[110.71179,19.814587],[110.71211,19.81451],[110.712494,19.814436],[110.71278,19.81442],[110.71303,19.814587],[110.71352,19.81474],[110.71394,19.814785],[110.71425,19.814861],[110.714645,19.815151],[110.71492,19.815258],[110.71517,19.815516],[110.715385,19.815874],[110.715485,19.816034],[110.71551,19.816225],[110.715485,19.81643],[110.71555,19.816528],[110.71565,19.816528],[110.715775,19.816727],[110.71582,19.816841],[110.71594,19.81694],[110.71637,19.817434],[110.716545,19.817732],[110.71661,19.8179],[110.71647,19.818113],[110.716644,19.818129],[110.71683,19.818121],[110.716896,19.818098],[110.71695,19.81822],[110.71696,19.818394],[110.71696,19.818455],[110.717186,19.818401],[110.71733,19.818356],[110.717514,19.81847],[110.717575,19.818607],[110.717575,19.81876],[110.717575,19.81892],[110.7176,19.819035],[110.717674,19.819073],[110.71779,19.819218],[110.71777,19.81946],[110.717766,19.819605],[110.718056,19.819834],[110.71808,19.820223],[110.71807,19.820526],[110.71806,19.820793],[110.71791,19.821075],[110.71791,19.821234],[110.71799,19.821463],[110.718124,19.821585],[110.718155,19.821638],[110.71815,19.82179],[110.71804,19.821966],[110.71797,19.822186],[110.71795,19.822521],[110.71797,19.822895],[110.71805,19.823109],[110.71812,19.823381]]}",
                geojson2:"{\"type\":\"LineString\",\"coordinates\":[[110.63859,19.38177],[110.63886,19.381704],[110.639046,19.381626],[110.63925,19.381529],[110.63937,19.381409],[110.63945,19.381237],[110.63951,19.38107],[110.63958,19.380955],[110.6398,19.380548],[110.63985,19.380478],[110.64002,19.3802],[110.64025,19.379854],[110.64057,19.379557],[110.64089,19.379326],[110.64134,19.379244],[110.64194,19.379278],[110.64255,19.379398],[110.642746,19.379478],[110.64314,19.379478],[110.64375,19.379433],[110.644356,19.379396],[110.644966,19.37928],[110.64556,19.379171],[110.645645,19.379171],[110.64576,19.379135],[110.64617,19.378782],[110.64657,19.378284],[110.64657,19.378212],[110.646805,19.377745],[110.64686,19.377634],[110.6469,19.377445],[110.64713,19.377066],[110.647255,19.376911],[110.647705,19.376604],[110.64831,19.376106],[110.64867,19.375763],[110.64912,19.37504],[110.64908,19.374924],[110.64892,19.374733],[110.64863,19.374542],[110.648346,19.374426],[110.64823,19.374346],[110.64815,19.374155],[110.64827,19.373585],[110.64831,19.373505],[110.64827,19.373007],[110.64815,19.372816],[110.648026,19.3727],[110.64775,19.372627],[110.64714,19.372816],[110.64694,19.372904],[110.64666,19.37292],[110.64659,19.372915],[110.64621,19.372711],[110.645706,19.372555],[110.64513,19.372345],[110.64507,19.372313],[110.64483,19.37193],[110.64449,19.371122],[110.64429,19.370646],[110.64426,19.370367],[110.64426,19.370256],[110.644356,19.369688],[110.64436,19.369434],[110.64438,19.368822],[110.64438,19.36847],[110.64438,19.36841],[110.644394,19.368301],[110.6445,19.36809],[110.64468,19.367846],[110.6448,19.367664],[110.64499,19.36721],[110.6451,19.366919],[110.64528,19.366703],[110.64548,19.366568],[110.64559,19.36654],[110.645676,19.366535],[110.646194,19.366703],[110.646545,19.366817],[110.646706,19.366854],[110.64694,19.366858],[110.64709,19.366816],[110.64717,19.366783],[110.64728,19.366718],[110.647606,19.366472],[110.64761,19.366465],[110.64775,19.366266],[110.647865,19.36613],[110.648125,19.36593],[110.64815,19.365915],[110.6482,19.365839],[110.64832,19.365585],[110.64835,19.365368],[110.648415,19.365232],[110.64849,19.365114],[110.648575,19.36507],[110.64865,19.365032],[110.64875,19.36501],[110.64887,19.36501],[110.64917,19.365032],[110.64936,19.365091],[110.64964,19.365274],[110.64971,19.365334],[110.649796,19.365353],[110.649895,19.365353],[110.64996,19.36533],[110.65006,19.365217],[110.65014,19.364996],[110.65015,19.364988],[110.6502,19.36477],[110.65037,19.36416],[110.65058,19.363619],[110.65086,19.362783],[110.65095,19.362656],[110.651085,19.36256],[110.65113,19.362549],[110.65131,19.362509],[110.65161,19.36252]]}",

                //查询条件相关data
                riverLevel:['未处理','处理中','已完成','已撤销'],
                riverLevelSelect:'',
                riverCounty:['文城镇','冯坡镇','东郊镇','东路镇','公坡镇','铺前镇','翁田镇','文教镇','蓬莱镇','锦山镇','昌洒镇','东阁镇','会文镇','抱罗镇','龙楼镇','潭牛镇','重兴镇'],
                riverCountySelect:'',
                startDateMenu:false,
                startDate:new Date().toISOString().substr(0, 10),
                startDateMenu1:false,
                startDate1:new Date().toISOString().substr(0, 10),

                //图表1相关data
                search: '',
                pagination: {
                    rowsPerPage:6,
                    totalItems:6,
                },
                selected: [],
                headers: [
                    {
                        text: '上报时间',
                        align: 'left',
                        sortable: true,
                        value: 'riverEventReportingTime'
                    },
                    { text: '地点', value: 'riverEventReportingAddress' },
                    { text: '上报人', value: 'riverEventReportingPerson' },
                    { text: '问题描述', value: 'riverEventDetails' },
                    { text: '状态', value: 'riverEventStatus' },
                ],
                riverDetails: [
                    {
                        riverId:1,
                        riverEventReportingTime: '2018-10-12 8:30:10',
                        riverEventReportingAddress: '沙荖河-重兴镇',
                        riverEventReportingPerson: '付策万',
                        riverEventDetails: '沙荖河流经重兴镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:2,
                        riverEventReportingTime: '2018-10-12 8:42:10',
                        riverEventReportingAddress: '南洋河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南洋河流经抱罗镇河段污染严重',
                        riverEventStatus: '已撤销',
                    },{
                        riverId:2,
                        riverEventReportingTime: '2018-10-12 10:30:10',
                        riverEventReportingAddress: '南洋河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南洋河流经抱罗镇河段污染严重',
                        riverEventStatus: '已撤销',
                    },
                    {
                        riverId:1,
                        riverEventReportingTime: '2018-10-13 12:22:22',
                        riverEventReportingAddress: '沙荖河-重兴镇',
                        riverEventReportingPerson: '付策万',
                        riverEventDetails: '沙荖河流经重兴镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:1,
                        riverEventReportingTime: '2018-10-13 15:11:44',
                        riverEventReportingAddress: '沙荖河-重兴镇',
                        riverEventReportingPerson: '付策万',
                        riverEventDetails: '沙荖河流经重兴镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:2,
                        riverEventReportingTime: '2018-10-13 16:30:55',
                        riverEventReportingAddress: '南洋河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南洋河流经抱罗镇河段污染严重',
                        riverEventStatus: '已撤销',
                    },
                ],

                //图表2相关data
                search2: '',
                pagination2: {
                    rowsPerPage:4,
                    totalItems:4,
                },
                selected2: [],
                headers2: [
                    {
                        text: '上报时间',
                        align: 'left',
                        sortable: true,
                        value: 'riverEventReportingTime'
                    },
                    { text: '地点', value: 'riverEventReportingAddress' },
                    { text: '上报人', value: 'riverEventReportingPerson' },
                    { text: '问题描述', value: 'riverEventDetails' },
                    { text: '状态', value: 'riverEventStatus' },
                ],
                riverDetails2: [
                    {
                        riverId:1,
                        riverEventReportingTime: '2018-10-12 8:30:10',
                        riverEventReportingAddress: '沙荖河-重兴镇',
                        riverEventReportingPerson: '付策万',
                        riverEventDetails: '沙荖河流经重兴镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:2,
                        riverEventReportingTime: '2018-10-12 8:42:10',
                        riverEventReportingAddress: '南洋河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南洋河流经抱罗镇河段污染严重',
                        riverEventStatus: '已撤销',
                    },
                    {
                        riverId:1,
                        riverEventReportingTime: '2018-10-13 15:11:44',
                        riverEventReportingAddress: '沙荖河-重兴镇',
                        riverEventReportingPerson: '付策万',
                        riverEventDetails: '沙荖河流经重兴镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:2,
                        riverEventReportingTime: '2018-10-13 16:30:55',
                        riverEventReportingAddress: '南洋河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南洋河流经抱罗镇河段污染严重',
                        riverEventStatus: '已撤销',
                    },
                ],
                //其他data
                riverInformationDialog:false,
                riverInformationDialog1:false,
                riverInformationDialog2:false,
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
            this.polygon= this.lngToLat(this.polygonCC)
        },
        methods:{
            areaShow(riverId){

                if(riverId === 1){
                    this.geojson = this.strToJson(this.geojson1)
                    this.imgBounds = this.geojson.coordinates
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates))
                    this.riverInformationDialog = true
                }
                if(riverId === 2){

                    this.geojson = this.strToJson(this.geojson2)
                    this.imgBounds = this.geojson.coordinates
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates))
                    this.riverInformationDialog1 = true
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
            },
            pages2 () {
                return Math.ceil(this.pagination2.totalItems / this.pagination2.rowsPerPage)
            }
        }
    }
</script>

<style scoped>

</style>
