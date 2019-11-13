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
            <v-btn text color="primary" @click="saveStartDateFilter">
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
            <v-btn text color="primary" @click="saveEndDateFilter">
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
        <v-flex>
          <stats-money-table :items="calculateSum"></stats-money-table>
        </v-flex>
        <v-flex>
          <v-card outlined class="pl-4 text-center">
            <v-flex class="font-weight-bold title">История продаж бара</v-flex>
            <v-flex xs12 row class="font-weight-medium">
              <v-flex xs3>Наименование</v-flex>
              <v-flex xs3>Метод оплаты</v-flex>
              <v-flex xs2>Количество</v-flex>
              <v-flex xs2>Цена за ед.</v-flex>
              <v-flex xs2>Итого</v-flex>
            </v-flex>
            <template v-for="item in barPayments">
              <bar-payment-list-item
                :bar-payment="item"
              ></bar-payment-list-item>
            </template>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
    <v-layout> </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import StatsCounterCard from "../../components/cards/StatsCounterCard";
import StatsMoneyTable from "../../components/hall/StatsMoneyTable";
import BarPaymentListItem from "../../components/hall/BarPaymentListItem";

export default {
  head() {
    return {
      title: "Зал" // todo
    };
  },
  components: {
    BarPaymentListItem,
    StatsMoneyTable,
    StatsCounterCard
  },

  data: () => ({
    loading: {
      payments: true
    },
    resource: "payments",

    modal: {
      start: false,
      end: false
    },

    filter: {
      start: String,
      end: String
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
    payments() {
      return this.$store.getters["payments/where"]({
        filter: this.pureFilter
      });
    },
    hallsFilter() {
      return {
        hall_id: this.$route.params.id
      };
    },
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
      return result;
    },
    barPayments() {
      const payments = this.payments;
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
    Promise.all([this.loadPayments(), this.loadBarItems()]);
  },

  methods: {
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
      this.loadPayments();
      this.loadBarItems();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      this.loadPayments();
      this.loadBarItems();
    },
    loadBarItems() {
      const items = this.$store.getters["payments/where"]({
        filter: this.pureFilter
      });
      const barItemsIds = _(items)
        .filter({
          sellable_type: "App\\Models\\BarItem"
        })
        .map(barItem => barItem.sellable_id)
        .value();
      return this.$store.dispatch("bar-items/loadWhere", {
        filter: { bar_item_id: barItemsIds }
      });
    },
    loadPayments() {
      this.$store.dispatch(this.resource + "/loadWhere", {
        filter: this.pureFilter
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
