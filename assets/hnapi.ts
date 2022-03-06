import axios from 'axios'
import { IFetchGeoJsonConfig } from '~/assets/interfaces/parsing/GeoJson'
import { GeoJsonStore } from '~/assets/hnapi-store'

class _ReqFailedErr extends Error {
  constructor(error: Error) {
    super(error.message)
    Object.setPrototypeOf(this, _ReqFailedErr.prototype)
  }
}

class HNAPI {
  private readonly mode = process.env.NODE_ENV
  private readonly color = this.mode === 'production' ? '#43bb88' : 'orange'
  private readonly version = process.env.version
    ? process.env.version
    : 'DEV_TEST'

  private readonly coreVersion = process.env.coreVersion
    ? process.env.coreVersion
    : 'DEV_TEST'

  private readonly useProductionAPI: boolean
  private readonly apiUrl: string
  private profiler: null | ReturnType<typeof setInterval> = null
  private heap: object = {
    used: null,
    total: null,
  }

  constructor(useProductionAPI = false) {
    this.useProductionAPI = useProductionAPI
    if (this.mode === 'development') {
      if (!useProductionAPI) {
        this.apiUrl = 'http://127.0.0.1:5000'
      } else {
        this.apiUrl = 'https://eqweb.daziannetwork.com'
      }
    } else {
      this.apiUrl = 'https://eqweb.daziannetwork.com'
    }
    this.profile()
  }

  async fetchGeoJson(fetchGeoJsonConfig: IFetchGeoJsonConfig): Promise<void> {
    if (fetchGeoJsonConfig.japan) {
      await this.makeApiRequest('/static/geojson/japan.json')
        .then((res) => {
          GeoJsonStore.setJapanGeoJson(res)
        })
        .catch((error) => {
          throw new Error('[!] Failed to load japan geojson: ' + error)
        })
    }
    if (fetchGeoJsonConfig.countries) {
      await this.makeApiRequest('/static/geojson/countries_without_japan.json')
        .then((res) => {
          GeoJsonStore.setCountriesGeoJson(res)
        })
        .catch((error) => {
          throw new Error('[!] Failed to load countries geojson: ' + error)
        })
    }
    if (fetchGeoJsonConfig.japanWithSubAreas) {
      await this.makeApiRequest('/static/geojson/japan_with_sub_areas.json')
        .then((res) => {
          GeoJsonStore.setJapanSubAreasGeoJson(res)
        })
        .catch((error) => {
          throw new Error('[!] Failed to load japanSubAreas geojson: ' + error)
        })
    }
  }

  async initialize(fetchGeoJsonConfig: IFetchGeoJsonConfig): Promise<void> {
    await this.fetchGeoJson(fetchGeoJsonConfig)
    // eslint-disable-next-line no-console
    console.log(
      `${process.env.logo}\n\n\n` +
        `Version ${this.version}-${this.mode}. ` +
        `Powered by EEWMapBackend ${this.coreVersion}.`,
      `color: ${this.color}; font-size: 20px; font-weight: bold;`
    )
    if (this.mode === 'development') {
      if (this.useProductionAPI) {
        this.warn(
          'Using (Overridden) Production API Server: ' +
            'It can cause unexpected behaviors.'
        )
      }
    }
  }

  // eslint-disable-next-line require-await
  async makeApiRequest(url: string, timeout = 0): Promise<never> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.apiUrl}${url}`, {
          timeout,
        })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(new _ReqFailedErr(error))
        })
    })
  }

  debug(...text: any[]) {
    // eslint-disable-next-line no-console
    console.log('%c[DEBUG]', 'color: lightgreen; font-weight: bold;', ...text)
  }

  info(...text: any[]) {
    // eslint-disable-next-line no-console
    console.log('%c[INFO]', 'color: lightblue; font-weight: bold;', ...text)
  }

  warn(...text: any[]) {
    // eslint-disable-next-line no-console
    console.log('%c[WARN]', 'color: yellow; font-weight: bold;', ...text)
  }

  error(...text: any[]) {
    // eslint-disable-next-line no-console
    console.log('%c[ERROR]', 'color: red; font-weight: bold;', ...text)
  }

  profile() {
    this.heap = {
      // @ts-ignore
      used: performance.memory.usedJSHeapSize,
      // @ts-ignore
      total: performance.memory.totalJSHeapSize,
    }
    performance.mark('start')
    setTimeout(() => {
      performance.mark('end')
      // @ts-ignore
      const duration = performance.measure(
        'from start to end',
        'start',
        'end'
        // @ts-ignore
      ).duration
      this.debug(
        `OK: ${duration} / ` +
          `Heap Used: ${
            // @ts-ignore
            (performance.memory.usedJSHeapSize - this.heap.used) / 1024 / 1024
          }MB / ` +
          `Heap total: ${
            // @ts-ignore
            (performance.memory.totalJSHeapSize - this.heap.total) / 1024 / 1024
          }MB`
      )
      this.profile()
    }, 2000)
  }
}

const hnapi = new HNAPI(true)

export default hnapi
