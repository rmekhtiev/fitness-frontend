<template>
  <div v-if="client" id="client">
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <!-- Client info -->
        <client-info-card :client="client" class="mb-2 mx-auto" />

        <!-- Active subscriptions -->
        <template
          v-for="item in activeSubscriptions"
          v-if="client.active_subscriptions.length > 0"
        >
          <subscription-info-card
            :client="client"
            :subscription="item"
            is-active
            class="mb-2 mx-auto"
          />
        </template>
        <!-- Inactive subscriptions -->
        <template
          v-for="item in inactiveSubscriptions"
          v-if="client.inactive_subscriptions.length > 0"
        >
          <subscription-info-card
            :client="client"
            :subscription="item"
            class="mb-2 mx-auto"
          />
        </template>
        <!-- No subscriptions -->
        <v-card
          v-if="
            client.active_subscriptions.length == 0 &&
              client.inactive_subscriptions.length == 0
          "
        >
          <v-card-text>
            <div class="overline">
              Активные абонементы отстутсвуют
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3>
        <!-- Lockers info -->
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              Шкафчики
            </div>
          </v-card-text>

          <template v-if="!loading.lockers">
            <v-card-text v-if="lockerClaims.length === 0" class="text-center">
              <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
              <br />
              Пусто
            </v-card-text>

            <template v-for="(claim, index) in lockerClaims" v-else>
              <locker-claim-list-item :key="'claim' + index" :claim="claim">
              </locker-claim-list-item>

              <v-divider
                v-if="index + 1 < lockerClaims.length"
                :key="'claim-divider' + index"
              />
            </template>
          </template>
          <v-card-text v-else class="text-center">
            <v-progress-linear
              height="16"
              rounded
              color="primary"
              indeterminate
            />
          </v-card-text>
        </v-card>

        <!-- Groups info -->
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              Группы
            </div>
          </v-card-text>

          <v-list v-if="!loading.groups">
            <v-card-text v-if="groupsIds.length === 0" class="text-center">
              <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
              <br />
              Пусто
            </v-card-text>
            <template v-for="(group, index) in groups" v-else>
              <v-list-item
                :key="'group-' + index"
                :to="{ name: 'groups-id', params: { id: group.id } }"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ group.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider
                v-if="index + 1 < lockerClaims.length"
                :key="'claim-divider' + index"
              />
            </template>
          </v-list>
          <v-card-text v-else class="text-center">
            <v-progress-linear
              height="16"
              rounded
              color="primary"
              indeterminate
            />
          </v-card-text>
        </v-card>

        <!-- Training sessions -->
        <training-session-info-card
          v-for="(session, index) in trainingSessions"
          :key="'training-session' + index"
          :session="session"
          display-trainer
          @update="loadTrainingSessions"
        />
      </v-flex>
      <v-flex xs12 sm6 lg4 xl3>
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              История абонементов
            </div>
          </v-card-text>

          <v-list>
            <v-card-text v-if="!subscriptions" class="text-center">
              <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
              <br />
              Пусто
            </v-card-text>
            <v-list v-for="item in subscriptions" v-else dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-badge-horizontal-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    с
                    {{ $moment.utc(item.issue_date).format("DD-MM-YYYY") }}
                    &mdash; по
                    {{ $moment.utc(item.valid_till).format("DD-MM-YYYY") }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list>
        </v-card>
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              История посещений
            </div>
          </v-card-text>

          <v-timeline dense>
            <v-list v-if="!loading.records">
              <template v-for="(record, index) in records">
                <v-timeline-item small>
                  {{ recordTime(record) }}
                </v-timeline-item>
              </template>
            </v-list>
            <v-card-text v-else class="text-center">
              <v-progress-linear
                height="16"
                rounded
                color="primary"
                indeterminate
              />
            </v-card-text>
          </v-timeline>
        </v-card>
      </v-flex>
    </v-layout>

    <v-speed-dial v-model="fab" fixed bottom right>
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" dark fab>
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-tooltip :value="tooltips" left>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="green"
            @click.native="openLockerClaimDialog"
          >
            <v-icon>mdi-locker</v-icon>
          </v-btn>
        </template>
        <span>Шкафчик</span>
      </v-tooltip>
      <v-tooltip :value="tooltips" left>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="red"
            @click.native="openSubscriptionDialog"
          >
            <v-icon>mdi-account-badge-horizontal-outline</v-icon>
          </v-btn>
        </template>
        <span>Абонемент</span>
      </v-tooltip>
      <v-tooltip :value="tooltips" left>
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="blue" @click.native="addIdentifier">
            <v-icon>mdi-qrcode</v-icon>
          </v-btn>
        </template>
        <span>Привязать идентификатор</span>
      </v-tooltip>
      <v-tooltip :value="tooltips" left>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="purple"
            @click.native="openTrainingSessionsDialog"
          >
            <v-icon>mdi-account-star</v-icon>
          </v-btn>
        </template>
        <span>Индивид. тренировки</span>
      </v-tooltip>
    </v-speed-dial>

    <locker-claim-dialog
      ref="lockerClaimDialog"
      :client="client"
      title="Новая бронь шкафчика"
    />
    <subscription-dialog
      ref="subscriptionDialog"
      :title="'Создать абонемент для ' + client.name"
      :client="client"
    />
    <client-identifier-dialog
      ref="clientIdentifierDialog"
      :title="'Привязать карточку-идентификатор: ' + client.name"
      :client="client"
    />
    <training-session-dialog
      ref="trainingSessionDialog"
      :title="'Создать расписание индивидуальных тренировок: ' + client.name"
    />
  </div>
</template>

<script>
import _ from "lodash";

import fabWithTooltips from "../../mixins/fab-with-tooltips";
import client from "../../mixins/client";

import selectedHallAware from "../../mixins/selected-hall-aware";

import ClientInfoCard from "../../components/clients/ClientInfoCard";

import SubscriptionInfoCard from "../../components/subscriptions/SubscriptionInfoCard";

import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem";
import LockerClaimDialog from "../../components/locker-claims/LockerClaimDialog";
import SubscriptionDialog from "../../components/subscriptions/SubscriptionDialog";
import ClientIdentifierDialog from "../../components/clients/ClientIdentifierDialog";
import TrainingSessionDialog from "../../components/training-sessions/TrainingSessionDialog";
import TrainingSessionInfoCard from "../../components/training-sessions/TrainingSessionInfoCard";

export default {
  head() {
    return {
      title: this.client.name
    };
  },

  components: {
    TrainingSessionInfoCard,
    TrainingSessionDialog,
    ClientIdentifierDialog,
    SubscriptionDialog,
    ClientInfoCard,
    SubscriptionInfoCard,
    LockerClaimListItem,
    LockerClaimDialog
  },

  mixins: [selectedHallAware, client, fabWithTooltips],

  data: () => ({
    dialogs: {
      lockerClaim: false
    },

    loading: {
      lockers: true,
      groups: true,
      records: true,
      subscriptions: true
    }
  }),

  computed: {
    client() {
      return this.$store.getters["clients/byId"]({ id: this.$route.params.id });
    },

    lockerFilter() {
      return {
        client_id: this.$route.params.id,
        after: this.$moment().format("YYYY-MM-DD")
      };
    },

    subscriptionFilter() {
      return {
        client_id: this.client.id
      };
    },

    activeFilter() {
      return {
        id: this.activeIds,
        client_id: this.client.id
      };
    },

    inactiveFilter() {
      return {
        id: this.inactiveIds,
        client_id: this.client.id
      };
    },

    groupFilter() {
      // +
      return {
        id: this.groupsIds
      };
    },
    recordFilter() {
      return {
        client_id: this.client.id
      };
    },

    identifierFilter() {
      return {
        client_id: this.client.id
      };
    },

    trainersFilter() {
      return {};
    },

    trainingSessionsFilter() {
      return {
        client_id: this.$route.params.id
      };
    },

    lockerClaims() {
      return this.$store.getters["locker-claims/where"]({
        filter: this.lockerFilter
      });
    },

    groups() {
      return this.groupsIds.length === 0
        ? []
        : this.$store.getters["groups/where"]({
            filter: this.groupFilter
          });
    },

    activeSubscriptions() {
      return this.$store.getters["subscriptions/where"]({
        filter: this.activeFilter
      });
    },

    inactiveSubscriptions() {
      return this.$store.getters["subscriptions/where"]({
        filter: this.inactiveFilter
      });
    },

    records() {
      return this.$store.getters["visit-history-records/where"]({
        filter: this.recordFilter
      });
    },

    subscriptions() {
      return this.$store.getters["subscriptions/where"]({
        filter: this.subscriptionFilter
      });
    },

    trainers() {
      return this.$store.getters["trainers/where"]({
        filter: this.trainersFilter
      });
    },

    trainingSessions() {
      return this.$store.getters["training-sessions/where"]({
        filter: this.trainingSessionsFilter
      });
    }
  },

  fetch: ({ store, params, $moment }) => {
    return Promise.all([
      store.dispatch("clients/loadById", {
        id: params.id
      }),
      store.dispatch("halls/loadAll")
    ]);
  },

  async mounted() {
    await Promise.all([
      this.loadLockerClaims(),
      this.loadGroups(),
      this.loadRecords(),
      this.loadSubscriptions(),
      this.loadActiveSubscriptions(),
      this.loadInactiveSubscriptions(),
      this.loadIdentifiers(),
      this.loadFilteredGroups(),
      this.loadTrainers(),
      this.loadTrainingSessions()
    ]);
  },

  methods: {
    openSubscriptionDialog() {
      this.$refs.subscriptionDialog.open().then(form => {
        this.$axios.post("subscriptions", form).then(async response => {
          await this.$store.dispatch("subscriptions/loadById", {
            id: response.data.data.id
          }),
            this.$store
              .dispatch("clients/loadById", {
                id: this.$route.params.id
              })
              .then(() => {
                this.loadActiveSubscriptions();
                this.loadInactiveSubscriptions();
              });
        });
      });
    },

    loadItems() {
      console.log("loadItems");
    },

    openLockerClaimDialog() {
      this.$refs.lockerClaimDialog.open().then(form => {
        this.$axios.post("locker-claims", form).then(async response => {
          await this.$store.dispatch("locker-claims/loadById", {
            id: response.data.data.id
          });
        });

        this.$store.dispatch("locker-claims/loadWhere", {
          filter: this.lockerFilter
        });
      });
    },

    addIdentifier() {
      this.$refs.clientIdentifierDialog.open().then(form => {
        this.$axios.post("identifiers", form).then(async response => {
          await this.$store.dispatch("identifiers/loadById", {
            id: response.data.data.id
          });
        });
      });
    },

    openTrainingSessionsDialog() {
      this.$refs.trainingSessionDialog.open().then(form => {
        form.client_id = this.$route.params.id;

        this.$axios
          .post("training-sessions", form)
          .then(() => this.loadTrainingSessions());
      });
    },

    loadLockerClaims() {
      this.loading.lockers = true;

      return this.$store
        .dispatch("locker-claims/loadWhere", {
          filter: this.lockerFilter
        })
        .then(() => {
          const lockerIds = _(
            this.$store.getters["locker-claims/where"]({
              filter: this.lockerFilter
            })
          )
            .map(claim => claim.locker_id)
            .uniq();

          console.info("Gonna load next lockers: " + lockerIds);

          return Promise.all(
            lockerIds.map(lockerId =>
              this.$store.dispatch("lockers/loadById", { id: lockerId })
            )
          ).then(() => {
            this.loading.lockers = false;
          });
        });
    },

    loadActiveSubscriptions() {
      this.loading.subscriptions = true;

      return this.$store
        .dispatch("subscriptions/loadWhere", {
          filter: this.activeFilter
        })
        .then(() => {
          const activeIds = _(
            this.$store.getters["subscriptions/where"]({
              filter: this.activeFilter
            })
          )
            .map(subscription => subscription.id)
            .uniq();

          console.info("Gonna load next lockers: " + activeIds);

          return Promise.all(
            activeIds.map(activeId =>
              this.$store.dispatch("subscriptions/loadById", { id: activeId })
            )
          ).then(() => {
            this.loading.subscriptions = false;
          });
        });
    },

    loadFilteredGroups() {
      return this.sellectedHallId
        ? this.$store.dispatch("groups/loadWhere", {
            filter: {
              hall_id: this.selectedHallId
            }
          })
        : this.$store.dispatch("groups/loadAll");
    },

    loadInactiveSubscriptions() {
      this.loading.subscriptions = true;

      return this.$store
        .dispatch("subscriptions/loadWhere", {
          filter: this.inactiveFilter
        })
        .then(() => {
          const inactiveIds = _(
            this.$store.getters["subscriptions/where"]({
              filter: this.inactiveFilter
            })
          )
            .map(subscription => subscription.id)
            .uniq();

          console.info("Gonna load next lockers: " + inactiveIds);

          return Promise.all(
            inactiveIds.map(inactiveId =>
              this.$store.dispatch("subscriptions/loadById", { id: inactiveId })
            )
          ).then(() => {
            this.loading.subscriptions = false;
          });
        });
    },

    loadGroups() {
      this.loading.groups = true;

      return this.$store
        .dispatch("groups/loadWhere", {
          filter: this.groupFilter
        })
        .then(() => {
          this.loading.groups = false;
        });
    },

    loadRecords() {
      this.loading.records = true;

      return this.$store
        .dispatch("visit-history-records/loadWhere", {
          filter: this.recordFilter
        })
        .then(() => {
          this.loading.records = false;
        });
    },

    loadSubscriptions() {
      this.loading.subscriptions = true;

      return this.$store
        .dispatch("subscriptions/loadWhere", {
          filter: this.subscriptionFilter
        })
        .then(() => {
          this.loading.subscriptions = false;
        });
    },

    loadIdentifiers() {
      this.loading.identifiers = true;

      return this.$store
        .dispatch("identifiers/loadWhere", {
          filter: this.identifierFilter
        })
        .then(() => {
          this.loading.identifires = false;
        });
    },

    loadTrainers() {
      this.loading.trainers = true;

      return this.$store
        .dispatch("trainers/loadWhere", {
          filter: this.trainersFilter,
          params: {
            per_page: "-1"
          }
        })
        .then(() => {
          this.loading.trainers = false;
        });
    },

    loadTrainingSessions() {
      this.loading.trainingSessions = true;

      return this.$store
        .dispatch("training-sessions/loadWhere", {
          filter: this.trainingSessionsFilter
        })
        .then(() => {
          this.loading.trainingSessions = false;
        });
    },

    recordTime(record) {
      return this.$moment
        .utc(record.datetime)
        .format("D MMMM YYYY года в HH:mm");
    }
  }
};
</script>

<style scoped></style>
