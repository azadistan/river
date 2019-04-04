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
                <div style="float:left;margin:1rem 0 0 1rem;">目标库录入</div>
            </div>
            <div style="width:100%">
                <div style="width:100%;height:4rem;margin-top:5%">
                    <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                        *
                    </div>
                    <div style="height:100%;width:80%;float:left;">
                        <v-text-field
                                v-model="targetLibraryName"
                                label="目标库名称"
                        ></v-text-field>
                    </div>
                </div>
                <div style="width:100%;height:4rem;clear:both;margin-top:5%" v-if="false">
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
                <div class="elevation-1" style="width:90%;height:14rem;clear:both;margin:10% 5% 10% 5%;border:1px solid #d8d8d8">
                    <div style="width:100%;height:4rem;clear:both;margin-top: 2%">
                        <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                            *
                        </div>
                        <div style="height:100%;width:80%;float:left;">
                            <v-text-field
                                    label="目标点经度"
                                    type="number"
                                    v-model="longitude"
                                    @blur.prevent="latlngChange()"
                            ></v-text-field>
                        </div>
                    </div>
                    <div style="width:100%;height:4rem;clear:both;margin-top: 2%">
                        <div style="color:red;float:left;padding:1.5rem 5% 0 5%">
                            *
                        </div>
                        <div style="height:100%;width:80%;float:left;">
                            <v-text-field
                                    label="目标点纬度"
                                    type="number"
                                    v-model="latitude"
                                    @blur.prevent="latlngChange()"
                            ></v-text-field>
                        </div>
                    </div>
                    <div style="width:100%;height:4rem;clear:both;margin-top: 2%">
                        <v-btn style="width:30%;height:80%;margin:0 auto;margin-left:10%" flat color="primary" @click="pointLocate()">定位目标点</v-btn>
                        <v-btn style="width:30%;height:80%;margin:0 auto;margin-left:20%" flat color="primary" @click="pointReset()">重置</v-btn>
                    </div>
                </div>
            </div>

            <v-btn block
                   large color="primary"
                   style="margin-bottom: 0;"@click="targetLibrarySubmit()">提交目标库
            </v-btn>

        </div>

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
    import { LMap,LMarker,LTileLayer} from 'vue2-leaflet'
    import L from 'leaflet'

    export default {
        name: "targetLibraryEntry",
        components: {
            LMap,
            LTileLayer,
            LMarker,
        },
        data () {
            return {
                zoom: 5,
                center: L.latLng(43.978292, 125.395057),
                url: this.$store.state.mapUrl,
                subdomains: this.$store.state.mapSubdomains,
                option: {zoomControl: false, attributionControl: false,dragging:false},
                marker:L.latLng(44,124),
                markerShow:false,

                targetLibraryName:'',
                remarks:'',

                longitude:'',
                latitude:'',

                alertDialog:false,
                alertDialogHtml:'',
                confirmDialog:false,
                confirmDialogHtml:'',
                confirmJump:'',
            }
        },
        watch:{
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
        },
        methods:{
            mapClick(e){
                this.markerShow = true
                var str = e.latlng
                this.longitude = e.latlng.lng
                this.latitude = e.latlng.lat
                this.marker = L.latLng(str)

            },//点击屏幕改变marker
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
            pointReset(){
                this.longitude = ''
                this.latitude = ''
                this.$refs.map.mapObject.setView([43.978292, 125.395057], 5);
            },//重置目标点
            targetLibrarySubmit(){
                if(this.latitude === '' || this.longitude === '' || !this.latitude || !this.longitude ){
                    this.alertDialogHtml = '目标点经纬度未输入完整，请重新输入'
                    this.alertDialog = true
                }
                else if(this.latitude > 90 || this.latitude < -90 || this.longitude > 180 || this.longitude < -180){
                    this.alertDialogHtml = '目标点的经纬度输入范围不符合规范，请重新输入值(经度范围-180°~180°；纬度范围-90°~90°)'
                    this.alertDialog = true
                }
                else if(this.targetLibraryName === '' || !this.targetLibraryName){
                    this.alertDialogHtml = '目标库名称未填写，请填写完整'
                    this.alertDialog = true
                }
                else{
                    this.alertDialogHtml = '目标库正在录入，请稍后'
                    this.alertDialog = true
                    var geoString = "{\"type\":\"Point\",\"coordinates\":["+this.longitude+","+this.latitude+"]}";
                    var params ={
                            targetName:this.targetLibraryName,
                            pointGeo:geoString,
                            targetRemark:'111',
                    }
                    let param = new URLSearchParams()  // 创建form对象
                    param.append('json', JSON.stringify(params))
                    this.$axios.post("api/addTarget",param)
                        .then((res) => {
                            if(res.data.data === 'fail'){
                                this.alertDialog = false
                                this.alertDialogHtml = '已有该目标库名称，请修改后提交！！'
                                this.alertDialog = true
                            }
                            else{
                                this.alertDialog = false
                                this.confirmJump = '/TargetRecords'
                                this.confirmDialogHtml = '目标库录入成功！！'
                                this.confirmDialog = true
                            }

                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                }
            },//提交目标库
            confirmDialogJump(){
                this.$router.push(this.confirmJump)
            },//提示跳转页面
        },
        mounted () {
            this.$refs.map.mapObject.on('click', this.mapClick)
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