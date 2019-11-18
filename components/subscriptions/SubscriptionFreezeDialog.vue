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
        <subscription-freeze-form :subscription="subscription" v-model="form" :is-edit="isEdit" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import SubscriptionFreezeForm from "./SubscriptionFreezeForm";
export default {
  name: "SubscriptionFreezeDialog",
  components: { SubscriptionFreezeForm },
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
    },

    subscription: {
      type: Object,
      required: false,
      default: () => ({})
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    dialog: false,

    resolve: null,
    reject: null,

    form: {
      client_id: null,
      issue_date: null,
      valid_till: null,
      frozen_start: null,
      frozen_till: null
    }
  }),

  created() {
    if (this.client) {
      this.form.client_id = this.client.id
    }

    if (this.subscription) {
      Object.assign(this.form, this.subscription)
    }
  },

  methods: {
    open() {
      this.dialog = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    save() {
      this.resolve(this.form)
      this.dialog = false
    },

    cancel() {
      this.dialog = false
    },
  }
}
</script>

<style scoped></style>
