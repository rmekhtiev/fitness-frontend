<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <group-info-card
          v-if="!isLoading"
          :group="group"
          class="mb-2 mx-auto"
        />
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

    <!--<group-add-client-dialog ref="addClient" :group="group" />-->

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

export default {
  head() {
    return {
      title: this.group.title
    };
  },

  components: {
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
    clients() {
      return this.$store.getters["clients/related"]({
        // todo: simplify to one function
        parent: {
          type: "groups",
          id: this.$route.params.id
        },
        options: {
          per_page: -1
        }
      });
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
    loadRelated() {
      let promises = [this.loadTrainer(), this.loadHall(), this.loadClients()];

      return Promise.all(promises);
    },

    loadHall() {
      this.loading.hall = true;

      return this.$store
        .dispatch("halls/loadById", {
          id: this.group.hall_id
        })
        .then(() => {
          this.loading.hall = false;
        });
    },

    loadTrainer() {
      this.loading.trainer = true;

      return this.$store
        .dispatch("trainers/loadById", {
          id: this.group.trainer_id
        })
        .then(() => {
          this.loading.trainer = false;
        });
    },

    loadClients() {
      this.loading.clients = true;

      return this.$store
        .dispatch("clients/loadRelated", {
          parent: {
            type: "groups",
            id: this.group.id
          },
          options: {
            per_page: -1
          }
        })
        .then(() => {
          this.loading.clients = false;
        });
    },

    addClientToGroup() {
      return this.$refs.addClient.open().then(async form => {
        await this.$axios
          .put("/groups/" + this.group.id + "/clients/" + form.client_id, form)
          .then(() => {
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
                this.loadClients();
              });
          }
        });
    }
  }
};
</script>

<style scoped></style>
