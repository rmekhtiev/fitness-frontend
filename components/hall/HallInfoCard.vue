<template>
  <div v-if="hall">
    <v-card>
      <v-list-item>
        <v-list-item-avatar color="grey" />
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ hall.title }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn
              v-if="isHallAdmin || isOwner"
              color="primary"
              text
              small
              @click="updateHall()"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <hall-dialog
      ref="hallDialog"
      :hall="hall"
      title="Редактировать зал"
      is-edit
    ></hall-dialog>
  </div>
</template>
<script>
import auth from "../../mixins/auth";
import HallDialog from "./HallDialog";
export default {
  name: "HallInfoCard",
  components: { HallDialog },
  mixins: [auth],
  computed: {
    hall() {
      return this.$store.getters["halls/byId"]({
        id: this.$route.params.id
      });
    }
  },
  methods: {
    updateHall() {
      this.$refs.hallDialog.open().then(form => {
        this.$axios
          .patch("halls/" + this.hall.id, form)
          .then(async response => {
            await this.$store.dispatch("halls/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    }
  }
};
</script>

<style scoped></style>
