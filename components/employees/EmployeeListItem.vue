<template>
  <v-list-item :to="{ name: 'employees-id', params: { id: employee.id } }">
    <v-layout>
      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="employee.full_name">
              {{ employee.name }}
            </div>
            <!--            <div class="body-2 text-truncate" :title="employee.full_name">{{ employee.id }}</div>-->
          </div>
        </div>
      </v-flex>

      <v-flex xs8 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="hall.title">
              {{ hall.title }}
            </div>
            <div class="caption text-truncate">
              {{ hall.address }}
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-list-item>
</template>

<script>
import hall from "../../mixins/employee"

export default {
  name: "EmployeeListItem",

  mixins: [hall],

  props: {
    employee: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
