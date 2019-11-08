<template>
  <div>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ group.title }}
          </v-list-item-title>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn
              v-if="isHallAdmin || isOwner"
              color="primary"
              text
              small
              @click="editGroup()"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              v-if="isHallAdmin || isOwner"
              color="red"
              text
              small
              @click="deleteGroup()"
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
        <v-skeleton-loader
          v-if="group.hall_id"
          :loading="!hall"
          type="list-item-avatar-two-line"
          class="mx-auto"
        >
          <v-list-item
            v-if="group.hall_id"
            :to="{ name: 'halls-id', params: { id: group.hall_id } }"
          >
            <v-list-item-avatar>
              <v-icon color="primary">
                mdi-map-marker
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content v-if="hall">
              <v-list-item-title>{{ hall.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-skeleton-loader>

        <v-skeleton-loader
          v-if="group.trainer_id"
          :loading="!trainer"
          type="list-item-avatar-two-line"
          class="mx-auto"
        >
          <v-list-item
            v-if="group.trainer_id"
            :to="{ name: 'trainers-id', params: { id: group.trainer_id } }"
          >
            <v-list-item-avatar>
              <v-icon color="primary">
                mdi-account-star
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content v-if="trainer">
              <v-list-item-title>{{ trainer.name }}</v-list-item-title>
              <v-list-item-subtitle>Основной тренер</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-skeleton-loader>

        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="primary">
              mdi-account
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Участники</v-list-item-title>
            <v-list-item-subtitle>
              {{ group.clients_count }}/{{ group.max_members }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <group-dialog
      ref="editDilog"
      title="Редактировать группу"
      :group="group"
      is-edit
    />
    <confirm ref="deleteDialog" />
  </div>
</template>

<script>
import Confirm from "../Confirm";
import auth from "../../mixins/auth";
import group from "../../mixins/group";
import GroupDialog from "./GroupDialog";

export default {
  name: "GroupInfoCard",

  components: {
    GroupDialog,
    Confirm
  },

  mixins: [auth, group],

  props: {
    group: {
      required: true,
      type: Object
    },

    link: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({}),

  computed: {
    isLoading() {
      return Object.values(this.loading).some(element => element === true);
    }
  },

  methods: {
    editGroup() {
      this.$refs.editDilog.open().then(form => {
        this.$axios
          .patch("groups/" + this.group.id, form)
          .then(async response => {
            await this.$store.dispatch("groups/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },

    deleteGroup() {
      this.$refs.deleteDialog
        .open(
          "Удалить группу",
          "Вы уверены, что хотите удалить группу? Данное действие невозможно отменить",
          { color: "red" }
        )
        .then(() => {
          this.$store
            .dispatch("groups/delete", { id: this.group.id })
            .then(() => {
              this.$toast.success("Группа удалена");
            });

          this.$emit("delete");
        });
    }
  }
};
</script>

<style scoped></style>
