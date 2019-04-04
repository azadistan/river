<template>
    <div>
        <v-card style="position: absolute; width: 100%; height: 100%; z-index: 0">
            <l-map ref="map" style="width: 100%; height: 100%;" :zoom="zoom" :center="center" :options="option" minZoom="10" :maxBounds="bounds">
                <l-tile-layer :url="url" :options="subdomains"></l-tile-layer>
                <l-marker :lat-lng="marker" v-if="markerShow">
                </l-marker>
            </l-map>
        </v-card>
        <div class="elevation-10" style="position: absolute; width:20%;top:1%;right:3%;background: white;font-family: 微软雅黑;">
            <div style="height:4rem;color:grey;font-size:large;font-weight:bold;border-bottom: 2px solid #d8d8d8">
                <img src="../assets/titlePng.png" style="float:left;height:20px;margin:1.2rem 0 0 1rem">
                <div style="float:left;margin:1rem 0 0 1rem;">新建需求</div>
            </div>
            <div style="width:100%">
                <div style="width:100%;height:3.5rem;clear:both">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:80%;float:left;">
                        <v-text-field
                                v-model="requirementName"
                                label="需求名称"
                        ></v-text-field>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:80%;float:left;">
                        <v-text-field
                                v-model="shootingTimes"
                                label="拍摄次数"
                                type="number"
                        ></v-text-field>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;height:100%;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:39%;float:left;margin-right:2%">
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
                                    slot="activator"
                                    label="拍摄开始日期"
                                    readonly
                                    v-model="startDate"
                            ></v-text-field>
                            <v-date-picker v-model="startDate">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="startDateMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">保存修改</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </div>
                    <div style="height:100%;width:39%;float:left;">
                        <v-menu
                                ref="startTimeMenuRef"
                                :close-on-content-click="false"
                                v-model="startTimeMenu"
                                :nudge-right="40"
                                :return-value.sync="startTime"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="拍摄开始时间"
                                    readonly
                                    v-model="startTime"
                            ></v-text-field>
                            <v-time-picker v-model="startTime" v-if="startTimeMenu" full-width>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="startTimeMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.startTimeMenuRef.save(startTime)">保存修改</v-btn>
                            </v-time-picker>
                        </v-menu>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;height:100%;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:39%;float:left;margin-right:2%">
                        <v-menu
                                ref="endDateMenu"
                                :close-on-content-click="false"
                                v-model="endDateMenu"
                                :nudge-right="40"
                                :return-value.sync="endDate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="拍摄结束日期"
                                    readonly
                                    v-model="endDate"
                            ></v-text-field>
                            <v-date-picker v-model="endDate">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="endDateMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.endDateMenu.save(endDate)">保存修改</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </div>
                    <div style="height:100%;width:39%;float:left;">
                        <v-menu
                                ref="endTimeMenuRef"
                                :close-on-content-click="false"
                                v-model="endTimeMenu"
                                :nudge-right="40"
                                :return-value.sync="endTime"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="拍摄结束时间"
                                    readonly
                                    v-model="endTime"
                            ></v-text-field>
                            <v-time-picker v-model="endTime" v-if="endTimeMenu" full-width>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="endTimeMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.endTimeMenuRef.save(endTime)">保存修改</v-btn>
                            </v-time-picker>
                        </v-menu>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:white;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left: 6px">
                        <v-text-field
                                v-model="remarks"
                                label="备注"
                                clearable
                        ></v-text-field>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                    *
                    </div>
                    <div style="height:100%;width:80%;float:left;">
                        <v-select
                                v-model="deliveryFormatSelect"
                                :items="deliveryFormat"
                                label="交付格式"
                        ></v-select>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left:6px">
                        <v-select
                                v-model="resolutionSelect"
                                :items="resolution"
                                label="分辨率"
                        ></v-select>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left:6px">
                        <v-slider
                                v-model="cloudSlider"
                                :label="cloud"
                        ></v-slider>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left:6px">
                        <v-slider
                                v-model="sideSlider"
                                :label="side"
                                min="0"
                                max="45"
                        ></v-slider>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left:6px">
                        <v-checkbox
                                v-model="targetLibrary"
                                label="将本次需求加入到目标库"
                        ></v-checkbox>
                    </div>
                </div>
                <div style="width:100%;height:3.5rem;clear:both" v-if="targetLibrary">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left: 6px">
                        <v-text-field
                                v-model="targetLibraryName"
                                label="目标库名称"
                        ></v-text-field>
                    </div>
                </div>
                <div class="elevation-1" style="width:90%;height:11.5rem;clear:both;margin:3% 5% 3% 5%;border:1px solid #d8d8d8">
                    <div style="width:100%;height:4rem;clear:both;">
                        <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                            *
                        </div>
                        <div style="height:100%;width:80%;float:left;">
                            <v-text-field
                                    label="目标点经度"
                                    type="number"
                                    v-model="longitude"
                                    @blur.prevent="latlngChange()"
                                    clearable
                            ></v-text-field>
                        </div>
                    </div>
                    <div style="width:100%;height:4rem;clear:both;">
                        <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                            *
                        </div>
                        <div style="height:100%;width:80%;float:left;">
                            <v-text-field
                                    label="目标点纬度"
                                    type="number"
                                    v-model="latitude"
                                    @blur.prevent="latlngChange()"
                                    clearable
                            ></v-text-field>
                        </div>
                    </div>
                    <div style="width:100%;height:4rem;clear:both;">
                        <v-btn :style="'width:1rem;height:60%;float: left;margin-left: '+(pageWidth*0.16-264)/4+'px'" flat color="primary" @click="pointLocate()">定位</v-btn>
                        <v-btn :style="'width:1rem;height:60%;float: left;margin-left: '+(pageWidth*0.16-264)/4+'px'" flat color="primary" @click="transitDialogShow()">过境查询</v-btn>
                        <v-btn :style="'width:1rem;height:60%;float: right;margin-right: '+(pageWidth*0.18-264)/4+'px'" flat color="primary" @click="targetLibraryGet()">从目标库选取</v-btn>
                    </div>
                </div>

            </div>

            <v-btn block
                   large color="primary"
                   style="margin-bottom: 0;"@click="requestSubmit()">提交需求
            </v-btn>
            <!--<v-btn block-->
                   <!--large color="primary"-->
                   <!--style="margin-bottom: 0;"@click="test()">提交需求-->
            <!--</v-btn>-->

        </div>

        <v-dialog v-model="transitDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>过境查询
                    <v-spacer></v-spacer>
                        <i class="material-icons" style="cursor: pointer" @click="transitDialog = false">close</i>
                </v-card-title>
                <div style="width:100%;height:4rem;clear:both;">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                    *
                    </div>
                    <div style="height:100%;width:80%;float:left;margin-bottom: 3rem">
                        <v-combobox
                                v-model="satelliteSelect"
                                :items="satellites"
                                label="选择卫星"
                                multiple
                                chips
                                clearable
                        ></v-combobox>
                    </div>
                </div>
                <div style="width:100%;height:4rem;clear:both;">
                    <div style="color:red;height:100%;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:39%;float:left;margin-right:2%">
                        <v-menu
                                ref="transitStartDateMenu"
                                :close-on-content-click="false"
                                v-model="transitStartDateMenu"
                                :nudge-right="40"
                                :return-value.sync="transitStartDate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="过境查询开始日期"
                                    readonly
                                    v-model="transitStartDate"
                            ></v-text-field>
                            <v-date-picker v-model="transitStartDate">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="transitStartDateMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.transitStartDateMenu.save(transitStartDate)">保存修改</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </div>
                    <div style="height:100%;width:39%;float:left;">
                        <v-menu
                                ref="transitStartTimeMenuRef"
                                :close-on-content-click="false"
                                v-model="transitStartTimeMenu"
                                :nudge-right="40"
                                :return-value.sync="transitStartTime"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="过境查询开始时间"
                                    readonly
                                    v-model="transitStartTime"
                            ></v-text-field>
                            <v-time-picker v-model="transitStartTime" v-if="transitStartTimeMenu" full-width>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="transitStartTimeMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.transitStartTimeMenuRef.save(transitStartTime)">保存修改</v-btn>
                            </v-time-picker>
                        </v-menu>
                    </div>
                </div>
                <div style="width:100%;height:4rem;clear:both;">
                    <div style="color:red;height:100%;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:39%;float:left;margin-right:2%">
                        <v-menu
                                ref="transitEndDateMenu"
                                :close-on-content-click="false"
                                v-model="transitEndDateMenu"
                                :nudge-right="40"
                                :return-value.sync="transitEndDate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="过境查询结束日期"
                                    readonly
                                    v-model="transitEndDate"
                            ></v-text-field>
                            <v-date-picker v-model="transitEndDate">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="transitEndDateMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.transitEndDateMenu.save(transitEndDate)">保存修改</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </div>
                    <div style="height:100%;width:39%;float:left;">
                        <v-menu
                                ref="transitEndTimeMenuRef"
                                :close-on-content-click="false"
                                v-model="transitEndTimeMenu"
                                :nudge-right="40"
                                :return-value.sync="transitEndTime"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    label="过境查询结束时间"
                                    readonly
                                    v-model="transitEndTime"
                            ></v-text-field>
                            <v-time-picker v-model="transitEndTime" v-if="transitEndTimeMenu" full-width>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="transitEndTimeMenu = false">取消</v-btn>
                                <v-btn flat color="primary" @click="$refs.transitEndTimeMenuRef.save(transitEndTime)">保存修改</v-btn>
                            </v-time-picker>
                        </v-menu>
                    </div>
                </div>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="transitSearch()">查询
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="transitReset()">重置
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="transitSearchTable" width="800">
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>过境查询结果
                    <v-spacer></v-spacer>
                    <i class="material-icons" style="cursor: pointer" @click="transitSearchTable = false">close</i>
                </v-card-title>
                <v-card-text id="dialogText" primary style="font-size: 18px;font-family: 微软雅黑">
                    <div style="height: 2rem;width:100%">
                        <div style="height: 2rem;width:50%;float: left">
                            <div v-html="'经度: '+longitude"></div>
                        </div>
                        <div style="height: 2rem;width:50%;float: left">
                            <div v-html="'过境查询开始时间: '+transitStartDate+' '+transitStartTime"></div>
                        </div>
                    </div>
                    <div style="height: 2rem;width:100%;margin-top: 1rem">
                        <div style="height: 2rem;width:50%;float: left">
                            <div v-html="'纬度: '+latitude"></div>

                        </div>
                        <div style="height: 2rem;width:50%;float: left">
                            <div v-html="'过境查询结束时间: '+transitEndDate+' '+transitEndTime"></div>
                        </div>
                    </div>
                    <div style="height: 2rem;width:100%;margin:1rem 0 1rem 0" v-html="'查询卫星: '+satelliteSelect">

                    </div>

                    <div style="width:30%;height:4rem;margin-bottom:1rem;clear:both;">
                        <div style="color:red;height:100%;float:left;padding:1.5rem 0.5rem 0 0">
                            *
                        </div>
                        <div style="height:100%;width:80%;float:left;">
                            <v-select
                                    :items="transitSatelliteSelect"
                                    label="选择卫星"
                                    v-model="transitSatelliteSelectNow"
                            ></v-select>
                        </div>
                    </div>

                    <div class="elevation-1" style="width:100%;border:1px solid #d8d8d8">
                        <v-data-table
                                v-model="transitTableItemsSelect"
                                :headers="transitHeaders"
                                :items="transitTableItems"
                                hide-actions
                                :loading="loading"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.transitTableStartTime }}</td>
                                <td>{{ props.item.transitTableEndTime }}</td>
                                <td>{{ props.item.transitTableSideAngle }}</td>
                                <td>{{ props.item.transitTableSunAngle }}</td>
                            </template>
                            <template slot="no-data">
                                <v-alert :value="true" color="error" icon="warning" outline>
                                    对不起，没有符合条件的查询结果。
                                </v-alert>
                            </template>
                        </v-data-table>
                    </div>

                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="targetLibraryDialog" width="500">
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>从目标库选取
                    <v-spacer></v-spacer>
                    <i class="material-icons" style="cursor: pointer" @click="targetLibraryDialog = false">close</i>
                </v-card-title>
                <div style="width:100%;height:3.5rem;clear:both;margin:5% 0 5% 0">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">

                    </div>
                    <div style="height:100%;width:80%;float:left;margin-left:6px">
                        <v-autocomplete
                                :items="targetLibraryNameList"
                                v-model="targetLibraryNameSelect"
                                label="目标库名称"
                        ></v-autocomplete>
                    </div>
                </div>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="targetLibrarySearch()">确定
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="targetLibraryNameSelect = ''">重置
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        <v-dialog v-model="confirmDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline primary white--text  " primary-title>操作提示
                </v-card-title>
                <v-card-text v-html="confirmDialogHtml" primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="confirmDialogJump()">确认
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="confirmDialog = false">返回
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { LMap,LMarker,LTileLayer,LPopup } from 'vue2-leaflet'
    import L from 'leaflet'
    export default {
        name: "urmDemand",
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

                marker:L.latLng(44,124),
                markerShow:false,

                requirementName:'',
                shootingTimes:'',
                startDateMenu:false,
                startTimeMenu:false,
                endDateMenu:false,
                endTimeMenu:false,
                startDate:new Date().toISOString().substr(0, 10),
                endDate:this.getNowAddTreeFormatDate().substr(0, 10),
                startTime:new Date().toLocaleTimeString().substr(0, 5),
                endTime:new Date().toLocaleTimeString().substr(0, 5),
                remarks:'',
                deliveryFormatSelect:'',
                deliveryFormat: ['标准产品', '融合影像'],
                resolutionSelect:'',
                resolution:['优于1.0m', '优于2.0m', '优于5.0m'],
                cloudSlider:10,
                sideSlider:45,
                targetLibrary:false,
                targetLibraryName:'',
                targetLibraryDialog:false,
                targetLibraryNameList:['王明通','潘胜穿','谭大畜','刘伯星'],
                targetLibraryNameSelect:'',
                targetLibraryPointList:[[44,124],[34,124],[37,119],[30,100]],
                longitude:'',
                latitude:'',
                centerLongitude:'',
                centerLatitude:'',
                transitDialog:false,
                transitStartDateMenu:false,
                transitStartTimeMenu:false,
                transitEndDateMenu:false,
                transitEndTimeMenu:false,
                transitStartDate:new Date().toISOString().substr(0, 10),
                transitEndDate:this.getNowAddTreeFormatDate().substr(0, 10),
                transitStartTime:new Date().toLocaleTimeString().substr(0, 5),
                transitEndTime:new Date().toLocaleTimeString().substr(0, 5),
                satelliteSelect:['JL101A','JL103B','JL104B','JL105B','JL106B','JL107B','JL108B'],
                satellites:['JL101A','JL103B','JL104B','JL105B','JL106B','JL107B','JL108B'],
                transitSearchTable:false,

                alertDialog:false,
                alertDialogHtml:'',
                confirmDialog:false,
                confirmDialogHtml:'',
                confirmJump:'',

                transitHeaders: [
                    { text: '过境开始时间', value: 'transitTableStartTime'},
                    { text: '过境结束时间', value: 'transitTableEndTime' },
                    { text: '侧摆角', value: 'transitTableSideAngle' },
                    { text: '太阳高度角', value: 'transitTableSunAngle' },
                ],
                transitTableItemsSelect:[],
                transitSatelliteSelectNow:'',
                transitTableItems: [

                    ],
                loading:true,
            }
        },
        watch:{
            requirementNameInput:{
                handler:function(val){
                    alert(val)
                }
            },
            longitude:{
                handler:function(val){
                    this.marker = L.latLng(this.latitude,val)
                }
            },
            latitude:{
                handler:function(val){
                    this.marker = L.latLng(val,this.longitude)
                }
            },
            startDate:{
                handler:function(val){
                    this.transitStartDate = val
                }
            },
            endDate:{
                handler:function(val){
                    this.transitEndDate = val
                }
            },
            startTime:{
                handler:function(val){
                    this.transitStartTime = val
                }
            },
            endTime:{
                handler:function(val){
                    this.transitEndTime = val
                }
            },
            transitSatelliteSelectNow:{
                handler:function(val,oldVal){
                    if(oldVal != ''){
                        this.loading = true
                        this.alertDialogHtml = '查询中，请稍后'
                        this.alertDialog = true
                        this.$axios.get("api/transitTimeQuery",{
                            params:{
                                longitude:this.longitude,
                                latitude:this.latitude,
                                satelliteId:val,
                                startTime:this.dateSplice(this.transitStartDate,this.transitStartTime),
                                endTime:this.dateSplice(this.transitEndDate,this.transitEndTime),
                            }
                        }).then((res) => {
                            var finalItems = []
                            var length = res.data.data.items.length
                            for(var i=0;i<length;i++){
                                finalItems.push({
                                    transitTableStartTime: res.data.data.items[i].startAvailableTime,
                                    transitTableEndTime: res.data.data.items[i].endAvailableTime,
                                    transitTableSideAngle: res.data.data.items[i].sideAngle,
                                    transitTableSunAngle: res.data.data.items[i].solarEA,
                                })
                            }
                            this.transitDialog = false
                            this.transitSearchTable = true
                            this.alertDialog = false
                            this.transitTableItems = finalItems
                            this.loading = false
                        })
                            .catch(function (err) {
                                console.log(err)
                            })
                    }
                }
            },
        },
        methods:{
            mapClick(e){
                this.markerShow = true
                var str = e.latlng
                this.longitude = e.latlng.lng
                this.latitude = e.latlng.lat
                this.marker = L.latLng(str)

            },//点击屏幕改变marker
            getNowAddTreeFormatDate() {
                var date = new Date();
                date.setDate(date.getDate()+3);//获取3天后的日期
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var monthStr = '';
                var day = date.getDate();
                var dayStr = '';
                if (month >= 1 && month <= 9) {
                    monthStr = "0" + month.toString();
                }else{
                    monthStr =  month.toString();
                }
                if (day >= 0 && day <= 9) {
                    dayStr = "0" + day.toString();
                }else{
                    dayStr = day.toString();
                }
                var currentdate = date.toISOString(); //date.getFullYear() + seperator1 + month + seperator1 + dayStr + 'T00:00:00+08:00'
                ;
                return currentdate;
            },//获取三天后的日期
            latlngChange(){
                // if(this.latitude != '' && this.longitude != '' ){
                //     this.markerShow = true
                //     this.center = L.latLng(this.latitude,this.longitude)
                // }
            },//手动输入经纬度改变center
            pointLocate(){
                if(this.latitude === '' || this.longitude === '' || !this.latitude || !this.longitude ){
                    this.alertDialogHtml = '目标点经纬度未输入完整，请重新输入'
                    this.alertDialog = true
                }
                else if(this.latitude > 90 || this.latitude < -90 || this.longitude > 180 || this.longitude < -180){
                    this.alertDialogHtml = '目标点的经纬度输入范围不符合规范，请重新输入值(经度范围-180°~180°；纬度范围-90°~90°)'
                    this.alertDialog = true
                }
                else{
                    this.markerShow = true
                    this.$refs.map.mapObject.setView([this.latitude,this.longitude], 5);
                }
            },//定位目标点按钮
            transitDialogShow(){
                if(this.latitude === '' || this.longitude === '' || !this.latitude || !this.longitude ){
                    this.alertDialogHtml = '目标点经纬度未输入完整，请重新输入'
                    this.alertDialog = true
                }
                else if(this.latitude > 90 || this.latitude < -90 || this.longitude > 180 || this.longitude < -180){
                    this.alertDialogHtml = '目标点的经纬度输入范围不符合规范，请重新输入值(经度范围-180°~180°；纬度范围-90°~90°)'
                    this.alertDialog = true
                }
                else{
                    this.transitReset()
                    this.transitDialog = true
                }
            },//唤醒过境窗口
            transitSearch(){
                if(this.satelliteSelect[0] === undefined){
                    this.alertDialogHtml = '请至少选择一个卫星进行过境查询'
                    this.alertDialog = true
                }
                else if(this.dateJudge(this.transitStartDate,this.transitEndDate,this.transitStartTime,this.transitEndTime) === 1){
                    this.alertDialogHtml = '过境查询结束时间要在开始时间之后，请重新选择时间范围'
                    this.alertDialog = true
                }
                else if(this.dateJudge(this.transitStartDate,this.transitEndDate,this.transitStartTime,this.transitEndTime) === false){
                    this.alertDialogHtml = '过境查询的时间跨度最大为三天，请重新选择时间范围'
                    this.alertDialog = true
                }
                else{
                    this.transitSatelliteSelectNow = this.satelliteSelect[0]
                    this.alertDialogHtml = '查询中，请稍后'
                    this.alertDialog = true
                    this.$axios.get("api/transitTimeQuery",{
                        params:{
                            longitude:this.longitude,
                            latitude:this.latitude,
                            satelliteId:this.satelliteSelect[0],
                            startTime:this.dateSplice(this.transitStartDate,this.transitStartTime),
                            endTime:this.dateSplice(this.transitEndDate,this.transitEndTime),
                        }
                    }).then((res) => {
                        var finalItems = []
                        var length = res.data.data.items.length
                        for(var i=0;i<length;i++){
                            finalItems.push({
                                transitTableStartTime: res.data.data.items[i].startAvailableTime,
                                transitTableEndTime: res.data.data.items[i].endAvailableTime,
                                transitTableSideAngle: res.data.data.items[i].sideAngle,
                                transitTableSunAngle: res.data.data.items[i].solarEA,
                            })
                        }
                        this.transitDialog = false
                        this.transitSearchTable = true
                        this.alertDialog = false
                        this.transitTableItems = finalItems
                        this.loading = false

                    })
                        .catch(function (err) {
                            console.log(err)
                            this.transitDialog = false
                            this.transitSearchTable = true
                            this.alertDialog = false
                            this.transitTableItems = []
                            this.loading = false
                        })

                }
            },//过境查询
            transitReset(){
                this.satelliteSelect = ['JL101A','JL103B','JL104B','JL105B','JL106B','JL107B','JL108B']
                this.transitStartDate = this.startDate
                this.transitEndDate = this.endDate
                this.transitStartTime = this.startTime
                this.transitEndTime = this.endTime
            },//过境重置
            requestSubmit(){
                if(this.latitude === '' || this.longitude === '' || !this.latitude || !this.longitude ){
                    this.alertDialogHtml = '目标点经纬度未输入完整，请重新输入'
                    this.alertDialog = true
                }
                else if(this.latitude > 90 || this.latitude < -90 || this.longitude > 180 || this.longitude < -180){
                    this.alertDialogHtml = '目标点的经纬度输入范围不符合规范，请重新输入值(经度范围-180°~180°；纬度范围-90°~90°)'
                    this.alertDialog = true
                }
                else if(this.requirementName === '' || !this.requirementName){
                    this.alertDialogHtml = '需求名称未填写，请填写完整'
                    this.alertDialog = true
                }
                else if(this.shootingTimes === '' || !this.shootingTimes){
                    this.alertDialogHtml = '拍摄次数未填写，请填写完整'
                    this.alertDialog = true
                }
                else if(this.dateJudge(this.startDate,this.endDate,this.startTime,this.endTime) === 1){
                    this.alertDialogHtml = '拍摄结束时间要在开始时间之后，请重新选择时间范围'
                    this.alertDialog = true
                }
                else if(this.deliveryFormatSelect === '' || !this.deliveryFormatSelect){
                    this.alertDialogHtml = '交付格式未选择，请选择标准产品或融合影像'
                    this.alertDialog = true
                }
                else if(this.targetLibrary === true){
                    var geoString = "{\"type\":\"Point\",\"coordinates\":["+this.longitude+","+this.latitude+"]}"
                    var params ={
                        targetName:this.targetLibraryName,
                        pointGeo:geoString,
                        targetRemark:'',
                    }
                    let param = new URLSearchParams()  // 创建form对象
                    param.append('json', JSON.stringify(params))
                    this.$axios.post("api/addTarget",param)
                        .then((res) => {
                            if(res.data.data === 'fail'){
                                this.alertDialogHtml = '已有该目标库名称，请修改后提交！！'
                                this.alertDialog = true
                            }
                            else{
                                this.requestSubmitAxios(geoString)
                            }

                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                    // var imageGeometry ={
                    //     type:'Point',
                    //     coordinates:[this.latitude,this.longitude],
                    // }
                    // let pointParam = new URLSearchParams()  // 创建目标点GeoJson的form对象
                    // pointParam.append('json', JSON.stringify(imageGeometry))


                }
                else{
                    var geoString = "{\"type\":\"Point\",\"coordinates\":["+this.longitude+","+this.latitude+"]}"
                    this.requestSubmitAxios(geoString)
                }
            },//提交需求
            requestSubmitAxios(geoString){
                var paramData = {
                    isSensitive:'1',
                    requirementName: this.requirementName,
                    requirementStatus:'1',
                    priority: '1',
                    requirementType: '0',
                    imageGeometry:geoString,
                    imagingFrequencyRequest:'1',
                    imagingTimes:this.shootingTimes,
                    imagingInternal:'3',
                    submitterId:this.$store.state.userId,
                    requirementStartTime:this.dateSplice(this.startDate,this.startTime),
                    requirementEndTime:this.dateSplice(this.endDate,this.endTime),
                    imageMode:'推扫成像',
                    imageDuration:'30',
                    isMultiGrid:'0',
                    requirementUser:'',
                    cloudPercent:this.intToString(this.cloudSlider),
                    resolution:this.resolutionChange(this.resolutionSelect),
                    rollSatelliteAngle:this.intToString(this.sideSlider),
                    deliveryMethod:'4',
                    dataFormat:'1',
                    dataLevel:'1',
                    spectralRequirement:'1',
                    geometryRequirement:'1',
                    radiationRequirement:'1',
                    deliveryTime:'4',
                    requirementRemark:this.remarks,
                    productType:'1',
                    ftpLine:'',
                    productDeliveryAddress:'',
                    bigdataUserName:'',
                    bigdataPassword:'',
                    ftpAddress:'',
                    fileName:'',
                    label:'',
                    targetId:'',
                    type:this.deliveryFormatSelectChange(this.deliveryFormatSelect),
                    imagingRequirement:[{"imagingSatellite":"ALL-SATELLITES","imagingMethod":"1","imagingFrequencyRequest":"1","imagingInternal":"0",
                        "satelliteImagingTimes":this.shootingTimes,"imagingStartTime":this.dateSplice(this.startDate,this.startTime),"imagingEndTime":this.dateSplice(this.endDate,this.endTime)}]
                }
                let param1 = new URLSearchParams()  // 创建form对象
                param1.append('json', JSON.stringify(paramData))
                this.alertDialogHtml = '提交中，请稍后'
                this.alertDialog = true
                this.$axios.post("api/submitUserRequirement",param1)
                    .then((res) => {
                        this.alertDialog = false
                        this.confirmJump = '/ShootingRequirementRecords'
                        this.confirmDialogHtml = '需求提交成功！！'
                        this.confirmDialog = true
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//提交需求的axios
            dateJudge(startDate,endDate,startTime,endTime) {
                var sDate1 = Date.parse(startDate)
                var sDate2 = Date.parse(endDate)
                var sTime1 = startTime.substr(0, 2)+startTime.substr(3, 4)
                var sTime2 = endTime.substr(0, 2)+endTime.substr(3, 4)
                var timeSpan = sTime2 - sTime1
                var dateSpan = sDate2 - sDate1
                var iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
                if(iDays<0){
                    return 1
                }
                if(iDays === 0 && timeSpan < 0){
                    return 1
                }
                else if(iDays>3){
                    return false
                }
                else if(iDays === 3 && timeSpan > 0){
                    return false
                }
                else{
                    return true
                }
            },//判断开始结束时间
            dateSplice(date,time){
                var dateSplice = date + 'T' + time + ':00'
                return dateSplice
            },//拼接时间字符串
            deliveryFormatSelectChange(str){
                if(str === '标准产品'){
                   return 1
                }
                if(str === '融合影像'){
                    return 2
                }
            },//交付格式转换为数字
            intToString(str){
                var x = str + ""
                return x
            },//int转String
            resolutionChange(str){
                if(str === '优于1.0m'){
                    return '1'
                }
                if(str === '优于2.0m'){
                    return '2'
                }
                else{
                    return '5'
                }
            },//分辨率转换
            targetLibraryGet(){
                this.$axios.get("api/getTargetList")
                    .then((res) => {
                        this.targetLibraryNameList = res.data.data
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                this.targetLibraryDialog = true
            },//从目标库选取
            targetLibrarySearch(){
                var tmp = this.targetLibraryNameSelect
                if(this.targetLibraryNameSelect === '' || this.targetLibraryNameSelect === null || this.targetLibraryNameSelect === undefined){
                    this.alertDialogHtml = '未从目标库中选取目标点，请重新选取'
                    this.alertDialog = true
                }
                else{
                    this.$axios.get("api/getTarget",{
                        params:{
                            targetName:tmp,
                        }})
                        .then((res) => {
                            var pointGeo = eval('(' + res.data.data.pointGeo + ')')
                            var latitude = pointGeo.coordinates[1]
                            var longitude = pointGeo.coordinates[0]
                            this.latitude = latitude
                            this.longitude = longitude
                            this.$refs.map.mapObject.setView([this.latitude,this.longitude], 5);
                            this.markerShow = true
                            this.targetLibraryDialog = false
                            this.targetLibraryNameSelect = ''
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                }
            },//确定目标库中的目标点位置
            confirmDialogJump(){
                this.$router.push(this.confirmJump)
            },//提交确认跳转
            requirementNameListInsert(){
                // var length = this.requirementNameList.length
                // if(length === this.requirementNameListLength + 1){
                //     this.requirementNameList.pop()
                // }
                // var x = document.getElementById('requirementNameInput').value
                // this.requirementNameList.push(x)
                // this.requirementName = x
            },//需求名称autocomplete改功能
            test(){
                window.location.href='http://10.10.50.222:8078/?Id=68';
            },//大数据接口测试
            getUrlKey(name){
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
            },//正则匹配地址栏中的ID
        },
        mounted () {
            this.$refs.map.mapObject.on('click', this.mapClick)
        },
        created:function () {
            if (this.$route.query.lat != '' && this.$route.query.lat != undefined) {
                this.latitude = this.$route.query.lat
                this.longitude = this.$route.query.lng
                this.center = L.latLng(this.latitude, this.longitude)
                this.marker = L.latLng(this.latitude, this.longitude)
                this.markerShow = true
             }
            if(this.getUrlKey('Id') === null || this.getUrlKey('Id') === undefined || this.getUrlKey('Id') === ''){
                // this.$store.commit('setUserId','122411330001846')
            }
            else{
                this.$store.commit('setUserId',this.getUrlKey('Id'))
            }
        },
        computed:{
            pageHeight(){
                return document.documentElement.clientHeight
            },
            pageWidth(){
                return document.documentElement.clientWidth
            },
            cloud(){
                var str = '云量：小于'+this.cloudSlider+'%'
                return str
            },
            side(){
                var str = '侧摆：小于'+this.sideSlider+'度'
                return str
            },
            transitSatelliteSelect(){
                return this.satelliteSelect
            },
        }
    }
</script>

<style scoped>

</style>