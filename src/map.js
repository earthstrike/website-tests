class Map {
    constructor(leafletjs, mapid, geojsonData, markers) {
        this.leafletjs = leafletjs;
        this.mapid = mapid;
        this.geoJson;
        this.markers = markers;

        this.tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.layerOptions = {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>; <a href="naturalearthdata.com">Made with Natural Earth</a>',
            maxZoom: 18,
            subdomains: ['a', 'b', 'c']
        };
        this.geoJsonOptions = {
            style: (feature) => {
                return {
                    weight: 2,
                    fillOpacity: 0.3,
                    color: '#00FF00',
                };
            },
            onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
        };
        this.geojsonData = geojsonData
    }

    loadMap(event) {
        this.map = this.leafletjs.map(this.mapid).setView([40.505, -100.09], 5);

        this.leafletjs.tileLayer(this.tileServer, this.layerOptions).addTo(this.map);

        this.markers.forEach(markerDef => {
            const marker = this.leafletjs.marker(markerDef.position, markerDef.options).addTo(this.map);
            marker.bindPopup(markerDef.content);
        });

        this.geoJson = this.leafletjs.geoJson(this.geojsonData, this.geoJsonOptions).addTo(this.map);
    }

    highlightFeature(event) {
        const layer = event.target;
        layer.setStyle({
            weight: 1,
            color: '#00FF00',
            dashArray: '',
            fillOpacity: 0.1
        });

        const { ie, opera, edge } = this.leafletjs.Browser;

        if (!ie && !opera && !edge) {
            layer.bringToFront();
        }
    }

    resetHighlight(event) {
        this.geoJson.resetStyle(event.target);
    }

    zoomToFeature(event) {
        this.leafletjs.popup()
            .setLatLng(event.latlng)
            .setContent('<p>Some specific information here.</p>')
            .openOn(this.map);
        this.map.fitBounds(event.target.getBounds());
    }

    onEachFeature(feature, layer) {
        layer.on({
            mouseover: (event) => this.highlightFeature(event),
            mouseout: (event) => this.resetHighlight(event),
            click: (event) => this.zoomToFeature(event)
        });
    }
}
