<template>
  <div>
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
            <v-btn v-if="isHallAdmin || isOwner" color="primary" text small>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn v-if="isHallAdmin || isOwner" color="red" text small>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import auth from "../../mixins/auth";

export default {
  name: "UserInfoCard",
  mixins: [auth],
  props: {
    user: {
      required: true,
      type: Object
    }
  }
};
</script>

<style scoped></style>
