<template>
  <div id="main-container">
    <EqInfoContainer
      v-if="!showEew"></EqInfoContainer>
    <QuakeMap
      v-if="mapReady"
      ref="quakeMap"></QuakeMap>
    <EEWInfoContainer
      v-if="showEew"></EEWInfoContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IQuakeInfo } from "@/assets/interfaces/parsing/QuakeInfo";
import { IInfo } from "@/assets/interfaces/api/QuakeInfo";
import hnapi from "@/assets/hnapi";
import isEqual from "@/assets/lodash/isEqual";
import { IEEW } from "~/assets/interfaces/parsing/EEW";
import QuakeMap from "~/components/map/QuakeMap.vue";
import EqInfoContainer from "~/components/map/EqInfoContainer.vue";
import EEWInfoContainer from "~/components/map/EEWInfoContainer.vue";
import { EEWInfoStore, EqInfoStore } from "~/store";

@Component({
  components: {
    EEWInfoContainer,
    EqInfoContainer,
    QuakeMap
  }
})
export default class Map extends Vue {
  $refs!: {
    quakeMap: QuakeMap
  };

  private updateTimer: null | ReturnType<typeof setInterval> = null;
  private updateInterval = 2500;

  private lastInfo?: object;
  private mapReady = false;

  private showEew = false;
  private eewInEffect = false;
  private messagesBeforeEew?: IQuakeInfo[];
  private lastEewReportNum = "-1";
  private suspendEewUntilNumberChange = false;

  public async mounted(): Promise<void> {
    await hnapi.initialize({
      japan: true,
      countries: true,
      japanWithSubAreas: true
    }).then(() => {
      this.$nextTick(() => {
        this.updateTimer = setInterval(this.updateInfo, this.updateInterval);
      });
    });
  }

  private updateInfo(): void {
    this.mapReady = true;
    hnapi.makeApiRequest("/api/earthquake_info", this.updateInterval)
      .then((result: IInfo) => {
        hnapi.debug(result);
        if (isEqual(this.lastInfo, result)) {
          hnapi.debug("Identical information. Skipping.");
          return;
        } else {
          hnapi.debug("Updated information. Parsing.");
          this.lastInfo = result;
        }
        if (result.eew.status === 0) {
          hnapi.debug("EEW Received. Parsing...");
          if (!this.eewInEffect) {
            hnapi.debug("EEW first received.");
            this.messagesBeforeEew = result.info;
            this.eewInEffect = true;
            this.lastEewReportNum = "-1";
          }
          if (parseInt(result.eew.report_num) > parseInt(this.lastEewReportNum)) {
            hnapi.debug("EEW updated (num != last_num). Displaying.");
            this.lastEewReportNum = result.eew.report_num;
            this.suspendEewUntilNumberChange = false;
            this.parseEEWInformation(result, false);
          } else if (!isEqual(result.info, this.messagesBeforeEew)) {
            hnapi.debug("Earthquake info updated. " +
              "Displaying new earthquake info.");
            this.messagesBeforeEew = result.info;
            this.suspendEewUntilNumberChange = true;
            this.parseEarthquakeInformation(result);
          } else if (!this.suspendEewUntilNumberChange) {
            hnapi.debug("Parameters updated. Displaying EEW.");
            this.parseEEWInformation(result, true);
          }
        } else {
          this.eewInEffect = false;
          this.parseEarthquakeInformation(result);
        }
      });
  }

  private parseEarthquakeInformation(result: IInfo) {
    this.showEew = false;
    result.info.forEach((content) => {
      EqInfoStore.setCurrentInfoType(content.type);
      if (parseInt(content.max_intensity) === 99999) {
        content.max_intensity = "-1";
      }
      if (content.type === "ScalePrompt") {
        EqInfoStore.setMaxIntensity(content.max_intensity);
        EqInfoStore.setOccurTime(content.occur_time);
        this.$refs.quakeMap.deleteAllLayers();
        this.$nextTick(() => {
          this.$refs.quakeMap.addMapIntensities(
            content.area_intensity.areas
          );
          this.$refs.quakeMap.addMapColoring(
            content.area_intensity.areas
          );
          this.setBannerContent(content);
          this.$refs.quakeMap.parseMapScale();
        });
      } else if (content.type === "Destination") {
        this.setEarthquakeInformationDisplay(content);
        this.$refs.quakeMap.addEpicenter(content.hypocenter);
        this.$refs.quakeMap.parseMapScale();
      } else if (content.type === "ScaleAndDestination") {
        EqInfoStore.setMaxIntensity(content.max_intensity);
        EqInfoStore.setHypocenter(content.hypocenter);
        this.setEarthquakeInformationDisplay(content);
        this.$refs.quakeMap.deleteAllLayers();
        this.$nextTick(() => {
          this.$refs.quakeMap.addEpicenter(content.hypocenter);
          this.$refs.quakeMap.addMapIntensities(
            content.area_intensity.areas
          );
          this.$refs.quakeMap.addMapColoring(
            content.area_intensity.areas
          );
          this.$refs.quakeMap.parseMapScale();
        });
      } else if (content.type === "DetailScale") {
        this.setEarthquakeInformationDisplay(content);
        EqInfoStore.setMaxIntensity(content.max_intensity);
        this.$refs.quakeMap.deleteAllLayers();
        this.$nextTick(() => {
          this.$refs.quakeMap.addMapIntensities(
            content.area_intensity.station
          );
          this.$refs.quakeMap.addEpicenter(content.hypocenter);
          this.$refs.quakeMap.parseMapScale();
        });
      } else if (content.type === "Foreign") {
        this.setEarthquakeInformationDisplay(content);
        EqInfoStore.setMaxIntensity(content.max_intensity);
        this.$refs.quakeMap.deleteAllLayers();
        this.$nextTick(() => {
          this.$refs.quakeMap.addEpicenter(content.hypocenter);
          this.$refs.quakeMap.setForeignEarthquake();
        });
      }
    });
  }

