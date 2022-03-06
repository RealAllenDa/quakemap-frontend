<template>
  <l-map ref="map"
         :center="mapCenter"
         :options="mapOptions"
         :zoom="mapZoom"
         class="map sub-window">
    <l-geo-json :geojson="geoJsonCountries"
                :options-style="countriesBgStyle"
                attribution="Map: Natural Earth | Map Data: JMA"
                pane="tilePane"></l-geo-json>
    <l-geo-json :geojson="geoJsonJapan"
                :options-style="japanBgStyle"
                pane="tilePane"></l-geo-json>
    <l-geo-json :geojson="geoJsonJapan"
                :options-style="japanBorderStyle"
                pane="tilePane"></l-geo-json>
    <l-geo-json :geojson="geoJsonJapanAreas"
                :options-style="japanAreaBorderStyle"
                pane="tilePane"></l-geo-json>
    <l-control-attribution
      position="bottomright"
      prefix="QuakeMap by AllenDa"
    ></l-control-attribution>
    <!-- Foundation end -->

    <l-feature-group v-if="stationIntensityReady"
                     ref="stationIntensities" :visible="stationIntensityReady">
      <l-marker v-for="(i, index) in stationIntensities"
                :key="index"
                :lat-lng="[i.latitude, i.longitude]"
                :z-index-offset="i.zIndex">
        <l-icon>
          <div v-if="!i.icon.addPlusOrMinus" :class="i.icon.iconClass">
            {{ i.icon.iconText }}
          </div>
          <div v-else :class="i.icon.iconClass">
            {{ i.icon.iconText }}
            <div v-if="i.icon.specialAdd"
                 class="special-intensity-add intensity-add-icon">
              {{ i.icon.addText }}
            </div>
            <div v-else
                 class="intensity-add-icon">
              {{ i.icon.addText }}
            </div>
          </div>
        </l-icon>
      </l-marker>
    </l-feature-group>
    <l-feature-group v-if="areaIntensityReady"
                     ref="areaIntensities"
                     :visible="areaIntensityReady">
      <l-marker v-for="(i, index) in areaIntensities"
                :key="index"
                :lat-lng="[i.latitude, i.longitude]"
                :z-index-offset="i.zIndex">
        <l-icon>
          <div v-if="!i.icon.addPlusOrMinus" :class="i.icon.iconClass">
            {{ i.icon.iconText }}
          </div>
          <div v-else :class="i.icon.iconClass">
            {{ i.icon.iconText }}
            <div class="intensity-add-icon">
              {{ i.icon.addText }}
            </div>
          </div>
        </l-icon>
      </l-marker>
    </l-feature-group>
    <l-marker
      v-if="epicenterReady"
      :lat-lng="[epicenter.latitude, epicenter.longitude]"
      :z-index-offset="5000000"
    >
      <l-icon
        :icon-size="[40, 40]"
      >
        <svg viewBox="0 0 100.73 101.16" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>.a {
              fill: #c31300;
              stroke: #efea3a;
              stroke-miterlimit: 10;
              stroke-width: 7px;
            }</style>
          </defs>
          <polygon class="a"
                   points="95.78 21.05 79.89 5.17 50.42 34.63 21.17 4.95 5.17 20.72 34.54 50.52 4.95 80.11 20.84 96 50.31 66.53 79.56 96.22 95.56 80.44 66.2 50.64 95.78 21.05" />
        </svg>
      </l-icon>
    </l-marker>
    <!-- Epicenter/Intensity Icons End -->

    <l-geo-json v-if="mapColoringReady"
                ref="mapColoring"
                :geojson="geoJsonJapanAreas"
                :options="{
                  filter: filterMapColoring
                }"
                :options-style="parseColorStyle"
                pane="tilePane"></l-geo-json>
    <!-- Intensity Coloring End -->

    <l-circle v-if="sWaveCircleReady"
              :color="sWaveCircleStyle.color"
              :fill-color="sWaveCircleStyle.fillColor"
              :fill-opacity="sWaveCircleStyle.fillOpacity"
              :lat-lng="sWaveCircleConfig.latLng"
              :opacity="sWaveCircleStyle.opacity"
              :radius="sWaveCircleConfig.distance"
              :weight="sWaveCircleStyle.weight"
              pane="popupPane"></l-circle>
    <l-circle v-if="pWaveCircleReady"
              :color="pWaveCircleStyle.color"
              :fill="pWaveCircleStyle.fill"
              :lat-lng="pWaveCircleConfig.latLng"
              :opacity="pWaveCircleStyle.opacity"
              :radius="pWaveCircleConfig.distance"
              :weight="pWaveCircleStyle.weight"
              pane="popupPane"></l-circle>
    <!-- P/S Wave End -->
  </l-map>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LFeatureGroup, LGeoJson, LMap } from "vue2-leaflet";
