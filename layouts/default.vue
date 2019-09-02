<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <drawer-profile></drawer-profile>

      <v-divider></v-divider>

      <drawer-menu></drawer-menu>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>

      <v-toolbar-title v-text="title"/>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
    import Profile from "../components/app/drawer/profile";
    import Menu from "../components/app/drawer/menu";
    import auth from "../mixins/auth";

    export default {
        components: {
            'drawer-profile': Profile,
            'drawer-menu': Menu,
        },

        mixins: [
            auth,
        ],

        data() {
            return {
                drawer: true,
                components: {
                    'drawer-profile': Profile,
                    'drawer-menu': Menu,
                },
                title: 'Фитнесс'
            }
        },

        beforeMount() {
            this.$store.dispatch('employees/loadById', { id: this.me.associated_employee.id }).then(() => {
                const employee = this.$store.getters['employees/byId']({ id: this.me.associated_employee.id });
                console.log(employee);

                this.$store.dispatch('halls/loadById', { id: employee.hall_id }).then(() => {
                    const hall = this.$store.getters['halls/byId']({ id: employee.hall_id });
                    console.log(hall);
                });
            });


        }
    }
</script>
