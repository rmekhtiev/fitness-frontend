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

    <v-row>
      <v-col cols="12" sm="6">
        <v-menu
          ref="date_start"
          v-model="modal.date_start"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          :return-value.sync="value.date_start"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="value.date_start"
              label="Начало занятий"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="value.date_start" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal.date_start = false">
              Отмена
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.date_start.save(value.date_start)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6">
        <v-menu
          ref="date_end"
          v-model="modal.date_end"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          :return-value.sync="value.date_end"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="value.date_end"
              label="Окончание занятий"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="value.date_end" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal.date_end = false"
              >Отмена</v-btn
            >
            <v-btn
              text
              color="primary"
              @click="$refs.date_end.save(value.date_end)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

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
      date_end: false,
      date_start: false
    }
  }),

  computed: {
    defaultForm() {
      return {
        date_start: this.$moment()
          .toISOString()
          .substr(0, 10),
        date_end: this.$moment()
          .add(1, "month")
          .toISOString()
          .substr(0, 10),
        cost: 2500
      };
    },

    trainersFiltered() {
      return this.trainers; // todo
    }
  },

  watch: {
    // "value.date_start"(val, prev) {
    //   const _new = this.$moment(val);
    //   const _prev = this.$moment(prev);
    //   const _end = this.$moment(this.value.date_end);
    //
    //   this.value.date_end = _new
    //     .add(_end.diff(_prev, "days"), "days")
    //     .toISOString()
    //     .substr(0, 10);
    // }
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
