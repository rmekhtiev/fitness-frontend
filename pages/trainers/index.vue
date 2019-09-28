<template>
    <div id="clients">
        <v-layout id="filters">

            <v-flex md3 class="hidden-sm-and-down">
                <v-autocomplete
                        v-model="filter.trainer_id"
                        :items="trainers"

                        item-text="name"
                        item-value="id"

                        label="Тренер"
                        single-line
                        filled

                        clearable

                        @input="loadFiltered"
                ></v-autocomplete>
            </v-flex>

            <v-flex md3 class="hidden-sm-and-down">
                <v-autocomplete
                        v-model="filter.phone_number"
                        :items="trainers"

                        item-text="phone_number"
                        item-value="phone_number"

                        label="Номер телефона"
                        single-line
                        filled

                        clearable

                        @input="loadFiltered"
                ></v-autocomplete>
            </v-flex>
        </v-layout>

        <v-data-iterator :items="trainers" :items-per-page="50">
            <template v-slot:header>
                <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
                    <v-flex xs8 md3>
                        <div style="display: flex; width: 100%">
                            <div style="flex: 1 1 0%;" class="overline text-truncate">
                                ФИО
                            </div>
                        </div>
                    </v-flex>

                    <v-flex md3>
                        <div style="display: flex; width: 100%">
                            <div style="flex: 1 1 0%;" class="overline text-truncate">
                                Зал
                            </div>
                        </div>
                    </v-flex>

                    <v-flex md3>
                        <div style="display: flex; width: 100%">
                            <div style="flex: 1 1 0%;" class="overline text-truncate">
                                Номер телефона
                            </div>
                        </div>
                    </v-flex>

                    <v-flex md3>

                    </v-flex>
                </v-layout>
            </template>

            <template v-slot:default="props">
                <v-card>
                    <v-list>
                        <template v-for="item in props.items">
                                <trainer-list-item :trainer="item" ></trainer-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </template>
        </v-data-iterator>
        <v-btn
                color="blue"
                dark
                absolute
                bottom
                right
                fab
                class="mb-12"
                @click.native="openTrainerDialog">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <trainer-dialog ref="trainerDialog" title="Создать тренера"></trainer-dialog>
    </div>
</template>

<script>
    import {filter} from 'lodash';

    import filterable from '../../mixins/filterable';
    import TrainerListItem from "../../components/trainers/TrainerListItem";
    import TrainerDialog from "../../components/trainers/TrainerDialog";

    export default {
        name: "index",

        components:{
         TrainerListItem,
         TrainerDialog,
        },

        mixins:[
            filterable,
        ],

        computed: {
            pureTrainers() {
                return _(this.pureFilter).isEmpty() ? this.$store.getters['trainers/all'] : this.$store.getters['trainers/where']({filter: this.pureFilter})
            },

            trainers() {
                return this.$store.getters['selectedHall']
                    ? filter(this.pureTrainers, item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.pureTrainers;
            },

        },
        methods: {
            openTrainerDialog() {
                this.$refs.trainerDialog.open().then(form => {
                    this.$axios.post('trainers', form)
                        .then(async response => {
                            await this.$store.dispatch('trainers/loadById', {id: response.data.data.id});
                            this.$router.push({name: 'trainers', params: {id: response.data.data.id}})
                        });
                });
            },
            loadFiltered() {
                this.$store.dispatch('trainers/loadWhere', {filter: this.pureFilter});
            },
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('trainers/loadAll'),
                store.dispatch('employees/loadAll'),
                store.dispatch('halls/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
