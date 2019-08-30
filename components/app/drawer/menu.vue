<template>
  <v-list dense nav>
    <v-list-item nuxt :to="{name: 'index'}" exact>
      <v-list-item-icon>
        <v-icon>home</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>Главная</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item nuxt :to="{name: 'clients'}" exact>
      <v-list-item-icon>
        <v-icon>persons</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>Клиенты</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  import auth from '../../../mixins/auth'

  export default {
    mixins: [
      auth,
    ],
  }
</script>

<style scoped>

</style>
