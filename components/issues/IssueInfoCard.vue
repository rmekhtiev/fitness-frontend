<template>
  <div>
    <v-card
      :class="classes"
      :to="to">
      <v-list-item>
        <v-list-item-avatar color="grey"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ issue.topic }}</v-list-item-title>
          <div class="body-2 text-truncate" :title="issue.status">{{$t('statuses.all.' + issue.status) }}</div>

          <div style="position: absolute; right: .5rem; top: .5rem;">
              <v-btn color="primary" v-if="isHallAdmin || isOwner" @click="updateIssue()" text small>
                  <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn color="red" v-if="isHallAdmin || isOwner" @click="deleteIssue()" text small>
                  <v-icon>mdi-delete</v-icon>
              </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list two-line>

        <v-list-item nuxt exact>
          <v-list-item-icon>
              <v-icon mt-5 large color="primary">mdi-map-marker</v-icon>
          </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="headline">{{ employee.full_name }}</v-list-item-title>
                <div class="body-2 text-truncate">{{primaryHall.title}}</div>
            </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt exact>
          <v-list-item-icon>
            <v-icon color="primary">mdi-map-marker</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            {{ issue.description }}
              {{ issue.id}}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

      <issue-dialog ref="issueDialog" title="Правка проблемы" :issue="issue" is-edit></issue-dialog>
      <confirm ref="delete"></confirm>

  </div>
</template>

<script>
    import routable from 'vuetify/es5/mixins/routable'
    import IssueDialog from "./IssueDialog";
    import Confirm from "../Confirm";
    import auth from "../../mixins/auth";

    export default {
        name: "IssueInfoCard",
        // extend: VCard,

        mixins: [
            routable,
            auth,
        ],

        components: {
          Confirm,
          IssueDialog,
        },

        props: {

            link: {
                type: Boolean,
                default: false,
            },
          issue: {
            type: Object,
            required: true
          },
        },

        computed: {
            componentTag() {
                return 'v-card';
            },

            primaryHall() {
                return this.$store.getters['halls/byId']({id: this.issue.hall_id});
            },

            employee() {
                return this.$store.getters['employees/byId']({id: this.issue.employee_id});
            },

            classes() {
                return {
                    ...routable.options.computed.classes.call(this)
                }
            }
        },

        methods: {
            updateIssue() {
                this.$refs.issueDialog.open().then((form) => {
                    this.$axios.patch('issues/' + this.issue.id, form)
                        .then(async response => {
                            await this.$store.dispatch('issues/loadById', {id: response.data.data.id});
                        });

                    this.$emit('update');
                });

            },

            deleteIssue() {
                this.$refs.delete.open('Удалить сотрудника?', 'Вы уверены? Это действие невозможно отменить', {color: 'red'}).then((confirm) => {
                    if (confirm) {
                        let issueId = this.issue.id;

                        this.$store.dispatch('issues/delete', {id: this.issue.id});

                        this.$emit('delete');
                    }
                    this.$router.push({path: '/issues'})
                })
            },
        }
    }
</script>

<style scoped>
  .v-card {
    /*background-color: #41b883;*/
  }
</style>
