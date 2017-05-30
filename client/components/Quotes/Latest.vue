<template>
  <div class="latest-quotes">
    <div class="title">
      <h2>Latest quotes</h2>
    </div>
      <div class="description">
        <p>Check out the latest quotes and sayings added to the quote library.</p>
      </div>
    <div class="quote-preview" v-for="quotes in quoteList">
      <p>{{ quotes.quote }}</p>
      <p class="author">--- {{ quotes.author }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        quoteList: [{
          quote: 'This is a quote that has been lately added.',
          author: 'Somebody Someone'
        }, {
          quote: 'This is a quote that has been lately added.',
          author: 'Somebody Someone'
        }]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .latest-quotes {
    margin-bottom: 20px;

    .description {
      margin-bottom: 0;
    }
    .title h2 {
      margin-top: 0;
      background: #18BC9C;
      padding: 5px;
      font-size: 24px;
    }
  }
</style>
