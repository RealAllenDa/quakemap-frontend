<template>
  <div v-if="show" :class="className" class="sub-window banner-description">
    <span>{{ tsunamiComments.text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Dict } from "~/assets/types";
import { IBannerType } from "~/assets/interfaces/parsing/Banner";
import { EqInfoStore } from "~/store";

@Component
export default class Banner extends Vue {
  @Prop() private type!: string;
  private show = true;

  // TODO: Refactor to store
  private domesticLookupTable: Dict<IBannerType> = {
    "Fetching": {
      text: "Fetching information...",
      className: "info-background"
    },
    "Warning": {
      text: "Japan: Major Tsunami Warning / Tsunami Warning / Advisory In Effect",
      className: "intensity-7"
    },
    "None": {
      text: "Japan: No Tsunami Expected",
      className: "no-tsunami"
    },
    "EEWCancelled": {
      text: "Previous Earthquake Early Warning had been cancelled",
      className: "no-tsunami"
    },
    "NonEffective": {
      text: "Japan: Light Sea Level Changes Expected - No Tsunami Expected",
      className: "intensity-4"
    },
    "Checking": {
      text: "Japan: Tsunami Risk Evaluating - Stay away from coastal areas",
      className: "risk-evaluating"
    }
  };

  private foreignLookupTable: Dict<IBannerType> = {
    "Fetching": {
      text: "Fetching information...",
      className: "info-background"
    },
    "None": {
      text: "Foreign: No Tsunami Expected",
      className: "no-tsunami"
    },
    "Checking": {
      text: "Foreign: Tsunami Risk Evaluating",
      className: "risk-evaluating"
    },
    "NonEffectiveNearby": {
      text: "Foreign: Small non-effective tsunami possible near the source",
      className: "intensity-4"
    },
    "WarningNearby": {
      text: "Foreign: Tsunami possible near the source",
      className: "intensity-7"
    },
    "WarningPacific": {
      text: "Foreign: Tsunami possible in the Pacific Ocean",
      className: "intensity-8"
    },
    "WarningPacificWide": {
      text: "Foreign: Tsunami possible in wide area of Pacific Ocean",
      className: "intensity-9"
    },
    "WarningIndian": {
      text: "Foreign: Tsunami possible in the Indian Ocean",
      className: "intensity-8"
    },
    "WarningIndianWide": {
      text: "Foreign: Tsunami possible in wide area of Indian Ocean",
      className: "intensity-9"
    },
    "Potential": {
      text: "Foreign: In general, tsunami is possible on this scale",
      className: "intensity-7"
    }
  };

  public get className(): string {
    return this.type === "foreign" ?
      `banner-foreign ${this.tsunamiComments.className}` :
      `${this.tsunamiComments.className}`;
  }

  public get tsunamiComments(): IBannerType {
    return this.type === "foreign" ?
      this.tsunamiCommentsForeign :
      this.tsunamiCommentsDomestic;
  }

  public get tsunamiCommentsDomestic(): IBannerType {
    const result = this.domesticLookupTable[this.text];
    if (!result) {
      return {
        text: `Unknown message: ${this.text}`,
        className: "info-background"
      };
    } else {
      return result;
    }
  }

  public get tsunamiCommentsForeign(): IBannerType {
    const result = this.foreignLookupTable[this.text];
    if (this.text === "None") {
      this.show = false;
      return result;
    } else if (!result) {
      return {
        text: `Unknown message: ${this.text}`,
        className: "info-background"
      };
    } else {
      return result;
    }
  }

  public get text() {
    if (EqInfoStore?.tsunamiComments === undefined) {
      return "Fetching";
    }
    if (this.type === "domestic") {
      return EqInfoStore.tsunamiComments.domestic;
    } else if (this.type === "foreign") {
      return EqInfoStore.tsunamiComments.foreign;
    } else {
      throw new Error("Exhaustive handling of banner type");
    }
  }
}
</script>

<style lang="scss">
.banner-description {
  background: $info-background-color;
  border: 4px solid $border-color;
  font-size: 20px;
  text-align: center;
  overflow: hidden;
  line-height: 40px;
  font-weight: bolder;
}

.banner-foreign {
  width: 750px;
  height: 40px;
  z-index: 999999;
  border-top: 0 !important;
}

.no-tsunami {
  color: white !important;
  background: #6cc !important;
}

.risk-evaluating {
  color: white !important;
  background: $intensity-6 !important;
}
</style>
