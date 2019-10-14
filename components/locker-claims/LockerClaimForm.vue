<template>
  <v-form>
    <v-autocomplete
      v-model="value.hall_id"
      :disabled="isHallAdmin || isEdit"
      :items="halls"
      label="Зал"
      name="hall_id"
      item-text="title"
      item-value="id"
    />

    <v-autocomplete
      v-model="value.locker_id"
      :disabled="isEdit"
      :items="lockers"
      label="Шкафчик"
      name="locker_id"
      item-text="number"
      item-value="id"
    >
      <template v-slot:selection="{ item }">
        &#8470;{{ item.number }} ({{
          $store.getters["halls/byId"]({ id: item.hall_id }).title
        }})
      </template>
      <template v-slot:item="{ item }">
        <locker-list-item :locker="item" hide-client />
      </template>
    </v-autocomplete>

    <v-dialog
      ref="claimStartDialog"
      v-model="modal.claim_start"
      :return-value.sync="value.claim_start"
      persistent
      full-width
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="$moment(value.claim_start).format('ll')"
          label="Начало брони"
          name="claim_start"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker v-model="value.claim_start" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.claim_start = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.claimStartDialog.save(value.claim_start)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>

    <v-dialog
      ref="claimEndDialog"
      v-model="modal.claim_end"
      :return-value.sync="value.claim_end"
      persistent
      full-width
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="$moment(value.claim_end).format('ll')"
          label="Окончание брони"
          name="claim_end"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker v-model="value.claim_end" scrollable locale="ru-ru">
        <div class="flex-grow-1" />
        <v-btn text color="primary" @click="modal.claim_end = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.claimEndDialog.save(value.claim_end)"
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

import LockerListItem from "../lockers/LockerListItem";

export default {
  name: "LockerClaimForm",

  components: {
    LockerListItem
  },

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    halls: {
      type: Array,
      default: () => []
    },

    lockers: {
      type: Array,
      default: () => []
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    modal: {
      claim_start: false,
      claim_end: false
    }
  }),

  computed: {
    defaultForm() {
      return {
        hall_id: this.me.associated_employee
          ? this.me.associated_employee.hall_id
          : null,
        claim_start: this.$moment().format("YYYY-MM-DD"),
        claim_end: this.$moment()
          .add(2, "week")
          .format("YYYY-MM-DD")
      };
    }
  },

  created() {
    let newVal = { ...this.value };

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
