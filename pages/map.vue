<template>
  <div id='main-container'>
    <div v-if='!showEew' id='intensity-display' class='window'>
      <div id='earthquake-description'>
        <IntensityIcon :intensity='maximumIntensity'></IntensityIcon>
        <div id='earthquake-info' class='sub-window'>
          <IntensityReport
            v-if="currentType === 'ScalePrompt'"
            :occur-time='occurTime'
          ></IntensityReport>
          <EarthquakeInformation
            v-else
            :hypocenter-info='hypocenterInfo'
            :is-eew='false'
            :magnitude='magnitude'
            :time='occurTime'
          ></EarthquakeInformation>
        </div>
      </div>
      <Banner :text='tsunamiCommentsDomestic' type='domestic'></Banner>
      <Banner :text='tsunamiCommentsForeign' type='foreign'></Banner>
    </div>
    <QuakeMap v-if='mapReady' ref='quakeMap' :geo-json='geoJson'></QuakeMap>
    <div v-if='showEew' id='eew-display' class='window'>
      <EEWFlag id='drill-flag'
               :display='eewIsDrill'
               message='Drill - Not Real Situation'></EEWFlag>
      <EEWFlag id='expected-flag'
               :display='eewIsExpected'
               message='Expected Intensity'></EEWFlag>
      <EEWBanner :text='eewType' class='sub-window'></EEWBanner>
      <EEWInfo :advice='eewAdvice'
               :report-number='eewReportNum'></EEWInfo>
      <div class='eew-earthquake sub-window'>
        <IntensityIcon
          :intensity='maximumIntensity'
          :is-eew='true'>
        </IntensityIcon>
        <EarthquakeInformation
          :hypocenter-info='hypocenterInfo'
          :is-eew='true'
          :magnitude='magnitude'
          :time='eewReceiveTime'
        ></EarthquakeInformation>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { IHypocenter, IQuakeInfo } from '@/assets/interfaces/parsing/QuakeInfo'
import { IInfo } from '@/assets/interfaces/api/QuakeInfo'
import hnapi from '@/assets/hnapi'
import EarthquakeDescription from '@/components/map/EarthquakeDescription.vue'
import IntensityIcon from '@/components/map/IntensityIcon.vue'
import Banner from '~/components/map/TsunamiBanner.vue'
import IntensityReport from '@/components/map/IntensityReport.vue'
import EarthquakeInformation from '@/components/map/EarthquakeInformation.vue'
import isEqual from '@/assets/lodash/isEqual'
import { IEEW } from '~/assets/interfaces/parsing/EEW'
import EEWFlag from '~/components/map/EEWFlag.vue'
import EEWBanner from '~/components/map/EEWBanner.vue'
import EEWInfo from '~/components/map/EEWInfo.vue'
import { IBannerType } from '~/assets/interfaces/parsing/Banner'
import QuakeMap from '~/components/map/QuakeMap.vue'
import { IGeoJsonData } from '~/assets/interfaces/parsing/GeoJson'

@Component({
  components: {
    EEWInfo,
    EEWBanner,
    EEWFlag,
    EarthquakeInformation,
    IntensityReport,
    Banner,
    IntensityIcon,
    EarthquakeDescription,
    QuakeMap
  }
})
export default class Map extends Vue {
  $refs!: {
    quakeMap: QuakeMap
  }

  private updateTimer: null | ReturnType<typeof setInterval> = null
  private updateInterval = 2500
  private geoJson?: IGeoJsonData
  private mapReady = false
  private hypocenterInfo: IHypocenter = {
    name: '---',
    depth: '---',
    latitude: -999,
    longitude: -999
  }

  private maximumIntensity = '--'
  private occurTime = 'XXXX/XX/XX XX:XX'
  private magnitude = '---'
  private currentType = 'Unknown'
  private tsunamiCommentsDomestic = 'Fetching'
  private tsunamiCommentsForeign = 'Fetching'
  private showEew = false
  private eewInEffect = false
  private messagesBeforeEew?: IQuakeInfo[]
  private lastEewReportNum = -1
  private suspendEewUntilNumberChange = false
  private eewReceiveTime = 'XXXX/XX/XX XX:XX'
  private eewReportNum = ''
  private eewIsDrill = false
  private eewIsExpected = false
  private eewType: IBannerType = {
    text: 'Fetching information...',
    className: 'info-background'
  }

  private eewAdvice: IBannerType = {
    text: 'Fetching information...',
    className: 'info-background'
  }

  public async mounted(): Promise<void> {
    await hnapi.initialize({
      japan: true,
      countries: true,
      japanWithSubAreas: true
    }).then(() => {
      this.geoJson = hnapi.geoJson
      this.mapReady = true
      this.$nextTick(() => {
        this.updateTimer = setInterval(this.updateInfo, this.updateInterval)
      })
    })
  }

