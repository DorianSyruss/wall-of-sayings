<template>
  <div class="latest-quotes">
    <div class="title">
      <h2>Latest quotes</h2>
      <p class="descrioption">
        Check out the latest quotes and sayings added to the quote library.
      </p>
    </div>
    <div class="list-group">
      <a href="#" class="list-group-item">
        <h5 class="list-group-item-text">{{ quote }}</h5>
        <p class="list-group-item-heading">{{ author }}</p>
      </a>
      <a href="#" class="list-group-item">
        <h5 class="list-group-item-heading">{{ quote }}</h5>
        <p class="list-group-item-text">{{ author }}</p>
      </a>
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
    .list-group-item {
      p {
        font-size: 13px;
        font-style: italic;
      }
    }
  }

</style>
