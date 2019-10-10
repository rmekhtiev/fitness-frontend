<template>
  <div v-if="employee">
    <v-card>
      <v-list-item>
        <v-list-item-avatar color="grey"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ employee.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ employee.full_name }}</v-list-item-subtitle>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn color="primary" v-if="isHallAdmin || isOwner" @click="updateEmployee()" text small>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

<!--            <v-btn color="red" v-if="isHallAdmin || isOwner" @click="deleteEmployee()" text small>-->
<!--              <v-icon>mdi-delete</v-icon>-->
<!--            </v-btn>-->

            <v-btn color="primary" text small v-if="link" :to="{name: 'employees-id', params: {id: employee.id}}"
                   target="_blank">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list two-line>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-map-marker</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ hall.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <employee-dialog ref="employeeDialog" title="Создать тренера" :employee="employee" is-edit></employee-dialog>
    <confirm ref="delete"></confirm>
  </div>
</template>

<script>
    import auth from "../../mixins/auth";
    import EmployeeDialog from "./EmployeeDialog";
    import Confirm from "../Confirm";

    export default {
        name: "EmployeeInfoCard",

        components: {
            Confirm,
            EmployeeDialog
        },

        mixins: [
            auth,

        ],

        props: {
            employee: {
                required: true,
                type: Object,
            },

            link: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            hall() {
                return this.$store.getters['halls/byId']({id: this.employee.hall_id});
            },
        },

        methods: {
          updateEmployee() {
            this.$refs.employeeDialog.open().then((form) => {
              this.$axios.patch('employees/' + this.employee.id, form)
                      .then(async response => {
                        await this.$store.dispatch('employees/loadById', {id: response.data.data.id});
                      });

              this.$emit('update');
            });

          },

          deleteEmployee() {
            this.$refs.delete.open('Удалить сотрудника?', 'Вы уверены? Это действие невозможно отменить', {color: 'red'}).then((confirm) => {
              if (confirm) {
                let employeeId = this.employee.id;

                this.$store.dispatch('employees/delete', {id: this.employee.id});

                this.$emit('delete');
              }
              this.$router.push({path: '/employees'})
            })
          },
        }
    }
</script>

<style scoped>

</style>
