<template>
  <div v-if="group">
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3 class="mb-4">
        <group-info-card
          :group="group"
          class="mb-2 mx-auto"
          @update="loadRelated()"
          @delete="$router.back()"
        />

        <v-card>
          <v-card-text>
            <div class="overline">
              Расписание
            </div>
          </v-card-text>

          <v-skeleton-loader
            :loading="schedules.length === 0"
            type="list-item-two-line, list-item-two-line"
          >
            <v-list two-line>
              <schedule-mini-list-item
                v-for="(schedule, index) in schedules"
                :key="'schedule' + index"
                :schedule="schedule"
              />
            </v-list>
          </v-skeleton-loader>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 lg8 xl9>
        <v-card>
          <v-card-text>
            <div class="overline">
              Тренировки
            </div>
          </v-card-text>

          <group-event-calendar :group="group" />
        </v-card>
      </v-flex>
    </v-layout>

    <v-data-iterator :items="clients ? clients : []" :items-per-page="15">
      <template v-slot:header>
        <client-list-header></client-list-header>
      </template>

      <template v-slot:default="props">
        <client-list-card
          v-slot:default="itemProps"
          :items-loading="loading.clients"
          :items="props.items"
        >
          <v-list-item-content class="py-0">

            <client-group-list-item :client="itemProps.item" />
          </v-list-item-content>

          <v-list-item-action class="my-0">
            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn icon @click.prevent="on.click">
                  <v-icon color="grey lighten-1">
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>

              <v-list dense flat>
                <v-list-item
                  @click.prevent="removeClientFromGroup(itemProps.item)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-close</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content class="pr-6">
                    <v-list-item-title>Убрать</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </client-list-card>
      </template>
    </v-data-iterator>

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

      <v-tooltip
        v-if="group.clients_count < group.max_members"
        left
        :value="tooltips"
      >
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="green" @click.native="addClientToGroup">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <span>Клиент</span>
      </v-tooltip>
    </v-speed-dial>

    <group-add-client-dialog v-if="!isLoading" ref="addClient" :group="group" />

    <confirm ref="removeClientConfirm" />
  </div>
</template>

<script>
import singleResource from "../../mixins/single-resource";
import group from "../../mixins/group";
import fabWithTooltips from "../../mixins/fab-with-tooltips";

import GroupInfoCard from "../../components/groups/GroupInfoCard";
import GroupAddClientDialog from "../../components/groups/GroupAddClientDialog";
import Confirm from "../../components/Confirm";
import GroupEventCalendar from "../../components/groups/GroupEventCalendar";
import ClientListHeader from "../../components/clients/ClientListHeader";
import ClientListCard from "../../components/clients/ClientListCard";
import ScheduleMiniListItem from "../../components/schedule/ScheduleMiniListItem";
import ClientGroupListItem from "../../components/clients/ClientGroupListItem";

export default {
  head() {
    return {
      title: this.group ? this.group.title : ""
    };
  },

  components: {
    ScheduleMiniListItem,
    ClientGroupListItem,
    ClientListCard,
    ClientListHeader,
    GroupEventCalendar,
    GroupInfoCard,
    GroupAddClientDialog,
    Confirm
  },

  mixins: [singleResource, group, fabWithTooltips],

  data: () => ({
    loading: {
      resource: false,
      hall: true,
      trainer: true,
      clients: true
    }
  }),

  computed: {
    isLoading() {
      return Object.values(this.loading).some(element => element === true);
    },

    group() {
      return this.$store.getters["groups/byId"]({ id: this.$route.params.id });
    }
  },

  fetch({ store, params }) {
    return store.dispatch("groups/loadById", { id: params.id });
  },

  mounted() {
    this.loadRelated();
  },

  methods: {
    loadResource() {
      return this.$store.dispatch("groups/loadById", {
        id: this.$route.params.id
      });
    },

    addClientToGroup() {
      return this.$refs.addClient.open().then(async form => {
        await this.$axios
          .put("/groups/" + this.group.id + "/clients/" + form.client_id, form)
          .then(() => {
            this.loadResource();
            this.loadClients();
          });
      });
    },

    removeClientFromGroup(client) {
      return this.$refs.removeClientConfirm
        .open("Убрать клиента " + client.name + " из группы", "Вы уверены?", {
          color: "red"
        })
        .then(async confirm => {
          if (confirm) {
            await this.$axios
              .delete("/groups/" + this.group.id + "/clients/" + client.id)
              .then(() => {
                this.loadResource();
                this.loadClients();
              });
          }
        });
    }
  }
};
</script>

<style scoped></style>
