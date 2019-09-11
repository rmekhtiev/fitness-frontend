<template>
    <div>
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ group.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list two-line>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon color="primary">mdi-map-marker</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ hall.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon color="primary">mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Участники</v-list-item-title>
                        <v-list-item-subtitle>{{group.clients_count}}/{{group.max_members}}</v-list-item-subtitle>
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
            group:{
                required:true,
                type: Object,
            }
        },
        computed: {
            hall() {
                return this.$store.getters['halls/byId']({id: this.group.hall_id});
            },
        },
    }
</script>

<style scoped>

</style>