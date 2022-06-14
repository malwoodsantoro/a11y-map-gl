class AccessibleMap {
  constructor(options) {
    this._layers = options.layers;
    this._description = options.description;
  }

  onAdd(map) {
    this._map = map;
    this._mapcontainer = map._container;
    this._mapcontainer.setAttribute('aria-label', this._description + 'Use the directional arrows to explore points of interest on the map.')
    this._mapcontainer.setAttribute('aria-live', 'assertive')
    this._container = document.createElement('div');
    this._container.className = 'maplibre-accessibility-ctrl';

    const featureSelector = document.createElement('div');
    featureSelector.classList.add("feature-selector");
    featureSelector.style.position = 'fixed';
    featureSelector.style.borderStyle = 'solid';
    featureSelector.style.borderWidth = '5px';
    featureSelector.style.borderRadius = '5px';
    featureSelector.style.top = '50%';
    featureSelector.style.left = '50%';
    featureSelector.style.marginTop = '-100px';
    featureSelector.style.marginLeft = '-100px';
    featureSelector.style.width = '200px';
    featureSelector.style.height = '200px';
    this._container.appendChild(featureSelector);

    const features = document.createElement('div');
    features.setAttribute('id', 'features')
    features.setAttribute('aria-live', 'assertive');
    features.style.fontSize = '22px';
    features.style.width = '400px';
    features.style.height = '50vh';
    features.style.marginRight = '0';
    features.style.marginLeft = 'auto';
    features.style.backgroundColor = 'white';
    this._container.appendChild(features);

    this._map.on("moveend", this.moveEnd.bind(this));
    this._map.once("idle", this.idleMap.bind(this));

    return this._container;
  }

  onRemove() {
    this._container.parentNode?.removeChild(this._container);
    this._map = undefined;
  }

  displayProperties() {
    var point = this._map.project(this._map.getCenter());
    var width = 200;
    var height = 200;
    var features = this._map.queryRenderedFeatures([
      [point.x - width / 2, point.y - height / 2],
      [point.x + width / 2, point.y + height / 2]
    ], { layers: this._layers });

    features.map(function (feat, i) {
      document.getElementById('features').innerHTML += '<div class="featureProperties" arialabel= "' + feat.properties.name + '" tabindex="' + (i + 2) + '">' + (i + 1) + '. ' + feat.properties.name + '</div>'
      document.getElementsByClassName('featureProperties')[i].style.outline = '2px solid black';
      document.getElementsByClassName('featureProperties')[i].style.padding = '20px';
      document.getElementsByClassName('featureProperties')[i].style.borderRadius = '5px';
    });
  }

  bindDirectionKeys() {
    var bearing = this._map.getBearing()
    document.onkeydown = (event) => {
      switch (event.keyCode) {
        //West
        case 37:
          document.getElementById('features').innerHTML = 'Moving ' + this.bearingToDirection(bearing - 90)
          break;
        //North 
        case 38:
          document.getElementById('features').innerHTML = 'Moving ' + this.bearingToDirection(bearing)
          break;
        //East
        case 39:
          document.getElementById('features').innerHTML = 'Moving ' + this.bearingToDirection(bearing + 90)
          break;
        //South
        case 40:
          document.getElementById('features').innerHTML = 'Moving ' + this.bearingToDirection(bearing + 180)
          break;
      }
    };
  }

  bearingToDirection(bearing){
    var positiveBearing = this.makeBearingPositive(bearing)

    switch (true) {
      case (positiveBearing < 30):
        return "North";

      case (positiveBearing <= 60):
        return "Northeast";

      case (positiveBearing <= 120):
        return "East";

      case (positiveBearing <= 150):
        return "Southeast";

      case (positiveBearing <= 210):
        return "South";

      case (positiveBearing <= 240):
        return "Southwest";

      case (positiveBearing <= 300):
        return "West";

      case (positiveBearing <= 330):
        return "Northwest"

      case (positiveBearing <= 360):
        return "North"

      default:
        console.log('Default');
    }
  }

  makeBearingPositive(bearing) {
    if (bearing < 0) {
      return bearing += 360
    } else {
      return bearing
    }
  }

  moveEnd() {
    document.getElementById('features').innerHTML = '';
    this.displayProperties();
  }

  idleMap() {
    this.displayProperties();
    this.bindDirectionKeys();
  }
}