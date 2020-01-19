<template>
    <div class="form">
        <div class="heading">
            Movie Details
        </div>
        <form id="myForm">
            <div class="form-group">
                <label for="movie_name">
                    Name
                    <span class="requiredField">*</span>
                </label>
                <input type="text" v-model.trim="movieDetails.name" class="form-control" name="movie_name"
                       placeholder="Eg: The Expendables" id="movie_name" required>
            </div>
            <label for="image_file" class="imageLabel">
                Image
                <span class="requiredField">*</span>
            </label>
            <div v-if="showPreview" class="preview">
                <img :src="baseImageURL + movieDetails.image" alt="" id="image_preview">
            </div>
            <div class="form-group">
                <input type="file" class="form-control file_type hidden" @change="ImageEventListener" id="image_file"
                       name="file">
                <button class="add_button btn btn-success" @click.prevent="TriggerUploadButton">
                    <span v-if="showPreview">Change Image</span>
                    <span v-else>Upload Image</span>
                </button>
            </div>
            <div class="form-group">
                <label>
                    Actors
                    <span class="requiredField">*</span>
                </label>
                <multiselect id="ac" v-model="selectedActors" :options="actorOptions" :multiple="true"
                             :close-on-select="false" :clear-on-select="false" :preserve-search="true"
                             placeholder="Select one or more" label="name" track-by="id" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                        <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
                    </template>
                </multiselect>
                <button :data-target="'#' + modalID" data-toggle="modal" @click.prevent="SendType(1)"
                        class="add_button btn btn-success">Add Actor
                </button>
            </div>
            <div class="form-group">
                <label>
                    Producer
                    <span class="requiredField">*</span>
                </label>
                <multiselect id="pd" v-model="selectedProducer" :options="producerOptions"
                             placeholder="Select a producer" label="name" track-by="id"
                             :preselect-first="true">
                </multiselect>
                <button :data-target="'#' + modalID" data-toggle="modal" @click.prevent="SendType(2)"
                        class="add_button btn btn-success">Add Producer
                </button>
            </div>
            <div class="form-group">
                <label for="movie_yearOfRelease">
                    Year of Release
                    <span class="requiredField">*</span>
                </label>
                <input type="number" v-model="movieDetails.yearOfRelease" class="form-control" id="movie_yearOfRelease"
                       name="yearOfRelease"
                       placeholder="Eg: 2001" required>
            </div>
            <div class="form-group">
                <label for="movie_plot">
                    Plot
                    <span class="requiredField">*</span>
                </label>
                <textarea v-model="movieDetails.plot" placeholder="Plot of the Movie...." id="movie_plot"
                          name="plot" class="form-control" rows="10" required></textarea>
            </div>
            <div class="submit_button">
                <button @click.prevent="SubmitForm" class="btn btn-info">SUBMIT</button>
                <router-link :to="{name: 'movies'}" tag="button" class="btn btn-danger">Cancel</router-link>
            </div>
        </form>
        <my-modal :modalID="modalID"></my-modal>
    </div>
</template>

