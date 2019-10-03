export default {
    computed: {
      groupsIds() {
        return this.client.groups.map(group => group.id);
      }
    }
}
