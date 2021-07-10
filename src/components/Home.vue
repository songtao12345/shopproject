<template>
    <div class="home">
        <el-button type="info" @click="logout">登陆</el-button>
    </div>
</template>

<script>
export default {
    name: 'Home',
    methods: {
        logout() {
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>

</style>