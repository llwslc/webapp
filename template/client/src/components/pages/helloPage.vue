<template>
  <div>
    <span>\{{ hello }}</span>
  </div>
</template>

<script>
  export default {

    computed: {
    },

    data() {
      return {
        hello: Hello.hello
      }
    },

    methods: {
    },

    updated() {
    },

    mounted() {
    },
  };
</script>

<style lang="scss">
  @import "../../assets/style/main-style";
</style>
