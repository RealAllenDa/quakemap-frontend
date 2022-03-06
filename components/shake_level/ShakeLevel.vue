<template>
  <span class="bold">Lv. {{ shakeLevel }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ShakeLevelShow extends Vue {
  @Prop({ default: "" }) private shakeLevel!: string;
}
</script>
