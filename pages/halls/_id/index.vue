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
      <v-card outlined class="pl-4 text-center">
        <v-flex class="font-weight-bold title">Итоговая статистика продаж</v-flex>
        <v-flex xs12 row class="font-weight-medium">
          <v-flex xs3>Категория</v-flex>
          <v-flex xs2>Наличными</v-flex>
          <v-flex xs2>По карте</v-flex>
          <v-flex xs2>Переводом</v-flex>
          <v-flex xs3>Итого</v-flex>
        </v-flex>
        <v-list-item :to="{ name: 'halls-id-bar-items'}">
          <v-flex xs12 row>
            <v-flex xs3>Бар</v-flex>
            <v-flex xs2>224</v-flex>
            <v-flex xs2>5646</v-flex>
            <v-flex xs2>7676</v-flex>
            <v-flex xs3>7676</v-flex>
          </v-flex>
        </v-list-item>
        <v-list-item :to="{ name: 'halls-id-subscriptions'}">
          <v-flex xs12 row>
          <v-flex xs3>Абонементы</v-flex>
          <v-flex xs2>3453</v-flex>
          <v-flex xs2>767</v-flex>
          <v-flex xs2>1443</v-flex>
          <v-flex xs3>1443</v-flex>
        </v-flex>
        </v-list-item>
        <v-list-item :to="{ name: 'halls-id-trainings'}">
          <v-flex xs12 row>
            <v-flex xs3>Тренировки</v-flex>
            <v-flex xs2>1113</v-flex>
            <v-flex xs2>4444</v-flex>
            <v-flex xs2>666</v-flex>
            <v-flex xs3>666</v-flex>
          </v-flex>
        </v-list-item>
      </v-card>
      <!--      <v-flex xs12>-->
      <!--        <stats-money-table :items="calculateSum"></stats-money-table>-->
      <!--      </v-flex>-->
<!--      <v-flex xs12>-->
<!--        <bar-payments-table-->
<!--          :date-filter="dateFilter"-->
<!--        ></bar-payments-table>-->
<!--      </v-flex>-->
<!--      <v-flex xs12>-->
<!--        <subscriptions-payments-table-->
<!--          :date-filter="dateFilter"-->
<!--        >-->
<!--        </subscriptions-payments-table>-->
<!--      </v-flex>-->
      <!--      <v-flex xs12>-->
      <!--        <trainings-payments-table-->
      <!--          :payments="trainingsPayments"-->
      <!--        ></trainings-payments-table>-->
      <!--      </v-flex>-->
    </v-flex>
  </div>
</template>

<script>
import _ from "lodash";
import StatsMoneyTable from "../../../components/hall/StatsMoneyTable";
import BarPaymentsTable from "../../../components/hall/barPaymentsTable";
import auth from "../../../mixins/auth";

import TrainingsPaymentsTable from "../../../components/hall/TrainingsPaymentsTable";
import SubscriptionsPaymentsTable from "../../../components/hall/SubscriptionsPaymentsTable";
import selectedHallAware from "../../../mixins/selected-hall-aware";
import HallInfoCard from "../../../components/hall/HallInfoCard";
import payments from "../../../mixins/payments";

export default {
  head() {
    return {
      title: "Зал" // todo
    };
  },
  components: {
    SubscriptionsPaymentsTable,
    HallInfoCard,
    BarPaymentsTable
  },

  mixins: [selectedHallAware, auth, payments],

  data: () => ({
    modal: {
      start: false,
      end: false
    },

    filter: {
      start: "",
      end: ""
    }
  }),

  computed: {
    dateFilter() {
      return _(this.filter)
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    }
  },

  created() {
    this.standartTimeFilter();
  },
  mounted() {
    return Promise.all([this.loadHall()]);
  },
  methods: {
    loadHall() {
      return this.$store.dispatch("halls/loadById", {
        id: this.$route.params.id
      });
    },

    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
      // this.loadPayments();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      // this.loadPayments();
    },
    standartTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped></style>
