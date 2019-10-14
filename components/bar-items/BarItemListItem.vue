<template>
  <div v-if="barItem">
    <v-list-item @click="openMenu">
      <v-layout>
        <v-flex xs8 md7>
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="text-truncate">
              <div class="body-2 text-truncate" :title="barItem.title">
                {{ barItem.title }}
              </div>
            </div>
          </div>
        </v-flex>

        <v-flex md2>
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="text-truncate text-right">
              <div class="body-2 text-truncate">{{ barItem.cost }} &#8381;</div>
            </div>
          </div>
        </v-flex>

        <v-flex md3>
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="text-truncate text-right">
              <div class="body-2 text-truncate">
                {{ barItem.amount }}
              </div>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-list-item>

    <v-menu
      v-model="menu.display"
      :position-x="menu.posX"
      :position-y="menu.posY"
      absolute
      offset-y
    >
      <v-list dense flat>
        <template v-for="(item, index) in menuItems">
          <v-list-item
            v-if="item.if"
            :key="'menu-item-' + index + '-for-' + barItem.id"
            :disabled="item.disabled"
            @click="item.click"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pr-6">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>

    <bar-sell-dialog
      ref="sellDialog"
      :bar-item="barItem"
      :title="'Продажа: ' + barItem.title"
    />
    <bar-dialog
      ref="editDialog"
      :bar-item="barItem"
      :title="'Редактирование: ' + barItem.title"
    />
    <confirm ref="delete" />
  </div>
</template>

<script>
import BarSellDialog from "./BarSellDialog";
import BarDialog from "./BarDialog";
import Confirm from "../Confirm";

export default {
  name: "BarItemListItem",

  components: {
    BarSellDialog,
    BarDialog,
    Confirm
  },

  props: {
    barItem: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    menu: {
      display: false,

      posX: 0,
      posY: 0
    }
  }),

  computed: {
    menuItems() {
      return [
        {
          title: "Редактировать",
          icon: "mdi-pencil",
          if: true,
          disabled: false,
          click: this.editItem
        },
        {
          title: "Продажа",
          icon: "mdi-basket-outline",
          if: true,
          disabled: this.barItem.amount === 0,
          click: this.sellItem
        },
        {
          title: "Удалить",
          icon: "mdi-delete",
          if: true,
          disabled: false,
          click: this.deleteItem
        }
      ];
    }
  },

  methods: {
    openMenu(e) {
      e.preventDefault();
      this.menu.display = false;
      this.menu.posX = e.clientX;
      this.menu.posY = e.clientY;
      this.$nextTick(() => {
        this.menu.display = true;
      });
    },

    editItem() {
      this.$refs.editDialog.open().then(form => {
        this.$axios.patch("bar-items/" + this.barItem.id, form).then(() => {
          this.$store.dispatch("bar-items/loadById", {
            id: this.barItem.id
          });

          this.$emit("update");
        });
      });
    },

    sellItem() {
      this.$refs.sellDialog.open().then(form => {
        this.$axios
          .$post("bar-items/" + this.barItem.id + "/sell", form)
          .then(() => {
            this.$store.dispatch("bar-items/loadById", {
              id: this.barItem.id
            });

            this.$emit("update");
          });
      });
    },

    deleteItem() {
      this.$refs.delete
        .open("Удалить товар", "Вы уверены? Это действие невозможно отменить", {
          color: "red"
        })
        .then(confirm => {
          if (confirm) {
            this.$store.dispatch("bar-items/delete", { id: this.barItem.id });
            this.$emit("delete");
          }
          this.$router.push({ path: "/bar-items" });
        });
    }
  }
};
</script>

<style scoped></style>
