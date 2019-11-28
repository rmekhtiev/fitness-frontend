<template>
  <v-form>
    <v-autocomplete
      v-model="value.schedulable_id"
      :items="sessions"
      label="Клиент"
      item-text="title"
      item-value="id"
    />

    <v-datetime-picker
      v-model="proxy.start_date"
      :time-picker-props="{
        format: '24hr',
        min: '8:00',
        max: '23:00',
        allowedMinutes: v => v === 0 || v === 30
      }"
      label="Дата и время"
    ></v-datetime-picker>

    <v-select
      v-model="value.duration"
      :items="durations"
      label="Длительность"
    />
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "EventForm",

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

    sessions: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    durations: [
      { text: "1 час", value: 60 },
      { text: "1,5 часа", value: 90 },
      { text: "2 часа", value: 120 }
    ],
    proxy: {
      start_date: ""
    }
  }),

  computed: {
    defaultForm() {
      return {
        start_date: "",
        end_date: "",
        duration: 60
      };
    },

    trainersFiltered() {
      return this.trainers; // todo
    }
  },

  watch: {
    "proxy.start_date"(newVal) {
      const newInput = { ...this.value };
      newInput.start_date = this.$moment(newVal).format("YYYY-MM-DD HH:mm");

      this.$emit("input", newInput);
    },
    "value.start_date"() {
      return this.recalculateEndDate();
    },
    "value.duration"() {
      return this.recalculateEndDate();
    }
  },

  mounted() {
    this.proxy.start_date = this.value.start_date;
  },

  created() {
    const newVal = { ...this.value };

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index] || this.value[index] === null) {
        newVal[index] = item;
      }
    });

    this.$emit("input", newVal);
  },

  methods: {
    recalculateEndDate() {
      const newInput = { ...this.value };

      newInput.end_date = this.$moment(this.value.start_date)
        .add(this.value.duration, "minutes")
        .format("YYYY-MM-DD HH:mm");

      this.$emit("input", newInput);
    }
  }
};
</script>

<style scoped></style>
