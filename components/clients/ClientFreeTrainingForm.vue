<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="textFieldValue"
        label="Дата истечения бесплатной тренировки"
        prepend-icon="event"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="value.free_training_expiration_date"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import _ from "lodash";

export default {
  name: "ClientFreeTrainingForm",
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
    menu: false
  }),

  computed: {
    defaultForm() {
      return {
        free_training_expiration_date: this.$moment()
          .add(1, "month")
          .format("YYYY-MM-DD")
      };
    },
    textFieldValue() {
      return this.value.free_training_expiration_date
        ? this.$moment(this.value.free_training_expiration_date).format("ll")
        : null;
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
