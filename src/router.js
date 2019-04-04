import Vue from 'vue'
import Router from 'vue-router'
import urmDemand from './views/urmDemand.vue'
import targetLibraryEntry from './views/targetLibraryEntry.vue'
import ShootingRequirementRecords from './views/ShootingRequirementRecords.vue'
import ShootingRequirementDetails from './views/ShootingRequirementDetails.vue'
import riverHomePage from './views/riverHomePage.vue'
import TargetRecords from './views/TargetRecords.vue'
import blank from './blank'

import riverInformation from './views/riverInformation.vue'
import riverManagerInformation from './views/riverManagerInformation.vue'
import riverPatrolRecord from './views/riverPatrolRecord.vue'
import riverEventList from './views/riverEventList.vue'
import riverProblemManagement from './views/riverProblemManagement.vue'
import riverComplaintManagement from './views/riverComplaintManagement.vue'
import riverPollutionSource from './views/riverPollutionSource.vue'
import riverSewageOutlet from './views/riverSewageOutlet.vue'
import riverAssessmentManagement from './views/riverAssessmentManagement.vue'



Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/urmDemand',
            name: 'urmDemand',
            component: urmDemand,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverAssessmentManagement',
            name: 'riverAssessmentManagement',
            component: riverAssessmentManagement,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverSewageOutlet',
            name: 'riverSewageOutlet',
            component: riverSewageOutlet,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverPollutionSource',
            name: 'riverPollutionSource',
            component: riverPollutionSource,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverProblemManagement',
            name: 'riverProblemManagement',
            component: riverProblemManagement,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverComplaintManagement',
            name: 'riverComplaintManagement',
            component: riverComplaintManagement,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverEventList',
            name: 'riverEventList',
            component: riverEventList,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverPatrolRecord',
            name: 'riverPatrolRecord',
            component: riverPatrolRecord,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverManagerInformation',
            name: 'riverManagerInformation',
            component: riverManagerInformation,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/riverHomePage',
            name: 'riverHomePage',
            component: riverHomePage,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/ShootingRequirementRecords',
            name: 'ShootingRequirementRecords',
            component: ShootingRequirementRecords,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/ShootingRequirementDetails',
            name: 'ShootingRequirementDetails',
            component: ShootingRequirementDetails,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/TargetRecords',
            name: 'TargetRecords',
            component: TargetRecords,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/targetLibraryEntry',
            name: 'targetLibraryEntry',
            component: targetLibraryEntry,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/',
            name: 'riverInformation',
            component: riverInformation,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/blank',
            name: 'blank',
            component: blank,
            meta: {
                requireAuth: true
            }
        },

    ]
})
