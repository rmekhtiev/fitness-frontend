<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <employee-info-card :employee="employee" class="mb-2 mx-auto" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import EmployeeInfoCard from "../../components/employees/EmployeeInfoCard";

export default {
  // head() {
  //   return {
  //     title: this.employee.name
  //   };
  // },

  components: {
    EmployeeInfoCard
  },

  computed: {
    employee() {
      return this.$store.getters["employees/byId"]({
        id: this.$route.params.id
      });
    }
  },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("employees/loadById", { id: params.id }),
      store.dispatch("halls/loadAll")
    ]);
  }
};
</script>

<style scoped></style>
