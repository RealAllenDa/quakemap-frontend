<template>
  <div v-if="display" class="flags">
    <span>{{ message }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class EEWFlag extends Vue {
  @Prop({ default: false }) private display!: boolean;
  @Prop({ default: "" }) private message!: string;
}
</script>
