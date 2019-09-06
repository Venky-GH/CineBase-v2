<template>
    <div class="form">
        <div class="heading">
            Movie Details
        </div>
        <form id="myForm">
            <div class="form-group" :class="{'invalid': $v.modified_details.name.$error}">
                <label for="movie_name">Name*</label>
                <input type="text" v-model.trim="modified_details.name" class="form-control" name="movie_name"
                       placeholder="Eg: The Expendables" id="movie_name" required>
            </div>
            <div v-if="showPreview" class="preview">
                <img :src="baseImageURL + modified_details.image" alt="" id="image_preview">
            </div>
            <div class="form-group">
                <label for="image_file">Image</label>
                <input type="file" class="form-control file_type" @change="imageEventListener" id="image_file"
                       name="file">
            </div>
            <div class="form-group">
                <label>Actors</label>
                <multiselect id="ac" v-model="selected_actors" :options="actor_options" :multiple="true"
                             :close-on-select="false" :clear-on-select="false" :preserve-search="true"
                             placeholder="Select one or more" label="name" track-by="id" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                        <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
                    </template>
                </multiselect>
                <button :data-target="'#' + modalID" data-toggle="modal" @click.prevent="sendType(1)"
                        class="add_button btn btn-success">Add Actor
                </button>
            </div>
            <div class="form-group">
                <label>Producer</label>
                <multiselect id="pd" v-model="selected_producer" :options="producer_options"
                             placeholder="Select a producer" label="name" track-by="id"
                             :preselect-first="true">
                </multiselect>
                <button :data-target="'#' + modalID" data-toggle="modal" @click.prevent="sendType(2)"
                        class="add_button btn btn-success">Add Producer
                </button>
            </div>
            <div class="form-group" :class="{'invalid': $v.modified_details.yor.$error}">
                <label for="movie_yor">Year of Release*</label>
                <input type="number" v-model="modified_details.yor" class="form-control" id="movie_yor" name="yor"
                       placeholder="Eg: 2001" required>
                <p v-if="!$v.modified_details.yor.between">Please enter a valid year</p>
            </div>
            <div class="form-group" :class="{'invalid': $v.modified_details.plot.$error}">
                <label for="movie_plot">Plot*</label>
                <textarea v-model="modified_details.plot" placeholder="Plot of the Movie...." id="movie_plot"
                          name="plot" class="form-control" rows="10" required></textarea>
                <p v-if="!$v.modified_details.plot.minLength">Plot must be at least 100 characters long</p>
            </div>
            <div class="submit_button"><!-- , {'disabled' : $v.modified_details.$error}-->
                <button @click.prevent="submitForm" :class="['btn btn-info']">SUBMIT</button>
                <router-link :to="{name: 'movies'}" tag="button" class="btn btn-danger">Cancel</router-link>
            </div>
        </form>
        <my-modal :id="modalID"></my-modal>
    </div>
</template>

