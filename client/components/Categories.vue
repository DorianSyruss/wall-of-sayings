<template>
    <div class="categories">
      <div class="content-title">
        <h2>Quotes and Sayings</h2>
      </div>
      <div class="description">
        <p>This is some description</p>
      </div>
      <div class="row">
        <div @click="selectCategory(category.title)" class="category col-md-10 col-lg-6" v-for="category in categories">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">{{ category.title }}</h3>
            </div>
            <div class="panel-body">
              {{ category.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  const categories = [{
    title: 'Inspirational',
    description: 'Discover things that inspire you'
  }, {
    title: 'Life',
    description: 'Discover things that inspire you'
  }, {
    title: 'Science',
    description: 'Discover things that inspire you'
  }, {
    title: 'Love',
    description: 'Discover things that inspire you'
  }, {
    title: 'Wise',
    description: 'Discover things that inspire you'
  }];

  export default {
    data() {
      return { categories };
    },
    methods: {
      selectCategory(category) {
        this.$emit('categorySelected', category);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .categories {
    margin-top: 15px;

    .panel-heading {
      background: #7ba3c1;
    }
  }

  .panel {
    border-radius: 0;
  }
</style>
