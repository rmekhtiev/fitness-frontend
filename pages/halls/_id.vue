<template>
  <div>
    <v-layout wrap row>
      <v-flex xs6 md4>
        <v-dialog
          ref="startDialog"
          v-model="modal.start"
          :return-value.sync="filter.start"
          persistent
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="$moment(filter.start).format('ll')"
              label="Начало периода"
              name="start"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker v-model="filter.start" scrollable locale="ru-ru">
            <div class="flex-grow-1" />
            <v-btn text color="primary" @click="modal.start = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.startDialog.save(filter.start)"
              @click.native="payments"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex xs6 md4>
        <v-dialog
          ref="endDialog"
          v-model="modal.end"
          :return-value.sync="filter.end"
          persistent
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="$moment(filter.end).format('ll')"
              label="Окончание периода"
              name="end"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker v-model="filter.end" scrollable locale="ru-ru">
            <div class="flex-grow-1" />
            <v-btn text color="primary" @click="modal.end = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.endDialog.save(filter.end)"
              @click.native="payments"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
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
              range="С прошлого месяца"
            >
            </stats-counter-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <stats-money-table :items="calculateSum"></stats-money-table>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-card outlined class="pl-4 text-center">
          <v-flex class="font-weight-bold title">История продаж бара</v-flex>
          <v-flex xs12 row>
            <v-flex xs3>Наименование</v-flex>
            <v-flex xs3>Количество</v-flex>
            <v-flex xs3>Метод оплаты</v-flex>
            <v-flex xs3>Цена</v-flex>
          </v-flex>
          <v-flex xs12 row>
            <template v-for="item in barPayments">
              <v-flex xs3>{{ item.sellable_id }}</v-flex>
              <v-flex xs3>{{ item.quantity }}</v-flex>
              <v-flex xs3>{{ item.method }}</v-flex>
              <v-flex xs3>{{ calculateTotal(item.cost,item.quantity) }}</v-flex>
            </template>
          </v-flex>
          <v-divider />
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import StatsCounterCard from "../../components/cards/StatsCounterCard";
import StatsMoneyTable from "../../components/hall/StatsMoneyTable";

export default {
  head() {
    return {
      title: "Зал" // todo
    };
  },
  components: {
    StatsMoneyTable,
    StatsCounterCard
  },

  data: () => ({
    loading: {
      payments: true
    },
    resource: "payments",

    types: [
      { value: "App\\Models\\Trainer", text: "тренер" },
      { value: "App\\Models\\BarItem", text: "бар" }
    ],
    methods: ["cash", "card", "transfer"],

    modal: {
      start: false,
      end: false
    },

    filter: {
      start: "2019-11-01",
      end: "2019-12-01"
    }
  }),

  computed: {
    pureFilter() {
      return _(this.filter)
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    },

    hall() {
      return this.$store.getters["halls/byId"]({ id: this.$route.params.id });
    },
    paymentsFilter() {
      return {
        method: this.methods
      };
    },
    hallsFilter() {
      return {
        hall_id: this.$route.params.id
      };
    },
    calculateSum() {
      const payments = this.$store.getters["payments/where"]({
        filter: this.pureFilter
      });
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
      return result;
    },
    barPayments() {
      const payments = this.$store.getters["payments/where"]({
        filter: this.pureFilter
      });
      const barPayments = _(payments)
        .filter({
          sellable_type: "App\\Models\\BarItem"
        })
        .value();
      const barPaymentsByMethod = _(barPayments)
        .groupBy("method")
        .value();
      const transferPayments = _(barPaymentsByMethod.transfer)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      console.log("opa");
      const cardPayments = _(barPaymentsByMethod.card)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cashPayments = _(barPaymentsByMethod.cash)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const result = _.concat(cashPayments, cardPayments, transferPayments);
      console.log(result);
      return result;
    }
  },

  fetch: ({ store, params }) => {
    return Promise.all([
      store.dispatch("halls/loadById", {
        id: params.id
      })
    ]);
  },

  mounted() {
    this.standartTimeFilter();
    this.payments();
    Promise.all([this.loadPayments()]);
  },

  methods: {
    calculateTotal(cost, quantity) {
      const floatCost = parseFloat(cost);
      return floatCost * quantity;
    },
    loadPayments() {
      return this.$store.dispatch("payments/loadWhere", {
        filter: this.paymentsFilter
      });
    },
    payments() {
      this.$store
        .dispatch(this.resource + "/loadWhere", { filter: this.pureFilter })
        .then(async () => {
          return Promise.resolve();
        });
    },
    standartTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped></style>
