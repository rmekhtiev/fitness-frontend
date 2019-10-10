<template>
  <div id="bar-items">
    <v-layout id="filters">
      <v-flex md3 class="hidden-sm-and-down">
        <v-text-field
          v-model="filter.title"

          prepend-inner-icon="search"
          label="Поиск"
          single-line
          filled

          clearable

          @keyup.enter="loadItems"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"

      :items-per-page="15">
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs8 md9>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Название
              </div>
            </div>
          </v-flex>

          <v-flex md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate text-right">
                Количество
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <template v-slot:default="props">
        <v-card>
          <v-list>
            <template v-if="itemsLoading">
              <v-list-item>
                <v-progress-linear
                  color="primary accent-4"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
              </v-list-item>
            </template>
            <template v-else v-for="(item, index) in props.items">
              <bar-item-list-item :barItem="item" @update="loadItems"></bar-item-list-item>

              <v-divider
                v-if="index + 1 < props.items.length"
                :key="index"
              ></v-divider>
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
            @click.native="openBarDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <bar-dialog ref="barDialog" title="Создать товар"></bar-dialog>
  </div>
</template>

<script>
    import BarItemListItem from "../../components/bar-items/BarItemListItem";

    import serverSidePaginated from "../../mixins/server-side-paginated";
    import selectedHallAware from "../../mixins/selectedHallAware";
    import BarDialog from "../../components/bar-items/BarDialog";

    export default {
        components: {
            BarItemListItem,
            BarDialog,
        },

        mixins: [
            selectedHallAware,
            serverSidePaginated,
        ],

        data: () => ({
            resource: 'bar-items',
        }),

        computed: {
            pureFilter: function () {
                return _({
                    hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
            },
        },

      methods: {
        openBarDialog() {
          this.$refs.barDialog.open().then(form => {
            this.$axios.post('bar-items', form)
                    .then(async response => {
                      await this.$store.dispatch('bar-items/loadById', {id: response.data.data.id});
                      this.$router.push({name: 'bar-items', params: {id: response.data.data.id}})
                    });
          })
        },

      },

        fetch({store}) {
            return Promise.all([
                store.dispatch('bar-items/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
