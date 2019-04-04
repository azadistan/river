<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 50%; height:100%;float:left">
            <v-card style="width: 100%; height: 100%; z-index: 1">
                <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                    <l-tile-layer :url="url" :options="subdomains"></l-tile-layer>
                    <l-geo-json
                            :geojson="geojson"
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
                                        <v-select v-model="processingStatusSelect"   style="" :items="processingStatus" label="处理状态" single-line clearable></v-select>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        河道名称：
                                    </div>
                                    <div style="width: 50%;float: left;">
                                        <v-select
                                                :items="riverName"
                                                label="河道名称"
                                                single-line
                                                v-model="riverNameSelect"
                                        ></v-select>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        上报日期：
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
                                    <v-btn color="info" @click="eventListSearch()">查询</v-btn>
                                </div>
                            </div>
                            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem">
                                <div class="elevation-2" >
                                    <v-data-table
                                            v-model="selected"
                                            :headers="headers"
                                            :items="eventListDetails"
                                            :search="search"
                                            hide-actions
                                            :pagination.sync="pagination"
                                            class="elevation-1"
                                            item-key="riverEventReportingTime"
                                    >
                                        <template slot="items" slot-scope="props">
                                            <tr :active="props.selected" @click="areaShow(props.item.riverGeo,props.item.riverEventReportingAddress)">
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
                                                v-model="processingStatusSelect1"
                                                :items="processingStatus1"
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
                                        <v-select
                                                :items="riverName1"
                                                label="河道名称"
                                                single-line
                                                v-model="riverNameSelect1"
                                        ></v-select>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <div style="width: 35%;float: left">
                                        上报日期：
                                    </div>
                                    <div style="width: 50%;float: left;">
                                        <v-menu
                                                :close-on-content-click="false"
                                                v-model="startDateMenu1"
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
                                                    v-model="startDate1"
                                                    prepend-inner-icon="date_range"
                                            ></v-text-field>
                                            <v-date-picker v-model="startDate1" v-if="startDateMenu1" @input="startDateMenu1 = false" no-title  locale="zh-cn">
                                            </v-date-picker>
                                        </v-menu>
                                    </div>
                                </div>
                                <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                                    <v-btn color="info" @click="eventListSearch2()">查询</v-btn>
                                </div>
                            </div>
                            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem">
                                <div class="elevation-2" >
                                    <v-data-table
                                            v-model="selected2"
                                            :headers="headers2"
                                            :items="eventListDetails2"
                                            :search="search2"
                                            hide-actions
                                            :pagination.sync="pagination2"
                                            class="elevation-1"
                                            item-key="riverEventReportingTime"
                                    >
                                        <template slot="items" slot-scope="props">
                                            <tr :active="props.selected2" @click="areaShow1(props.item.riverGeo,props.item.riverEventReportingAddress)">
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

        <v-dialog v-model="eventListDialog" width="1000">
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>事件信息
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-stepper vertical="true">
                            <v-stepper-step step="1" complete>问题上报</v-stepper-step>

                            <v-stepper-content  step="1">
                                <v-card color="white lighten-1" class="elevation-2">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event1ProblemReport[0]" style="width: 32%;"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event1ProblemReport[1]" style="width: 32%"></div>
                                            <div v-html="event1ProblemReport[2]" style="width: 32%"></div>
                                            <div v-html="event1ProblemReport[3]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event1ProblemReport[4]" style="width: 64%"></div>
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
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[0][0]" style="width: 32%;"></div>
                                            <div v-html="event2Review[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[0][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[0][0]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[0][2]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[0][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[1][0]" style="width: 32%;"></div>
                                            <div v-html="event2Review[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[1][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[1][0]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[1][2]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[1][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[2][0]" style="width: 32%;"></div>
                                            <div v-html="event2Review[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[2][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[2][0]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[2][2]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[2][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[3][0]" style="width: 32%;"></div>
                                            <div v-html="event2Review[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[3][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[3][0]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[3][2]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[3][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[4][0]" style="width: 32%;"></div>
                                            <div v-html="event2Review[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[4][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[4][0]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2ReviewBack[4][2]" style="width: 32%;"></div>
                                            <div v-html="event2ReviewBack[4][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[5][0]" style="width: 32%;"></div>
                                            <div v-html="event2Review[5][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event2Review[5][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <v-stepper-step step="1" complete>已转办</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[0][0]" style="width: 32%;"></div>
                                            <div v-html="event3Transfer[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[0][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[0][0]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[0][2]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[0][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[1][0]" style="width: 32%;"></div>
                                            <div v-html="event3Transfer[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[1][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[1][0]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[1][2]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[1][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[2][0]" style="width: 32%;"></div>
                                            <div v-html="event3Transfer[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[2][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[2][0]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[2][2]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[2][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[3][0]" style="width: 32%;"></div>
                                            <div v-html="event3Transfer[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[3][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[3][0]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[3][2]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[3][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[4][0]" style="width: 32%;"></div>
                                            <div v-html="event3Transfer[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[4][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[4][0]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3TransferBack[4][2]" style="width: 32%;"></div>
                                            <div v-html="event3TransferBack[4][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[5][0]" style="width: 32%;"></div>
                                            <div v-html="event3Transfer[5][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event3Transfer[5][2]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <v-stepper-step step="1" complete>已整改</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[0][0]" style="width: 32%;"></div>
                                            <div v-html="event4Rectification[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[0][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[0][0]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[0][2]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[0][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[1][0]" style="width: 32%;"></div>
                                            <div v-html="event4Rectification[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[1][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[1][0]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[1][2]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[1][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[2][0]" style="width: 32%;"></div>
                                            <div v-html="event4Rectification[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[2][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[2][0]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[2][2]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[2][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[3][0]" style="width: 32%;"></div>
                                            <div v-html="event4Rectification[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[3][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[3][0]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[3][2]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[3][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[4][0]" style="width: 32%;"></div>
                                            <div v-html="event4Rectification[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[4][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[4][0]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4RectificationBack[4][2]" style="width: 32%;"></div>
                                            <div v-html="event4RectificationBack[4][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[5][0]" style="width: 32%;"></div>
                                            <div v-html="event4Rectification[5][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event4Rectification[5][2]" style="width: 32%"></div>
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

                            <v-stepper-step step="1" complete>已复核</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[0][0]" style="width: 32%;"></div>
                                            <div v-html="event5Check[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[0][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[0][0]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[0][2]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[0][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[1][0]" style="width: 32%;"></div>
                                            <div v-html="event5Check[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[1][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[1][0]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[1][2]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[1][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[2][0]" style="width: 32%;"></div>
                                            <div v-html="event5Check[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[2][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[2][0]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[2][2]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[2][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[3][0]" style="width: 32%;"></div>
                                            <div v-html="event5Check[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[3][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[3][0]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[3][2]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[3][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[4][0]" style="width: 32%;"></div>
                                            <div v-html="event5Check[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[4][2]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 8rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <img src="../assets/pollution1.png">
                                            <div style="width: 2%"></div>
                                            <img src="../assets/pollution2.png">
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[4][0]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5CheckBack[4][2]" style="width: 32%;"></div>
                                            <div v-html="event5CheckBack[4][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[5][0]" style="width: 32%;"></div>
                                            <div v-html="event5Check[5][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event5Check[5][2]" style="width: 32%"></div>
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

                            <v-stepper-step step="1" complete>已通过</v-stepper-step>

                            <v-stepper-content step="1">
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[0][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[0][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[0][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[0][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[1][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[1][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[1][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[1][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[2][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[2][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[2][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[2][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[3][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[3][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[3][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[3][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[4][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[4][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[4][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[4][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[5][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[5][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[5][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[5][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[6][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[6][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[6][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[6][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[7][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[7][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[7][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[7][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[8][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[8][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[8][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[8][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[9][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[9][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[9][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[9][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[10][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[10][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[10][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[10][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[11][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[11][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[11][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[11][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[12][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[12][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[12][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[12][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[13][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[13][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[13][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[13][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[14][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[14][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[14][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[14][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[15][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[15][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[15][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[15][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[16][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[16][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[16][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[16][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[17][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[17][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[17][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[17][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[18][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[18][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[18][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[18][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <v-icon size="16" style="margin-left: -2px">info</v-icon>
                                            <div style="width: 32%;margin-left: 2px">退回信息</div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[19][0]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[19][1]" style="width: 32%"></div>
                                        </div>
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6ConfirmBack[19][2]" style="width: 32%;"></div>
                                            <div v-html="event6ConfirmBack[19][3]" style="width: 32%"></div>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card color="white lighten-1" class=" elevation-2" style="margin-bottom: 0.8rem">
                                    <div class="elevation-2" style="border: 1px solid #d8d8d8; height:100%;width: 100%">
                                        <div style="width: 100%;height: 2rem;text-align:left;display:flex;justify-content:left;align-items:center;">
                                            <div  style="width: 4%;"></div>
                                            <div v-html="event6Confirm[0]" style="width: 32%;"></div>
                                            <div v-html="event6Confirm[1]" style="width: 32%"></div>
                                            <div v-html="event6Confirm[2]" style="width: 32%"></div>
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
                    <v-btn color="primary" flat @click="eventListDialog = false">关闭
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
                //地图相关data
                zoom:11,
                center: L.latLng(19.71801, 110.75918),
                url: this.$store.state.mapUrl,
                subdomains: this.$store.state.mapSubdomains,
                option: {zoomControl: false, attributionControl: false},
                geojson:'',
                //查询条件相关data
                processingStatus:['已撤销','待审核','待转办','待整改','已整改','待复核','待确认','已确认'],
                processingStatusSelect:'',
                processingStatus1:['已撤销','待审核','待转办','待整改','已整改','待复核','待确认','已确认'],
                processingStatusSelect1:'',
                riverName:['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖'],
                riverNameSelect:'',
                riverName1:['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖'],
                riverNameSelect1:'',
                startDateMenu:false,
                startDate:'',
                startDateMenu1:false,
                startDate1:'',
                statusList:[[0,'已撤销'],[1,'待审核'],[3,'待转办'],[5,'待整改'],[6,'已整改'],[9,'待复核'],[11,'待确认'],[12,'已确认']],

                //图表1相关data
                search: '',
                pagination: {
                    rowsPerPage:12,
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
                eventListDetails: [
                ],

                //图表2相关data
                search2: '',
                pagination2: {
                    rowsPerPage:2,
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
                eventListDetails2: [
                ],
                //详情相关data
                eventListDialog:false,
                e13: 1,
                detailRiverInformation:['问题来源：河长上报','时间：2018-10-17 10:12:23','上报人：沙荖河-重兴镇河长 符策万','上报地点：沙荖河重兴镇','问题描述：沙荖河流经重兴镇河段有异常气味，疑似周围堆放过多垃圾及污水排放'],
                detailRiverInformation1:['操作时间：2018-10-30 09:10:42','经办人：文昌市河长 任怀锋','操作：问题撤销','原因：重新整理问题再上报'],
                detailRiverInformation2:['操作时间：2018-10-20 09:20:22','经办人：文昌市河长 任怀锋','操作：转镇级处理'],
                detailRiverInformation3:['操作时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：整改处理','内容：整改处理河水污染情况'],
                detailRiverInformation4:['操作时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回'],

                event1ProblemReport:['问题来源：河长上报','时间：2018-10-17 10:12:23','上报人：沙荖河-重兴镇河长 符策万','上报地点：沙荖河重兴镇','问题描述：沙荖河流经重兴镇河段有异常气味，疑似周围堆放过多垃圾及污水排放'],

                event2Review:[['1时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：选择镇级处理'],['2时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：选择镇级处理'],['3时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：选择镇级处理'],['4时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：选择镇级处理'],['5时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：选择镇级处理'],['6时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：选择镇级处理']],
                event2ReviewStatus:[true,true,true,true,true,true],
                event2ReviewBack:[['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误']],
                event2ReviewStatus:[true,true,true,true,true],

                event3Transfer:[['1时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：转办至市长办公室'],['2时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：转办至市长办公室'],['3时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：转办至市长办公室'],['4时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：转办至市长办公室'],['5时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：转办至市长办公室'],['6时间：2018-10-22 09:30:13','经办人：文昌市河长 李娇慧','操作：转办至市长办公室']],
                event3TransferStatus:[true,true,true,true,true,true],
                event3TransferBack:[['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误']],
                event3TransferBackStatus:[true,true,true,true,true],

                event4Rectification:[['1时间：2018-10-22 09:30:13','经办人：市长 王明聪','整改内容：处理了问题'],['2时间：2018-10-22 09:30:13','经办人：市长 王明聪','整改内容：处理了问题'],['3时间：2018-10-22 09:30:13','经办人：市长 王明聪','整改内容：处理了问题'],['4时间：2018-10-22 09:30:13','经办人：市长 王明聪','整改内容：处理了问题'],['5时间：2018-10-22 09:30:13','经办人：市长 王明聪','整改内容：处理了问题'],['6时间：2018-10-22 09:30:13','经办人：市长 王明聪','整改内容：处理了问题']],
                event4RectificationStatus:[true,true,true,true,true,true],
                event4RectificationBack:[['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误']],
                event4RectificationBackStatus:[true,true,true,true,true],

                event5Check:[['1时间：2018-10-22 09:30:13','经办人：市长 王明聪','复核内容：确认处理了问题'],['2时间：2018-10-22 09:30:13','经办人：市长 王明聪','复核内容：确认处理了问题'],['3时间：2018-10-22 09:30:13','经办人：市长 王明聪','复核内容：确认处理了问题'],['4时间：2018-10-22 09:30:13','经办人：市长 王明聪','复核内容：确认处理了问题'],['5时间：2018-10-22 09:30:13','经办人：市长 王明聪','复核内容：确认处理了问题'],['6时间：2018-10-22 09:30:13','经办人：市长 王明聪','复核内容：确认处理了问题']],
                event5CheckStatus:[true,true,true,true,true,true],
                event5CheckBack:[['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误']],
                event5CheckBackStatus:[true,true,true,true,true],
                event6Confirm:['时间：2018-10-22 09:30:13','经办人：河长 张毅','操作：通过'],
                event6ConfirmStatus:true,
                event6ConfirmBack:[['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至复核','原因：图片上传有误'],['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至整改','原因：图片上传有误'],['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至转办','原因：图片上传有误'],['1时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['2时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['3时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['4时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误'],['5时间：2018-10-23 09:17:27','经办人：文昌市河长办公室','操作：退回至审核','原因：图片上传有误']],
                event6ConfirmBackStatus:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
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
            this.getEventListData1('','',-1)
            this.getEventListData2('','',-1)
            this.$refs.map.mapObject.on('click', this.mapClick)
        },
        methods:{
            areaShow(riverGeo,riverAddress){
                if(riverAddress === '霞洞湖'){
                    this.geojson = this.strToJson(riverGeo)
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates[0]))
                    this.eventListDialog = true
                }
                else{
                    this.geojson = this.strToJson(riverGeo)
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates))
                    this.eventListDialog = true
                }

            },//点击显示巡河问题详情及区域
            areaShow1(riverGeo,riverAddress){
                if(riverAddress === '霞洞湖'){
                    this.geojson = this.strToJson(riverGeo)
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates[0]))
                    this.eventListDialog = true
                }
                else{
                    this.geojson = this.strToJson(riverGeo)
                    this.$refs.map.mapObject.fitBounds(this.geoJsonLngToLat(this.geojson.coordinates))
                    this.eventListDialog = true
                }

            },//点击显示公众号详情及区域
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
            getEventListData1(river,startTime,status){
                if(river === null || river === undefined){
                    river = ''
                }
                if(startTime === null || startTime === undefined){
                    startTime = ''
                }
                if(status === null || status === undefined){
                    status = ''
                }
                this.$axios.get("api/getEventList",{
                    params:{
                        type:1,
                        river:river,
                        startTime:startTime,
                        status:status,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination.totalItems = length
                    for(var i=0;i<length;i++){

                        var status = ''
                        for(var j=0;j<this.statusList.length;j++){
                            if(res.data.data[i].solvingStatus === this.statusList[j][0]){
                                status = this.statusList[j][1]
                            }
                        }
                        resultListFormat.push(
                            {
                                riverEventReportingTime: res.data.data[i].time,
                                riverEventReportingAddress: res.data.data[i].river,
                                riverEventReportingPerson: res.data.data[i].userName,
                                riverEventDetails: res.data.data[i].problemDescribe,
                                riverEventStatus: status,
                                riverGeo:res.data.data[i].geo
                            })
                    }
                    this.eventListDetails = resultListFormat
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取巡河问题列表
            getEventListData2(river,startTime,status){
                if(river === null || river === undefined){
                    river = ''
                }
                if(startTime === null || startTime === undefined){
                    startTime = ''
                }
                if(status === null || status === undefined){
                    status = ''
                }
                this.$axios.get("api/getEventList",{
                    params:{
                        type:2,
                        river:river,
                        startTime:startTime,
                        status:status,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination2.totalItems = length
                    for(var i=0;i<length;i++){

                        var status = ''
                        for(var j=0;j<this.statusList.length;j++){
                            if(res.data.data[i].solvingStatus === this.statusList[j][0]){
                                status = this.statusList[j][1]
                            }
                        }
                        resultListFormat.push(
                            {
                                riverEventReportingTime: res.data.data[i].time,
                                riverEventReportingAddress: res.data.data[i].river,
                                riverEventReportingPerson: res.data.data[i].userName,
                                riverEventDetails: res.data.data[i].problemDescribe,
                                riverEventStatus: status,
                                riverGeo:res.data.data[i].geo
                            })
                    }
                    this.eventListDetails2 = resultListFormat
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取公众号投诉列表
            eventListSearch(){
                var status = -1
                for(var j=0;j<this.statusList.length;j++){
                    if(this.processingStatusSelect === this.statusList[j][1]){
                        status = this.statusList[j][0]
                    }
                }
                this.getEventListData1(this.riverNameSelect,this.startDate,status)
            },//巡河问题查询
            eventListSearch2(){
                var status = -1
                for(var j=0;j<this.statusList.length;j++){
                    if(this.processingStatusSelect === this.statusList[j][1]){
                        status = this.statusList[j][0]
                    }
                }
                this.getEventListData2(this.riverNameSelect1,this.startDate1,status)
            },//公众号投诉查询
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
