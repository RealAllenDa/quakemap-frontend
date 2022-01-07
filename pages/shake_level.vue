<template>
  <div id="main-container">
    <span>Shake Level</span>
    <span class="bold">Lv. {{ shakeLevel }}</span>
    <div class="detail-points-wrapper">
      <div>
        <span>Green</span>
        <span>{{ greenPoints }}</span>
      </div>
      <div>
        <span>Yellow</span>
        <span>{{ yellowPoints }}</span>
      </div>
      <div>
        <span>Red</span>
        <span>{{ redPoints }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import hnapi from "@/assets/hnapi";
import { IShakeLevel } from "@/assets/interfaces/api/ShakeLevel";

@Component
export default class ShakeLevel extends Vue {
  private updateTimer: null | ReturnType<typeof setInterval> = null;
  private shakeLevel = 0;
  private greenPoints = 0;
  private yellowPoints = 0;
  private redPoints = 0;

  public mounted(): void {
    hnapi.initialize();
    this.updateTimer = setInterval(this._updateInfo, 2500);
  }

  private _updateInfo(): void {
    hnapi.makeApiRequest("/api/shake_level").then((result: IShakeLevel) => {
      this.shakeLevel = result.shake_level;
      this.greenPoints = result.green;
      this.yellowPoints = result.yellow;
      this.redPoints = result.red;
    });
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/globals";


.detail-points-wrapper {
  border-top: 3px solid $border-color;

  div {
    width: 100%;
    height: 40px;
    display: flex;

    span {
      width: 50%;
      height: 40px;
    }
  }
}

#main-container {
  width: 200px;
  height: 215px;
  border: 6px solid $border-color;
  background: $info-background-color;
  box-sizing: border-box;
  font-size: 25px;

  span {
    display: inline-block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    box-sizing: border-box;
  }
}

.bold {
  @include bold;
}
</style>
