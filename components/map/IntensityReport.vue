<template>
  <div class="sub-window intensity-report">
    <span class="intensity-report-label">Intensity Report</span>
    <span class="occur-label">Occurred at {{ occurTime }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EqInfoStore } from "~/store";

@Component
export default class IntensityReport extends Vue {
  public get occurTime() {
    return EqInfoStore?.getOccurTime === undefined
      ? "XXXX/XX/XX XX:XX"
      : EqInfoStore!.getOccurTime
  }
}
</script>

<style lang="scss">
.intensity-report-label {
  font-size: 42px;
  font-weight: bold;
  position: relative;
  top: 25px;
  left: 75px;
}

.intensity-report {
  .occur-label {
    font-size: 20px;
    display: inline-block;
    left: 110px;
    top: 33px;
  }
}
</style>
