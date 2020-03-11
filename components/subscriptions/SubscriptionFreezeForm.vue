<template>
  <v-form>
    <v-dialog
      ref="frozenStartDialog"
      v-model="modal.frozen_start"
      :return-value.sync="value.frozen_start"
      persistent
      full-width
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="$moment(value.frozen_start).format('ll')"
          label="Начало действия заморозки"
          name="frozen_start"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker v-model="value.frozen_start" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.frozen_start = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.frozenStartDialog.save(value.frozen_start)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
    <v-dialog
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
          label="Окончание заморозки"
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
          v-model="value.valid_till"
          :value="validTill"
          label="Окончание действия абонимента"
          name="valid_till"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker v-model="validTill" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.valid_till = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.validTillDialog.save(validTill)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "SubscriptionFreezeForm",

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
    }
  },
  data: () => ({
    modal: {
      frozen_start: false,
      valid_till: false,
      frozen_till: false
    }
  }),

  computed: {
    validTill() {
      const diff = this.$moment(this.value.frozen_till).diff(
        this.value.frozen_start,
        "days"
      );
      this.value.valid_till = this.subscription.valid_till;
      this.value.valid_till = this.$moment(this.value.valid_till)
        .add(diff, "day")
        .format("YYYY-MM-DD");
      return this.value.valid_till;
    },
    defaultForm() {
      return {
        client_id: this.$route.params.id,
        frozen_start: this.$moment().format("YYYY-MM-DD"),
        frozen_till: this.$moment().format("YYYY-MM-DD"),
        valid_till: this.validTill
      };
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
};
</script>

<style scoped></style>
