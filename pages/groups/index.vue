<template>
    <div id="clients">
        <v-data-iterator :items="groups" :items-per-page="50">
            <template v-slot:header>
                <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
                    <v-flex xs8 md3>
                        <div style="display: flex; width: 100%">
                            <div style="flex: 1 1 0%;" class="overline text-truncate">
                                Название
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
                                Участники
                            </div>
                        </div>
                    </v-flex>

                </v-layout>
            </template>

            <template v-slot:default="props">
                <v-card>
                    <v-list>
                        <template v-for="item in props.items">
                            <v-list-item :to="{name: 'groups-id', params: {id: item.id}}">
                                <group-list-item :group="item"></group-list-item>
                            </v-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </template>
        </v-data-iterator>
    </div>
</template>

<script>
    import {filter} from 'lodash';

    import GroupListItem from "../../components/groups/GroupListItem";

    export default {
        components: {
            GroupListItem,
        },

        computed: {
            groups() {
                return this.$store.getters['selectedHall']
                    ? filter(this.$store.getters['groups/all'], item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['groups/all'];
            },
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('groups/loadAll'),
                store.dispatch('halls/loadAll'),
                store.dispatch('clients/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
