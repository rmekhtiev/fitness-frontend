<template>
  <v-list-item>
    <v-layout>
      <v-flex xs2 md1>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-1">{{ locker.number }}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
    export default {
        name: "hall-list-item",

        props: {
            locker: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>
