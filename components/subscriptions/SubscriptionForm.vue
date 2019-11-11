
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
     <v-card>
       {{validTill}}
     </v-card>
    <v-dialog v-if="isEdit"
            ref="frozenTillDialog"
            v-model="modal.frozen_till"
            :return-value.sync="value.frozen_till"
            persistent
            full-width
            width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
                :value="$moment(value.frozen_till).format('ll')"
                label="Заморозка абонемента"
                name="frozen_till"
                readonly
                v-on="on"
        />
      </template>
      <v-date-picker v-model="value.frozen_till" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.frozen_till = false">
          Cancel
        </v-btn>
        <v-btn
                text
                color="primary"
                @click="$refs.frozenTillDialog.save(value.frozen_till)"
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
  name: "SubscriptionForm",

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    isEdit: {
      type: Boolean,
      default: false
    },
    subscription: {
      type: Object,
      required: false,
      default: () => ({})
    },
  },
  data: () => ({
    modal: {
      issue_date: false,
      valid_till: false,
      frozen_till: false,
    }
  }),

   computed: {
    validTill() {
      let diff = this.$moment(this.value.frozen_till).diff(
              this.$moment(),
              "days"
      );
      return this.$moment(this.value.valid_till).add(diff, "day").format("YYYY-MM-DD")
    },
    defaultForm() {
      return {
        client_id: this.$route.params.id,
        issue_date: this.$moment().format("YYYY-MM-DD"),
        frozen_till:this.$moment().format("YYYY-MM-DD"),
        valid_till: this.$moment().add(1, "year")
                .format("YYYY-MM-DD"),
      }
    }
  },

  created() {
    const newVal = { ...this.value };

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index]) {
        newVal[index] = item;
      }
    });

    this.$emit("input", newVal);
  }
}
</script>

<style scoped></style>