  private updateInfo(): void {
    hnapi.makeApiRequest('/api/earthquake_info', this.updateInterval)
      .then((result: IInfo) => {
        console.log(result)
        if (result.eew.status === 0) {
          console.log('EEW Received. Parsing...')
          if (!this.eewInEffect) {
            console.log('EEW first received.')
            this.messagesBeforeEew = result.info
            this.eewInEffect = true
            this.lastEewReportNum = -1
          }
          if (parseInt(result.eew.report_num) > parseInt(this.lastEewReportNum)) {
            console.log('EEW updated (num != last_num). Displaying.')
            this.lastEewReportNum = result.eew.report_num
            this.suspendEewUntilNumberChange = false
            this.parseEEWInformation(result, false)
          } else if (!isEqual(result.info, this.messagesBeforeEew)) {
            console.log('Earthquake info updated. ' +
              'Displaying new earthquake info.')
            this.messagesBeforeEew = result.info
            this.suspendEewUntilNumberChange = true
            this.parseEarthquakeInformation(result)
          } else if (!this.suspendEewUntilNumberChange) {
            console.log('Parameters updated. Displaying EEW.')
            this.parseEEWInformation(result, true)
          }
          console.log(this.eewInEffect, this.lastEewReportNum, result.eew.report_num, this.suspendEewUntilNumberChange)
        } else {
          this.eewInEffect = false
          this.parseEarthquakeInformation(result)
        }
      })
  }

  private parseEarthquakeInformation(result: IInfo) {
    this.showEew = false
    result.info.forEach((content) => {
      this.currentType = content.type
      if (parseInt(this.maximumIntensity) === 99999) {
        content.max_intensity = '-1'
      }
      if (this.currentType === 'ScalePrompt') {
        this.maximumIntensity = content.max_intensity
        this.occurTime = content.occur_time
        this.$refs.quakeMap.deleteAllLayers()
        this.$nextTick(() => {
          this.$refs.quakeMap.addMapIntensities(
            content.area_intensity.areas
          )
          this.$refs.quakeMap.addMapColoring(
            content.area_intensity.areas
          )
          this.setBannerContent(content)
          this.$refs.quakeMap.parseMapScale()
        })
      } else if (this.currentType === 'Destination') {
        this.setEarthquakeInformationDisplay(content)
        this.$refs.quakeMap.addEpicenter(content.hypocenter)
        this.$refs.quakeMap.parseMapScale()
      } else if (this.currentType === 'ScaleAndDestination') {
        this.maximumIntensity = content.max_intensity
        this.hypocenterInfo = content.hypocenter
        this.setEarthquakeInformationDisplay(content)
        this.$refs.quakeMap.deleteAllLayers()
        this.$nextTick(() => {
          this.$refs.quakeMap.addEpicenter(content.hypocenter)
          this.$refs.quakeMap.addMapIntensities(
            content.area_intensity.areas
          )
          this.$refs.quakeMap.addMapColoring(
            content.area_intensity.areas
          )
          this.$refs.quakeMap.parseMapScale()
        })
      } else if (this.currentType === 'DetailScale') {
        this.setEarthquakeInformationDisplay(content)
        this.maximumIntensity = content.max_intensity
        this.$refs.quakeMap.deleteAllLayers()
        this.$nextTick(() => {
          this.$refs.quakeMap.addMapIntensities(
            content.area_intensity.station
          )
          this.$refs.quakeMap.addEpicenter(content.hypocenter)
          this.$refs.quakeMap.parseMapScale()
        })
      } else if (this.currentType === 'Foreign') {
        this.setEarthquakeInformationDisplay(content)
        this.maximumIntensity = content.max_intensity
        this.$refs.quakeMap.deleteAllLayers()
        this.$nextTick(() => {
          this.$refs.quakeMap.addEpicenter(content.hypocenter)
          this.$refs.quakeMap.setForeignEarthquake()
        })
      }
    })
  }

  private setBannerContent(content: IQuakeInfo) {
    this.tsunamiCommentsDomestic = content.tsunami_comments.domestic
    this.tsunamiCommentsForeign = content.tsunami_comments.foreign
  }

  private setEarthquakeInformationDisplay(
    content: IQuakeInfo
  ) {
    this.magnitude = content.magnitude
    this.hypocenterInfo = content.hypocenter
    this.occurTime = content.occur_time
    this.setBannerContent(content)
  }

  private setEEWEqInformationDisplay(
    content: IEEW
  ) {
    this.eewReceiveTime = content.report_time
    this.magnitude = content.magnitude
    this.hypocenterInfo = content.hypocenter
  }

