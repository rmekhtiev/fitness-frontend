<template>
  <div>
    <div v-if="identifiers.length > 0">
      <v-card>
        <v-card-text>
          <div class="overline">
            Идентификаторы
          </div>
        </v-card-text>
        <v-list>
          <template v-for="(item, index) in identifiers">
            <v-list-item v-if="item" two-line>
              <v-list-item-content>
                <v-list-item-title>
                  Идентификатор #{{ index + 1 }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  от {{ $moment(item.created_at).format("ll") }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="deleteIdentifier(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </div>
    <div v-else>
      <v-alert border="right" colored-border type="error" elevation="2">
        У клиента нет привязанных идентификаторов
      </v-alert>
    </div>
    <confirm ref="delete" />
  </div>
</template>

<script>
import Confirm from "~/components/Confirm";
export default {
  name: "ClientIdentifiers",
  components: { Confirm },
  props: {
    identifiers: {
      type: Array,
      required: true
    },
    client: {
      type: Object
    }
  },
  methods: {
    deleteIdentifier(identifier) {
      this.$refs.delete
        .open(
          "Удалить идентификатор?",
          "Вы уверены? Это действие невозможно отменить",
          { color: "red" }
        )
        .then(async confirm => {
          if (confirm) {
            await this.$store.dispatch("identifiers/delete", {
              id: identifier.id
            });
            this.$store.dispatch("identifiers/loadWhere", {
              filter: {
                client_id: this.client.id
              }
            });
            this.$toast.success("Идентификатор удален");
            this.$emit("delete");
          }
        });
    }
  }
};
</script>
