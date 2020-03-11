<template>
  <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
    <v-flex xs4 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="overline text-truncate">
          ФИО
        </div>
      </div>
    </v-flex>

    <v-flex xs6 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="overline text-truncate">
          Абонемент
        </div>
      </div>
    </v-flex>

    <v-flex hidden-xs-only md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="overline text-truncate text-right">
          Последнее посещение
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "ClientListHeader"
};
</script>

<style scoped></style>
