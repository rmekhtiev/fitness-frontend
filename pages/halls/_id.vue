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
    <v-layout wrap row>
      <v-flex xs12>
        <stats-money-table :items="calculateSum"></stats-money-table>
      </v-flex>
      <v-flex xs12>
        <bar-payments-table :payments="barPayments"></bar-payments-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import StatsMoneyTable from "../../components/hall/StatsMoneyTable";
import BarPaymentsTable from "../../components/hall/barPaymentsTable";

export default {
  head() {
    return {
      title: "Зал" // todo
    };
  },
  components: {
    BarPaymentsTable,
    StatsMoneyTable
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
    barPaymentsFilter() {
      return {
        sellable_type: "bar-items",
        ...this.pureFilter
      };
    },
    trainingPaymentsFilter() {
      return {
        sellable_type: "trainings",
        ...this.pureFilter
      };
    },
    pureFilter() {
      return _(this.filter)
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    },

    hall() {
      return this.$store.getters["halls/byId"]({ id: this.$route.params.id });
    },
    barPayments() {
      return this.$store.getters["payments/where"]({
        filter: this.barPaymentsFilter
      });
    },
    trainingPayments() {
      return this.$store.getters["payments/where"]({
        filter: this.trainingPaymentsFilter
      });
    },
    hallsFilter() {
      return {
        hall_id: this.$route.params.id
      };
    },
    calculateSum() {
      const payments = this.trainingPayments;
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
        if (payments[i].sellable_type === "bar-items") {
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

        if (payments[i].sellable_type === "trainings") {
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
    return Promise.all([
      this.loadBarPayments(),
      this.loadBarItems(),
      this.loadTrainingPayments()
    ]);
  },

  methods: {
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
      this.loadBarPayments();
      this.loadBarItems();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      this.loadBarPayments();
      this.loadBarItems();
    },
    loadBarItems() {
      const items = this.$store.getters["payments/where"]({
        filter: this.barPaymentsFilter
      });
      const barItemsIds = _(items)
        .map(barItem => barItem.sellable_id)
        .value();
      return this.$store.dispatch("bar-items/loadWhere", {
        filter: { bar_item_id: barItemsIds }
      });
    },
    loadBarPayments() {
      this.$store.dispatch(this.resource + "/loadWhere", {
        filter: this.barPaymentsFilter
      });
    },
    loadTrainingPayments() {
      this.$store.dispatch(this.resource + "/loadWhere", {
        filter: this.trainingPaymentsFilter
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
