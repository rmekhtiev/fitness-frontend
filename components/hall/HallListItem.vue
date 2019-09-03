<template>
  <v-list-item>
    <v-layout>
      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="hall.title">{{ hall.title }}</div>
            <div class="caption text-truncate" :title="hall.address">{{ hall.address }}</div>
          </div>
        </div>
      </v-flex>

      <v-flex md1>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2" >{{ hall.clients_count }}</div>
            <div class="caption green--text">+ {{ hall.clients_count }}</div>
          </div>
        </div>
      </v-flex>

      <v-flex md1>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2" >{{ hall.lockers_count }} <span class="grey--text">({{ hall.lockers_count_free }})</span></div>
          </div>
        </div>
      </v-flex>

      <v-flex md1>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2" >{{ hall.employees_count }}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
    import client from "../../mixins/client";

    export default {
        name: "hall-list-item",

        props: {
            hall: {
                type: Object,
                required: true
            }
        },

        mixins: [
            client,
        ]
    }
</script>

<style scoped>

</style>
