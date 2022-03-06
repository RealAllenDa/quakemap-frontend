<template>
  <div>
    <span>{{ description }}</span>
    <span>{{ pointsCount }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DetailPoints extends Vue {
  @Prop({ default: "" }) private description!: string;
  @Prop({ default: "" }) private pointsCount!: string;
}
</script>
