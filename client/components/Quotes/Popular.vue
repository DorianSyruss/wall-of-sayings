<template>
  <div class="popular-quotes">
    <div class="title">
      <h2>Most popular quotes</h2>
    </div>
    <div class="description">
      <p>Check out most frequently saved quotes to collections.</p>
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
          quote: 'This is a quote that has been saved to user collections a lot of times.',
          author: 'Somebody Someone'
        }]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .popular-quotes {

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
