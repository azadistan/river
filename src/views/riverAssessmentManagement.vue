<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div style="width: 100%;height: 100%">
            <div class="elevation-1" style="height: 10%;width: 100%;">
                <div style="float: left;height: 100%;width: 20%;text-align:center;display:flex;justify-content:center;align-items:center;">
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
                <div style="float: left;height: 100%;width: 20%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        河道名称：
                    </div>
                    <v-autocomplete
                            :items="riverName"
                            label="请输入或选择"
                            single-line
                            v-model="riverNameSelect"
                            no-data-text="无此数据"
                            clearable
                    ></v-autocomplete>
                </div>
                <div style="float: left;height: 100%;width: 20%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        起始时间：
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
                <div style="float: left;height: 100%;width: 20%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <div style="width: 30%;float: left">
                        结束时间：
                    </div>
                    <div style="width: 50%;float: left;">
                        <v-menu
                                :close-on-content-click="false"
                                v-model="endDateMenu"
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
                                    v-model="endDate"
                                    prepend-inner-icon="date_range"
                            ></v-text-field>
                            <v-date-picker v-model="endDate" v-if="endDateMenu" @input="endDateMenu = false" no-title  locale="zh-cn">
                            </v-date-picker>
                        </v-menu>
                    </div>
                </div>
                <div style="float: left;height: 100%;width: 8%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <v-btn color="info" @click="getAssessmentManagementDataSearch">查询</v-btn>
                </div>
                <div style="float: left;height: 100%;width: 8%;text-align:center;display:flex;justify-content:center;align-items:center;">
                    <download-excel
                            class = "export-excel-wrapper"
                            :data = "riverManagerDetails"
                            name = "考核管理.xls">
                        <v-btn color="info" outline style="">导出当前记录</v-btn>
                    </download-excel>
                    <!--<v-btn color="info" outline style="">导出当前记录</v-btn>-->
                </div>
            </div>
            <div class="elevation-1" style="height: 80%;width: 100%;padding: 2rem">
                <div class="elevation-2" >
                    <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="riverManagerDetails"
                            :search="search"
                            hide-actions
                            :pagination.sync="pagination"
                            class="elevation-1"
                            item-key="河长姓名"
                    >
                        <template slot="items" slot-scope="props">
                            <tr :active="props.selected" @click="areaShow(props.item.riverId)">
                                <td @click="testClick(props.item.河长姓名,props.item.职务,props.item.联系方式,props.item.负责河流)">{{ props.item.河长姓名 }}</td>
                                <td>{{ props.item.职务 }}</td>
                                <td>{{ props.item.联系方式 }}</td>
                                <td>{{ props.item.负责河流 }}</td>
                                <td>{{ props.item.打卡数 }}</td>
                                <td>{{ props.item.巡河次数 }}</td>
                                <td>{{ props.item.上报问题数 }}</td>
                                <td>{{ props.item.公众号投诉数 }}</td>
                            </tr>
                        </template>
                        <v-alert slot="no-data" :value="true" color="error" icon="warning">
                            找不到相关的数据！
                        </v-alert>
                    </v-data-table>

                </div>
            </div>
            <div class="elevation-1" style="height: 10%;width: 100%;text-align:center;display:flex;justify-content:center;align-items:center;">
                <div class="text-xs-center pt-2" style="height: 100%;width: 100%;">
                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "river-assessment-management",
        components: {
        },
        data () {
            return{

                //查询条件相关data
                riverManager:['钟鸣明','王晓桥','何欢宝','李娇慧','吴小洪','任怀锋','张毅','符策万','符永高','王茀甫','许环峰','杜冰','刘庆棠','徐健超','吕烈炜',
                    '邢艳','王宏伟','杨兹农','陈文慧','陈文强', '朱兴育','黄心奋','邢福健','林勉','韩松元','陈东明','郑鸿雁','林方江','杨兹富','符斌','王云',
                    '陈文学','郑有雷','张光润','严世巍','符日伟', '李湘燕','邓德雄','符方利','唐甸远','郑学','邢彩虹','范高满','孙人培','王兰英','陈丹','陈明泽',
                    '林明恺','韩锐光','李道俊','韩红光','吴清雄','邓海闻', '符力','陈少波','凌波','甘大韧'],
                riverManagerSelect:'',
                riverName:['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖'],
                riverNameSelect:'',
                startDateMenu:false,
                startDate:'',
                endDateMenu:false,
                endDate:'',

                //图表相关data
                search: '',
                pagination: {
                    rowsPerPage:12,
                    totalItems:13,
                },
                selected: [],
                headers: [
                    {
                        text: '河长姓名',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    { text: '职务', value: '职务' },
                    { text: '联系方式', value: '联系方式' },
                    { text: '负责河流', value: '负责河流' },
                    { text: '打卡数', value: '打卡数' },
                    { text: '巡河次数', value: '巡河次数' },
                    { text: '上报问题数', value: '上报问题数' },
                    { text: '公众号投诉数', value: '公众号投诉数' },
                ],
                riverManagerDetails: [
                ],
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
            this.getAssessmentManagementData('','','','')
        },
        methods:{
            areaShow(riverId){
                if(riverId === 1) {
                    this.polygonC = this.polygon[0]
                    this.imgBounds = this.polygon[0]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 2) {
                    this.polygonC = this.polygon[1]
                    this.imgBounds = this.polygon[1]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 3) {
                    this.polygonC = this.polygon[2]
                    this.imgBounds = this.polygon[2]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 4) {
                    this.polygonC = this.polygon[3]
                    this.imgBounds = this.polygon[3]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 5) {
                    this.polygonC = this.polygon[4]
                    this.imgBounds = this.polygon[4]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 6) {
                    this.polygonC = this.polygon[5]
                    this.imgBounds = this.polygon[5]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 7) {
                    this.polygonC = this.polygon[6]
                    this.imgBounds = this.polygon[6]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 8) {
                    this.polygonC = this.polygon[7]
                    this.imgBounds = this.polygon[7]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 9) {
                    this.polygonC = this.polygon[8]
                    this.imgBounds = this.polygon[8]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
                }
                if(riverId === 10) {
                    this.polygonC = this.polygon[9]
                    this.imgBounds = this.polygon[9]
                    this.$refs.map.mapObject.fitBounds(this.imgBounds)
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
            getAssessmentManagementData(河长姓名,riverName,startTime,endTime){
                if(河长姓名 === null || 河长姓名 === undefined){
                    河长姓名 = ''
                }
                if(riverName === null || riverName === undefined){
                    riverName = ''
                }
                if(startTime === null || startTime === undefined){
                    startTime = ''
                }
                if(endTime === null || endTime === undefined){
                    endTime = ''
                }
                this.$axios.get("api/examineManage",{
                    params:{
                        name:河长姓名,
                        river:riverName,
                        startTime:startTime,
                        endTime:endTime,
                    }
                }).then((res) => {
                    var resultListFormat= []
                    var length = res.data.data.length
                    this.pagination.totalItems = length
                    for(var i=0;i<length;i++){
                        resultListFormat.push(
                            {
                                河长姓名: res.data.data[i].personInfo.name,
                                职务: res.data.data[i].personInfo.level,
                                联系方式: res.data.data[i].personInfo.phone,
                                负责河流: res.data.data[i].personInfo.manageRiver,
                                打卡数:res.data.data[i].clockTimes,
                                巡河次数:res.data.data[i].patrolTimes,
                                上报问题数:res.data.data[i].problemTimes,
                                公众号投诉数:res.data.data[i].complainTimes,

                            })
                    }
                    this.riverManagerDetails = resultListFormat
                })
                    .catch(function (err) {
                        console.log(err)
                    })
            },//获取河流信息列表全部内容
            getAssessmentManagementDataSearch(){
                this.getAssessmentManagementData(this.riverManagerSelect,this.riverNameSelect,this.startDate,this.endDate)
            }//查询
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