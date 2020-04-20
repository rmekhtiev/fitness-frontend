<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }} {{ client.name }}</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn dark text @click="save">
            Сохранить
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <client-free-training-form v-model="form" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ClientFreeTrainingForm from "~/components/clients/ClientFreeTrainingForm";

export default {
  name: "ClientFreeTrainingDialog",
  components: { ClientFreeTrainingForm },
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
      free_training_expiration_date: null,
    }
  }),

  created() {
    if (this.client) {
      Object.assign(this.form, this.client);
    }
  },

  methods: {
    open() {
      this.dialog = true;

      if (this.client) {
        Object.assign(this.form, this.client);
      }

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
