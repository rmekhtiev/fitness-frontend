<template>
  <v-layout row wrap>
    <!--    <v-flex xs12 md4>-->
    <!--      <v-layout row wrap>-->
    <!--        <v-flex xs12 sm6>-->
    <!--          <stats-counter-card-->
    <!--            title="Клиенты"-->
    <!--            description="Всего / Без аб-та"-->
    <!--            :counter="hall.clients_count + ' / 12'"-->
    <!--            icon="mdi-arrow-up-bold"-->
    <!--            color="success"-->
    <!--            :change="hall.clients_count_new"-->
    <!--            range="С прошлого месяца"-->
    <!--          >-->
    <!--          </stats-counter-card>-->
    <!--        </v-flex>-->

    <!--        <v-flex xs12 sm6>-->
    <!--          <stats-counter-card-->
    <!--            title="Клиенты"-->
    <!--            description="Новые"-->
    <!--            :counter="hall.clients_count_new"-->
    <!--            icon="mdi-arrow-up-bold"-->
    <!--            color="success"-->
    <!--            :change="hall.clients_count_new"-->
    <!--            range="С прошлого месяца"-->
    <!--          >-->
    <!--          </stats-counter-card>-->
    <!--        </v-flex>-->

    <!--        <v-flex xs12 sm6>-->
    <!--          <stats-counter-card-->
    <!--            title="Абонементы"-->
    <!--            counter="12"-->
    <!--            icon="mdi-arrow-up-bold"-->
    <!--            color="success"-->
    <!--            :change="12"-->
    <!--            range="С прошлого месяца"-->
    <!--          >-->
    <!--          </stats-counter-card>-->
    <!--        </v-flex>-->

    <!--        <v-flex xs12 sm6>-->
    <!--          <stats-counter-card-->
    <!--            title="Абонементы"-->
    <!--            counter="12"-->
    <!--            icon="mdi-arrow-up-bold"-->
    <!--            color="success"-->
    <!--            :change="12"-->
    <!--            range="С прошлого месяца"-->
    <!--          >-->
    <!--          </stats-counter-card>-->
    <!--        </v-flex>-->
    <!--      </v-layout>-->
    <!--    </v-flex>-->
    <v-flex md4 sm12>
      <v-card>
        <table style="border: 2px solid black">
          <tr>
            <th>Итого по категории</th>
            <th>Бар</th>
            <th>Тренеры</th>
            <th>Метод оплаты</th>
          </tr>
          <tr>
            <td>{{ calculateSum.total.cash }}</td>
            <td>{{ calculateSum.bar.cash }}</td>
            <td>{{ calculateSum.trainers.cash }}</td>
            <td>Наличными</td>
          </tr>
          <tr>
            <td>{{ calculateSum.total.card }}</td>
            <td>{{ calculateSum.bar.card }}</td>
            <td>{{ calculateSum.trainers.card }}</td>
            <td>По карте</td>
          </tr>
          <tr>
            <td>{{ calculateSum.total.transfer }}</td>
            <td>{{ calculateSum.bar.transfer }}</td>
            <td>{{ calculateSum.trainers.transfer }}</td>
            <td>Переводом</td>
          </tr>
          <tr>
            <td>{{ calculateSum.total.total }}</td>
            <td>{{ calculateSum.bar.total }}</td>
            <td>{{ calculateSum.trainers.total }}</td>
            <td>*</td>
          </tr>
        </table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from "lodash";
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
    loading: {
      payments: true
    },
    types: [
      { value: "App\\Models\\Trainer", text: "тренер" },
      { value: "App\\Models\\BarItem", text: "бар" }
    ],
    methods: [
      // { value: "cash", text: "Наличными" },
      // { value: "card", text: "Картой" },
      // { value: "transfer", text: "Переводом" }
      "cash",
      "card",
      "transfer"
    ],
    filter: {}
  }),

  computed: {
    payments() {
      return this.$store.getters["payments/where"]({
        filter: this.paymentsFilter
      });
    },

    // hall() {
    //   return this.$store.getters["halls/where"]({
    //     filter: this.hallsFilter
    //   });
    // },
    paymentsFilter() {
      return {
        method: this.methods
      };
    },
    // hallsFilter() {
    //   return {
    //     hall_id: this.$route.params.id
    //   };
    // }
    calculateSum() {
      const payments = this.payments;
      const result = {
        bar: {
          cash: 0,
          card: 0,
          transfer: 0,
          total: 0
        },
        trainers: {
          cash: 0,
          card: 0,
          transfer: 0,
          total: 0
        },
        total: {
          cash: 0,
          card: 0,
          transfer: 0,
          total: 0
        }
      };
      for (let i = 0; i < payments.length; i++) {
        const cost = parseFloat(payments[i].cost * payments[i].quantity);
        if (payments[i].sellable_type === "App\\Models\\BarItem") {
          if (payments[i].method === "cash") {
            result.bar.cash += cost;
          }
          if (payments[i].method === "card") {
            result.bar.card += cost;
          }
          if (payments[i].method === "transfer") {
            result.bar.transfer += cost;
          }
        }

        if (payments[i].sellable_type === "App\\Models\\Trainer") {
          if (payments[i].method === "cash") {
            result.trainers.cash += cost;
          }
          if (payments[i].method === "card") {
            result.trainers.card += cost;
          }
          if (payments[i].method === "transfer") {
            result.trainers.transfer += cost;
          }
        }
      }
      result.bar.total =
        result.bar.cash + result.bar.card + result.bar.transfer;
      result.trainers.total =
        result.trainers.cash + result.trainers.card + result.trainers.transfer;
      result.total.cash = result.bar.cash + result.trainers.cash;
      result.total.card = result.bar.card + result.trainers.card;
      result.total.transfer = result.bar.transfer + result.trainers.transfer;
      result.total.total = result.bar.total + result.trainers.total;
      console.log(result);
      return result;
    }
  },
  //
  // fetch: ({ store, params }) => {
  //   return Promise.all([
  //     store.dispatch("payments/loadWhere", {
  //       filter: this.paymentsFilter
  //     }),
  //     store.dispatch("halls/loadById", {
  //       id: params.id
  //     })
  //   ]);
  // },

  mounted() {
    Promise.all([this.loadPayments()]);
  },

  methods: {
    loadPayments() {
      return this.$store.dispatch("payments/loadWhere", {
        filter: this.paymentsFilter
      });
    }
  }
  // loadHalls() {
  //   this.store.dispatch("halls/loadWhere", {
  //     filter: this.hallsFilter
  //   });
  // }
};
</script>

<style scoped>
table {
  font-size: 16px;
  border-collapse: collapse;
  text-align: center;
}

td:first-child {
  font-weight: bold;
  color: green;
  padding: 10px 20px;
}
th {
  padding: 10px 20px;
  font-weight: bold;
  border-style: solid;
  border-width: 0 1px 1px 0;
  border-color: grey;
}
td {
  border-style: solid;
  border-width: 0 1px 1px 0;
  border-color: grey;
}
</style>