import { IAreaColor, IGeoJsonFeature } from "~/assets/interfaces/parsing/GeoJson";
import { IHypocenter } from "~/assets/interfaces/parsing/QuakeInfo";
import { AllAreaIntensities, AllStationIntensities, IMapIntensities } from "~/assets/interfaces/parsing/Intensities";
import { IWaveCircleConfig } from "~/assets/interfaces/parsing/MapIcon";
import { GeoJsonStore, IntensityConfigStore, MapConfigStore } from "~/store";
import hnapi from "~/assets/hnapi";

@Component
export default class QuakeMap extends Vue {
  public mapCenter = [38.272688535980976, 137];
  public mapZoom = 5;
  // Layers
  public areaIntensities: IMapIntensities[] = [];
  public areaIntensityReady = false;
  public stationIntensities: IMapIntensities[] = [];
  public stationIntensityReady = false;
  public epicenter?: IHypocenter;
  public epicenterReady = false;
  public mapColoringConfig?: IAreaColor;
  public mapColoringReady = false;
  public sWaveCircleReady = false;
  public sWaveCircleConfig?: IWaveCircleConfig;
  public pWaveCircleReady = false;
  public pWaveCircleConfig?: IWaveCircleConfig;
  $refs!: {
    map: LMap
    mapColoring: LGeoJson
    stationIntensities: LFeatureGroup
    areaIntensities: LFeatureGroup
  };

  public get geoJsonCountries() {
    return GeoJsonStore.countriesGeoJson;
  }

  public get geoJsonJapan() {
    return GeoJsonStore.japanGeoJson;
  }

  public get geoJsonJapanAreas() {
    return GeoJsonStore.japanWithSubAreasGeoJson;
  }

  public get mapOptions() {
    return MapConfigStore.mapConfig.mapOptions;
  }

  public get countriesBgStyle() {
    return MapConfigStore.mapConfig.countriesBgStyle;
  }

  public get japanBgStyle() {
    return MapConfigStore.mapConfig.japanBgStyle;
  }

  public get japanBorderStyle() {
    return MapConfigStore.mapConfig.japanBorderStyle;
  }

  public get japanAreaBorderStyle() {
    return MapConfigStore.mapConfig.japanAreaBorderStyle;
  }

  public get sWaveCircleStyle() {
    return MapConfigStore.mapConfig.sWaveCircleStyle;
  }

  public get pWaveCircleStyle() {
    return MapConfigStore.mapConfig.pWaveCircleStyle;
  }

  public deleteAllLayers(): void {
    this.areaIntensities = [];
    this.areaIntensityReady = false;
    this.stationIntensities = [];
    this.stationIntensityReady = false;
    this.epicenter = undefined;
    this.epicenterReady = false;
    this.mapColoringConfig = undefined;
    this.mapColoringReady = false;
    this.sWaveCircleConfig = undefined;
    this.sWaveCircleReady = false;
    this.pWaveCircleConfig = undefined;
    this.pWaveCircleReady = false;
  }

