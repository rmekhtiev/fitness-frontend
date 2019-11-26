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
              @click="updateClient()"
              color="primary"
              text
              small
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              v-if="link"
              :to="{ name: 'clients-id', params: { id: client.id } }"
              color="primary"
              text
              small
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

          <v-list-item-icon :href="'sms:' + client.phone_number">
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item
          v-if="client.whats_app_number"
          :href="'https://wa.me/' + updateWhatsAppNumber()"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-whatsapp
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ updateWhatsAppNumber() }}</v-list-item-title>
            <v-list-item-subtitle>Номер WhatsApp</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="client.instagram"
          :href="'https://instagram.com/' + client.instagram"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-instagram
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ client.instagram }}</v-list-item-title>
            <v-list-item-subtitle>Instagram</v-list-item-subtitle>
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
      <v-card-actions v-if="client.active_subscriptions">
        <v-spacer />
        <v-btn @click="addRecord()" text color="primary">
          Зафиксировать посещение
        </v-btn>
      </v-card-actions>
    </v-card>

    <client-dialog
      ref="edit"
      v-if="isHallAdmin || isOwner"
      :client="client"
      title="Редактирование клиента"
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
    },
    updateWhatsAppNumber() {
      return this.client.whats_app_number
        .replace(/-/g, "")
        .replace("8", "7")
        .replace("+", "");
    },

    addRecord() {
      this.$axios
        .post("visit-history-records", {
          datetime: this.$moment(),
          client_id: this.client.id,
          hall_id: this.client.primary_hall_id
        })
        .then(response => {
          this.$store.dispatch("visit-history-records/loadById", {
            id: response.data.data.id
          });
        });
      this.$emit("create");
    }
  }
};
</script>

<style scoped>
.v-card {
  /*background-color: #41b883;*/
}
</style>
