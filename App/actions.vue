<template>
  <section class="actions">
    <button type="button" id="undo" @click="$emit('undo')" :disabled="readings.length === 0">Undo</button>
    <button type="button" id="reset" @click="$emit('reset')" :disabled="readings.length === 0">Clear</button>

    <label for="debug">
      <input type="checkbox" id="debug" @change="$emit('debug', $event.target.checked)" />
      Debug
    </label>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      readings: Array
    }
  });
</script>

<style scoped>
  button {
    margin-bottom: 0.5rem;
  }
</style>