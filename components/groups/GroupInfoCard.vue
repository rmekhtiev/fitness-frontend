<template>
  <div>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ group.title }}</v-list-item-title>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn color="primary" v-if="isHallAdmin || isOwner" @click="editGroup()" text small>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn color="red" v-if="isHallAdmin || isOwner" @click="deleteGroup()" text small>
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn color="primary" text small v-if="link" :to="{name: 'trainers-id', params: {id: trainer.id}}"
                   target="_blank">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list two-line>
        <v-list-item v-if="group.hall_id" :to="{name: 'halls-id', params: {id: group.hall_id}}">
          <v-list-item-icon>
            <v-icon color="primary">mdi-map-marker</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ hall.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ hall.address }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="group.trainer_id" :to="{name: 'trainers-id', params: {id: group.trainer_id}}">
          <v-list-item-icon>
            <v-icon color="primary">mdi-account-star</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ trainer.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Участники</v-list-item-title>
            <v-list-item-subtitle>{{group.clients_count}}/{{group.max_members}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <group-dialog ref="editDilog" title="Редактировать группу" :group="group" is-edit></group-dialog>
    <confirm ref="deleteDialog"></confirm>
  </div>
</template>

<script>
    import GroupDialog from "./GroupDialog";
    import Confirm from "../Confirm";
    import auth from "../../mixins/auth";
    import group from "../../mixins/group";

    export default {
        name: "GroupInfoCard",

        components: {
            GroupDialog,
            Confirm
        },

        mixins: [
            auth,
            group
        ],

        props: {
            group: {
                required: true,
                type: Object,
            },

            link: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            hall() {
                return this.$store.getters['halls/byId']({id: this.group.hall_id});
            },

            trainer() {
                return this.$store.getters['trainers/byId']({id: this.group.trainer_id});
            },
        },

        methods: {
            editGroup() {
                this.$refs.editDilog.open().then((form) => {
                    this.$axios.patch('groups/' + this.group.id, form)
                        .then(async response => {
                            await this.$store.dispatch('groups/loadById', {id: response.data.data.id});
                        });

                    this.$emit('update');
                });
            },

            deleteGroup() {
                this.$refs.deleteDialog.open('Удалить группу', 'Вы уверены, что хотите удалить группу? Данное действие невозможно отменить', {color: 'red'}).then(response => {
                    this.$router.back();
                    this.$store.dispatch('groups/delete', {id: this.group.id}).then(() => {
                        this.$toast.success('Группа удалена');
                    });
                });
            },
        }
    }
</script>

<style scoped>

</style>
