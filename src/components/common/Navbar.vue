<template>
    <div>
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <router-link :to="{name: 'movies'}" tag="a" class="navbar-brand">CineBase v2</router-link>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <router-link active-class="active" :exact="true" tag="li" :to="{name: 'movies'}"><a>Movies</a></router-link>
                    </ul>
                    <div class="navbar-form navbar-right">
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="searchParams" placeholder="Search">
                        </div>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                        <router-link active-class="active" tag="li" :to="{name: 'addMovie'}"><a>Add Movie</a></router-link>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
    </div>
</template>

<script>
    import {eventBus} from "../../main";

    export default {
        data() {
            return {
                searchParams: ''
            }
        },
        watch: {
            searchParams() {
                eventBus.$emit('searchIt', this.searchParams);
            }
        }
    }
</script>

<style scoped>
    li:hover {
        cursor: pointer;
    }
</style>