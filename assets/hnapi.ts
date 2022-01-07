import axios from "axios";

class _ReqFailedErr extends Error {
  constructor(error: Error) {
    super(error.message);
    Object.setPrototypeOf(this, _ReqFailedErr.prototype);
  }
}

class HNAPI {
  private readonly mode = process.env.NODE_ENV;
  private readonly color = this.mode === "production" ? "#43bb88" : "orange";
  private readonly version = process.env.version
    ? process.env.version
    : "DEV_TEST";
  private readonly coreVersion = process.env.coreVersion
    ? process.env.coreVersion
    : "DEV_TEST";
  private readonly useProductionAPI: boolean;
  private readonly apiUrl: string;

  constructor(useProductionAPI = false) {
    this.useProductionAPI = useProductionAPI;
    if (this.mode === "development") {
      if (!useProductionAPI) {
        this.apiUrl = "http://127.0.0.1:5000";
      } else {
        this.apiUrl = "https://eqweb.daziannetwork.com";
      }
    } else {
      this.apiUrl = "https://eqweb.daziannetwork.com";
    }
  }

  initialize(): void {
    // eslint-disable-next-line no-console
    console.log(
      `${process.env.logo}\n` +
        `Version ${this.version}-${this.mode}. ` +
        `Powered by mighty-vue-core ${this.coreVersion}.`,
      `color: ${this.color}; font-size: 20px; font-weight: bold;`
    );
    if (this.mode === "development") {
      if (this.useProductionAPI) {
        // eslint-disable-next-line no-console
        console.warn(
          "%c!!! Using (Overridden) Production API Server: " +
            "It can cause unexpected behaviors.",
          "color: orange; font-size: 20px; font-weight: bold;"
        );
      }
      console.warn(
        "%c!!! Clearing all intervals: " +
          "This was meant to prevent the hot-reloading to affect the interval. " +
          "This shall not happen in production environment.",
        "color: orange; font-size: 20px; font-weight: bold;"
      );
      //this._devClearAllInterval();
    }
  }

  async makeApiRequest(url: string, timeout = 0): Promise<never> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.apiUrl}${url}`, {
          timeout: timeout,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new _ReqFailedErr(error));
        });
    });
  }

  private _devClearAllInterval() {
    for (let i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }
  }
}

const hnapi = new HNAPI(true);

export default hnapi;
