<template>
  <div :class="'intensity-' + computedClass" class="intensity-icon">
    <span class="intensity-label">Maximum Int.</span>
    <div class="intensity">
      <span v-if="addThings !== '' || intensity === '--'"
            style="margin-left: 5px">
        {{ computedIntensity }}
      </span>
      <span v-else class="margin-add">{{ computedIntensity }}</span>
      <span v-if="addThings !== ''" :class="intensityAddClass">{{ addThings }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { EqInfoStore } from "~/store";

@Component
export default class IntensityIcon extends Vue {
  @Prop({ default: false }) private isEew?: boolean;

  public get intensity(): string {
    return EqInfoStore?.getMaxInt === undefined
      ? "-1"
      : EqInfoStore?.getMaxInt;
  }

  public get computedIntensity(): string {
    switch (this.intensity) {
      case "5-":
      case "5+":
        return "5";
      case "6-":
      case "6+":
        return "6";
      default:
        return this.intensity;
    }
  }

  public get intensityAddClass(): string {
    return this.isEew ? "eew-intensity-add" : "intensity-add";
  }

  public get computedClass(): string {
    switch (this.intensity) {
      case "1":
      case "2":
      case "3":
      case "4":
        return this.intensity;
      case "5-":
        return "5";
      case "5+":
        return "6";
      case "6-":
        return "7";
      case "6+":
        return "8";
      case "7":
        return "9";
      default:
        return "unknown";
    }
  }

  public get addThings(): string {
    if (this.intensity.indexOf("+") === 1) {
      return "+";
    } else if (this.intensity.indexOf("-") === 1) {
      return "-";
    } else {
      return "";
    }
  }
}
</script>

<style lang="scss" scoped>
.intensity-icon {
  width: 275px;
  height: 100%;
  box-sizing: border-box;
  border: 4px solid $border-color;
  background: $intensity-0;
}

.intensity {
  display: inline-block;

  span {
    display: inline-block;
    font-size: 95px;
    font-weight: bolder;
    font-style: italic;
  }
}

.intensity-label {
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
  padding-left: 15px;
  padding-top: 85px;
}

.intensity-add {
  font-size: 75px !important;
  position: absolute;
  top: 10px;
  left: 217px;
}

.eew-intensity-add {
  font-size: 75px !important;
  position: absolute;
  top: 540px;
  left: 217px;
}

.margin-add {
  margin-left: 15px;
}
</style>
