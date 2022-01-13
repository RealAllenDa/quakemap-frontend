export class MapConfig {
  public mapOptions = {
    attributionControl: false,
    zoomControl: false,
    zoomSnap: 0.01,
    zoomDelta: 0.5,
    maxZoom: 8,
    minZoom: 2,
  }

  public countriesBgStyle = {
    stroke: true,
    fill: true,
    fillColor: '#3a3a3a',
    fillOpacity: 1,
    weight: 1,
    color: '#3a3a3a',
  }

  public japanBgStyle = {
    stroke: false,
    fill: true,
    fillColor: '#3a3a3a',
    fillOpacity: 1,
  }

  public japanAreaBorderStyle = {
    stroke: true,
    fill: false,
    color: '#565656',
    weight: 0.5,
  }

  public japanBorderStyle = {
    stroke: true,
    fill: false,
    color: '#838383',
    weight: 0.5,
  }

  public sWaveCircleStyle = {
    color: '#E65A5A',
    weight: 2,
    opacity: 1,
    fillColor: '#E65A5A',
    fillOpacity: 0.2,
  }

  public pWaveCircleStyle = {
    color: '#50A0FA',
    weight: 2,
    opacity: 1,
    fill: false,
  }
}
