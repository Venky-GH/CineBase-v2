<template>
    <div>
        <div class="row thumbnail-container">
            <div v-for="item in filteredMovies" v-bind:key="item.movie_id" class="col-sm-6 col-md-4">
                <div class="thumbnail">
                    <img :src="baseImageURL + item.image" :alt="item.image">
                    <div class="caption">
                        <div>
                            <div class="section_headers">Starring: </div>
                            <div class="chip actor" v-for="(value, index) in item.actor_names" v-bind:key="item.actor_ids[index]">
                                <span @click="showDetails(1, item.actor_ids[index])">{{ value }}</span>
                            </div>
                        </div>
                        <div>
                            <div class="section_headers">Produced by: </div>
                            <p class="chip producer" @click="showDetails(2, item.producer_id)">{{ item.producer_name }}</p>
                        </div>
                        <hr>
                        <h3 class="movie_name">{{ item.name }}</h3>
                        <p class="plot">{{ item.plot }}</p>
                        <p class="button_section">
                            <router-link :to="{name: 'editMovie', params: {id: item.movie_id}}" tag="button" class="btn edit_button">Edit</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { myApiService } from '../../api';
    import { baseImageURL } from "../../main";
    import {eventBus} from "../../main";

    export default {
        data() {
            return {
                movies: [],
                baseImageURL: baseImageURL,
                searchParams: ''
            }
        },
        methods: {
            showDetails (type, id) {
                myApiService.getItemDetails(type, id).then(res => {
                    console.log(res);
                });
            }
        },
        computed: {
            filteredMovies() {
                return this.movies.filter(item => {
                    return item.name.toLowerCase().includes(this.searchParams);
                });
            }
        },
        created() {
            (async() => {
                try {
                    let response = await myApiService.listItems(1);
                    this.movies = response.data.list;
                } catch(e) {
                    throw e;
                }
            })().catch(err => console.error(err.stack));

            eventBus.$on('searchIt', (value) => {
                this.searchParams = value.toLowerCase();
            });
        }
    }
</script>

<style scoped>
    .thumbnail-container {
        display: flex;
        flex-wrap: wrap;
    }
    .thumbnail {
        height: 98%;
        position: relative;
        padding: 0rem;
    }
    .thumbnail:hover {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
        transition: all 0.1s ease-in;
    }
    .button_section {
        position: absolute;
        top: 0;
        right: 0;
    }
    .button_section .edit_button {
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 0;
        width: 8rem;
        text-transform: uppercase;
        transition: all 0.2s ease-in;
        font-size: 1.35rem;
        outline: none;
    }
    .button_section .edit_button:hover {
        padding: 1rem;
        width: 9rem;
    }
    hr {
        margin: 1rem 0.5rem;
    }
    .thumbnail img {
        object-fit: cover;
        width: 100%;
        height: 40%;
    }
    .thumbnail .movie_name {
        font-weight: 600;
    }
    .thumbnail .plot {
        margin-bottom: 5rem;
    }
    .chip {
        display: inline-block;
        padding: 0.2rem 1.5rem 0.3rem;
        border-radius: 2rem;
        margin: 1rem 0.5rem;
        color: #fff;
        cursor: pointer;
        background-color: #aaa;
    }
    .section_headers {
        display: inline-block;
        margin-right: 0.5rem;
        font-size: 1.5rem;
        font-weight: bold;
    }
    .actor {
        background-color: rgba(255, 4, 12, 0.55);
    }
    .actor:hover {
        background-color: rgba(255, 4, 12, 0.8);
    }
    .producer {
        background-color: rgba(128, 0, 128, 0.55);
    }
    .producer:hover {
        background-color: rgba(128, 0, 128, 0.8);
    }
</style>