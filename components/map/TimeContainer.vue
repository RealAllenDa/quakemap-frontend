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
