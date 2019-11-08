<template>
  <div v-if="trainer">
    <v-card>
      <v-list-item>
        <v-list-item-avatar color="grey" />
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ trainer.name }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ trainer.full_name }}</v-list-item-subtitle>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn
              v-if="isHallAdmin || isOwner"
              color="primary"
              text
              small
              @click="updateTrainer()"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              v-if="isHallAdmin || isOwner"
              color="red"
              text
              small
              @click="deleteTrainer()"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn
              v-if="link"
              color="primary"
              text
              small
              :to="{ name: 'trainers-id', params: { id: trainer.id } }"
              target="_blank"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list two-line>
        <v-list-item
          v-if="trainer.phone_number"
          :href="'tel:' + trainer.phone_number"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-phone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ trainer.phone_number }}</v-list-item-title>
            <v-list-item-subtitle>Телефон</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-map-marker
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ hall.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <trainer-dialog
      ref="trainerDialog"
      title="Создать тренера"
      :trainer="trainer"
      is-edit
    />
    <confirm ref="delete" />
  </div>
</template>

<script>
import auth from "../../mixins/auth";
import Confirm from "../Confirm";
import TrainerDialog from "./TrainerDialog";

export default {
  name: "TrainerInfoCard",

  components: {
    TrainerDialog,
    Confirm
  },

  mixins: [auth],

  props: {
    trainer: {
      required: true,
      type: Object
    },

    link: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    hall() {
      return this.$store.getters["halls/byId"]({ id: this.trainer.hall_id });
    }
  },

  methods: {
    updateTrainer() {
      this.$refs.trainerDialog.open().then(form => {
        this.$axios
          .patch("trainers/" + this.trainer.id, form)
          .then(async response => {
            await this.$store.dispatch("trainers/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },

    deleteTrainer() {
      this.$refs.delete
        .open(
          "Удалить тренера",
          "Вы уверены? Это действие невозможно отменить",
          { color: "red" }
        )
        .then(confirm => {
          if (confirm) {
            this.$store.dispatch("trainers/delete", { id: this.trainer.id });
            this.$toast.success("Тренер удален");
            this.$emit("delete");
            this.$router.back();
          }
        });
    }
  }
};
</script>

<style scoped></style>
