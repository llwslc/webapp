<style scoped>

</style>

<template>
  <div>
    <hello-page></hello-page>
  </div>
</template>

<script>
  import HelloPage from './pages/helloPage.vue';

  import Vue from 'vue';
  import Store from '../vuex/store';

  export default {
    components: {
      HelloPage,
    },

    beforeCreate() {

      global.Hello = require('../services/helloJs');

      global.Vue = Vue;
      global.Store = Store;
    },

    name: 'MainPage',
  };
</script>
