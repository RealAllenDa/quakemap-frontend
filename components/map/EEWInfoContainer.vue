<template>
  <div class="window eew-display">
    <EEWFlag :display="eewIsDrill"
             class="drill-flag"
             message="Drill - Not Real Situation"></EEWFlag>
    <EEWFlag :display="eewIsExpected"
             class="expected-flag"
             message="Expected Intensity"></EEWFlag>
    <EEWBanner class="sub-window"></EEWBanner>
    <EEWInfo></EEWInfo>
    <div class="eew-earthquake sub-window">
      <IntensityIcon
        :is-eew="true">
      </IntensityIcon>
      <EarthquakeInformation
        :is-eew="true"
      ></EarthquakeInformation>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EEWFlag from "~/components/map/EEWFlag.vue";
import EarthquakeInformation from "~/components/map/EarthquakeInformation.vue";
import IntensityIcon from "~/components/map/IntensityIcon.vue";
import EEWBanner from "~/components/map/EEWBanner.vue";
import EEWInfo from "~/components/map/EEWInfo.vue";
import { EEWInfoStore } from "~/store";

@Component({
  components: {
    EEWFlag,
    EEWBanner,
    EEWInfo,
    IntensityIcon,
    EarthquakeInformation
  }
})
export default class EEWInfoContainer extends Vue {
  public get eewIsDrill() {
    return EEWInfoStore?.getEEWIsDrill === undefined
      ? false
      : EEWInfoStore.getEEWIsDrill;
  }

  public get eewIsExpected() {
    return EEWInfoStore?.getEEWIsExpected === undefined
      ? false
      : EEWInfoStore.getEEWIsExpected;
  }
}
</script>

<style lang="scss" scoped>
.eew-display {
  grid-template-rows:
    [eewtype] 45px
    [eewadvice] 40px
    [eewinfo] 140px;
}

.drill-flag {
  z-index: 10000;
  background: $intensity-3;
  color: black;
  left: 490px;
}

.expected-flag {
  z-index: 9999;
  background: rgb(195, 120, 7);
}

.eew-earthquake {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.eew-earthquake-info {
  width: 475px;
  height: 100%;
  border: 4px solid $border-color;
  background: $info-background-color;

  div {
    display: flex;
    margin-top: 5px;
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>
