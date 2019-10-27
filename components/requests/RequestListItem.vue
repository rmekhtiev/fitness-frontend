<template>
  <v-list-item v-if="request">
    <v-layout>
      <v-flex xs4 md4>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-4 text-truncate" :title="request.name">
              {{ request.name }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex xs3 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-4 text-truncate" :title="request.phone">
              {{ phoneNumber }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex xs3 md3>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate ">
            <div class="body-4 text-truncate" :title="request.date">
              {{ createdDay }}
            </div>
            <div class="caption text-truncate">
              {{ createdTime }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex xs2 md2 flat dense class="text-right">
        <v-menu left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense flat>
            <v-list-item @click="deleteRequest()">
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pr-4">
                <v-list-item-title>Удалить</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>


    <confirm ref="delete" />
  </v-list-item>

</template>

<script>

import request from "../../mixins/request";
import Confirm from "../Confirm";

export default {

  name: "RequestListItem",

  mixins: [request],

  components: {
    Confirm,
  },

  props: {
    request: {
      type: Object,
      required: true
    }
  },


  methods: {
    deleteRequest() {
      this.$refs.delete
              .open("Удалить заявку", "Вы уверены?", { color: "red" })
              .then(confirm => {
                if (confirm) {
                  this.$store.dispatch("requests/delete", { id: this.request.id });
                  this.$emit("delete");
                }
              });
    },
  },

};
</script>

<style scoped></style>
