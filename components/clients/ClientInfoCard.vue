<template>
  <v-card
    :class="classes"
    :to="to">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Клиент</div>
        <v-list-item-title class="headline mb-1">{{ client.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ client.full_name }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
    import routable from 'vuetify/es5/mixins/routable'
    import VCard from 'vuetify/es5/components/VCard'

    export default {
        name: "ClientInfoCard",

        // extend: VCard,

        mixins: [
            routable,
        ],

        props: {
            client: {
                type: Object,
                required: true
            }
        },

        computed: {
            componentTag() {
                return 'v-card';
            },
            classes() {
                return {
                    ...routable.options.computed.classes.call(this)
                }
            }
        }
    }
</script>

<style scoped>
  .v-card {
    /*background-color: #41b883;*/
  }
</style>
