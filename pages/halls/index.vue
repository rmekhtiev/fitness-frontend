<template>
  <div id="halls">
    <v-data-iterator :items="halls" :items-per-page="50">
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs8 sm6>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Зал
              </div>
            </div>
          </v-flex>

          <v-flex xs4 sm2>
            <div style="display: flex; width: 100%">
              <div
                style="flex: 1 1 0%;"
                class="overline text-truncate text-right"
              >
                Клиенты
              </div>
            </div>
          </v-flex>

          <v-flex hidden-xs-only sm2>
            <div style="display: flex; width: 100%">
              <div
                style="flex: 1 1 0%;"
                class="overline text-truncate text-right"
              >
                Шкафчики
              </div>
            </div>
          </v-flex>

          <v-flex hidden-xs-only sm2>
            <div style="display: flex; width: 100%">
              <div
                style="flex: 1 1 0%;"
                class="overline text-truncate text-right"
              >
                Сотрудники
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <template v-slot:default="props">
        <v-card>
          <v-list>
            <template v-for="item in props.items">
              <v-list-item :to="{ name: 'halls-id', params: { id: item.id } }">
                <hall-list-item :hall="item" />
              </v-list-item>
              <v-divider />
            </template>
          </v-list>
        </v-card>
      </template>
    </v-data-iterator>
    <v-btn
      color="primary"
      dark
      fab
      fixed
      bottom
      right
      @click.native="openHallDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <hall-dialog ref="hallDialog" title="Создать зал"> </hall-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HallListItem from "../../components/hall/HallListItem";
import HallDialog from "../../components/hall/HallDialog";

export default {
  name: "Index",

  head() {
    return {
      title: "Залы"
    };
  },

  components: {
    HallDialog,
    HallListItem
  },

  computed: {
    ...mapGetters({
      halls: "halls/all"
    })
  },

  fetch({ store }) {
    return Promise.all([store.dispatch("halls/loadAll")]);
  },
  methods: {
    openHallDialog() {
      this.$refs.hallDialog.open().then(form => {
        this.$axios.post("halls", form).then(async response => {
          await this.$store.dispatch("halls/loadById", {
            id: response.data.data.id
          });
          this.$router.push({
            name: "halls-id",
            params: { id: response.data.data.id }
          });
        });
      });
    }
  }
};
</script>

<style scoped></style>
