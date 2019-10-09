<template>
    <v-list-item>
        <v-layout>
            <v-flex xs8 md9>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate">
                        <div class="body-2 text-truncate" :title="barItem.title">{{ barItem.title }}</div>
                    </div>
                </div>
            </v-flex>

            <v-flex md3>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate text-right">
                        <div class="body-2 text-truncate">{{ barItem.amount }}</div>
                    </div>
                </div>
            </v-flex>
        </v-layout>
    </v-list-item>
</template>

<script>
    export default {
        name: "BarItemListItem",

        props: {
            barItem: {
                type: Object,
                required: true
            }
        },
    }
</script>

<style scoped>

</style>