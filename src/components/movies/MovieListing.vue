<template>
    <div>
        <div class="row thumbnail-container">
            <div v-for="movie in FilteredMovies" :key="movie.id" class="col-sm-6 col-md-4" data-aos="zoom-in" data-aos-duration="1000">
                <div class="thumbnail">
                    <img :src="baseImageURL + movie.image" :alt="movie.image">
                    <div class="caption">
                        <div>
                            <div class="section_headers">Starring:</div>
                            <div class="chip actor" v-for="actor in movie.actors" :key="actor.id">
                                <span @click="ShowActorDetails(actor.id)">{{ actor.name }}</span>
                            </div>
                        </div>
                        <div>
                            <div class="section_headers">Produced by:</div>
                            <p class="chip producer" @click="ShowProducerDetails(movie.producer.id)">{{
                                movie.producer.name }}</p>
                        </div>
                        <hr>
                        <h3 class="movie_name">{{ movie.name }} <span
                                class="yearOfRelease">({{ movie.yearOfRelease }})</span></h3>
                        <p class="plot">{{ movie.plot }}</p>
                        <p class="button_section">
                            <router-link :to="{name: 'editMovie', params: {id: movie.id}}" tag="button"
                                         class="btn edit_button">Edit
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {MyApiService} from '../../api';
    import {baseImageURL} from "../../main";
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
            async ShowActorDetails(actorId) {
                try {
                    let response = await MyApiService.FetchSpecificActor(actorId);
                    console.log(response.data.result);
                } catch (e) {
                    console.error(e.toString());
                }
            },
            async ShowProducerDetails(producerId) {
                try {
                    let response = await MyApiService.FetchSpecificProducer(producerId);
                    console.log(response.data.result);
                } catch (e) {
                    console.error(e.toString());
                }
            }
        },
        computed: {
            FilteredMovies() {
                return this.movies.filter(item => {
                    return item.name.toLowerCase().includes(this.searchParams);
                });
            }
        },
        created() {
            (async () => {
                try {
                    let response = await MyApiService.FetchAllMovies();
                    this.movies = response.data.result;
                } catch (e) {
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
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
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
        transition: all 0.2s ease-in;
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

    .yearOfRelease {
        font-size: 1.8rem;
    }
</style>