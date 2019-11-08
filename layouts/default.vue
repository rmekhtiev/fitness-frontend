<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app fixed>
      <drawer-profile />

      <v-divider />

      <drawer-menu />
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="title" />

      <div class="flex-grow-1" />

      <v-btn icon @click="$refs.search.open()">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon @click="$refs.scanner.open()">
        <v-icon>mdi-qrcode-scan</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container grid-list-md fluid>
        <nuxt/>
      </v-container>

      <scanner-dialog ref="scanner" />
      <client-search-dialog ref="search" />
      <confirm ref="confirm"></confirm>
    </v-content>
  </v-app>
</template>

<script>
import auth from "../mixins/auth";

import Profile from "../components/app/drawer/profile";
import Menu from "../components/app/drawer/menu";

import ScannerDialog from "../components/ScannerDialog";
import ClientSearchDialog from "../components/ClientSearchDialog";
import Confirm from "../components/Confirm";

export default {
  components: {
    Confirm,
    "drawer-profile": Profile,
    "drawer-menu": Menu,
    ScannerDialog,
    ClientSearchDialog
  },

  mixins: [auth],

  data() {
    return {
      drawer: true,
      components: {
        "drawer-profile": Profile,
        "drawer-menu": Menu
      },
      title: "MULTIPOWER"
    };
  }
};
</script>
