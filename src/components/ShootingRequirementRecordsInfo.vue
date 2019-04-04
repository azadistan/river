<template>

  <div :style="{'margin-left':1.8+'rem',height:  autoHeight+'px',width:autoWidth+'px'}"style="background:#FFF;margin-top:20px">
    <v-dialog v-model="dialog1" width="500">
      <v-card>
        <v-card-title class="headline primary white--text  "  primary-title>详情提示
        </v-card-title>
        <v-card-text primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">归档失败!
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog1 = false">关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" width="500">
      <v-card>
        <v-card-title class="headline primary white--text  "  primary-title>详情提示
        </v-card-title>
        <v-card-text primary style="margin-top: 50px;  text-align:center;height: 120px;font-size: 20px">正在归档中，请稍后查看!
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog2 = false">关闭
          </v-btn>
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


    <v-card>
      <v-card-title class="headline">
        需求列表
        <v-spacer></v-spacer>
        <div >
        <v-text-field v-model="search" append-icon="search" label="关键词搜索" single-line hide-details :style="{width:autoWidth*0.1+'px'}"></v-text-field>
          <v-select  style="margin-top: -45px; " :style="{width:autoWidth*0.1+'px','margin-left':-autoWidth*0.22+'px'}" v-model="type" :items="typeItems" label="需求类型"></v-select>
          <v-select  style="margin-top: -64px; " :style="{width:autoWidth*0.1+'px','margin-left':-autoWidth*0.11+'px'}" v-model="status" :items="statusItems" label="需求状态"></v-select>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="archivalRecordsItems"
        hide-actions
        :loading=loading
        :pagination.sync="pagination"
        headers-length="8"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.requirementName }}</td>
          <td>{{ props.item.requirementType }}</td>
          <td>{{ props.item.requirementSubmitTime }}</td>
          <td>{{ props.item.submitterId }}</td>
          <td >{{ props.item.requirementStatus }}</td>
          <td   class="blue--text" ><div @click="details(props.item.requirementId)" v-if="props.item.requirementType=='编程摄影'"  style="cursor:pointer">{{ props.item.details }}</div></td>
          <td v-if="false" >{{ props.item.requirementId }}</td>
        </template>
        <v-alert slot="no-data" :value="true" color="error" icon="warning">
          对不起，没有符合条件的查询结果。
        </v-alert>
      </v-data-table>
    </v-card>



    <div  style="width: 50rem;height:1rem;margin-left: 10rem;background:#FFF;text-align:center"></div>
  <div class="text-xs-center" style="">
    <v-pagination v-model="page" :length="pageTotal" :total-visible="7"></v-pagination>
  </div>
    <div  style="width: 50rem;height:1rem;margin-left: 10rem;background:#FFF;text-align:center"></div>
  </div>
</template>

<script>
    import axios from 'axios'
// import MenuIcon from "vue-material-design-icons/Menu.vue"

