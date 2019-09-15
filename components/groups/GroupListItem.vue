<template>
  <v-layout>
    <v-flex xs8 sm6 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="group.title">{{ group.title }}</div>
        </div>
      </div>
    </v-flex>

    <v-flex sm3 md4 class="hidden-xs-only">
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="hall.title">{{ hall.title }}</div>
          <div class="caption text-truncate">{{ hall.address }}</div>
        </div>
      </div>
    </v-flex>

    <v-flex xs4 sm3 md2>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate text-right">
          <div class="body-2">{{group.clients_count}}/{{group.max_members}}</div>
        </div>
      </div>
    </v-flex>

  </v-layout>
</template>

<script>
    import group from "../../mixins/group";

    export default {
        name: "group-list-item",

        props: {
            group: {
                type: Object,
                required: true
            }
        },

        mixins: [
            group,
        ]
    }
</script>

<style scoped>

</style>
