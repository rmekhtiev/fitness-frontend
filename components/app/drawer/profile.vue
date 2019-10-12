<template>
  <v-list-group v-if="$auth.loggedIn">
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ me.name }}
        </v-list-item-title>

        <v-list-item-subtitle v-if="hall" :title="hall.address">
          {{ hall.title }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else-if="isOwner">
          Все залы
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          {{ me.primary_role.description }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>

    <v-list dense>
      <v-list-item
        v-for="(item, index) in halls"
        v-if="isOwner"
        :key="'hall-in-drawer-' + index"
        style="padding-left: 11px;"
        @click="
          $store.dispatch(
            'selectHall',
            item.id !== $store.getters['selectedHallId'] ? item : null
          )
        "
      >
        <v-list-item-avatar size="34" style="margin-right: 26px">
          <v-badge
            :value="item.id === $store.getters['selectedHallId']"
            bottom
            overlap
            color="success"
          >
            <template v-slot:badge>
              <v-icon class="white--text">
                mdi-check
              </v-icon>
            </template>

            <v-avatar size="34" color="primary" />
          </v-badge>
        </v-list-item-avatar>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-list-item @click.prevent="logout">
        <v-list-item-icon>
          <v-icon>exit_to_app</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Выйти из аккаунта</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-list-group>
</template>

<script>
import auth from "../../../mixins/auth"

export default {
  mixins: [auth],

  computed: {
    employee() {
      return this.$store.getters["employees/byId"]({
        id: this.me.associated_employee.id
      })
    },

    hall() {
      return this.$store.getters["selectedHall"]
    },

    halls() {
      return this.$store.getters["halls/all"]
    }
  },

  methods: {
    logout() {
      return this.$auth.logout().then(value => {
        this.$router.push({
          name: "auth-login"
        })
      })
    }
  }
}
</script>

<style scoped>
>>> .v-badge__badge {
  height: 16px !important;
  width: 16px !important;
  min-width: 16px !important;
  bottom: -4px !important;
  right: -4px !important;
}
</style>
