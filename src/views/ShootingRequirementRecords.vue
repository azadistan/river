<template>
    <v-container fluid style="background:#FFF">

      <div >
        <v-layout   row >
            <div stlye="float:bottom" >
              <ShootingRequirementRecordsInfo/>

            </div>




        </v-layout>
      </div>

    </v-container>
</template>

<script>
    import ShootingRequirementRecordsInfo from '../components/ShootingRequirementRecordsInfo'

    export default {
      name: 'App',
      components: {

          ShootingRequirementRecordsInfo

      },
      data () {
        return {
                //
        }
      }
    }
</script>

<style scoped>

</style>
