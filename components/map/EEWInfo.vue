<template>
  <div class="eew-information sub-window">
    <span class="report-number">{{ reportNumber }}</span>
    <span :class="advice.className" class="eew-advice">{{ advice.text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EEWInfoStore } from "~/store";
import { IBannerType } from "~/assets/interfaces/parsing/Banner";

@Component
export default class EEWInfo extends Vue {
  public get advice(): IBannerType {
    return EEWInfoStore!.getEEWAdvice;
  }

  public get reportNumber(): string {
    return EEWInfoStore?.getEEWReportNum === undefined
      ? "#--"
      : EEWInfoStore!.getEEWReportNum;
  }
}
</script>

<style lang="scss">
.eew-information {
  border: 4px solid $border-color;
  overflow: hidden;
  line-height: 36px;
  display: flex;
}

.report-number {
  width: 80px;
  height: 100%;
  background: $intensity-1;
  border-right: 4px solid $border-color;
  text-align: center;
  font-weight: bolder;
  font-size: 23px;
}

.eew-advice {
  width: 675px;
  height: 100%;
  background: $info-background-color;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>
