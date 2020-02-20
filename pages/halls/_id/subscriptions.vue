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
            <v-flex class="font-weight-bold title"
              >История продаж абонементов</v-flex
            >
            <v-flex xs12 row class="font-weight-medium">
              <v-flex xs3 class="text-left">Клиент</v-flex>
              <v-flex xs3 class="text-left">Дата начала/окончания</v-flex>
              <v-flex xs2 class="text-left">Тип абонимента</v-flex>
              <v-flex xs2 class="text-left">Метод оплаты</v-flex>
              <v-flex xs2 class="text-right">Итого</v-flex>
            </v-flex>
          </template>

          <template v-for="item in items">
            <subscriptions-payment-list-item
              :subscriptions-payment="item"
            ></subscriptions-payment-list-item>
          </template>
        </v-data-iterator>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import serverSidePaginated from "../../../mixins/server-side-paginated";
import SubscriptionsPaymentListItem from "../../../components/hall/SubscriptionsPaymentListItem";
export default {
  name: "Subscriptions",
  components: { SubscriptionsPaymentListItem },
  mixins: [serverSidePaginated],
  // props: {
  //   dateFilter: {
  //     type: Object,
  //     required: true
  //   }
  // },
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
    },
  },
  created() {
    this.standartTimeFilter();
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
    standartTimeFilter() {
      this.filter.start = this.$moment().format("YYYY-MM-DD");
      this.filter.end = this.$moment().format("YYYY-MM-DD");
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
        const subscriptions = this.$store.getters["subscriptions/where"]({
          filter: {
            subscription_id: subscriptionsIds
          }
        });
        const clientsIds = _(subscriptions)
          .map(subscription => subscription.client_id)
          .uniq()
          .value();
        const groupsIds = _(subscriptions)
          .filter({ subscriable_type: "groups" })
          .map(subscription => subscription.subscriable_id)
          .uniq()
          .value();
        return Promise.all([
          this.$store.dispatch("clients/loadWhere", {
            filter: {
              client_id: clientsIds
            }
          }),
          this.$store.dispatch("groups/loadWhere", {
            filter: {
              group_id: groupsIds
            }
          })
        ]);
      });
    }
  }
};
</script>

<style scoped></style>
