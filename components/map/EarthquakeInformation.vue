<template>
  <div :class="computedClass" class="earthquake-report sub-window">
    <TimeContainer
      :time="occurTime"
      :type="receiveOrOccur"></TimeContainer>
    <EarthquakeDescription
      :name="'Epicenter'"
      :value="hypocenterInfo.name" />
    <EarthquakeDescription
      :name="'Depth'"
      :value="hypocenterInfo.depth" />
    <EarthquakeDescription
      :name="'M'"
      :value="magnitude" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import EarthquakeDescription from "@/components/map/EarthquakeDescription.vue";
import TimeContainer from "~/components/map/TimeContainer.vue";
import { EEWInfoStore, EqInfoStore } from "~/store";
import { IHypocenter } from "~/assets/interfaces/parsing/QuakeInfo";

@Component({
  components: { TimeContainer, EarthquakeDescription }
})
export default class EarthquakeInformation extends Vue {
  @Prop({ default: false }) private isEew!: boolean;

  public get magnitude(): string {
    return EqInfoStore?.getMagnitude === undefined ?
      "---" :
      EqInfoStore!.getMagnitude;
  }

  public get hypocenterInfo(): IHypocenter {
    if (EqInfoStore?.getHypocenter === undefined) {
      return {
        name: '---',
        depth: '---',
        latitude: -999,
        longitude: -999,
      }
    } else {
      return EqInfoStore!.getHypocenter
    }
  }

  public get occurTime(): string {
    return this.isEew ?
      EEWInfoStore.getEEWReceiveTime :
      EqInfoStore.getOccurTime;
  }

  public get receiveOrOccur(): string {
    return this.isEew ? "Received" : "Occurred";
  }

  public get computedClass(): string {
    return this.isEew ?
      "eew-earthquake-info sub-window" :
      "earthquake-report sub-window";
  }
}
</script>

<style lang="scss">
.earthquake-report {
  display: flex;
  flex-direction: column;
}
</style>
