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
            :counter="hall.clients_count_new"
            icon="mdi-arrow-up-bold"
            color="success"
            :change="hall.clients_count_new"
            range="С прошлого месяца"
          >
          </stats-counter-card>
        </v-flex>

        <v-flex xs12 sm6>
          <stats-counter-card
            title="Абонементы"
            counter="12"
            icon="mdi-arrow-up-bold"
            color="success"
            :change="12"
            range="С прошлого месяца">
          </stats-counter-card>
        </v-flex>

        <v-flex xs12 sm6>
          <stats-counter-card
            title="Абонементы"
            counter="12"
            icon="mdi-arrow-up-bold"
            color="success"
            :change="12"
            range="С прошлого месяца">
          </stats-counter-card>
        </v-flex>

      </v-layout>
    </v-flex>

    <v-flex>
      <v-card outlined>
        <v-card-title class="overline">
          Посещения
        </v-card-title>
        <v-sheet color="transparent">
          <v-sparkline
            :key="String(avg)"
            :smooth="16"
            :gradient="['#f72047', '#ffd200', '#1feaea']"
            :line-width="3"
            :value="heartbeats"
            auto-draw
            stroke-linecap="round"
          ></v-sparkline>
        </v-sheet>
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

        data: () => ({
            heartbeats: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        }),

        computed: {
            hall() {
                return this.$store.getters['halls/byId']({id: this.$route.params.id})
            },
            avg() {
                const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0);
                const length = this.heartbeats.length;

                if (!sum && !length) return 0;

                return Math.ceil(sum / length)
            },
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
