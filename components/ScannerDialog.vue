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
    identifier_id: null,
    client_id: null
  }),

  computed: {
    client() {
      return this.$store.getters["clients/byId"]({ id: this.identifier.client_id });
    },

    identifier() {
      return this.$store.getters["identifiers/where"]({id: this.content})
    }
  },


  // async mounted() {
  //   await Promise.all([
  //     this.loadClients(),
  //   ]);
  // },

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
         //const parsed = JSON.parse(content);

        if (content) {
          console.log('opa')
          console.log(content)
          this.loadIdentifier(content)
        } else {
          this.$toast.error("Неизвестный формат");
        }
      } catch (error) {
        this.$toast.error(error);
      }
    },

    loadClient() {
      this.$store.dispatch("clients/loadById", { filter: {id: 'kek'}})
    },

    loadIdentifier(content) {
      this.$store.dispatch("identifiers/loadWhere", { filter: {identifier: content}});
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
