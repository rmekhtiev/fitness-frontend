<template>
  <v-card class="mb-2 mx-auto">
    <v-card-text>
      <div class="overline">
        История посещений
      </div>
    </v-card-text>

    <v-timeline v-if="records" dense>
      <template v-for="item in records.slice(0, 10)">
        <v-timeline-item small>
          {{ recordTime(item) }}
        </v-timeline-item>
      </template>
    </v-timeline>
    <v-card-text v-else class="text-center">
      <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
      <br />
      Пусто
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ClientVisitHistory",
  props: {
    records: {
      type: Array
    }
  },
  methods: {
    recordTime(record) {
      return this.$moment
        .utc(record.datetime)
        .local()
        .format("D MMMM YYYY года в HH:mm");
    }
  }
};
</script>

<style scoped></style>
