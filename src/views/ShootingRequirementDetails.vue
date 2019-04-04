<template>
    <v-container fluid style="background:#F0F2F5">


      <div >

            <div stlye="float:left" >
                <ShootingRequirementDetailsInfo/>
            </div>





      </div>

    </v-container>
</template>

<script>
    import ShootingRequirementDetailsInfo from '../components/ShootingRequirementDetailsInfo'

export default {
      name: 'App',
      components: {
          ShootingRequirementDetailsInfo
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
