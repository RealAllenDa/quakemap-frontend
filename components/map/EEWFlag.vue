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

<style lang="scss">
.flags {
  padding: 5px;
  font-weight: bolder;
  font-size: 20px;
  border: 2px solid $intensity-1;
  position: absolute;
  top: 20px;
  left: 10px;
  text-align: center;
}
</style>
