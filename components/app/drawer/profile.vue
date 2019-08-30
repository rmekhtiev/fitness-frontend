<template>
  <v-toolbar flat class="transparent">
    <v-list-item>
      <template v-if="$auth.loggedIn">

        <v-list-item-content>
          <v-list-item-title class="title">{{ me.name }}</v-list-item-title>

          <v-list-item-subtitle>{{ me.primaryRole.description }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon ripple @click.prevent="logout">
            <v-icon color="grey lighten-1">exit_to_app</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-toolbar>
</template>

<script>
    import auth from '../../../mixins/auth'

    export default {
        mixins: [
            auth,
        ],
        methods: {
            logout() {
                return this.$auth.logout().then(value => {
                    this.$router.push({
                        name: 'auth-login',
                    })
                });
            }
        },
    }
</script>

<style scoped>

</style>
