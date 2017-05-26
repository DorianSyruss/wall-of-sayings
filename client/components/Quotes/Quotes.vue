<template>
  <div class="quotes col-sm-12">
    <div class="row">
      <div class="title">
        <h2>{{ categoryName }}</h2>
        <blockquote>
          <p>this is some quote</p>
          <small>Some Author</small>
        </blockquote>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        categoryName: 'Inspirational quotes',
        quote: 'Quote example Uno',
        author: 'Someone Somebody'
      };
    }
  };
</script>

<style lang="scss" scoped>

</style>
