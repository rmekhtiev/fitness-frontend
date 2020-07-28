<template>
  <div>
    <v-card color="mb-2 mx-auto">
      <v-card-text>
        <div class="overline">
          Бесплатная тренировка
        </div>
      </v-card-text>
      <v-list>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-subtitle
              >Статус бесплатной тренировки</v-list-item-subtitle
            >
            <v-list-item-title>
              {{ $t('free_training_statuses.' + client.free_training_status) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-subtitle
              >Дата истечения тренировки</v-list-item-subtitle
            >
            <v-list-item-title v-if="client.free_training_expiration_date">
              {{ $moment(client.free_training_expiration_date).format("ll") }}
            </v-list-item-title>
            <v-list-item-title v-else>Не установлена</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-subtitle
              >Дата использования тренировки</v-list-item-subtitle
            >
            <v-list-item-title v-if="client.free_training_use_date">
              {{ $moment(client.free_training_use_date).format("ll") }}
            </v-list-item-title>
            <v-list-item-title v-else>Не проведена</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <div v-if="!client.free_training_use_date">
              <v-btn
                v-if="client.free_training_status === 'not_scheduled'"
                @click="updateFreeTraining()"
                >Назначить бесплатную тренировку</v-btn
              >
              <div v-else class="d-flex flex-column justify-center">
                <v-btn
                  v-if="
                    client.free_training_expiration_date >=
                      $moment().format('YYYY-MM-DD')
                  "
                  color="primary"
                  class="mb-2"
                  @click="trainClient()"
                  >Провести</v-btn
                >

                <v-btn @click="updateFreeTraining()">
                  Изменить условия
                </v-btn>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <ClientFreeTrainingDialog
      v-if="isHallAdmin || isOwner"
      ref="freeTraining"
      :client="client"
      title="Бесплатная тренировка для: "
      is-edit
    />
  </div>
</template>

<script>
import auth from "../../mixins/auth";
import ClientFreeTrainingDialog from "~/components/clients/ClientFreeTrainingDialog";

export default {
  name: "ClientFreeTrainingInfoCard",
  components: { ClientFreeTrainingDialog },
  mixins: [auth],
  computed: {
    client() {
      return this.$store.getters["clients/byId"]({ id: this.$route.params.id });
    },
  },
  methods: {
    updateFreeTraining() {
      this.$refs.freeTraining.open().then(form => {
        this.$axios
          .patch("clients/" + this.client.id, form)
          .then(async response => {
            await this.$store.dispatch("clients/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },
    trainClient() {
      const trainForm = {};
      if (this.client) {
        Object.assign(trainForm, this.client);
      }
      trainForm.free_training_use_date = this.$moment().format("YYYY-MM-DD");
      this.$axios
        .patch("clients/" + this.client.id, trainForm)
        .then(async response => {
          await this.$store.dispatch("clients/loadById", {
            id: response.data.data.id
          });
        });
    }
  }
};
</script>

<style scoped></style>
