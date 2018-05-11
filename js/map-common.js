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
