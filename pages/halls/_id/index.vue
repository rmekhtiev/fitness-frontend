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
            <tr
              v-for="(method, key) in stats"
              :key="'stats-method-' + key"
              :class="{ 'body-2 font-weight-bold': key === 'total' }"
            >
              <td class="text-left">
                <component
                  :is="key !== 'total' ? 'nuxt-link' : 'span'"
                  :to="{ name: `halls-id-${key}` }"
                >
                  {{ $t(`categories.${key}`) }}
                </component>
              </td>
              <td class="text-right">{{ method.cash || 0 }} &#8381;</td>
              <td class="text-right">{{ method.transfer }} &#8381;</td>
              <td class="text-right">{{ method.card }} &#8381;</td>
              <td class="text-right font-weight-bold">
                {{ method.total }} &#8381;
              </td>
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

const getOptionsQuery = (optionsObject = {}) =>
  Object.keys(optionsObject)
    .filter(k => typeof optionsObject[k] !== "undefined")
    .map(k => `${k}=${encodeURIComponent(optionsObject[k])}`)
    .join("&");

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
    },

    stats: {}
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
    this.standardTimeFilter();
    this.loadStats();
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
    loadStats() {
      this.$axios
        .get(
          `halls/${this.$route.params.id}/stats?${getOptionsQuery(this.filter)}`
        )
        .then(({ data }) => (this.stats = data.data.payments));
    },
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
      this.loadStats();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      this.loadStats();
    },
    standardTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped></style>
