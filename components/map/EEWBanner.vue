<template>
  <div :class="eewType.className" class="eew-banner">
    <span>{{ eewType.text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EEWInfoStore } from "~/store";
import { IBannerType } from "~/assets/interfaces/parsing/Banner";

@Component
export default class EEWBanner extends Vue {
  public get eewType(): IBannerType {
    return EEWInfoStore!.getEEWType;
  }
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
