<template>
  <v-card class="mb-2 mx-auto">
    <v-card-text>
      <div class="overline">
        История абонементов
      </div>
    </v-card-text>
    <div v-if="subscriptions.length > 0">
      <v-list v-for="item in subscriptions" :key="item.id" dense>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-badge-account-horizontal</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>
              с
              {{ $moment.utc(item.issue_date).format("DD-MM-YYYY") }}
              &mdash; по
              {{ $moment.utc(item.valid_till).format("DD-MM-YYYY") }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <v-card-text v-else class="text-center">
      <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
      <br />
      Пусто
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ClientSubscriptionsHistory",
  props: {
    subscriptions: {
      type: Array
    }
  }
};
</script>

<style scoped></style>
