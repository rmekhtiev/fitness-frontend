<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 sm12 lg8 xl6>
                <issue-info-card
                        :issue="issue"
                        class="mb-2 mx-auto">
                </issue-info-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import {filter} from 'lodash';
    import IssueInfoCard from "../../components/issues/IssueInfoCard";

    export default {
        components: {
            IssueInfoCard,
        },

        computed: {
            issue() {
                return this.$store.getters['issues/byId']({id: this.$route.params.id});
            },
            employees() {
                return this.$store.getters['selectedHall']
                    ? this.$store.getters['employees/all'].filter(item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['employees/all'];
            },
        },

        fetch({store, params}) {
            return Promise.all([
                store.dispatch('issues/loadById', {id: params.id}),
                store.dispatch('halls/loadAll'),
                store.dispatch('employees/loadAll'),
            ]);
        },
        
        head() {
            return {
             title: "Проблема" // todo:
        }
    }
}
</script>

<style scoped></style>
