<template>
  <div class="quotes">
    <div class="title">
      <h2>{{ category }}</h2>
      <span><a @click="clearCategory" href="#" class="btn btn-primary btn-xs">Back</a></span>
    </div>
    <div class="description">
      <p>Check out the latest quotes and sayings added to the quote library.</p>
    </div>
    <div class="quote-list">
      <div v-for="quotes in quoteList" class="quote">
        <p>{{ quotes.quote }}</p>
        <p class="author">Some Author</p>
        <div class="actions">
          <a href="#" class="btn btn-warning btn-xs">Add to collection</a>
          <a href="#" class="btn btn-warning btn-xs">Edit</a>
          <span>Favorited count</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const quoteList = [{
    quote: 'Quote example Uno Quote example Uno Quote example Uno Quote example Uno Quote example Uno',
    author: 'Someone Somebody'
  }, {
    quote: 'Quote example Uno Quote example Uno Quote example Uno Quote example Uno Quote example Uno',
    author: 'Someone Somebody'
  }, {
    quote: 'Quote example Uno Quote example Uno Quote example Uno Quote example Uno Quote example Uno',
    author: 'Someone Somebody'
  }];

  export default {
    props: [
      'category'
    ],
    data() {
      return {
        categoryName: 'Inspirational quotes',
        quoteList
      };
    },
    methods: {
      clearCategory() {
        this.$emit('clearCategory');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .quote-list {
    margin-bottom: 20px;
    background: #477b9c;

    .quote {
      margin-bottom: 5px;
      background: white;
    }
  }
  .actions {
    padding: 10px;

    span {
      float:right;
    }
  }
</style>
