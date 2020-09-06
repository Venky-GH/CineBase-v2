<template>
    <div :id="modalID" class="modal fade" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add {{ type === 1 ? "Actor" : "Producer" }} Details</h4>
                </div>
                <div class="modal-body">
                    <form id="detailsForm">
                        <div class="form-group">
                            <label for="name">
                                Name
                                <span class="requiredField">*</span>
                            </label>
                            <input type="text" placeholder="Eg: Venkatesh Naidu" id="name" name="name"
                                   v-model="details.name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>
                                Sex
                                <span class="requiredField">*</span>
                            </label>
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
                            <label for="dateOfBirth">
                                Date of Birth
                                <span class="requiredField">*</span>
                            </label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" v-model="details.dateOfBirth"
                                   placeholder="Eg: " class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="biography">
                                Biography
                                <span class="requiredField">*</span>
                            </label>
                            <textarea name="bio" id="bio" cols="30" v-model="details.biography" class="form-control"
                                      rows="10"
                                      placeholder="Enter biography....." required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" @click.prevent="FormSubmit" class="btn btn-success">SUBMIT</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">CLOSE</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {MyApiService} from "../../api";
    import {$, eventBus} from '../../main';
    import {ShowToast} from "../../main";

    export default {
        props: ['modalID'],
        data() {
            return {
                details: {
                    name: '',
                    sex: 'Male',
                    dateOfBirth: '',
                    biography: ''
                },
                type: 0
            }
        },
        methods: {
            async FormSubmit() {
                try {
                    let response = await MyApiService.AddItem(this.details, this.type);
                    let insertedItem = {
                        id: response.data.id,
                        name: this.details.name
                    };
                    eventBus.$emit('newAddition', insertedItem, this.type);
                    this.ResetForm();
                    ShowToast(1, ((this.type === 1) ? "Actor" : "Producer") + " added successfully");
                } catch (e) {
                    console.error(e.toString());
                    ShowToast(2, "Something went wrong");
                }
            },
            ResetForm() {
                this.details.name = '';
                this.details.sex = 'Male';
                this.details.dateOfBirth = '';
                this.details.biography = '';
            }
        },
        created() {
            eventBus.$on('typeCasted', (value) => {
                this.type = value;
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

    .requiredField {
        color: rgba(255, 38, 0, 0.78);
    }
</style>