<script>
    import {MyApiService} from '../../api';
    import {baseImageURL, eventBus, ShowToast} from '../../main';
    import Multiselect from 'vue-multiselect';
    import myModal from './modal.vue';
    import {required, minLength, numeric, minValue, between} from 'vuelidate/lib/validators'

    export default {
        data() {
            return {
                movieDetails: {
                    id: -1,
                    name: '',
                    image: '',
                    plot: '',
                    yearOfRelease: ''
                },
                actorOptions: [],
                producerOptions: [],
                selectedActors: [],
                selectedActorIds: [],
                selectedProducerId: '',
                selectedProducer: null,
                baseImageURL: baseImageURL,
                modalID: 'addOnPopUp',
                showPreview: false
            }
        },
        components: {
            Multiselect,
            myModal
        },
        methods: {
            TriggerUploadButton() {
                document.getElementById('image_file').click();
            },
            async PopulateActors() {
                try {
                    let actorDetails = await MyApiService.FetchAllActors();
                    this.actorOptions = [];
                    $.each(actorDetails.data.result, (key, value) => {
                        this.actorOptions.push({
                            name: value.name,
                            id: value.id
                        });
                    });
                } catch (e) {
                    console.error(e.toString());
                    ShowToast(2, "Something went wrong");
                }
            },
            async PopulateProducer() {
                try {
                    let producerDetails = await MyApiService.FetchAllProducers();
                    this.producerOptions = [];
                    $.each(producerDetails.data.result, (key, value) => {
                        this.producerOptions.push({
                            name: value.name,
                            id: value.id
                        });
                    });
                } catch (e) {
                    console.error(e.toString());
                    ShowToast(2, "Something went wrong");
                }
            },
            async PopulateForm() {
                try {
                    if (this.movieDetails.id !== -1) {
                        let response = await MyApiService.FetchSpecificMovie(this.movieDetails.id);
                        response = response.data.result;
                        this.movieDetails.name = response.name;
                        this.movieDetails.image = response.image;
                        this.movieDetails.plot = response.plot;
                        this.movieDetails.yearOfRelease = response.yearOfRelease;

                        // set selected actors and producer
                        response.actors.forEach(value => {
                            this.selectedActors.push({
                                id: value.id,
                                name: value.name
                            });
                        });

                        this.selectedProducer = {
                            id: response.producer.id,
                            name: response.producer.name
                        };
                    }
                } catch (e) {
                    console.error(e.toString());
                    ShowToast(2, "Something went wrong");
                }
            },
            async ImageEventListener(e) {
                try {
                    let imageDetails = e.target.value.split(".");
                    let extension = imageDetails[imageDetails.length - 1];
                    let allowedExtensions = ["jpg", "jpeg", "png", "gif"];
                    if (!allowedExtensions.includes(extension)) {
                        // show_toast(0, "File type not allowed!", "");
                        alert("File type not allowed!");
                        e.target.value = "";
                    } else {
                        if (e.target.files[0].size > 10000000) {
                            // show_toast(0, "File size exceeded!", "File size limit is 2 MB.");
                            alert("File size limit is 10 MB.");
                            e.target.value = "";
                        } else {
                            let formData = new FormData();
                            formData.append('file', e.target.files[0]);
                            let res = await MyApiService.UploadImage(formData);
                            this.movieDetails.image = res.data.result;
                            this.showPreview = true;
                        }
                    }
                } catch (e) {
                    console.error(e.toString());
                    ShowToast(2, "Something went wrong");
                }
            },
            async SubmitForm() {
                try {
                    let movieData = {
                        name: this.movieDetails.name,
                        image: this.movieDetails.image,
                        plot: this.movieDetails.plot,
                        yearOfRelease: this.movieDetails.yearOfRelease,
                        actorIdList: this.selectedActorIds,
                        producerId: this.selectedProducerId
                    };
                    if (this.movieDetails.id === -1) {
                        let res = await MyApiService.AddMovie(movieData);
                        console.log(res.data.message);
                        ShowToast(1, "Movie added successfully");
                    } else {
                        movieData.id = this.movieDetails.id;
                        let res = await MyApiService.UpdateMovie(movieData, movieData.id);
                        console.log(res.data.message);
                        ShowToast(1, "Movie updated successfully");
                    }
                    await this.$router.push({name: 'movies'});
                } catch (e) {
                    console.error(e.toString());
                    ShowToast(2, "Something went wrong");
                }
            },
            SendType(type) {
                eventBus.$emit('typeCasted', type);
            }
        },
        created() {

            this.PopulateActors();
            this.PopulateProducer();
            if (this.$route.params.id) {
                this.movieDetails.id = this.$route.params.id;
                this.showPreview = true;
                this.PopulateForm();
            }

            eventBus.$on('newAddition', (value, type) => {
                if (type === 1) {
                    this.actorOptions.push(value);
                    this.selectedActors.push(value)
                } else {
                    this.producerOptions.push(value);
                    this.selectedProducer = value;
                }
            });
        },
        watch: {
            selectedActors(newVal, oldVal) {
                this.selectedActorIds = [];
                $.each(newVal, (key, value) => {
                    this.selectedActorIds.push(value.id);
                });
            },
            selectedProducer(newVal, oldVal) {
                this.selectedProducerId = newVal.id;
            }
        }
    }
</script>

<style scoped>

    @media (min-width: 501px) {
        .form {
            margin: 1rem 20rem;
        }
    }

    @media (max-width: 500px) {
        .form {
            margin: auto;
        }
    }

    .form .heading {
        text-align: center;
        font-size: 2.25rem;
        font-weight: bold;
        margin-bottom: 5rem;
    }

    .preview img {
        object-fit: cover;
        width: 50%;
        height: 30%;
        border: 1px solid #e8e8e8;
        padding: 0.4rem;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
    }

    input.form-control {
        height: 4rem;
        padding: 0.65rem;
    }

    .form-control {
        border: 1px solid #e8e8e8;
        box-shadow: none;
    }

    .submit_button {
        margin: 5rem auto;
        text-align: center;
    }

    .btn {
        width: 12rem;
        margin: 0rem 1rem;
    }

    .btn.add_button {
        margin: 1rem 0rem;
    }

    .invalid input, .invalid textarea {
        border-color: rgba(255, 0, 0, 0.8);
        background-color: rgba(250, 128, 114, 0.08);
    }

    .invalid label, .invalid p {
        color: rgba(255, 0, 0, 0.8);
    }

    .disabled {
        pointer-events: none;
    }

    .requiredField {
        color: rgba(255, 38, 0, 0.78);
    }

    .imageLabel {
        margin-bottom: 1.5rem;
    }
</style>