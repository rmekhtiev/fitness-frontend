<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-flex class="text-center">
        <v-img
          :src="require('../assets/img/header-logo-1c-pos.svg')"
          class="mt-3 mx-auto"
          contain
          height="200"
          width="200"
        />
      </v-flex>

      <div class="display-1 text-center">
        Корпоративная сеть <br />
        управления фитнесс-залами
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  head() {
    return {
      title: "Главная"
    };
  },
  components: {
    Logo,
    VuetifyLogo
  }
};
</script>
