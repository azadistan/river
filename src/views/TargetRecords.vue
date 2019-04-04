<template>
    <v-container fluid style="background:#FFF">

      <div >
        <v-layout   row >
            <div stlye="float:bottom" >
              <TargrtRecordsInfo/>
            </div>




        </v-layout>
      </div>

    </v-container>
</template>

<script>
    import TargrtRecordsInfo from '../components/TargrtRecordsInfo'

    export default {
      name: 'App',
      components: {
          TargrtRecordsInfo
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
