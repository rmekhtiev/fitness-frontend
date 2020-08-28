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
    <v-flex xs12 sm6 md3>
      <v-select
          v-model="filter.hall"
          :items="halls"
          item-text="title"
          item-value="id"
          label="Зал"
          single-line
          filled
          clearable
          @input="loadItems"
      />
    </v-flex>
  </v-layout>
  <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
  >
    <template v-slot:header>
      <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
        <v-flex xs6 md4>
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="overline text-truncate">
              Клиент
            </div>
          </div>
        </v-flex>

        <v-flex xs3 md4 class="hidden-xs-only">
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="overline text-truncate">
              Зал
            </div>
          </div>
        </v-flex>

        <v-flex xs3 md4 class="hidden-xs-only">
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="overline text-truncate">
              Дата посещения
            </div>
          </div>
        </v-flex>

      </v-layout>
    </template>

    <template v-slot:default="props">
      <v-card>
        <v-list>
          <template v-for="(item, index) in props.items">
            <v-list-item>
              <visit-history-record-list-item :record="item" />
            </v-list-item>
            <v-divider v-if="index + 1 < props.items.length" :key="index" />
          </template>
        </v-list>
      </v-card>
    </template>
  </v-data-iterator>
</div>
</template>

<script>
import selectedHallAware from "~/mixins/selected-hall-aware";
import serverSidePaginated from "~/mixins/server-side-paginated";
import _ from "lodash";
import VisitHistoryRecordListItem from "~/components/visit-history/VisitHistoryRecordListItem";

export default {
  name: "index",
  components: {VisitHistoryRecordListItem},
  mixins: [selectedHallAware, serverSidePaginated],
  data: () => ({
    modal: {
      start: false,
      end: false
    },

    filter: {
      start: "",
      end: "",
      hall: ""
    },

    resource: "visit-history-records"
  }),
  computed: {
    pureFilter() {
      return _({
        hall_id: this.selectedHallId,
        ...this.filter
      })
          .omitBy(_.isNull)
          .omitBy(_.isUndefined)
          .value();
    },
    dateFilter() {
      return _(this.filter)
          .omitBy(_.isNull)
          .omitBy(_.isUndefined)
          .value();
    },
    halls() {
      return this.$store.getters["halls/all"];
    },
  },
  created() {
    this.standardTimeFilter();
  },
  methods: {
    loadRelated() {
      const clientIds = _(this.items)
          .map(record => record.client_id)
          .uniq()
          .value();

      return Promise.all([
        this.$store.dispatch("clients/loadWhere", {
          filter: {
            client_id: clientIds
          }
        }),
        this.$store.dispatch("halls/loadAll")
      ]);
    },
    saveStartDateFilter() {
      this.$refs.startDialog.save(this.filter.start);
      this.loadItems();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      this.loadItems();
    },
    standardTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
    }
  }
}
</script>