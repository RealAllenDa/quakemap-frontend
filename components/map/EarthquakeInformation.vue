<template>
  <div :class="computedClass" class="earthquake-report sub-window">
    <TimeContainer
      :time="time"
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
import { IHypocenter } from "@/assets/interfaces/parsing/QuakeInfo";
import TimeContainer from "~/components/map/TimeContainer.vue";

@Component({
  components: { TimeContainer, EarthquakeDescription }
})
export default class EarthquakeInformation extends Vue {
  @Prop({ default: false }) private isEew!: string;
  @Prop({ default: "XXXX/XX/XX XX:XX" }) private time!: string;
  @Prop() private hypocenterInfo!: IHypocenter;
  @Prop() private magnitude!: string;

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
