<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="close">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Сканер</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-btn dark text @click="close()">Закрыть</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <qrcode-stream v-if="dialog" @init="onInit" @detect="onDetect"></qrcode-stream>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    import {QrcodeStream, QrcodeDropZone, QrcodeCapture} from 'vue-qrcode-reader'

    export default {
        name: "LockerClaimDialog",

        components: {
            'qrcode-stream': QrcodeStream
        },

        props: {
            fullscreen: {
                type: Boolean,
                default: true,
            },
        },

        data: () => ({
            dialog: false,

            resolve: null,
            reject: null,
        }),

        computed: {},

        methods: {
            async onInit(promise) {
                try {
                    await promise

                    // successfully initialized
                } catch (error) {
                    this.$toast.error(error)
                }
            },

            async onDetect(promise) {
                try {
                    const {
                        imageData,    // raw image data of image/frame
                        content,      // decoded String
                        location      // QR code coordinates
                    } = await promise;


                    let parsed = JSON.parse(content);

                    console.log(parsed);

                    if (parsed.client_id) {
                        this.$router.push({name: 'clients-id', params: {id: parsed.client_id}});
                        this.close();
                    } else {
                        this.$toast.warn('Неизвестный формат')
                    }
                } catch (error) {
                    this.$toast.warn('Неизвестный формат')
                }
            },

            open() {
                this.dialog = true;
            },

            close() {
                this.dialog = false;
            }
        }
    }
</script>

<style scoped>

</style>
