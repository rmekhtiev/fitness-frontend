<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="close">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Сканер</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn dark text @click="close()">
            Закрыть
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <qrcode-stream v-if="dialog" @init="onInit" @detect="onDetect" />
      </v-card-text>

      <template v-if="client_id">
        <client-info-card v-if="client" :client="client" link class="mx-4" />

        <v-card-text v-else>
          Клиент не найден
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";

import client from "../mixins/client";

import ClientInfoCard from "./clients/ClientInfoCard";

export default {
  name: "LockerClaimDialog",

  components: {
    ClientInfoCard,
    "qrcode-stream": QrcodeStream
  },

  mixins: [client],

  props: {
    fullscreen: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    dialog: false,

    resolve: null,
    reject: null,

    client_id: null
  }),

  computed: {
    client() {
      return this.$store.getters["clients/byId"]({ id: this.client_id });
    }
  },

  methods: {
    async onInit(promise) {
      try {
        await promise;

        // successfully initialized
      } catch (error) {
        this.$toast.error(error);
      }
    },

    async onDetect(promise) {
      try {
        const {
          // eslint-disable-next-line no-unused-vars
          imageData, // raw image data of image/frame
          content, // decoded String
          // eslint-disable-next-line no-unused-vars
          location // QR code coordinates
        } = await promise;

        console.log(content);

        const parsed = JSON.parse(content);

        if (parsed.client_id) {
          this.loadClient(parsed.client_id);
          this.client_id = parsed.client_id;
        } else {
          this.$toast.error("Неизвестный формат");
        }
      } catch (error) {
        this.$toast.error("Неизвестный формат");
      }
    },

    loadClient(client_id) {
      this.$store.dispatch("clients/loadById", { id: client_id });
    },

    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
