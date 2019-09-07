<template>
  <v-list-item>
    <template v-if="$auth.loggedIn">

      <v-list-item-content>
        <v-list-item-title class="title">{{ me.name }}</v-list-item-title>

        <v-list-item-subtitle v-if="isOwner">{{ me.primary_role.description }}</v-list-item-subtitle>
        <v-list-item-subtitle v-else-if="isHallAdmin && hall" :title="hall.address">{{ hall.title }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn icon ripple @click.prevent="logout">
          <v-icon color="grey lighten-1">exit_to_app</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script>
    import auth from '../../../mixins/auth'

    export default {
        mixins: [
            auth,
        ],

        computed: {
            employee() {
                return this.$store.getters['employees/byId']({id: this.me.associated_employee.id});
            },

            hall() {
                return this.$store.getters['halls/byId']({id: this.me.associated_employee.hall_id});
            }
        },

        methods: {
            logout() {
                return this.$auth.logout().then(value => {
                    this.$router.push({
                        name: 'auth-login',
                    })
                });
            }
        },

        beforeMount() {
            if (this.me.associated_employee) {
                this.$store.dispatch('employees/loadById', {id: this.me.associated_employee.id}).then(() => {
                    const employee = this.$store.getters['employees/byId']({id: this.me.associated_employee.id});
                    console.debug(employee);

                    this.$store.dispatch('halls/loadById', {id: employee.hall_id}).then(() => {
                        const hall = this.$store.getters['halls/byId']({id: employee.hall_id});
                        console.debug(hall);
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
