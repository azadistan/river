<template>
    <div style="position: absolute; width: 100%; height: 100%">
        <div class="elevation-1" style="width: 50%; height:100%;float:left">
            <div class="elevation-1" style="height: 16%;width: 100%;">
                <div style="height: 50%;width: 100%;text-align:center;display:flex;justify-content:left;align-items:center;border-bottom: 1px solid #E8E8E8;padding-left: 2rem">
                    <div style="font-family: 微软雅黑;font-size: 20px">巡河问题统计</div>
                </div>
                <div style="height: 50%;width: 100%;">
                    <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                        <div style="width: 30%;float: left">
                            处理状态：
                        </div>
                        <div style="width: 50%;float: left;">
                            <v-select
                                    v-model="riverEventReportingAddresselect"
                                    :items="riverLevel"
                                    label="请选择处理状态"
                                    single-line
                                    clearable
                            ></v-select>
                        </div>
                    </div>
                    <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                        <div style="width: 30%;float: left">
                            河道名称：
                        </div>
                        <div style="width: 50%;float: left;">
                            <v-text-field
                                    label="请输入河道名称"

                            ></v-text-field>
                        </div>
                    </div>
                    <div style="float: left;height: 100%;width: 28%;text-align:center;display:flex;justify-content:center;align-items:center;">
                        <div style="width: 30%;float: left">
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
                                        slot="activator"
                                        label="请选择巡河日期"
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
                    </div>
                    <div style="float: left;height: 100%;width: 16%;text-align:center;display:flex;justify-content:center;align-items:center;">
                        <v-btn color="info" style="">查询</v-btn>
                    </div>
                </div>
            </div>
            <div class="elevation-1" style="height: 74%;width: 100%;padding: 2rem">
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
        <div style="width: 50%;height: 100%;float: right;text-align:center;display:flex;justify-content:center;align-items:center;">
            <div style="width: 97%;height: 97%">
                <div style="width: 100%;height: 10%;text-align:center;display:flex;justify-content:center;align-items:center;">
                        <div style="position: absolute;color: #00C2C3">文昌市调查摸底图斑统计分析</div>
                        <img src="../assets/homePageBorder.svg"  style="width: 100%;height: 100%">
                </div>
                <div id="riverProblemManagementBar" style="width: 100%;height: 90%;border: 1px solid #00C2C3;box-shadow: 0 0 6px 0 #00C2C3, inset 0 0 6px 2px #4FD3D7;">

                </div>
            </div>
        </div>

        <v-dialog v-model="riverInformationDialog" width="500">
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
    export default {
        name: "river-problem-management",
        data () {
            return{
                //查询条件相关data
                riverLevel:['未处理','处理中','已完成'],
                riverLevelSelect:'',
                startDateMenu:false,
                startDate:new Date().toISOString().substr(0, 10),

                //图表相关data
                search: '',
                pagination: {
                    rowsPerPage:3,
                    totalItems:4,
                },
                selected: [],
                headers: [
                    {
                        text: '上报时间',
                        align: 'left',
                        sortable: false,
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
                        riverEventReportingTime: '2019-03-10 10:30:10',
                        riverEventReportingAddress: '南阳河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南阳河流经抱罗镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:1,
                        riverEventReportingTime: '2019-03-10 10:30:10',
                        riverEventReportingAddress: '南阳河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南阳河流经抱罗镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },{
                        riverId:1,
                        riverEventReportingTime: '2019-03-10 10:30:10',
                        riverEventReportingAddress: '南阳河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南阳河流经抱罗镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                    {
                        riverId:1,
                        riverEventReportingTime: '2019-03-10 10:30:10',
                        riverEventReportingAddress: '南阳河-抱罗镇',
                        riverEventReportingPerson: '张毅',
                        riverEventDetails: '南阳河流经抱罗镇河段有异常气味',
                        riverEventStatus: '处理中',
                    },
                ],

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
            this.drawBar()
        },
        methods:{
            testClick(){
                this.riverInformationDialog = true
            },
            drawBar(){
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('riverProblemManagementBar'))
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            // text: '世界人口总量',
                            // subtext: '数据来自网络'
                        },
                        color:'#6db1d6',
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: ['2011年', '2012年']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        },
                        yAxis: {
                            type: 'category',
                            data: ['永丰水','南洋河','文教河','文昌江','古城河','北山溪','沙荖河','塔洋河','珠溪河','白芒溪','排港溪','北水溪','黑溪','石壁河','三合水溪','横山河','大兰港河','衙前溪','文清河','港尾沟','霞洞湖']
                        },
                        series: [
                            {
                                // name: '2011年',
                                type: 'bar',
                                data: [18203, 23489, 29034, 104970, 131744, 630230,18203, 23489, 29034, 104970, 131744, 630230,18203, 23489, 29034, 104970, 131744, 630230, 23489, 29034, 104970]
                            },
                        ]
                    })
            },
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