<script>
    import {myApiService} from '../../api';
    import {$, baseImageURL, eventBus} from '../../main';
    import Multiselect from 'vue-multiselect';
    import myModal from './modal.vue';
    import {required, minLength, numeric, minValue, between} from 'vuelidate/lib/validators'

    export default {
        data() {
            return {
                modified_details: {
                    id: -1,
                    name: '',
                    image: '',
                    plot: '',
                    yor: ''
                },
                actor_options: [],
                producer_options: [],
                selected_actors: [],
                selected_actors_form: [],
                selected_producer_form: '',
                selected_producer: null,
                file_status: 0,
                baseImageURL: baseImageURL,
                modalID: 'addOnPopUp',
                showPreview: false
            }
        },
        validations: {
            modified_details: {
                name: {
                    required
                },
                plot: {
                    required,
                    minLength: minLength(100)
                },
                yor: {
                    required,
                    numeric,
                    between: between(1800, 2019)
                }
            }
        },
        components: {
            Multiselect,
            myModal
        },
        methods: {
            async populateActors() {
                try {
                    let actor_details = await myApiService.listItems(2);
                    this.actor_options = [];
                    $.each(actor_details.data.list, (key, value) => {
                        this.actor_options.push({
                            name: value.name,
                            id: parseInt(value.actor_id)
                        });
                    });
                } catch (e) {
                    console.log(e);
                    alert('Something went wrong!');
                }
            },
            async populateProducer() {
                try {
                    let producer_details = await myApiService.listItems(3);
                    this.producer_options = [];
                    $.each(producer_details.data.list, (key, value) => {
                        this.producer_options.push({
                            name: value.name,
                            id: parseInt(value.producer_id)
                        });
                    });
                } catch (e) {
                    console.log(e);
                    alert('Something went wrong!');
                }
            },
            async populateForm() {
                try {
                    if (this.modified_details.id !== -1) {
                        this.showPreview = true;

                        let response = await myApiService.listItems(4, this.modified_details.id);
                        response = response.data.list[0];
                        this.modified_details.name = response.name;
                        this.modified_details.image = response.image;
                        this.modified_details.plot = response.plot;
                        this.modified_details.yor = response.yor;

                        // set selected actors and producer
                        response.actor_names.forEach((value, index) => {
                            this.selected_actors.push({
                                id: parseInt(response.actor_ids[index]),
                                name: value
                            });
                        });

                        this.selected_producer = {
                            id: parseInt(response.producer_id),
                            name: response.producer_name
                        };
                    }
                } catch (e) {
                    console.error(e.stack);
                }
            },
            imageEventListener(e) {
                let name_splits = e.target.value.split(".");
                let extension = name_splits[name_splits.length - 1];
                let allowed_extensions = ["jpg", "jpeg", "png", "gif"];
                if (!allowed_extensions.includes(extension)) {
                    // show_toast(0, "File type not allowed!", "");
                    alert("File type not allowed!");
                    event.target.value = "";
                } else {
                    if (e.target.files[0].size > 10000000) {
                        // show_toast(0, "File size exceeded!", "File size limit is 2 MB.");
                        alert("File size limit is 10 MB.");
                        event.target.value = "";
                    } else {
                        let formData = new FormData();
                        formData.append('file', e.target.files[0]);
                        myApiService.uploadImage(formData).then(res => {
                            if (res.data.status === 1) {
                                this.modified_details.image = res.data.filename;
                                $('#filename').val(this.modified_details.image);
                                this.file_status = 1;
                            } else {
                                alert('Error While Uploading!');
                                this.file_status = 0;
                            }
                        });
                        this.showPreview = true;
                    }
                }
            },
            submitForm() {
                this.$v.modified_details.$touch();
                if (this.$v.modified_details.$error || this.validateSelectedActors || this.validateSelectedProducer || !this.file_status)
                    console.log('Fill all the fields!!');
                else {
                    let form_data = {
                        movie_name: this.modified_details.name,
                        filename: this.modified_details.image,
                        plot: this.modified_details.plot,
                        yor: this.modified_details.yor,
                        actor_id_list: this.selected_actors_form.join(','),
                        producer_id_list: this.selected_producer_form
                    };
                    if (this.modified_details.id === -1) {
                        myApiService.addMovie(form_data).then(res => {
                            if (res.data.status === 1) {
                                console.log('Added Successfully!');
                                this.$router.push({name: 'movies'});
                            } else {
                                console.log('Something went wrong!');
                            }
                        });
                    } else {
                        form_data.movie_id = this.modified_details.id;
                        myApiService.updateMovie(form_data).then(res => {
                            if (res.data.status === 1) {
                                console.log('Updated Successfully!');
                                this.$router.push({name: 'movies'});
                            } else {
                                console.log('Something went wrong');
                            }
                        });
                    }
                }
            },
            sendType(type) {
                eventBus.$emit('typeCasted', type);
            }
        },
        computed: {
            validateSelectedActors() {
                return this.selected_actors.length === 0;
            },
            validateSelectedProducer() {
                return this.selected_producer === null;
            }
        },
        created() {

            this.populateActors();
            this.populateProducer();
            if(this.$route.params.id) {
                console.log('aaya!');
                this.modified_details.id = this.$route.params.id;
                this.file_status = 1;
                this.populateForm();
            }

            eventBus.$on('newAddition', (value, type) => {
                if (type === 1) {
                    this.actor_options.push(value);
                    this.selected_actors.push(value)
                } else {
                    this.producer_options.push(value);
                    this.selected_producer = value;
                }
            });
        },
        watch: {
            selected_actors(newVal, oldVal) {
                this.selected_actors_form = [];
                $.each(newVal, (key, value) => {
                    this.selected_actors_form.push(parseInt(value.id));
                });
            },
            selected_producer(newVal, oldVal) {
                this.selected_producer_form = newVal.id;
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
</style>