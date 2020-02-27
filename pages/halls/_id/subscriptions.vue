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
        История продаж абонементов
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="iteratorOptions"
        :server-items-length="totalItems"
        :loading="itemsLoading"
        :items-per-page="15"
      >
        <template v-slot:item="{ item }">
          <subscriptions-payment-list-item
            :subscriptions-payment="item"
            :loading="itemsLoading"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import _ from "lodash";
import serverSidePaginated from "../../../mixins/server-side-paginated";
import SubscriptionsPaymentListItem from "../../../components/hall/SubscriptionsPaymentListItem";
import auth from "../../../mixins/auth";
export default {
  name: "Subscriptions",
  components: { SubscriptionsPaymentListItem },
  mixins: [auth, serverSidePaginated],
  // props: {
  //   dateFilter: {
  //     type: Object,
  //     required: true
  //   }
  // },
  data: () => ({
    resource: "payments",

    headers: [
      { text: "Клиент", sortable: false, value: "client" },
      { text: "Дата начала/окончания", sortable: false, value: "dates_range" },
      { text: "Тип абонимента", sortable: false, value: "type" },
      { text: "Метод оплаты", sortable: false, value: "method" },
      { text: "Итого", sortable: false, value: "total", align: "right" }
    ],

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
        sellable_type: "subscriptions"
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
      // this.loadPayments();
    },
    saveEndDateFilter() {
      this.$refs.endDialog.save(this.filter.end);
      // this.loadPayments();
    },
    standardTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");

      if (this.role("owner")) {
        this.filter.start = this.$moment()
          .subtract(1, "month")
          .format("YYYY-MM-DD");
      }
    },
    loadRelated() {
      const subscriptionsIds = _(this.items)
        .map(payment => payment.sellable_id)
        .uniq()
        .value();
      return Promise.all([
        this.$store.dispatch("subscriptions/loadWhere", {
          filter: {
            subscription_id: subscriptionsIds
          }
        })
      ]).then(() => {
        const _promises = [];

        const subscriptions = this.$store.getters["subscriptions/where"]({
          filter: {
            subscription_id: subscriptionsIds
          }
        });
        const clientsIds = _(subscriptions)
          .map(subscription => subscription.client_id)
          .uniq()
          .value();

        if (clientsIds.length > 0) {
          _promises.push(
            this.$store.dispatch("clients/loadWhere", {
              filter: {
                client_id: clientsIds
              }
            })
          );
        }

        const groupsIds = _(subscriptions)
          .filter({ subscriable_type: "groups" })
          .map(subscription => subscription.subscriable_id)
          .uniq()
          .value();

        if (groupsIds.length > 0) {
          _promises.push(
            this.$store.dispatch("groups/loadWhere", {
              filter: {
                group_id: groupsIds
              }
            })
          );
        }

        return Promise.all(_promises);
      });
    }
  }
};
</script>

<style scoped></style>
