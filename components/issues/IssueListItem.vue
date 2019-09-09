<template>
    <v-list-item>
        <v-layout>

            <v-flex xs8 md3>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate">
                        <div class="body-2 text-truncate" :title="employee.name">{{employee.name}}</div>
                    </div>
                </div>
            </v-flex>

            <v-flex xs8 md3>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate">
                        <div class="body-2 text-truncate" :title="hall.title">{{ hall.title }}</div>
                        <div class="caption text-truncate" :title="hall.address">{{ hall.address }}</div>
                    </div>
                </div>
            </v-flex>

            <v-flex xs8 md3>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate">
                        <div class="body-2 text-truncate" :title="issue.status">{{issue.status}}</div>
                    </div>
                </div>
            </v-flex>

            <v-flex xs8 md3>

            </v-flex>

            <v-flex xs8 md3>

            </v-flex>

            <v-flex xs8 md3>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate text-right">
                        <div class="body-2 text-truncate" :title="issue.updated_at">{{updatedDay}}</div>
                        <div class="caption text-truncate">{{ updatedTime }}</div>
                    </div>
                </div>
            </v-flex>

        </v-layout>
    </v-list-item>
</template>

<script>
    import issue from "../../mixins/issue";

    export default {
        name: "issue-list-item",

        props: {
            issue: {
                type: Object,
                required: true
            }
        },


        mixins: [
            issue,
        ]
    }
</script>

<style scoped>

</style>
