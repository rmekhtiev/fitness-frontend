<template>
  <v-card>
    <v-list>
      <template v-if="itemsLoading">
        <v-list-item>
          <v-progress-linear
            color="primary accent-4"
            indeterminate
            rounded
            height="6"
          />
        </v-list-item>
      </template>
      <template v-for="(item, index) in items" v-else>
        <v-list-item
          :key="'client-' + index + '-' + item.id"
          :to="{ name: 'clients-id', params: { id: item.id } }"
        >
          <slot :item="item" :index="index">
            <client-list-item :client="item" />
          </slot>
        </v-list-item>
        <v-divider v-if="index + 1 < items.length" :key="index" />
      </template>
    </v-list>
  </v-card>
</template>

<script>
import ClientListItem from "./ClientListItem";

export default {
  name: "ClientListCard",
  components: { ClientListItem },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemsLoading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped></style>
