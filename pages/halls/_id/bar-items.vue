<template>
  <div>
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
    <v-layout wrap row class="justify-center">
      <v-flex xs10 class="text-center">
        <v-data-iterator
          :items="items"
          :options.sync="iteratorOptions"
          :server-items-length="totalItems"
          :loading="itemsLoading"
          :items-per-page="15"
        >
          <template v-slot:header>
            <v-flex class="font-weight-bold title">История продаж бара</v-flex>
            <v-flex xs12 row class="font-weight-medium">
              <v-flex xs3 class="text-left">Наименование</v-flex>
              <v-flex xs3>Метод оплаты</v-flex>
              <v-flex xs2>Количество</v-flex>
              <v-flex xs2 class="text-right">Цена за ед.</v-flex>
              <v-flex xs2 class="text-right">Итого</v-flex>
            </v-flex>
          </template>

          <template v-for="(item, index) in items">
            <bar-payment-list-item
              :key="'bar-payment-' + index"
              :bar-payment="item"
            />
          </template>
        </v-data-iterator>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import serverSidePaginated from "../../../mixins/server-side-paginated";

import BarPaymentListItem from "../../../components/hall/BarPaymentListItem";
export default {
  name: "BarItems",
  components: { BarPaymentListItem },
  mixins: [serverSidePaginated],
  data: () => ({
    resource: "payments",
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
    this.standartTimeFilter();
  },
  methods: {
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
    },
    standartTimeFilter() {
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
