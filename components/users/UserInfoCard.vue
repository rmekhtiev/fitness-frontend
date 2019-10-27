<template>
  <div v-if="user">
    <v-card>
      <v-list-item>
        <v-list-item-avatar color="grey" />
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ user.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("users.primary_role.name." + user.primary_role.name) }}
          </v-list-item-subtitle>
          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn
              v-if="isOwner"
              color="primary"
              text
              small
              @click="updateUser()"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn v-if="isOwner" color="red" text small @click="deleteUser()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-btn text color="primary" v-if="isOwner" @click="changePassword()">
          Сменить пароль
        </v-btn>
      </v-list-item>
    </v-card>
    <user-change-password-dialog
      ref="changePassword"
      title="Изменение пароля пользователя"
      :user="user"
      is-edit
    ></user-change-password-dialog>
    <user-update-dialog
      ref="updateUserDialog"
      title="Редактировать пользователя"
      :user="user"
      :roles="roles"
      is-edit
    />
    <confirm ref="deleteUserConfirm" />
  </div>
</template>

<script>
import auth from "../../mixins/auth";
import Confirm from "../../components/Confirm";
import UserUpdateDialog from "./UserUpdateDialog";
import UserChangePasswordDialog from "./UserChangePasswordDialog";

export default {
  name: "UserInfoCard",
  components: {
    UserChangePasswordDialog,
    UserUpdateDialog,
    Confirm
  },
  mixins: [auth],
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  computed: {
    roles() {
      return this.$store.getters["roles/all"];
    }
  },
  methods: {
    updateUser() {
      this.$refs.updateUserDialog.open().then(form => {
        this.$axios
          .patch("users/" + this.user.id, form)
          .then(async response => {
            await this.$store.dispatch("users/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },
    changePassword() {
      this.$refs.changePassword.open().then(form => {
        this.$axios
          .patch("users/" + this.user.id, form)
          .then(async response => {
            await this.$store.dispatch("users/loadById", {
              id: response.data.data.id
            });
          });
        this.$emit("update");
      });
    },
    deleteUser() {
      this.$refs.deleteUserConfirm
        .open(
          "Удалить пользователя",
          "Вы уверены? Это действие невозможно отменить",
          { color: "red" }
        )
        .then(confirm => {
          if (confirm) {
            this.$store.dispatch("users/delete", { id: this.user.id });
            this.$emit("delete");
          }
        });
    }
  }
};
</script>

<style scoped></style>
