<template>
  <v-form>
    <v-autocomplete
      v-model="value.primary_hall_id"
      :items="halls"
      label="Зал"
      name="hall_id"
      prepend-icon="mdi-domain"
      item-text="title"
      item-value="id"
    />

    <v-text-field
      v-model="value.last_name"
      label="Фамилия"
      name="last_name"
      prepend-icon="mdi-account-outline"
      required
    />

    <v-text-field
      v-model="value.first_name"
      label="Имя"
      name="first_name"
      prepend-icon=" "
      required
    />

    <v-text-field
      v-model="value.middle_name"
      label="Отчество"
      name="middle_name"
      prepend-icon=" "
      required
    />
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="formatDate"
          label="Дата рождения"
          prepend-icon="event"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="value.birth_date"
        @input="menu = false"
      ></v-date-picker>
    </v-menu>
    <v-select
      v-model="value.gender"
      :items="[
        { value: 'male', text: 'Мужской' },
        { value: 'female', text: 'Женский' }
      ]"
      label="Пол"
      name="middle_name"
      prepend-icon="mdi-gender-male-female"
      required
    />

    <v-text-field
      v-model="value.instagram"
      label="Instagram"
      name="instagram"
      prepend-icon="mdi-instagram"
    />

    <v-text-field
      v-model="value.phone_number"
      v-mask="'+7 (###) ###-##-##'"
      label="Телефон"
      placeholder="+7 (900) 123-45-67"
      name="phone_number"
      prepend-icon="mdi-phone-outline"
      required
    />

    <v-text-field
      v-model="value.whats_app_number"
      v-mask="'+7 (###) ###-##-##'"
      label="Номер WhatsApp"
      placeholder="+7 (900) 123-45-67"
      name="whats_app"
      prepend-icon="mdi-whatsapp"
    />
    <v-select
      v-model="value.prefers"
      :items="prefers"
      attach
      chips
      label="Предпочтения"
      multiple
    >
      <template v-slot:selection="prefers">
        <v-chip>
          {{ $t("prefers." + prefers.item) }}
        </v-chip>
      </template>
      <template v-slot:item="prefers">
        <template>
          <v-list-item-content>
            <v-list-item-title>{{
              $t("prefers." + prefers.item)
            }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </template>
    </v-select>
    <v-select
      v-model="value.questionnaire_status"
      label="Статус заполнения анкеты"
      :items="questionnaire_statuses"
      item-text="name"
      item-value="value"
      prepend-icon="mdi-file-outline"
    />
  </v-form>
</template>

<script>
import _ from "lodash";

import { mask } from "vue-the-mask";

import auth from "../../mixins/auth";

export default {
  name: "ClientForm",

  directives: {
    mask
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

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    questionnaire_statuses: [
      { name: "Заполнена", value: "filled" },
      { name: "Не заполнена", value: "unfilled" }
    ],
    prefers: ["gym", "straiting", "personal", "single"],
    menu: false
  }),

  computed: {
    defaultForm() {
      return {
        primary_hall_id: this.me.associated_employee
          ? this.me.associated_employee.hall_id
          : null
      };
    },
    formatDate() {
      if(this.value.birth_date){
        return this.$moment(this.value.birth_date).format("DD-MM-YYYY");
      }
    }
  },
  watch: {
    "value.phone_number"(newVal, oldVal) {
      if (this.value.whats_app_number === oldVal) {
        this.value.whats_app_number = newVal;
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
};
</script>

<style scoped></style>
