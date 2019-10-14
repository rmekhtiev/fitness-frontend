<template>
  <div>
    <v-card :class="classes" :to="to">
      <v-list-item>
        <v-list-item-avatar color="grey" />
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ client.name }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ client.full_name }}</v-list-item-subtitle>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn
              v-if="isHallAdmin || isOwner"
              color="primary"
              text
              small
              @click="updateClient()"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              v-if="link"
              color="primary"
              text
              small
              :to="{ name: 'clients-id', params: { id: client.id } }"
              target="_blank"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list two-line>
        <v-list-item
          v-if="client.phone_number"
          :href="'tel:' + client.phone_number"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-phone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ client.phone_number }}</v-list-item-title>
            <v-list-item-subtitle>Телефон</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item v-if="client.email" :href="'mailto:' + client.email">
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-email
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ client.email }}</v-list-item-title>
            <v-list-item-subtitle>Email</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="primaryHall"
          :to="{ name: 'halls-id', params: { id: primaryHall.id } }"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-map-marker
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ primaryHall.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ primaryHall.address }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <client-dialog
      v-if="isHallAdmin || isOwner"
      ref="edit"
      title="Редактирование клиента"
      :client="client"
      is-edit
    />
  </div>
</template>

<script>
import routable from "vuetify/es5/mixins/routable";

import auth from "../../mixins/auth";

import ClientDialog from "./ClientDialog";

export default {
  name: "ClientInfoCard",
  components: { ClientDialog },
  // extend: VCard,

  mixins: [routable, auth],

  props: {
    client: {
      type: Object,
      required: true
    },

    link: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    componentTag() {
      return "v-card";
    },

    primaryHall() {
      return this.$store.getters["halls/byId"]({
        id: this.client.primary_hall_id
      });
    },

    classes() {
      return {
        ...routable.options.computed.classes.call(this)
      };
    }
  },

  methods: {
    updateClient() {
      this.$refs.edit.open().then(form => {
        this.$axios
          .patch("clients/" + this.client.id, form)
          .then(async response => {
            await this.$store.dispatch("clients/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    }
  }
};
</script>

<style scoped>
.v-card {
  /*background-color: #41b883;*/
}
</style>
