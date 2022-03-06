<template>
  <div class="earthquake-description">
    <IntensityIcon></IntensityIcon>
    <div class="earthquake-info sub-window">
      <IntensityReport
        v-if="currentType === 'ScalePrompt'"
      ></IntensityReport>
      <EarthquakeInformation
        v-else
        :is-eew="false"
      ></EarthquakeInformation>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IntensityReport from "~/components/map/IntensityReport.vue";
import EarthquakeInformation from "~/components/map/EarthquakeInformation.vue";
import IntensityIcon from "~/components/map/IntensityIcon.vue";
import { EqInfoStore } from "~/store";

@Component({
  components: {
    IntensityIcon,
    IntensityReport,
    EarthquakeInformation
  }
})
export default class EarthquakeDescriptionContainer extends Vue {
  public get currentType() {
    if (EqInfoStore?.getCurrentType === undefined) {
      return "Unknown";
    } else {
      return EqInfoStore!.getCurrentType;
    }
  }
}
</script>

<style lang="scss" scoped>
.earthquake-description {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.earthquake-info {
  width: 475px;
  height: 100%;
  border: 4px solid $border-color;
  background: $info-background-color;
}
</style>
