<template>
  <div :class="text.className" class="eew-banner">
    <span>{{ text.text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IBannerType } from "~/assets/interfaces/parsing/Banner";

@Component
export default class EEWBanner extends Vue {
  @Prop({ default: "" }) private text!: IBannerType;
}
</script>

<style lang="scss">
.eew-banner {
  background: $info-background-color;
  border: 4px solid $border-color;
  font-size: 20px;
  text-align: center;
  overflow: hidden;
  line-height: 40px;
  font-weight: bolder;
}

.deep-earthquake {
  background: #C37807;
}
</style>
