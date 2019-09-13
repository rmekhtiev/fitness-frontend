<template>
    <v-list-item>
        <v-layout>
            <v-flex xs8 md3>
                <div style="display: flex; width: 100%">
                    <div style="flex: 1 1 0%;" class="text-truncate">
                        <div class="body-2 text-truncate" :title="trainer.name">{{trainer.name}}</div>
                        <div class="caption text-truncate" :title="trainer.associated_employee_id">{{ trainer.associated_employee_id }}</div>
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
                        <div class="body-2 text-truncate" :title="trainer.phone_number">{{ trainer.phone_number }}</div>
                    </div>
                </div>
            </v-flex>

        </v-layout>
    </v-list-item>
</template>

<script>
    import hall from "../../mixins/trainer";
    export default {
        name: "trainer-list-item",

        props: {
            trainer: {
                type: Object,
                required: true
            }
        },
        mixins: [
            hall,
        ]
    }

</script>

<style scoped>

</style>
