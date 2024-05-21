// Create the map object with center and zoom level
var map = L.map('map').setView([37.7749, -122.4194], 5);

// Add a tile layer (the background map image) to our map. We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a function to get the color based on the depth of the earthquake
function getColor(depth) {
  return depth > 90 ? '#FF0000' :
         depth > 70 ? '#FF4500' :
         depth > 50 ? '#FF8C00' :
         depth > 30 ? '#FFA500' :
         depth > 10 ? '#FFD700' :
                      '#ADFF2F';
}

// Define a function to get the radius based on the magnitude of the earthquake
function getRadius(magnitude) {
  return magnitude * 4;
}

// Fetch the earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
  // Create a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Each feature will be represented as a circle marker
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style each circle marker
    style: function(feature) {
      return {
        color: "#000000",
        weight: 1,
        fillOpacity: 0.8,
        fillColor: getColor(feature.geometry.coordinates[2]), // Depth
        radius: getRadius(feature.properties.mag) // Magnitude
      };
    },
    // Add popups
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  }).addTo(map);
});

// Create a legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0, 10, 30, 50, 70, 90];
  var labels = [];

  // Loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);
