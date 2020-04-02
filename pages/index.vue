<template>
  <div>
    <h1 class="head text-center pt-2">
      nuxt starter
    </h1>
    <List />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.head {
  @include transition(color 0.3s);
  &:hover {
    color: wheat;
  }
}
</style>