  private setBannerContent(content: IQuakeInfo) {
    EqInfoStore.setDomesticTsunamiComment(content.tsunami_comments.domestic);
    EqInfoStore.setForeignTsunamiComment(content.tsunami_comments.foreign);
  }

  private setEarthquakeInformationDisplay(
    content: IQuakeInfo
  ) {
    EqInfoStore.setMagnitude(content.magnitude);
    EqInfoStore.setHypocenter(content.hypocenter);
    EqInfoStore.setOccurTime(content.occur_time);
    this.setBannerContent(content);
  }

  private setEEWEqInformationDisplay(
    content: IEEW
  ) {
    EEWInfoStore.setEEWReceiveTime(content.report_time);
    EqInfoStore.setMagnitude(content.magnitude);
    EqInfoStore.setHypocenter(content.hypocenter);
  }

  private parseEEWInformation(result: IInfo, mapUpdateOnly = false) {
    this.showEew = true;
    if (result.eew.is_cancel) {
      this.showEew = false;
      EqInfoStore.setDomesticTsunamiComment("EEWCancelled");
      EEWInfoStore.setEEWDrill(false);
      EEWInfoStore.setEEWExpected(false);
      this.$refs.quakeMap.deleteAllLayers();
      return;
    }
    if (!mapUpdateOnly) {
      this.setEEWEqInformationDisplay(result.eew);
      EqInfoStore.setMaxIntensity(result.eew.max_intensity);
      if (result.eew.is_final) {
        EEWInfoStore.setEEWReportNum(`#${result.eew.report_num}-F`);
      } else {
        EEWInfoStore.setEEWReportNum(`#${result.eew.report_num}`);
      }
      if (result.eew.is_plum) {
        EEWInfoStore.setEEWType("PLUM");
      } else if (result.eew.report_flag === 0) {
        EEWInfoStore.setEEWType("Forecast");
      } else if (result.eew.report_flag === 1) {
        EEWInfoStore.setEEWType("Warning");
      }
      if (result.eew.max_intensity === "0" || result.eew.is_plum) {
        EEWInfoStore.setEEWAdvice("Wait");
      } else if (parseInt(result.eew.hypocenter.depth.slice(0, -2)) >= 100) {
        EEWInfoStore.setEEWAdvice("Deep");
      } else if (parseFloat(result.eew.magnitude) >= 6.0) {
        EEWInfoStore.setEEWAdvice("StayAway");
      } else {
        EEWInfoStore.setEEWAdvice("PayAttention");
      }
      EEWInfoStore.setEEWDrill(result.eew.is_test);
    }
    this.$refs.quakeMap.deleteAllLayers();
    this.$nextTick(() => {
      this.$refs.quakeMap.addEpicenter(result.eew.hypocenter);
      if (result.eew.area_coloring.recommended_areas) {
        if (!isEqual({}, result.eew.area_coloring.areas)) {
          this.$refs.quakeMap.addMapIntensities(
            result.eew.area_coloring.areas
          );
          this.$refs.quakeMap.addMapColoring(
            result.eew.area_coloring.areas
          );
        } else {
          hnapi.warn("Areas equals null. Check server status.");
        }
      } else if (result.eew.area_intensity !== {}) {
        this.$refs.quakeMap.addMapIntensities(
          result.eew.area_intensity
        );
      } else {
        hnapi.warn("No points exist. Check server status.");
      }
      this.$refs.quakeMap.parseMapScale();
    });

    EEWInfoStore.setEEWExpected(true);

    if (result.eew.s_wave !== null) {
      this.$refs.quakeMap.addWaveCircle(
        result.eew.hypocenter,
        result.eew.s_wave,
        "s"
      );
    } else {
      hnapi.warn("S wave time equals null. Check server status.");
    }
    if (result.eew.p_wave !== null) {
      this.$refs.quakeMap.addWaveCircle(
        result.eew.hypocenter,
        result.eew.p_wave,
        "p"
      );
    } else {
      hnapi.warn("P wave time equals null. Check server status.");
    }
  }
}
</script>

<style lang="scss">
#main-container {
  width: 750px;
  height: 675px;
}

.window {
  width: 100%;
  height: 185px;
  display: grid;
  box-sizing: border-box;
}

.sub-window {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.label {
  display: inline-block;
  font-size: 20px;
  width: 100px;
  margin-left: 10px;
}

.label-content {
  font-size: 23px;
  font-weight: bold;
  margin-left: 23px;
}
</style>
