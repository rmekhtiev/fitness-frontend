<template>
  <div>
    <v-list-item @click="openMenu">
      <v-layout>
        <v-flex xs8 md7>
          <div style="display: flex; width: 100%">
            <div style="flex: 1 1 0%;" class="text-truncate">
              <div class="body-2 text-truncate" :title="barItem.title">{{ barItem.title }}</div>
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
              <div class="body-2 text-truncate">{{ barItem.amount }}</div>
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
      <v-list
        dense
        flat
      >
        <v-list-item v-for="(item, index) in menuItems" v-if="item.if" @click="item.click"
                     :key="'menu-item-' + index + '-for-' + barItem.id">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="pr-6">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <bar-sell-dialog
      ref="sellDialog"
      :bar-item="barItem"
      :title="'Продажа: ' + barItem.title"
    >
    </bar-sell-dialog>
    <bar-edit-dialog
      ref="editDialog"
      :bar-item="barItem"
      :title="'Редактирование: ' + barItem.title"
    >
    </bar-edit-dialog>
  </div>
</template>

<script>
    import BarSellDialog from "./BarSellDialog";
    import BarEditDialog from "./BarEditDialog";

    export default {
        name: "BarItemListItem",

        props: {
            barItem: {
                type: Object,
                required: true
            }
        },

        components: {
            BarSellDialog,
            BarEditDialog,
        },

        data: () => ({
            menu: {
                display: false,

                posX: 0,
                posY: 0,
            },
        }),

        computed: {
            menuItems() {
                return [
                    {title: "Редактировать", icon: "mdi-pencil", if: true, click: this.editItem},
                    {title: "Продажа", icon: "mdi-basket-outline", if: true, click: this.sellItem},
                ]
            },
        },

        methods: {
            openMenu(e) {
                e.preventDefault();
                this.menu.display = false;
                this.menu.posX = e.clientX;
                this.menu.posY = e.clientY;
                this.$nextTick(() => {
                    this.menu.display = true
                })
            },

            editItem(e) {
                this.$refs.editDialog.open().then((form) => {
                    this.$axios.patch('bar-items/' + this.barItem.id, form).then(response => {
                        this.$store.dispatch('bar-items/loadById', {
                            id: this.barItem.id,
                        });

                        this.$emit('update');
                    });
                });
            },

            sellItem(e) {
                this.$refs.sellDialog.open().then(value => {

                });
            }
        }
    }
</script>

<style scoped>

</style>
