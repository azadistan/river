<template>

</template>

<script>
    export default {
        name: 'blank',
        created () {
            if (this.$route.query.returnUrl) {
                // console.log('refreshed')
                this.$router.push(this.$route.query.returnUrl)
            }
        }
    }
</script>

<style scoped>

</style>