// import Qs from 'qs'
// import uploadButton from "./uploadButton";
export default {
      name: 'ShootingRequirementRecordsInfo',
      components: {
          // MenuIcon
            // uploadButton
      },
      data () {
        return {
            alertDialog:false,
            alertDialogHtml:'',
           // aaa:48,
          pagination: {
            sortBy: 'requirementSubmitTime',
            rowsPerPage: 20,
            descending:true
          },
          valueDeterminate: 0,
          showPrise: false,
          showAll: true,
          file: document.getElementById('file'),
          message: '',
          loader: null,
          loading1: false,
          loading2: false,
          loading3: false,
          loading4: false,
          suss: 0,
          open: ['public'],
          files: {
            html: 'mdi-language-html5',
            js: 'mdi-nodejs',
            json: 'mdi-json',
            md: 'mdi-markdown',
            pdf: '../assets/upload.png',
            png: 'mdi-file-image',
            txt: 'mdi-file-document-outline',
            xls: 'mdi-file-excel'
          },
          tree: [],
          items: [],

          search: '',
          headers: [
              {text: '需求名称', align: 'left',  value: 'requirementName'},
              {text: '需求类型',   value: 'requirementType'},
              { text: '提交时间',  value: 'requirementSubmitTime' },

              { text: '提交人', value: 'submitterId' },
              { text: '需求状态', value: 'requirementStatus' },
              { text: '  ', value: 'details' }
          ],
          archivalRecordsItems: [],
          page: 1,
          pageTotal: 15,
          loading: false,
          dialog1: false,
          dialog2: false,
            typeItems:["全部类型","编程摄影","存档数据"],
            statusItems:["全部状态","已受理","处理中","生产完成","数据准备完毕","已取消"],
            type:'',
            status:''
            // filename:""
        }
      },

  mounted: function () {
    this.upload(this.$store.state.userId, 1, 20, '','','')
  },
      methods: {

        details: function (a) {
         // alert(a);

              //this.$router.push('/AdvancedProduct?Id=' + a)
              let routeUrl = this.$router.resolve({
                   path: '/ShootingRequirementDetails',query:{rListId:a}
              });
              window.open(routeUrl .href, '_blank');

            // alert(a);
        },
        changeFn: function () {
                // alert("aa");
                // `this` 在方法里指向当前 Vue 实例
          files.click()
            // this.showPrise=true;
            // `event` 是原生 DOM 事件
        },
        upload: function (archivePersonnel, curPageNum, maxResult, condition,type,status) {
            // this.alertDialog = true
            // this.alertDialogHtml = '载入中，请稍后'
          this.loading = true

        // alert("aa");
            var type1;
          var status1;
            switch (type) {
                case "编程摄影":
                    type1=1;
                    break;
                case "存档数据":
                    type1=2;
                    break;
                case "":
                    type1=0;
                    break;
                case "全部类型":
                    type1=0;
                    break;
            }
            switch (status) {
                case "已受理":
                    status1=1;
                break;
                case "处理中":
                    status1=2;
                    break;
                case "生产完成":
                    status1=3;
                    break;
                case "数据准备完毕":
                    status1=5;
                    break;
                case "已取消":
                    status1=4;
                    break;
                case "":
                    status1=0;
                    break;
                case "全部状态":
                    status1=0;
                    break;
            }
          axios.get('/api/userRequirementList', {
            params: {
              userId:this.$store.state.userId,
              curPageNum: curPageNum,
              maxResult: maxResult,
              condition: condition,
                requirementWholeType:type1,
                status:status1
            }
          })
                .then(response => {
                  // alert(response);
                  var archiveInfo = []
                  this.pageTotal = response.data.data.totalPageNum
                  for (var i = 0; i < response.data.data.userRequirementStrList.length; i++) {

                      archiveInfo.push({
                        requirementName: response.data.data.userRequirementStrList[i].requirementName,
                        requirementSubmitTime: response.data.data.userRequirementStrList[i].requirementSubmitTime,
                        requirementType:response.data.data.userRequirementStrList[i].wholeRequirementType,
                        submitterId: response.data.data.userRequirementStrList[i].submitterId,
                        requirementStatus: response.data.data.userRequirementStrList[i].requirementStatus,
                        details: '详情',
                        requirementId:response.data.data.userRequirementStrList[i].requirementId
                      })

                  }
                  // alert(archiveInfo);
                    this.archivalRecordsItems = archiveInfo
                    this.loading = false
                    this.alertDialog = false
              // archivalRecordsItems=archiveInfo;
                })
                .catch(function (error) {
                  alert(error)
                })
        },
        importFile: function () {
          var selectedFile = document.getElementById('files').files[0]// 获取读取的File对象
          var filename = selectedFile.name
            // alert(filename);
          this.message = filename
            // alert(this.message);
            // console.log(filename);
            // fileReader(selectedFile);
            // `this` 在方法里指向当前 Vue 实例
            // files.click();
          this.showPrise = true
            // `event` 是原生 DOM 事件
        },
        aa: function (a) {
             // alert(this.items);
            // alert( this.items.indexOf(a,0));
          var index = this.items.indexOf(a, 0)
          this.$store.commit('archivalRecordsInfoShowChange', index)
        // alert(a);
        },
        getUrlKey(name){
              return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
          },//正则匹配地址栏中的ID

      },
      watch: {
        search: {
          handler () {
              // alert("aa");
              // alert(this.page);
              // alert(this.search);
            this.page = 1
            this.upload(this.$store.state.userId, 1, 20, this.search,this.type,this.status)
          // this.pageTotal=5;
          }},
          type: {
              handler () {
                   //alert("bb");
                  // alert(this.page);
                  // alert(this.search);
                  this.page = 1
                  this.upload(this.$store.state.userId, 1, 20, this.search,this.type,this.status)
                  // this.pageTotal=5;
              }},
          status: {
              handler () {
                   //alert("aa");
                  // alert(this.page);
                  // alert(this.search);
                  this.page = 1
                  this.upload(this.$store.state.userId, 1, 20, this.search,this.type,this.status)
                  // this.pageTotal=5;
              }},
        page: {
          handler () {
              // alert("aa");
            // alert(this.page);
            // alert(this.search);
            this.upload(this.$store.state.userId, this.page, 20, this.search,this.type,this.status)
          }},
        loader () {
          const l = this.loader
          this[l] = !this[l]

                // setTimeout(() => (this[l] = false), 3000)

               // this.loader = null
        },
        suss: {
          handler () {
                    // alert("aa");
            const l = this.loader
            this[l] = !this[l]
            this.loader = null
          }
        }
      },
      computed: {
        autoTop () {
          // alert(this.$store.state.archivalRecordsScrollTop1);
          // if(this.$store.state.archivalRecordsScrollTop1>100)
         // {
           // this.aaa=54;
           // return this.$store.state.archivalRecordsScrollTop1 +140;
         // }
         // else {
            // this.aaa=48;
          return this.$store.state.scrollTop + 20
        //  }
        },
        autoWidth () {
          // this.aaa=(this.$store.state.archivalRecordsClientWidth1-1519)/175*(-1)-3.2;
          // alert(this.$store.state.archivalRecordsClientWidth1);
          return this.$store.state.clientWidth - 100
        },
        autoHeight () {
          return this.$store.state.clientHeight - 140
    }
      },
    created:function () {
        if(this.getUrlKey('Id') === null || this.getUrlKey('Id') === undefined || this.getUrlKey('Id') === ''){
            // this.$store.commit('setUserId','122411330001846')
        }
        else{
            this.$store.commit('setUserId',this.getUrlKey('Id'))
        }
    }

    }
</script>

<style>
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .whitetemp{
      height: 2px;
      width: 650px;
      float: left;
    }
    .page_button{
      height: 34px;
      width: 150px;
      float: left;
    }
    .page_front,.page_next{
      background:#ffffff;
      border:1px solid rgba(0,0,0,0.15);
      border-radius:4px;
      width:30px;
      height:30px;
      float: left;
    }
    .front,.next{
      margin-left: 8px;
      margin-top: 8px;
    }
</style>
