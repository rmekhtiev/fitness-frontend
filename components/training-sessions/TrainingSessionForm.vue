<template>
  <v-form>
    <v-autocomplete
      v-model="value.trainer_id"
      :items="trainersFiltered"
      label="Основной тренер"
      name="hall_id"
      item-text="name"
      item-value="id"
    />

    <v-text-field
      v-model="value.count"
      label="Кол-во тренировок"
      name="amount"
      type="number"
      required
    />

    <v-text-field
      v-model="value.cost"
      label="Стоимость"
      name="cost"
      type="number"
      required
    />
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "TrainingSessionForm",

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

    trainers: {
      type: Array,
      default: () => []
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
        count: 13,
        cost: 5000
      };
    },

    trainersFiltered() {
      return this.trainers; // todo
    }
  },

  created() {
    const newVal = { ...this.value };

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index] || this.value[index] === null) {
        newVal[index] = item;
      }
    });

    this.$emit("input", newVal);
  }
};
</script>

<style scoped></style>
