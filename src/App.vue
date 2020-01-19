<template>
    <div class="entirePage">
        <nav-bar></nav-bar>
        <div class="container bodyContent">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
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
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