  private parseEEWInformation(result: IInfo, mapUpdateOnly = false) {
    this.showEew = true
    if (result.eew.is_cancel) {
      this.showEew = false
      this.tsunamiCommentsDomestic = 'EEWCancelled'
      this.eewIsDrill = false
      this.eewIsExpected = false
      this.$refs.quakeMap.deleteAllLayers()
      return
    }
    if (!mapUpdateOnly) {
      this.setEEWEqInformationDisplay(result.eew)
      this.maximumIntensity = result.eew.max_intensity
      if (result.eew.is_final) {
        this.eewReportNum = `#${result.eew.report_num}-F`
      } else {
        this.eewReportNum = `#${result.eew.report_num}`
      }
      if (result.eew.is_plum) {
        this.eewType = {
          text: 'PLUM determined epicenter - ' +
            'No detailed information available',
          className: 'info-background'
        }
      } else if (result.eew.report_flag === 0) {
        this.eewType = {
          text: 'Earthquake Early Warning (Forecast)',
          className: 'info-background'
        }
      } else if (result.eew.report_flag === 1) {
        this.eewType = {
          text: 'Earthquake Early Warning (Warning) - Strong Shaking Expected',
          className: 'intensity-8'
        }
      }
      if (result.eew.max_intensity === '0' || result.eew.is_plum) {
        this.eewAdvice = {
          text: 'Wait for further information',
          className: 'info-background'
        }
      } else if (parseInt(result.eew.hypocenter.depth.slice(0, -2)) >= 100) {
        this.eewAdvice = {
          text: 'Deep earthquake - Information may not be accurate',
          className: 'deep-earthquake'
        }
      } else if (parseFloat(result.eew.magnitude) >= 6.0) {
        this.eewAdvice = {
          text: 'Stay away from coastal areas',
          className: 'intensity-7'
        }
      } else {
        this.eewAdvice = {
          text: 'Pay attention to coastal areas',
          className: 'intensity-2'
        }
      }
      this.eewIsDrill = result.eew.is_test
    }
    this.$refs.quakeMap.deleteAllLayers()
    this.$nextTick(() => {
      this.$refs.quakeMap.addEpicenter(result.eew.hypocenter)
      if (result.eew.area_coloring.recommended_areas) {
        if (!isEqual({}, result.eew.area_coloring.areas)) {
          this.$refs.quakeMap.addMapIntensities(
            result.eew.area_coloring.areas
          )
          this.$refs.quakeMap.addMapColoring(
            result.eew.area_coloring.areas
          )
        } else {
          console.warn('Areas equals null. Check server status.')
        }
      } else if (result.eew.area_intensity !== {}) {
        this.$refs.quakeMap.addMapIntensities(
          result.eew.area_intensity
        )
      } else {
        console.warn('No points exist. Check server status.')
      }
      this.$refs.quakeMap.parseMapScale()
    })

    this.eewIsExpected = true

    if (result.eew.s_wave !== null) {
      this.$refs.quakeMap.addWaveCircle(
        result.eew.hypocenter,
        result.eew.s_wave,
        's'
      )
    } else {
      console.warn('S wave time equals null. Check server status.')
    }
    if (result.eew.p_wave !== null) {
      this.$refs.quakeMap.addWaveCircle(
        result.eew.hypocenter,
        result.eew.p_wave,
        'p'
      )
    } else {
      console.warn('P wave time equals null. Check server status.')
    }
  }
}
</script>

<style lang='scss'>
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

.margin-add {
  margin-left: 15px;
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

/* Map-Icons End */

#earthquake-description {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

#earthquake-info {
  width: 475px;
  height: 100%;
  border: 4px solid $border-color;
  background: $info-background-color;
}

/* Intensity-Display end */

#intensity-display {
  grid-template-rows:
    [eqinfo] 140px
    [infobanner] 45px;
}

#eew-display {
  grid-template-rows:
    [eewtype] 45px
    [eewadvice] 40px
    [eewinfo] 140px;
}

.occur-label {
  width: fit-content;
  font-size: 16px;
  position: relative;
  left: 175px;
  top: 5px;
}

.flags {
  padding: 5px;
  font-weight: bolder;
  font-size: 20px;
  border: 2px solid $intensity-1;
  position: absolute;
  top: 20px;
  left: 10px;
  text-align: center;
}

#drill-flag {
  z-index: 10000;
  background: $intensity-3;
  color: black;
  left: 490px;
}

#expected-flag {
  z-index: 9999;
  background: rgb(195, 120, 7);
}

.leaflet-control-attribution {
  color: white !important;
  background: rgba(29, 29, 29, 0.3) !important;
}

.overlay-eew {
  z-index: 9999 !important;
}

/* Index End */

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
