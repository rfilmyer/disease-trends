function generateSmallpoxMap(elementId, geoJSONUrl, fromYear, toYear) {
	var map = L.map(elementId)
		.setView([37.8, -86], 3);
		//.fitBounds([[49.228012, -125.247199], [24.380394, -67.186257]])

	// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	// 	maxZoom: 18,
	// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
	// 		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	// 	id: 'mapbox.light'
	// }).addTo(map);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h6>Smallpox Incidence, ' + fromYear + '&ndash;' + toYear +'</h6>' + 
		(props ? createInfoboxStateText(props) : 'Hover over a state');
	};

	info.addTo(map);

	// color stuff is in map-common.js

	var geojson;

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}


	function createInfoboxStateText (props) {
		return ('<b>' + props.NAME + '</b><br />' + 
				formatNumber(props.cases_per_1m)
				)
	}

	function formatNumber(cases) {
		if (cases || cases === 0) {
			return(cases.toLocaleString("en-US", {maximumSignificantDigits: 3}) + 
				' new cases annually' + '<br>' + 'per 1,000,000 people');
		} else {
			return("no data");
		}
	}

	// create legend
	function createLegend(map) {
			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 1, 10, 50, 100, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
	};

	// get color depending on population density value
	function getColor(d) {
		return d > 1000 ? '#800026' :
				d > 500  ? '#BD0026' :
				d > 100  ? '#E31A1C' :
				d > 50  ? '#FC4E2A' :
				d > 10   ? '#FD8D3C' :
				d > 1   ? '#FEB24C' :
				d > 0   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.cases_per_1m)
		};
	}

	fetch(geoJSONUrl)
		.then(response => response.json())
		.then(smallpoxData => {
			geojson = L.geoJson(smallpoxData, {
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);
		});

	map.attributionControl.addAttribution('Epidemiology data &copy; the Typho Project');


	var legend = L.control({position: 'bottomright'});

	legend.onAdd = createLegend;

	legend.addTo(map);

	return(map)
}


// text creation

function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}


	function createInfoboxStateText (props) {
		return ('<b>' + props.NAME + '</b><br />' + 
				formatNumber(props.cases_per_1m)
				)
	}

	function formatNumber(cases) {
		if (cases || cases === 0) {
			return(cases.toLocaleString("en-US", {maximumSignificantDigits: 3}) + 
				' new cases annually' + '<br>' + 'per 1,000,000 people');
		} else {
			return("no data");
		}
	}

	// create legend
	function createLegend(map) {
			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 1, 10, 50, 100, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
	};

	// get color depending on population density value
	function getColor(d) {
		return d > 1000 ? '#800026' :
				d > 500  ? '#BD0026' :
				d > 100  ? '#E31A1C' :
				d > 50  ? '#FC4E2A' :
				d > 10   ? '#FD8D3C' :
				d > 1   ? '#FEB24C' :
				d > 0   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.cases_per_1m)
		};
	}

// Generate the Maps
//generateSmallpoxMap("smallpox-1928-map", "data/smallpox_1928.geojson", 1928, 1935);
//generateSmallpoxMap("smallpox-1936-map", "data/smallpox_1936.geojson", 1936, 1943);
//generateSmallpoxMap(elementId, geoJSONUrl, fromYear, toYear)
//generateSmallpoxMap(elementId, geoJSONUrl, fromYear, toYear)