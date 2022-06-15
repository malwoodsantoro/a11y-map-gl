# a11y map gl plugin
An accessibility plugin for the [MapLibre library](https://maplibre.org/).

## Example

View the example by running the below command. 

`npm run example`

<img width="1015" alt="Screen Shot 2022-06-14 at 1 42 40 PM" src="https://user-images.githubusercontent.com/19801577/173646090-789a6551-4d08-4864-8fa8-44562a88c173.png">

## Usage

Add file from dist folder to script tag: 

`<script src="a11y-map-gl.js"></script>`

Initialize a new AccessibleMap instance and pass it to the map.addControl function: 
```
map.on('load', () => {
  let Accessibility = new AccessibleMap({
    
    // Layers in the style that will be used with Voiceover control. 
    layers: ['poi_z14', 'poi_z15', 'poi_z16'], 
    // Description of the map on page load. 
    description: "This is a map of East Portland, Oregon."
  });
  
  map.addControl(Accessibility);
});
```

🐝
