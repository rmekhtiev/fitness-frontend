<template>
  <v-card
    :class="classes"
    :to="to">
    <v-list-item>
      <v-list-item-avatar color="grey"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ client.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ client.full_name }}</v-list-item-subtitle>
      </v-list-item-content>
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
