<template>
    <div id="clients">
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

                    </v-flex>

                    <v-flex md3>

                    </v-flex>
                </v-layout>
            </template>

            <template v-slot:default="props">
                <v-card>
                    <v-list>
                        <template v-for="item in props.items">
                            <trainer-list-item :trainer="item"></trainer-list-item>
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
    import TrainerListItem from "../../components/trainers/TrainerListItem";
    import TrainerDialog from "../../components/trainers/TrainerDialog";

    export default {
        name: "index",

        components:{
         TrainerListItem,
            TrainerDialog,
        },

        computed: {
            trainers() {
                return this.$store.getters['selectedHall']
                    ? filter(this.$store.getters['trainers/all'], item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['trainers/all'];
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
