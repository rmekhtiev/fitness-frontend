<template>
  <div id="users">
    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
    >
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs8 sm4>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Email пользователя
              </div>
            </div>
          </v-flex>

          <v-flex xs8 sm4>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Должность
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
                />
              </v-list-item>
            </template>
            <template v-for="(item, index) in props.items" v-else>
              <v-list-item :to="{ name: 'users-id', params: { id: item.id } }">
                <user-list-item :user="item" />
              </v-list-item>
              <v-divider v-if="index + 1 < props.items.length" :key="index" />
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
      @click.native="openUserDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <user-dialog
      ref="userDialog"
      :employees="freeEmployees"
      title="Создать пользователя"
    />
  </div>
</template>

<script>
import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";
import UserListItem from "../../components/users/UserListItem";
import UserDialog from "../../components/users/UserDialog";
export default {
  name: "Index",
  components: { UserDialog, UserListItem },
  mixins: [selectedHallAware, serverSidePaginated],
  data: () => ({
    resource: "users",
    userFilter: {
      user: false
    }
  }),
  computed: {
    freeEmployees() {
      return this.$store.getters["employees/where"]({
        filter: this.userFilter
      });
    }
  },
  fetch({ store }) {
    return Promise.all([
      store.dispatch("users/loadAll"),
      store.dispatch("roles/loadAll")
    ]);
  },
  mounted() {
    this.loadFreeEmployees();
  },
  methods: {
    openUserDialog() {
      this.$refs.userDialog.open().then(form => {
        this.$axios.post("users", form).then(async response => {
          await this.$store.dispatch("users/loadById", {
            id: response.data.data.id
          });
          this.$router.push({
            name: "users",
            params: { id: response.data.data.id }
          });
        });
      });
    },
    loadFreeEmployees() {
      return this.$store.dispatch("employees/loadWhere", {
        filter: this.userFilter
      });
    }
  }
};
</script>

<style scoped></style>
