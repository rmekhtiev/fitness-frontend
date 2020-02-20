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
              >История продаж тренировок</v-flex
            >
            <v-flex xs12 row class="font-weight-medium">
              <v-flex xs2 class="text-left">Тренер</v-flex>
              <v-flex xs2 class="text-left">Клиент</v-flex>
              <v-flex xs2 class="text-left">Метод оплаты</v-flex>
              <v-flex xs3 class="text-left"
                >Дата начала/окончания занятий</v-flex
              >
              <v-flex xs3 class="text-right">Оплата тренеру</v-flex>
            </v-flex>
            <template v-for="item in items">
              <trainings-payment-list-item
                :trainings-payment="item"
              ></trainings-payment-list-item>
            </template>
          </template>
        </v-data-iterator>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import serverSidePaginated from "../../../mixins/server-side-paginated";
import TrainingsPaymentListItem from "../../../components/hall/TrainingsPaymentListItem";

export default {
  name: "Trainings",
  components: { TrainingsPaymentListItem },
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
        sellable_type: "training-sessions"
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
      const trainingsIds = _(this.items)
        .map(payment => payment.sellable_id)
        .uniq()
        .value();

      return Promise.all([
        this.$store.dispatch("training-sessions/loadWhere", {
          filter: {
            training_session_id: trainingsIds
          }
        })
      ]).then(() => {
        const trainings = this.$store.getters["training-sessions/where"]({
          filter: {
            training_session_id: trainingsIds
          }
        });
        const clientsIds = _(trainings)
          .map(training => training.client_id)
          .uniq()
          .value();
        const trainersIds = _(trainings)
          .map(training => training.trainer_id)
          .uniq()
          .value();
        return Promise.all([
          this.$store.dispatch("clients/loadWhere", {
            filter: {
              client_id: clientsIds
            }
          }),
          this.$store.dispatch("trainers/loadWhere", {
            filter: {
              trainer_id: trainersIds
            }
          })
        ]);
      });
    }
  }
};
</script>

<style scoped></style>
