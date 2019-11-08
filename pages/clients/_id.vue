<template>
  <div v-if="client" id="client">
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <client-info-card :client="client" class="mb-2 mx-auto" />
        <subscription-info-card
          :subscription="subscription"
          :client="client"
          class="mb-2 mx-auto"
        />
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3>
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              Шкафчики
            </div>
          </v-card-text>

          <v-list v-if="!loading.lockers">
            <template v-for="(claim, index) in lockerClaims">
              <locker-claim-list-item :key="'claim' + index" :claim="claim" />

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
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              Группы
            </div>
          </v-card-text>

          <v-list v-if="!loading.groups">
            <template v-for="(group, index) in groups">
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
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              История посещений
            </div>
          </v-card-text>
          <v-timeline dense>
            <v-list v-if="!loading.records">
              <template v-for="(record, index) in records">
                <v-timeline-item
                        small
                >
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
      <v-tooltip left :value="tooltips">
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
      <v-tooltip left :value="tooltips">
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            color="red"
            @click.native="openSubscriptionCreateDialog"
          >
            <v-icon>mdi-locker</v-icon>
          </v-btn>
        </template>
        <span>Абонимент</span>
      </v-tooltip>
    </v-speed-dial>

    <locker-claim-dialog
      ref="lockerClaimDialog"
      title="Новая бронь шкафчика"
      :client="client"
    />
    <subscription-create-dialog
      ref="subscriptionCreateDialog"
      :title="'Создать абонимент для ' + client.name"
      :client="client"
    />
  </div>
</template>

<script>
import _ from "lodash";

import fabWithTooltips from "../../mixins/fab-with-tooltips";
import client from "../../mixins/client";

import ClientInfoCard from "../../components/clients/ClientInfoCard";

import SubscriptionInfoCard from "../../components/subscriptions/SubscriptionInfoCard";

import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem"
import LockerClaimDialog from "../../components/locker-claims/LockerClaimDialog"
import SubscriptionCreateDialog from "../../components/subscriptions/SubscriptionCreateDialog"

export default {
  head() {
    return {
      title: this.client.name
    };
  },

  components: {
    SubscriptionCreateDialog,
    ClientInfoCard,
    SubscriptionInfoCard,
    LockerClaimListItem,
    LockerClaimDialog
  },

  mixins: [client, fabWithTooltips],

  data: () => ({
    dialogs: {
      lockerClaim: false
    },

    subscription: {
      // todo: make computed from vuex
      id: "0defe181-4b8c-4273-85cf-1454e414a7fa",
      issue_date: "2019-09-08",
      valid_till: "2019-09-22"
    },

    loading: {
      lockers: true,
      groups: true,
      records: true,
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
        client_id: this.$route.params.id
      }
    },

    groupFilter() {
      return {
        id: this.groupsIds
      };
    },
    recordFilter() {
      return {
        client_id: this.$route.params.id,
      };
    },

    lockerClaims() {
      return this.$store.getters["locker-claims/where"]({
        filter: this.lockerFilter
      });
    },

    groups() {
      return this.$store.getters["groups/where"]({
        filter: this.groupFilter
      });
    },
    records() {
      return this.$store.getters["visit-history-records/where"]({
        filter: this.recordFilter
      });
    },
  },

  fetch: ({ store, params, $moment }) => {
    // eslint-disable-next-line no-unused-vars
    const lockerClaimsFilter = {
      client_id: params.id,
      after: $moment().format("YYYY-MM-DD")
    };

    return Promise.all([
      store.dispatch("clients/loadById", {
        id: params.id
      }),
      store.dispatch("halls/loadAll"),
      store.dispatch("subscriptions/loadAll")
    ])
  },

  async mounted() {
    await Promise.all([
      this.loadLockerClaims(),
      this.loadGroups(),
      this.loadRecords(),
    ]);
  },

  methods: {
    openSubscriptionCreateDialog() {
      this.$refs.subscriptionCreateDialog.open().then(form => {
        this.$axios.post("subscriptions", form).then(async response => {
          await this.$store.dispatch("subscriptions/loadById", {
            id: response.data.data.id
          })
        })

        this.$store.dispatch("subscriptions/loadWhere", {
          filter: this.subscriptionFilter
        })
      })
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
    recordTime(record) {
      return this.$moment.utc(record.datetime).format("D MMMM YYYY года в HH:mm");
  }
}
};
</script>

<style scoped></style>
