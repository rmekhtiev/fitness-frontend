<template>
  <div>
    <v-list-item v-if="schedule">
      <v-list-item-content>
        <v-list-item-title>
          {{ $moment(schedule.start_date).format("dddd") }},
          {{ $moment(schedule.start_date).format("HH:mm") }} -
          {{ $moment(schedule.end_date).format("HH:mm") }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $t("schedule.repeat." + schedule.recurrence_type) }}
          <template v-if="schedule.recurrence_until">
            до {{ $moment(schedule.start_date).format("LL") }}
          </template>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon color="grey lighten-1">
                mdi-dots-horizontal
              </v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item
              @click="
                $refs.confirm.open({}).then(res => res && deleteItem(schedule))
              "
            >
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pr-6">
                <v-list-item-title>Удалить</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-action>
    </v-list-item>

    <confirm ref="confirm"></confirm>
  </div>
</template>

<script>
import schedule from "../../mixins/schedule";
import Confirm from "../Confirm";

export default {
  name: "ScheduleMiniListItem",
  components: { Confirm },
  mixins: [schedule],
  props: {
    schedule: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    confirmDelete() {

    }
  }
};
</script>

<style scoped></style>
