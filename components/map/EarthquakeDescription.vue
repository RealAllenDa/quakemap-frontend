<template>
  <div>
    <span class="label">{{ name }}</span>
    <span class="label-content">{{ value }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class EarthquakeDescription extends Vue {
  @Prop({ default: "" }) private name!: string;
  @Prop({ default: "" }) private value!: string;
}
</script>

<style scoped>
div {
  align-items: center;
  display: flex;
  margin-top: 5px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
