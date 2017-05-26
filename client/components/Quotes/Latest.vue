<template>
  <div class="latest-quotes">
    <div class="title">
      <h2>Latest quotes</h2>
      <div class="description">
        <p>Check out the latest quotes and sayings added to the quote library.</p>
      </div>
    </div>
    <div class="quote">
      <p>{{ quote }}</p>
      <p class="author">--- {{ author }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        quote: 'This is a quote that has been lately added.',
        author: 'Somebody Someone'
      };
    }
  };
</script>

<style lang="scss" scoped>
  .latest-quotes {
    p {
      font-size: 14px;
      font-style: italic;
    }
    .author {
      font-size: 12px;
      text-indent: 10px;
    }
  }
</style>
