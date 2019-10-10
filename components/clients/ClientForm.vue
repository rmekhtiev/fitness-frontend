<template>
  <v-form>
    <v-autocomplete
      v-model="value.primary_hall_id"
      :disabled="isHallAdmin || isEdit"
      :items="halls"

      label="Зал"
      name="hall_id"
      prepend-icon="mdi-domain"
      item-text="title"
      item-value="id">
    </v-autocomplete>

    <v-text-field
      v-model="value.last_name"

      label="Фамилия"
      name="last_name"
      prepend-icon="mdi-account-outline"
      required
    ></v-text-field>

    <v-text-field
      v-model="value.first_name"

      label="Имя"
      name="first_name"
      prepend-icon=" "
      required
    ></v-text-field>

    <v-text-field
      v-model="value.middle_name"

      label="Отчество"
      name="middle_name"
      prepend-icon=" "
      required
    ></v-text-field>

    <v-select
      v-model="value.gender"
      :items="[{value: 'male', text: 'Мужской'}, {value: 'female', text: 'Женский'}, ]"

      label="Пол"
      name="middle_name"
      prepend-icon="mdi-gender-male-female"
      required
    ></v-select>

    <v-text-field
      v-model="value.phone_number"

      v-mask="'+7 (###) ###-##-##'"

      label="Телефон"
      placeholder="+7 (900) 123-45-67"
      name="phone_number"
      prepend-icon="mdi-phone-outline"
      required
    ></v-text-field>
  </v-form>
</template>

<script>
    import { mask } from 'vue-the-mask'

    import auth from "../../mixins/auth";

    export default {
        name: "ClientForm",

        directives: {
            mask,
        },

        mixins: [
            auth,
        ],

        props: {
            value: {
                type: Object,
                default: {}
            },

            halls: {
                type: Array,
            },

            isEdit: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            defaultForm() {
                return {
                    primary_hall_id: this.me.associated_employee ? this.me.associated_employee.hall_id : null,
                }
            }
        },

        created() {
            let newVal = {...this.value};

            _(this.defaultForm).each((item, index) => {
                if (!this.value[index]) {
                    newVal[index] = item;
                }
            });

            this.$emit('input', newVal)
        },
    }
</script>

<style scoped>

</style>
