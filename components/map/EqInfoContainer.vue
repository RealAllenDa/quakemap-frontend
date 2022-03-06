<template>
  <div class="intensity-display window">
    <EarthquakeDescriptionContainer></EarthquakeDescriptionContainer>
    <Banner type="domestic"></Banner>
    <Banner type="foreign"></Banner>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Banner from "~/components/map/TsunamiBanner.vue";
import EarthquakeDescriptionContainer from "~/components/map/EarthquakeDescriptionContainer.vue";

@Component({
  components: {
    EarthquakeDescriptionContainer,
    Banner
  }
})
export default class EqInfoContainer extends Vue {
}
</script>

<style lang="scss" scoped>
.intensity-display {
  grid-template-rows:
    [eqinfo] 140px
    [infobanner] 45px;
}
</style>
