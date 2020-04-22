<template>
  <tr v-if="item">
    <td
      v-for="header in item.headers"
      :key="`client-row-${item.index}-${header.value}`"
      :class="[`text-${header.align || 'start'}`]"
    >
      <slot :name="`item.${header.value}`">
        <nuxt-link
          v-if="header.value === 'attributes.title'"
          :to="{ name: 'clients-id', params: { id: client.id } }"
        >
          a
        </nuxt-link>
        <template v-else>
            {{client.name}}
        </template>
      </slot>
    </td>
  </tr>
</template>

<script>
export default {
  name: "ClientRowItem",
  props: {
    client: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped></style>
