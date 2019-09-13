<template>
    <div>
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ trainer.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ trainer.full_name }}</v-list-item-subtitle>

                    <v-btn color="primary" text small style="position: absolute; right: .5rem; top: .5rem;">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-list-item-content>
            </v-list-item>
            <v-list two-line>
                <v-list-item v-if="trainer.phone_number" :href="'tel:' + trainer.phone_number">
                    <v-list-item-icon>
                        <v-icon color="primary">mdi-phone</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ trainer.phone_number }}</v-list-item-title>
                        <v-list-item-subtitle>Телефон</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-icon>
                        <v-icon>mdi-message-text</v-icon>
                    </v-list-item-icon>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon color="primary">mdi-map-marker</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ hall.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        </v-card>
    </div>
</template>

<script>
    export default {
        name: "GroupInfoCard",
        props:{
            trainer:{
                required:true,
                type: Object,
            }
        },
        computed: {
            hall() {
                return this.$store.getters['halls/byId']({id: this.trainer.hall_id});
            },
        },
    }
</script>

<style scoped>

</style>