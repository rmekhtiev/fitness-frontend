<template>
  <v-card outlined>
    <v-card-title class="overline">
      {{ title }}
    </v-card-title>

    <v-card-text>
      <p class="headline" v-if="description">
        {{ description }}
      </p>
      <p class="display-1 text--primary">
        {{ counter }}
      </p>

      <template v-if="change">
        <div :class="data.class">
          <v-icon small :color="color" v-if="icon" style="margin-right: 5px;">{{ icon }}</v-icon>
          <span style="margin-top: 2px;">{{ change }}</span>
        </div>
        <div class="caption" v-if="range">
          {{ range }}
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
  import Colorable from 'vuetify/es5/mixins/colorable'

    export default {
        name: "StatsCounterCard",

        mixins: [
            Colorable,
        ],

        props: {
            title: {
                type: String,
                required: true
            },

            counter: {
                type: String | Number,
                required: true
            },

            description: {
                type: String,
            },

            change: {
                type: String | Number,
            },

            icon: {
                type: String,
            },

            range: {
                type: String,
            },

        },

        computed: {
            data() {
                return this.setTextColor(this.color, {
                    class: {
                        'd-flex': true,
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
