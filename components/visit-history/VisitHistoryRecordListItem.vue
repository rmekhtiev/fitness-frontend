<template>
  <v-layout>
    <v-flex xs3 md4 >
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate">
            <template v-if="client">
              {{ client.name }}
            </template>
            <v-skeleton-loader v-else type="table-cell" />
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs3 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate">
            <template v-if="client">
              {{ $store.getters["halls/byId"]({
                  id: this.client.primary_hall_id
                  })
                .title
              }}
            </template>
            <v-skeleton-loader v-else type="table-cell" />
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs3 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate">
            {{ $moment(record.datetime).format('LLLL') }}
          </div>
        </div>
      </div>
    </v-flex>

  </v-layout>
</template>

<script>
export default {
name: "VisitHistoryRecordListItem",
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  computed: {
    client() {
      return this.$store.getters["clients/byId"]({
        id: this.record.client_id
      });
    },
  },
}
</script>

<style scoped>

</style>