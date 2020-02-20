<template>
  <div>
    <v-layout wrap row class="mb-4">
      <v-flex xs6>
        <hall-info-card></hall-info-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
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
              filled
              v-on="on"
            />
          </template>
          <v-date-picker v-model="filter.start" scrollable locale="ru-ru">
            <div class="flex-grow-1" />
            <v-btn text color="primary" @click="modal.start = false">
              Отмена
            </v-btn>
            <v-btn text color="primary" @click="saveStartDateFilter">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex xs4>
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
              filled
              v-on="on"
            />
          </template>
          <v-date-picker v-model="filter.end" scrollable locale="ru-ru">
            <div class="flex-grow-1" />
            <v-btn text color="primary" @click="modal.end = false">
              Отмена
            </v-btn>
            <v-btn text color="primary" @click="saveEndDateFilter">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-flex>
      <v-card outlined>
        <v-card-title class="font-weight-bold">
          <span class="title">Итоговая статистика продаж</span>
        </v-card-title>
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Категория</th>
              <th class="text-right">Наличными</th>
              <th class="text-right">Переводом</th>
              <th class="text-right">По карте</th>
              <th class="text-right font-weight-bold">Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">Бар:</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right font-weight-bold">15 000 &#8381;</td>
            </tr>
            <tr>
              <td class="text-left">Абонементы:</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right font-weight-bold">15 000 &#8381;</td>
            </tr>
            <tr>
              <td class="text-left">Тренировки:</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right font-weight-bold">15 000 &#8381;</td>
            </tr>
            <tr class="body-1">
              <td class="text-left">Подитог:</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right">5000 &#8381;</td>
              <td class="text-right font-weight-bold">15 000 &#8381;</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import _ from "lodash";
import auth from "../../../mixins/auth";

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
    HallInfoCard
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
