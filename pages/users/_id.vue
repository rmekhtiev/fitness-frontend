<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 md6 xl3>
        <user-info-card :user="user"></user-info-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import UserInfoCard from "../../components/users/UserInfoCard";
export default {
  name: "Id",
  components: { UserInfoCard },
  computed: {
    user() {
      return this.$store.getters["users/byId"]({
        id: this.$route.params.id
      });
    }
  },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("users/loadById", { id: params.id }),
      store.dispatch("roles/loadAll")
    ]);
  }
};
</script>

<style scoped></style>
