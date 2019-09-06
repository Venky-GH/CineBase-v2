<template>
    <div class="entirePage">
        <nav-bar></nav-bar>
        <div class="container bodyContent">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import NavBar from './components/common/Navbar'

    export default {
        components : {
            NavBar
        }
    }
</script>

<style scoped>
    .entirePage {
        font-family: 'Livvic', sans-serif;
    }
    .bodyContent {
        margin-top: 10rem;
    }
</style>
