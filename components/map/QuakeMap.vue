<template>
  <l-map :center="mapCenter"
         :options="mapOptions"
         :zoom="mapZoom"
         class="map sub-window">
    <l-geo-json :geojson="geoJson.countries"
                :options-style="countriesBgStyle"
                attribution="Map: Natural Earth | Map Data: JMA"
                pane="tilePane"></l-geo-json>
    <l-geo-json :geojson="geoJson.japan"
                :options-style="japanBgStyle"
                pane="tilePane"></l-geo-json>
    <l-geo-json :geojson="geoJson.japan"
                :options-style="japanBorderStyle"
                pane="tilePane"></l-geo-json>
    <l-geo-json :geojson="geoJson.japanWithSubAreas"
                :options-style="japanAreaBorderStyle"
                pane="tilePane"></l-geo-json>
    <l-control-attribution
      position="bottomright"
      prefix="QuakeMap by AllenDa"
    ></l-control-attribution>
  </l-map>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGeoJsonData } from "~/assets/interfaces/parsing/GeoJson";
import { AllIntensities } from "~/assets/interfaces/parsing/Intensities";

@Component
export default class QuakeMap extends Vue {
  @Prop({ default: {} }) private geoJson?: IGeoJsonData;
  private mapCenter = [38.272688535980976, 137];
  private mapZoom = 5;
  private mapOptions = {
    attributionControl: false,
    zoomControl: false,
    zoomSnap: 0.01,
    zoomDelta: 0.5,
    maxZoom: 8,
    minZoom: 2
  };

  private countriesBgStyle = {
    stroke: true,
    fill: true,
    fillColor: "#3a3a3a",
    fillOpacity: 1,
    weight: 1,
    color: "#3a3a3a"
  };

  private japanBgStyle = {
    stroke: false,
    fill: true,
    fillColor: "#3a3a3a",
    fillOpacity: 1
  };

  private japanAreaBorderStyle = {
    stroke: true,
    fill: false,
    color: "#565656",
    weight: 0.5
  };

  private japanBorderStyle = {
    stroke: true,
    fill: false,
    color: "#838383",
    weight: 0.5
  };

  public addMapIntensities(intensity: AllIntensities[]): void {
    intensity.forEach(content => {

    });
  }
}
</script>

<style lang="scss" scoped>
$map-background-color: #1d1d1d;

.map {
  width: 100%;
  height: 450px;
  background: $map-background-color;
}
</style>
