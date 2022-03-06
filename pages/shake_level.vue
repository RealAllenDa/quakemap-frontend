<template>
  <div id="main-container">
    <span>Shake Level</span>
    <ShakeLevelShow :shake-level="shakeLevel"></ShakeLevelShow>
    <div class="detail-points-wrapper">
      <DetailPoints
        :points-count="greenPoints"
        description="Green"
      ></DetailPoints>
      <DetailPoints
        :points-count="yellowPoints"
        description="Yellow"
      ></DetailPoints>
      <DetailPoints
        :points-count="redPoints"
        description="Red"
      ></DetailPoints>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import hnapi from "@/assets/hnapi";
import { IShakeLevel } from "@/assets/interfaces/api/ShakeLevel";
import DetailPoints from "~/components/shake_level/DetailPoints.vue";
import ShakeLevelShow from "~/components/shake_level/ShakeLevel.vue";

@Component({
  components: { ShakeLevelShow, DetailPoints }
})
export default class ShakeLevel extends Vue {
  private updateTimer: null | ReturnType<typeof setInterval> = null;
  private updateInterval = 2500;
  private shakeLevel = 0;
  private greenPoints = 0;
  private yellowPoints = 0;
  private redPoints = 0;

  public mounted(): void {
    hnapi.initialize({});
    this.updateTimer = setInterval(this._updateInfo, this.updateInterval);
  }

  private _updateInfo(): void {
    hnapi.makeApiRequest("/api/shake_level", this.updateInterval)
      .then((result: IShakeLevel) => {
        this.shakeLevel = result.shake_level;
        this.greenPoints = result.green;
        this.yellowPoints = result.yellow;
        this.redPoints = result.red;
      });
  }
}
</script>

<style lang="scss">
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
</style>
