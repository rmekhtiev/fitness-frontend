<template>
  <v-layout row wrap>
    <v-flex xs12 md6 lg4 xl3>
      <client-info-card
        :client="client"
        class="mb-2 mx-auto">
      </client-info-card>
    </v-flex>

  </v-layout>
</template>

<script>
    import client from "../../mixins/client";
    import ClientInfoCard from "../../components/clients/ClientInfoCard";

    export default {
        components: {
            ClientInfoCard
        },

        mixins: [
            client,
        ],

        computed: {
            client() {
                return this.$store.getters['clients/byId']({id: this.$route.params.id});
            },
        },

        fetch: ({store, params}) => {
            return store.dispatch('clients/loadById', {
                id: params.id
            });
        },
    }
</script>

<style scoped>

</style>
