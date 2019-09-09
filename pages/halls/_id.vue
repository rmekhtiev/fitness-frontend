<template>
  <v-layout row wrap>
    <v-flex xs12 md4>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <stats-counter-card
            title="Клиенты"
            description="Всего / Без аб-та"
            :counter="hall.clients_count + ' / 12'"
            icon="mdi-arrow-up-bold"
            color="success"
            :change="hall.clients_count_new"
            range="С прошлого месяца"
          >
          </stats-counter-card>
        </v-flex>

        <v-flex xs12 sm6>
          <stats-counter-card
            title="Клиенты"
            description="Новые"
            :counter="hall.clients_count_new">
          </stats-counter-card>
        </v-flex>

        <v-flex xs12 sm6>
          <stats-counter-card
            title="Абонементы"
            counter="12">
          </stats-counter-card>
        </v-flex>

        <v-flex xs12 sm6>
          <stats-counter-card
            title="Абонементы"
            counter="12">
          </stats-counter-card>
        </v-flex>

      </v-layout>
    </v-flex>

    <v-flex>
      <v-card outlined>
        <v-card-title></v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
    import StatsCounterCard from "../../components/cards/StatsCounterCard";

export default {
  head() {
    return {
      title: "Зал" // todo
    };
  },
        components: {
            StatsCounterCard
        },
        computed: {
            hall() {
                return this.$store.getters['halls/byId']({id: this.$route.params.id})
            }
        },
        fetch: ({store, params}) => {
            return Promise.all([
                store.dispatch('halls/loadById', {
                    id: params.id
                })
            ]);
        },
};
</script>

<style scoped></style>
