<template>
  <div>
    <v-layout wrap row class="mb-12">
      <v-flex xs6>
        <hall-info-card></hall-info-card>
      </v-flex>
    </v-layout>
    <v-layout wrap row class="justify-center">
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
              :disabled="isHallAdmin"
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
              :disabled="isHallAdmin"
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
      <v-flex xs12>
        <subscriptions-payments-table :payments="subscriptionsPayments">
        </subscriptions-payments-table>
      </v-flex>
      <v-flex xs12>
        <trainings-payments-table
          :payments="trainingsPayments"
        ></trainings-payments-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import StatsMoneyTable from "../../components/hall/StatsMoneyTable";
import BarPaymentsTable from "../../components/hall/barPaymentsTable";
import auth from "../../mixins/auth";
import TrainingsPaymentsTable from "../../components/hall/TrainingsPaymentsTable";
import SubscriptionsPaymentsTable from "../../components/hall/SubscriptionsPaymentsTable";
import selectedHallAware from "../../mixins/selected-hall-aware";
import HallInfoCard from "../../components/hall/HallInfoCard";
import payments from "../../mixins/payments";

export default {
  head() {
    return {
      title: "Зал" // todo
    };
  },
  components: {
    HallInfoCard,
    SubscriptionsPaymentsTable,
    TrainingsPaymentsTable,
    BarPaymentsTable,
    StatsMoneyTable
  },

  mixins: [selectedHallAware, auth, payments],

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
      return _({
        hall_id: this.$route.params.id,
        ...this.filter
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    }
  },

  mounted() {
    this.standartTimeFilter();
    return Promise.all([this.loadPayments(), this.loadHall()]);
  },
  methods: {
    loadHall() {
      return this.$store.dispatch("halls/loadById", {
        id: this.$route.params.id
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
