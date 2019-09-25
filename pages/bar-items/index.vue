<template>
    <div id="bar-items">
        <v-data-iterator :items="barItems" :items-per-page="50">
            <template v-slot:header>
                <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
                    <v-flex xs8 md9>
                        <div style="display: flex; width: 100%">
                            <div style="flex: 1 1 0%;" class="overline text-truncate">
                               Название
                            </div>
                        </div>
                    </v-flex>

                    <v-flex md3>
                        <div style="display: flex; width: 100%">
                            <div style="flex: 1 1 0%;" class="overline text-truncate text-right">
                                Количество
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </template>

            <template v-slot:default="props">
                <v-card>
                    <v-list>
                        <template v-for="item in props.items">
                            <bar-item-list-item :barItem="item"></bar-item-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </template>
        </v-data-iterator>
    </div>
</template>

<script>
    import BarItemListItem from "../../components/bar-items/BarItemListItem";
    export default {
        components:{
            BarItemListItem,
        },

        computed: {
            barItems() {
                return this.$store.getters['bar-items/all'];
            },
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('bar-items/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>