<template>
  <div class="proposed-quotes">
    <h2>Quote vote</h2>
    <div class="description">
      <p>Vote for the quote you wish to see published! These quotes can be proposed by you or your friends!</p>
    </div>
    <blockquote>
      <span class="glyphicon glyphicon-chevron-left"></span>
      <span class="glyphicon glyphicon-chevron-right"></span>
      <p>{{ quote }}</p>
      <small>{{ author }}</small>
    </blockquote>
    <div class="vote">
      <a href="#" class="btn btn-success btn-sm">Great!</a>
      <a href="#" class="btn btn-primary btn-sm">Naah!</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        quote: 'Please vote yes so this quote gets published.',
        author: 'Somebody Someone'
      };
    }
  };
</script>

<style lang="scss" scoped>
  .proposed-quotes {
    padding-bottom: 30px;
    border-bottom: 1px solid black;
  }
  .vote {
    text-align: center;
  }
  .proposed-quotes {
    blockquote {
      border-left: 5px solid orange;
    }
  }
</style>
