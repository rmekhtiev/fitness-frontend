<template>
  <div>
    <v-layout row>
      <v-flex xs12 md4>
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
      <v-flex xs12 md4>
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
    <v-card>
      <v-card-title>
        История продаж бара
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="iteratorOptions"
        :server-items-length="totalItems"
        :loading="itemsLoading"
        :footer-props="footerProps"
      >
        <template v-slot:item="{ item }">
          <bar-payment-list-item :loading="itemsLoading" :bar-payment="item" />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import _ from "lodash";
import serverSidePaginated from "../../../mixins/server-side-paginated";

import BarPaymentListItem from "../../../components/hall/BarPaymentListItem";
import auth from "../../../mixins/auth";
export default {
  name: "BarItems",
  components: { BarPaymentListItem },
  mixins: [auth, serverSidePaginated],
  data: () => ({
    resource: "payments",

    headers: [
      { text: "Наименование", sortable: false, value: "title" },
      { text: "Метод оплаты", sortable: false, value: "method" },
      { text: "Дата продажи", sortable: false, value: "updated_at" },
      { text: "Кол-во", sortable: false, value: "quantity", align: "right" },
      { text: "За ед.", sortable: false, value: "cost", align: "right" },
      { text: "Итого", sortable: false, value: "total", align: "right" }
    ],

    modal: {
      start: false,
      end: false
    },

    filter: {
      start: "",
      end: ""
    },
    iteratorOptions: {
      itemsPerPage: 15,
      page: 1
    },
    footerProps: { "items-per-page-options": [15] }
  }),
  computed: {
    dateFilter() {
      return _(this.filter)
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    },
    localFilter() {
      return {
        sellable_type: "bar-items"
      };
    },
    pureFilter() {
      return _({
        hall_id: this.$route.params.id,
        ...this.localFilter,
        ...this.dateFilter
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    },
    serverPayload() {
      return {
        filter: this.pureFilter,
        options: {
          page: this.iteratorOptions.page,
          per_page: this.iteratorOptions.itemsPerPage,
          sort: this.sortString
        }
      };
    }
  },
  watch: {
    dateFilter() {
      this.loadItems();
    }
  },
  created() {
    this.standardTimeFilter();
  },
  methods: {
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
    },
    standardTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
    },
    loadRelated() {
      const barItemsIds = _(this.items)
        .map(payment => payment.sellable_id)
        .uniq()
        .value();

      return Promise.all([
        this.$store.dispatch("bar-items/loadWhere", {
          filter: {
            bar_item_id: barItemsIds
          }
        })
      ]);
    }
  }
};
</script>

<style scoped></style>
