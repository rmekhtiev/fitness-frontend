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
      <div>{{ barPayments }}</div>
      <div>{{ barItems }}</div>
    </v-layout>
    <v-layout wrap row>
      <v-flex xs12>
        <!--        <stats-money-table :items="calculateSum"></stats-money-table>-->
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
    pureFilter() {
      return _(this.filter)
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    },
    barItemsFilter() {
      const items = this.$store.getters["payments/where"]({
        filter: this.barPaymentsFilter
      });
      const barItemsIds = _(items)
        .map(payment => payment.sellable_id)
        .uniq()
        .value();
      return {
        bar_item_id: barItemsIds
      };
    },
    barPaymentsFilter() {
      return {
        sellable_type: "bar-items",
        ...this.pureFilter
      };
    },
    barPayments() {
      return this.$store.getters["payments/where"]({
        filter: this.barPaymentsFilter
      });
    }
  },

  mounted() {
    this.standartTimeFilter();
    return Promise.all([this.loadPayments()]);
  },

  methods: {
    loadSubject(payments, type) {
      switch (type) {
        case "bar-items":
          return this.$store
            .dispatch("payments/loadWhere", {
              filter: this.barPaymentsFilter
            })
            .then(() => {
              const barItemsIds = _(
                this.$store.getters["payments/where"]({
                  filter: this.barPaymentsFilter
                })
              )
                .map(payment => payment.sellable_id)
                .uniq().value();

              console.info("Gonna load next sellable ids: " + barItemsIds);

              return Promise.all([
                this.$store.dispatch("bar-items/loadWhere", {
                  filter: {
                    bar_item_id: barItemsIds
                  }
                })
              ]);
            });
        default:
          return 0;
      }
    },

    loadPayments() {
      this.$store
        .dispatch("payments/loadPage", {
          options: {
            page: -1
          }
        })
        .then(async () => {
          const payments = this.$store.getters["payments/page"];
          return await Promise.all(
            _(payments)
              .groupBy("sellable_type")
              .map(
                async (payments, type) => await this.loadSubject(payments, type)
              )
              .value()
          );
        });
    },
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
      this.loadPayments();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      this.loadPayments();
    },
    standartTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped></style>
