<template>
  <span class="occur-label">{{ type }} at {{ time }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TimeContainer extends Vue {
  @Prop({ default: "Occurred" }) private type?: string;
  @Prop({ default: "" }) private time!: string;
}
</script>

<style lang="scss">
.occur-label {
  width: fit-content;
  font-size: 16px;
  position: relative;
  left: 175px;
  top: 5px;
}
</style>
