export default {
    computed: {

        user() {
            return this.$store.getters['users/byId']({id: this.issue.user_id});
        },

        hall() {
            return this.$store.getters['halls/byId']({id: this.issue.hall_id});
        },

        updatedDay() {
            let date = this.$moment.utc(this.issue.updated_at).local();
            let now = this.$moment().local();
            if (Math.abs(date.diff(now, 'days')) < 2) {
                if (date.dayOfYear() == now.dayOfYear()) {
                    return 'Сегодня'
                } else if (date.dayOfYear() == now.dayOfYear() - 1) {
                    return 'Вчера'
                }
            }
            return date.format('DD MMM')
        },
        updatedTime() {
            return this.$moment.utc(this.issue.updated_at).local().format('HH:mm')
        },

    },
}
