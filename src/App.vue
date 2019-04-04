<template>
    <v-app style="font-family: '微软雅黑';">
        <v-toolbar app dark style="z-index: 77">
            <img src="data:image/png;base64,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">
            <v-toolbar-title>需求管理系统</v-toolbar-title>
            <v-toolbar-items class="hidden-sm-and-down" style="margin-left: 6rem">
                <v-btn flat @click="$router.push('/blank?returnUrl=/urmDemand')">新建编程摄影需求</v-btn>
                <v-btn flat @click="$router.push('/blank?returnUrl=/ShootingRequirementRecords')">需求列表</v-btn>
                <v-menu offset-y open-on-hover>
                    <v-btn
                            slot="activator"
                            flat
                    >
                        目标库
                    </v-btn>
                    <v-list>
                        <v-list-tile
                                @click="$router.push('/blank?returnUrl=/targetLibraryEntry')"
                        >
                            <v-list-tile-title>目标点录入</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                                @click="$router.push('/blank?returnUrl=/TargetRecords')"
                        >
                            <v-list-tile-title>目标点管理</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn flat @click="$router.push('/blank?returnUrl=/riverHomePage')">河流首页</v-btn>
                <v-btn flat @click="$router.push('/blank?returnUrl=/')">河流信息</v-btn>
                <v-btn flat @click="$router.push('/blank?returnUrl=/riverManagerInformation')">河长信息</v-btn>
                <v-btn flat @click="$router.push('/blank?returnUrl=/riverPatrolRecord')">巡河记录</v-btn>
                <v-btn flat @click="$router.push('/blank?returnUrl=/riverEventList')">事件列表</v-btn>
                <!--<v-btn flat @click="$router.push('/blank?returnUrl=/riverProblemManagement')">问题管理</v-btn>-->
                <!--<v-btn flat @click="$router.push('/blank?returnUrl=/riverComplaintManagement')">投诉管理</v-btn>-->
                <v-btn flat @click="$router.push('/blank?returnUrl=/riverAssessmentManagement')">考核管理</v-btn>
                <v-btn flat @click="$router.push('/blank?returnUrl=/riverSewageOutlet')">入河排污口</v-btn>
            </v-toolbar-items>
            <v-spacer />
        </v-toolbar>

        <v-content>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script>

    export default {
        name: 'App',
        components: {
        },
        data () {
            return {
                //
            }
        }
    }
</script>
