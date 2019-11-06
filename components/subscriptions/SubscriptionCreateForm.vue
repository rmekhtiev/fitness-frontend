<template>
  <v-form>
    <v-dialog
      ref="issueDateDialog"
      v-model="modal.issue_date"
      :return-value.sync="value.issue_date"
      persistent
      full-width
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="$moment(value.issue_date).format('ll')"
          label="Начало действия абонимента"
          name="issue_date"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker v-model="value.issue_date" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.issue_date = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.issueDateDialog.save(value.issue_date)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>

    <v-dialog
      ref="validTillDialog"
      v-model="modal.valid_till"
      :return-value.sync="value.valid_till"
      persistent
      full-width
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="$moment(value.valid_till).format('ll')"
          label="Окончание действия абонимента"
          name="valid_till"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker v-model="value.valid_till" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.valid_till = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.validTillDialog.save(value.valid_till)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </v-form>
</template>

<script>
import _ from "lodash"

import auth from "../../mixins/auth"

export default {
  name: "SubscriptionCreateForm",

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: {
      issue_date: false,
      valid_till: false
    }
  }),

  computed: {
    defaultForm() {
      return {
        client_id: this.$route.params.id,
        issue_date: this.$moment().format("YYYY-MM-DD"),
        valid_till: this.$moment()
          .add(1, "year")
          .format("YYYY-MM-DD")
      }
    }
  },

  created() {
    let newVal = { ...this.value }

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index] || this.value[index] === null) {
        newVal[index] = item
      }
    })

    this.$emit("input", newVal)
  }
}
</script>

<style scoped></style>
