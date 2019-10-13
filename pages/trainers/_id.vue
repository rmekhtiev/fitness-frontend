<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <trainer-info-card :trainer="trainer" class="mb-2 mx-auto" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import TrainerInfoCard from "../../components/trainers/TrainerInfoCard"

export default {
  head() {
    return {
      title: this.trainer.name
    }
  },

  components: {
    TrainerInfoCard
  },

  computed: {
    trainer() {
      return this.$store.getters["trainers/byId"]({ id: this.$route.params.id })
    }
  },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("trainers/loadById", { id: params.id }).then(
        async () =>
          await store.dispatch("employees/loadById", {
            id: store.getters["trainers/byId"]({ id: params.id })
              .associated_employee_id
          })
      ),
      store.dispatch("halls/loadAll")
    ])
  }
}
</script>

<style scoped></style>
