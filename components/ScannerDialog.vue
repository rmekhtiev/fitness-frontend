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
    </v-card>
  </v-dialog>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import _ from "lodash";

import selectedHallAware from "../mixins/selected-hall-aware";
import client from "../mixins/client";

export default {
  name: "LockerClaimDialog",

  components: {
    "qrcode-stream": QrcodeStream
  },

  mixins: [client, selectedHallAware],

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
    client_id: null,
    text: null
  }),

  computed: {
    identifiers() {
      return this.$store.getters["identifiers/where"]({
        filter: { identifier: this.text }
      });
    },

    clientId() {
      return _(this.identifiers).last().client_id;
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

        // const parsed = JSON.parse(content);

        if (content) {
          this.text = content;
          this.loadIdentifier(content);
          this.text = content;
          console.log('Client Id ' + this.clientId);
          this.addRecord();
          this.$router.push({
            name: "clients-id",
            params: { id: this.clientId }
          });
          this.close();
        } else {
          this.$toast.error("Неизвестный формат");
        }
      } catch (error) {
        this.$toast.error(error);
      }
    },

    loadIdentifier(content) {
      this.$store.dispatch("identifiers/loadWhere", {
        filter: {
          identifier: content
        }
      });
    },

    addRecord() {
      this.$axios.post("visit-history-records", {
        datetime:this.$moment(),
        client_id:this.clientId,
        hall_id: this.selectedHallId,
      }).then(async response => {
        await this.$store.dispatch("visit-history-records/loadById", {
          id: response.data.data.id,
        });
      }),
              this.$emit("create")
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
