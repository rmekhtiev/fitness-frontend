<template>
  <v-card :class="classes" :to="to">
    <template v-if="client">
      <v-list-item>
        <v-list-item-content>
          <v-avatar class="profile" color="grey" size="250" tile>
            <v-img v-if="client.avatar" :src="client.avatar"></v-img>
          </v-avatar>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ client.name }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ client.full_name }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{
            $moment(client.birth_date).format("ll")
          }}</v-list-item-subtitle>

          <div style="position: absolute; right: .5rem; top: .5rem;">
            <v-btn
              v-if="isHallAdmin || isOwner"
              color="primary"
              text
              small
              @click="photoClient()"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>

            <v-btn
              v-if="isHallAdmin || isOwner"
              color="primary"
              text
              small
              @click="updateClient()"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              v-if="isHallAdmin || isOwner"
              color="red"
              text
              small
              @click="deleteClient()"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn
              v-if="link"
              :to="{ name: 'clients-id', params: { id: client.id } }"
              color="primary"
              text
              small
              target="_blank"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list two-line>
        <v-list-item
          v-if="client.phone_number"
          :href="'tel:' + client.phone_number"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-phone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ client.phone_number }}</v-list-item-title>
            <v-list-item-subtitle>Телефон</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-icon :href="'sms:' + client.phone_number">
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item
          v-if="client.whats_app_number"
          :href="'https://wa.me/' + updateWhatsAppNumber().replace('+', '')"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-whatsapp
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ updateWhatsAppNumber() }}</v-list-item-title>
            <v-list-item-subtitle>Номер WhatsApp</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="client.instagram"
          :href="'https://instagram.com/' + client.instagram"
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-instagram
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ client.instagram }}</v-list-item-title>
            <v-list-item-subtitle>Instagram</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="primaryHall"
          :to="
            isOwner || client.primary_hall_id === selectedHallId
              ? { name: 'halls-id', params: { id: client.primary_hall_id } }
              : null
          "
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-map-marker
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ primaryHall.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ primaryHall.address }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-file-outline
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Статус анкеты</v-list-item-title>
            <v-list-item-subtitle
              >{{ $t("questionnaire_statuses." + client.questionnaire_status) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!--      <v-card-actions v-if="client.active_subscriptions">-->
      <!--        <v-spacer />-->
      <!--        <v-btn @click="addRecord()" text color="primary">-->
      <!--          Зафиксировать посещение-->
      <!--        </v-btn>-->
      <!--      </v-card-actions>-->

      <client-dialog
        v-if="isHallAdmin || isOwner"
        ref="edit"
        :client="client"
        title="Редактирование клиента"
        is-edit
      />
      <client-camera-dialog
        v-if="isHallAdmin || isOwner"
        ref="camera"
        :client="client"
        title="Фотография клиента"
        is-edit
      />
      <confirm ref="delete" />
    </template>
    <v-skeleton-loader
      v-else
      type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line, actions"
    />
  </v-card>
</template>

<script>
import routable from "vuetify/es5/mixins/routable";

import auth from "../../mixins/auth";
import selectedHallAware from "../../mixins/selected-hall-aware";

import Confirm from "../Confirm";
import ClientDialog from "./ClientDialog";
import ClientCameraDialog from "./ClientCameraDialog";

export default {
  name: "ClientInfoCard",
  components: { ClientCameraDialog, ClientDialog, Confirm },
  // extend: VCard,

  mixins: [selectedHallAware, routable, auth],

  props: {
    client: {
      type: Object,
      required: true
    },

    link: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    componentTag() {
      return "v-card";
    },

    primaryHall() {
      return this.$store.getters["halls/byId"]({
        id: this.client.primary_hall_id
      });
    },

    classes() {
      return {
        ...routable.options.computed.classes.call(this)
      };
    }
  },

  methods: {
    updateClient() {
      this.$refs.edit.open().then(form => {
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

    photoClient() {
      this.$refs.camera.open().then(form => {
        this.$axios
          .post("clients/" + this.client.id + "/avatar", form)
          .then(async response => {
            await this.$store.dispatch("clients/loadById", {
              id: this.client.id
            });
          });
      });
    },
    deleteClient() {
      this.$refs.delete
        .open(
          "Удалить клиента?",
          "Вы уверены? Это действие невозможно отменить",
          { color: "red" }
        )
        .then(confirm => {
          if (confirm) {
            this.$store.dispatch("clients/delete", { id: this.client.id });
            this.$toast.success("Клиент удален");
            this.$emit("delete");
            this.$router.back();
          }
        });
    },
    updateWhatsAppNumber() {
      return this.client.whats_app_number
        .replace(/-/g, "")
        .replace(/\s/g, "")
        .replace("(", "")
        .replace(")", "");
    },
  }
};
</script>

<style scoped>
.v-card {
  /*background-color: #41b883;*/
}
</style>
