<template>
  <v-list-item :to="{name: 'clients-id', params: {id: client.id}}">
    <v-layout>
      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="client.full_name">{{ client.name }}</div>
            <div class="caption text-truncate" :title="primaryHall.address">{{ primaryHall.title }}</div>
          </div>
        </div>
      </v-flex>

      <v-flex md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="mt-1">
            <v-progress-linear
              color="deep-purple accent-4"
              rounded
              height="18"
            >
              <template v-slot="{ value }">
                <span class="caption">12 дней</span>
              </template>
            </v-progress-linear>
          </div>
        </div>
      </v-flex>

      <v-flex md3>
      </v-flex>

      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-right">
            <div class="body-2 text-truncate text-right">10 дней назад</div>
            <div class="caption text-right">12:58</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
    import client from "../../mixins/client";

    export default {
        name: "client-list-item",

        props: {
            client: {
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
