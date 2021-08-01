// ELEMENTS
const $searchBar = $('#search-bar-main');
const $btn = $('#btn-arrow');
const $resultBar = $('#result-bar');
const $ipAddrEl = $('#ip-address');
const $locationEl = $('#location');
const $timezoneEl = $('#timezone');
const $ispEl = $('#isp');

// https://ipapi.co/42.105.17.12/json/

class App {
	#map;
	#mapZoom = 15;

	constructor() {
		this._getIPData();
		// EVENTS
		$btn.click(() => {
			this._getIPData($searchBar[0].value);
			$searchBar[0].value = '';
		});

		$(document).keydown(e => {
			if (key.enter === 'Enter') this._getIPData($searchBar[0].value);
		});
	}

	_getIPData(ip = '') {
		fetch(`https://ipapi.co/${ip}/json`)
			.then(res => res.json())
			.then(data => {
				if (data.error) throw new Error();
				this._setIPData(data);
			})
			.catch(() => alert(`Error: Invalid IP Address`));
	}

	_setIPData({
		ip,
		city,
		region,
		country_name,
		postal,
		utc_offset,
		org,
		latitude,
		longitude,
	}) {
		$ipAddrEl.text(ip);
		$locationEl.html(`${city}, ${region}<br>${country_name} - ${postal}`);
		$timezoneEl.text(`UTC${utc_offset}`);
		$ispEl.text(org);

		if (this.#map) {
			this.#map.setView([latitude, longitude], this.#mapZoom);
		} else {
			this._loadMap([latitude, longitude]);
		}
	}

	_loadMap(coords) {
		// LeafLets: Library
		this.#map = L.map('map').setView(coords, this.#mapZoom);

		// Google Map
		L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
		}).addTo(this.#map);

		L.marker(coords, {
			icon: L.icon({
				iconUrl: '/images/icon-location.svg',
				iconAnchor: [24, 56],
			}),
		})
			.addTo(this.#map)
			.openPopup();
	}
}

const app = new App();
