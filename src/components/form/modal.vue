<template>
    <div :id="id" class="modal fade" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add Details</h4>
                </div>
                <div class="modal-body">
                    <form id="detailsForm">
                        <div class="form-group">
                            <label for="name">Name*</label>
                            <input type="text" placeholder="Eg: Venkatesh Naidu" id="name" name="name"
                                   v-model="details.name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Sex*</label>
                            <br>
                            <label class="radio-label">
                                <input type="radio" name="sex" value="Male" v-model="details.sex" required>
                                Male
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="sex" value="Female" v-model="details.sex" required>
                                Female
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="dob">Date of Birth*</label>
                            <input type="date" id="dob" name="dob" v-model="details.dob" placeholder="Eg: " class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="bio">Biography*</label>
                            <textarea name="bio" id="bio" cols="30" v-model="details.bio" class="form-control" rows="10"
                                      placeholder="Enter biography....." required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" @click.prevent="formSubmit" class="btn btn-success">SUBMIT</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">CLOSE</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {myApiService} from "../../api";
    import {$, eventBus} from '../../main';

    export default {
        props: ['id'],
        data() {
            return {
                details: {
                    name: '',
                    sex: 'Male',
                    dob: '',
                    bio: '',
                    type: ''
                }
            }
        },
        methods: {
            formSubmit() {
                myApiService.addItem(this.details).then(res => {
                    if (res.data.status === 1) {
                        let details = {
                            id: res.data.id,
                            name: res.data.name
                        };
                        eventBus.$emit('newAddition', details, this.details.type);
                        $('#detailsForm')[0].reset();
                        alert('Added Successfully!');
                    }
                })
            }
        },
        created() {
            eventBus.$on('typeCasted', (value) => {
                this.details.type = value;
            });
        }
    }
</script>

<style scoped>
    input[type='text'].form-control {
        height: 3.7rem;
        padding: 0.65rem;
    }

    .form-control {
        border: 1px solid #e8e8e8;
        box-shadow: none;
    }

    .radio-label {
        margin-left: 1rem;
    }

    .modal-title {
        font-weight: 600;
        text-align: center;
    }

    .modal-header {
        border-top: 2px solid #eee;
    }
</style>