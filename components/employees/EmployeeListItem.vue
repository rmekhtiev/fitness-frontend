<template>
  <v-list-item>
    <v-layout>
      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="employee.full_name">{{ employee.name }}</div>
            <div class="caption text-truncate">{{ employee.associated_user_id }}</div>
          </div>
        </div>
      </v-flex>

      <v-flex md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="hall.title">{{ hall.title }}</div>
            <div class="caption text-truncate">{{ hall.address }}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
    import hall from "../../mixins/employee";

    export default {
        name: "employee-list-item",

        props: {
            employee: {
                type: Object,
                required: true
            }
        },

        mixins: [
            hall,
        ]
    }
</script>

<style scoped>

</style>
