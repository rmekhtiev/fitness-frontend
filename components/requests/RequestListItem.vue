<template>
  <v-list-item>
    <v-layout>
      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="request.name">
              {{ request.name }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="request.address">
              {{ request.date }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="request.date">
              {{ request.phone }}
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
export default {
  name: "RequestListItem",

  props: {
    request: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped></style>
