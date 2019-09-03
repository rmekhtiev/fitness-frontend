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
        }
    }
</script>