  public addMapIntensities(intensity:
                             AllStationIntensities |
                             AllAreaIntensities): void {
    for (const i in intensity) {
      const content = intensity[i];
      const intensityConverted =
        IntensityConfigStore.intensityConversion[content.intensity];
      if (content.is_area) {
        this.areaIntensities.push({
          longitude: content.longitude,
          latitude: content.latitude,
          zIndex: intensityConverted.zIndex,
          icon: {
            iconClass: [`intensity-big`,
              `intensity-${intensityConverted.class}`],
            iconText: intensityConverted.text,
            addPlusOrMinus: intensityConverted.isAddOrMinus,
            addText: intensityConverted.addText
          }
        });
        this.areaIntensityReady = true;
      } else {
        this.stationIntensities.push({
          longitude: content.longitude,
          latitude: content.latitude,
          zIndex: intensityConverted.zIndex,
          icon: {
            iconClass: [`intensity-small`,
              `intensity-${intensityConverted.class}`],
            iconText: intensityConverted.text,
            addPlusOrMinus: intensityConverted.isAddOrMinus,
            addText: intensityConverted.addText
          }
        });
        this.stationIntensityReady = true;
      }
    }
  }

  public addEpicenter(epicenter: IHypocenter): void {
    this.epicenter = epicenter;
    this.epicenterReady = true;
  }

  public addMapColoring(intensity: AllAreaIntensities): void {
    this.mapColoringConfig = this.areaIntensityToColor(intensity);
    this.mapColoringReady = true;
  }

  public setForeignEarthquake(): void {
    this.mapZoom = 2;
    this.mapCenter = [
      this.epicenter!.latitude,
      this.epicenter!.longitude
    ];
  }

  public addWaveCircle(epicenter: IHypocenter,
                       waveDistance: number,
                       type: string): void {
    if (type === "s") {
      this.sWaveCircleConfig = {
        latLng: [epicenter.latitude, epicenter.longitude],
        distance: waveDistance * 1000
      };
      this.sWaveCircleReady = true;
    } else if (type === "p") {
      this.pWaveCircleConfig = {
        latLng: [epicenter.latitude, epicenter.longitude],
        distance: waveDistance * 1000
      };
      this.pWaveCircleReady = true;
    } else {
      throw new Error("Exhaustive wave circle handling");
    }
  }

  public parseColorStyle(feature: IGeoJsonFeature): any {
    return {
      fillColor: this.mapColoringConfig?.colors[feature.properties.name],
      fillOpacity: 1.0,
      stroke: true,
      color: "#000000",
      weight: 2
    };
  }

  public parseMapScale(): void {
    this.$nextTick(() => {
      const currentBounds = this.$L.latLngBounds([]);
      if (this.areaIntensityReady) {
        currentBounds.extend(this.$refs.areaIntensities.mapObject.getBounds());
      }
      if (this.stationIntensityReady) {
        currentBounds.extend(this.$refs.stationIntensities.mapObject.getBounds());
      }
      if (this.epicenterReady) {
        currentBounds.extend([this.epicenter!.latitude,
          this.epicenter!.longitude]);
      }
      if (this.mapColoringReady) {
        currentBounds.extend(this.$refs.mapColoring.mapObject.getBounds());
      }
      hnapi.debug(currentBounds);
      this.$refs.map.mapObject.fitBounds(currentBounds, {
        padding: [0, 30]
      });
    });
  }

  private areaIntensityToColor(
    intensity: AllAreaIntensities
  ): IAreaColor {
    const areaColoring: IAreaColor = {
      colors: {},
      areas: []
    };
    for (const i in intensity) {
      areaColoring.colors[i] =
        IntensityConfigStore.intensityColors[intensity[i].intensity];
      areaColoring.areas.push(i);
    }
    return areaColoring;
  }

  private filterMapColoring(feature: IGeoJsonFeature): boolean {
    return this.mapColoringConfig?.areas.indexOf(feature.properties.name) !== -1;
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

.intensity-add-icon {
  align-self: flex-end;
  font-size: 13px !important;
  position: initial !important;
}

.intensity-big {
  width: 25px !important;
  height: 25px !important;
  display: flex !important;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 19px !important;
  font-family: "B612", sans-serif;
  justify-content: center;
  line-height: 29px;
}

.intensity-small {
  width: 20px !important;
  height: 20px !important;
  display: flex !important;
  box-sizing: border-box;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px !important;
  font-family: "B612", sans-serif;
  justify-content: center;
  line-height: 24px;
}

.intensity-add {
  align-self: flex-end;
  font-size: 13px;
}

.special-intensity-add {
  font-size: 12px;
}

</style>
