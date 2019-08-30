<template>
  <v-list-item >
    <v-layout>
      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-1 text-truncate" :title="client.full_name">{{ client.name }}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
    export default {
        name: "client-list-item",

        props: {
            client: {
                type: Object,
                required: true
            }
        },
    }
</script>

<style scoped>

</style>
