<template>
  <div class="quote-collections">
    <h3>My Quote Collection List</h3>
    <div class="list-group table-of-contents" v-for="collection in collections">
      <a class="list-group-item" href="#">{{ collection.title }}</a>
    </div>
  </div>
</template>

<script>
  const collections = [{
    title: 'My Collection1'
  }, {
    title: 'My Collection2'
  }, {
    title: 'My Collection3'
  }, {
    title: 'My Collection1 My Collection1 My Collection1'
  }, {
    title: 'My Collection1 My Collection1 My Collection1'
  }];

  export default {
    data() {
      return {
        collections
      };
    }
  };
</script>

<style lang="scss" scoped>
  .quote-collections {
    margin-bottom: 20px;
    margin-top: 25px;

    .list-group {
      margin-bottom: 0;
    }
  }

</style>
