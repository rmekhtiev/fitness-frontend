<template>
  <v-layout>
    <v-flex xs8 sm4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="user.name">
            {{ user.name }}
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs8 sm4 class="hidden-xs-only">
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="user.primary_role.name">
            {{ $t("users.primary_role.name." + user.primary_role.name) }}
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "UserListItem",
  props: {
    user: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped></style>
