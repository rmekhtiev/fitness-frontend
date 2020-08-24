<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn dark text @click="save">
            Сохранить
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
export default {
  name: "SubscriptionSellDialog",

  components: {
    "qrcode-stream": QrcodeStream
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      default: ""
    },

    client: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data: () => ({
    dialog: false,

    resolve: null,
    reject: null,

    form: {
      client_id: null,
      identifier: null
    }
  }),

  created() {},

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
          this.form.client_id = this.$route.params.id;
          this.form.identifier = this.text;
          this.$toast.success("Идентификатор успешно привязан");
          this.save();
        } else {
          this.$toast.error("Неизвестный формат");
        }
      } catch (error) {
        this.$toast.error(error);
      }
    },

    open() {
      this.dialog = true;

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    save() {
      this.resolve(this.form);
      this.dialog = false;
    },

    cancel() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
