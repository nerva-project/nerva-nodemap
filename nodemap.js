/*
 * NERVA nodemap — map.nerva.one
 *
 * Vanilla JS. jQuery, Bootstrap and Font Awesome are gone: the page needs a
 * map, three charts and a theme toggle, and none of them justify 400 KB of
 * framework. Leaflet, MarkerCluster and Chart.js are self-hosted in vendor/.
 *
 * The same script powers two pages:
 *   - index.html, the dashboard with the map and the statistics charts
 *   - nodemap.html, the bare map embedded in an iframe on nerva.one
 * Charts are skipped automatically when their canvases are absent, which is
 * why the embed page does not even load Chart.js.
 */

'use strict';

(function () {
    /* ------------------------------------------------------------------ */
    /* configuration                                                       */
    /* ------------------------------------------------------------------ */

    var API_URL = 'https://api.nerva.one/analytics/fetch/';
    var THEME_KEY = 'nerva-nodemap-theme';

    /* Mapbox publishable token (pk. keys are designed to be public). This one
     * is scoped to styles:tiles + styles:read and restricted to the nerva.one
     * origin, and is deliberately written as a single literal: a split-string
     * trick hid a typo that 401'd every tile request, and obfuscation buys
     * nothing for a key that ships in every page load anyway. If push
     * protection flags it, dismiss the alert: it is a false positive by
     * design. */
    var MAPBOX_TOKEN = 'pk.eyJ1IjoicjBiYzBkM3IiLCJhIjoiY210aGtkYmYzMDcyMTJ6b3Q1YzlqOGN3NyJ9.zqhhEiYkttJ64pPot8MkvQ';

    /* Both themes keep the streets-v11 basemap; dark mode dims the tile pane
     * instead of swapping to dark tiles (see the .leaflet-tile-pane rule in
     * nodemap.css), which keeps the geography readable and the markers at
     * full contrast. */
    var TILE_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

    var TILE_OPTIONS = {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 15,
        id: 'mapbox/streets-v11',
        accessToken: MAPBOX_TOKEN
    };

    /* ------------------------------------------------------------------ */
    /* reference data (country and continent codes)                        */
    /* ------------------------------------------------------------------ */

    var CONTINENTS = {
        'AF': 'Africa', 'NA': 'North America', 'SA': 'South America',
        'EU': 'Europe', 'OC': 'Oceania', 'AS': 'Asia', 'AN': 'Antarctica'
    };

    var COUNTRIES = {
        'AF': 'Afghanistan', 'AX': 'Aland Islands', 'AL': 'Albania', 'DZ': 'Algeria', 'AS': 'American Samoa', 'AD': 'Andorra', 'AO': 'Angola', 'AI': 'Anguilla', 'AQ': 'Antarctica', 'AG': 'Antigua And Barbuda', 'AR': 'Argentina', 'AM': 'Armenia', 'AW': 'Aruba', 'AU': 'Australia', 'AT': 'Austria', 'AZ': 'Azerbaijan', 'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh', 'BB': 'Barbados', 'BY': 'Belarus', 'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin', 'BM': 'Bermuda', 'BT': 'Bhutan', 'BO': 'Bolivia', 'BA': 'Bosnia And Herzegovina', 'BW': 'Botswana', 'BV': 'Bouvet Island', 'BR': 'Brazil', 'IO': 'British Indian Ocean Territory', 'BN': 'Brunei Darussalam', 'BG': 'Bulgaria', 'BF': 'Burkina Faso', 'BI': 'Burundi', 'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada', 'CV': 'Cape Verde', 'KY': 'Cayman Islands', 'CF': 'Central African Republic', 'TD': 'Chad', 'CL': 'Chile', 'CN': 'China', 'CX': 'Christmas Island', 'CC': 'Cocos (Keeling) Islands', 'CO': 'Colombia', 'KM': 'Comoros', 'CG': 'Congo', 'CD': 'Congo, Democratic Republic', 'CK': 'Cook Islands', 'CR': 'Costa Rica', 'CI': 'Cote D\'Ivoire', 'HR': 'Croatia', 'CU': 'Cuba', 'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DK': 'Denmark', 'DJ': 'Djibouti', 'DM': 'Dominica', 'DO': 'Dominican Republic', 'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador', 'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'EE': 'Estonia', 'ET': 'Ethiopia', 'FK': 'Falkland Islands (Malvinas)', 'FO': 'Faroe Islands', 'FJ': 'Fiji', 'FI': 'Finland', 'FR': 'France', 'GF': 'French Guiana', 'PF': 'French Polynesia', 'TF': 'French Southern Territories', 'GA': 'Gabon', 'GM': 'Gambia', 'GE': 'Georgia', 'DE': 'Germany', 'GH': 'Ghana', 'GI': 'Gibraltar', 'GR': 'Greece', 'GL': 'Greenland', 'GD': 'Grenada', 'GP': 'Guadeloupe', 'GU': 'Guam', 'GT': 'Guatemala', 'GG': 'Guernsey', 'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HT': 'Haiti', 'HM': 'Heard Island & Mcdonald Islands', 'VA': 'Holy See (Vatican City State)', 'HN': 'Honduras', 'HK': 'Hong Kong', 'HU': 'Hungary', 'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran, Islamic Republic Of', 'IQ': 'Iraq', 'IE': 'Ireland', 'IM': 'Isle Of Man', 'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica', 'JP': 'Japan', 'JE': 'Jersey', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya', 'KI': 'Kiribati', 'KR': 'Korea', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan', 'LA': 'Lao People\'s Democratic Republic', 'LV': 'Latvia', 'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libyan Arab Jamahiriya', 'LI': 'Liechtenstein', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MO': 'Macao', 'MK': 'Macedonia', 'MG': 'Madagascar', 'MW': 'Malawi', 'MY': 'Malaysia', 'MV': 'Maldives', 'ML': 'Mali', 'MT': 'Malta', 'MH': 'Marshall Islands', 'MQ': 'Martinique', 'MR': 'Mauritania', 'MU': 'Mauritius', 'YT': 'Mayotte', 'MX': 'Mexico', 'FM': 'Micronesia, Federated States Of', 'MD': 'Moldova', 'MC': 'Monaco', 'MN': 'Mongolia', 'ME': 'Montenegro', 'MS': 'Montserrat', 'MA': 'Morocco', 'MZ': 'Mozambique', 'MM': 'Myanmar', 'NA': 'Namibia', 'NR': 'Nauru', 'NP': 'Nepal', 'NL': 'Netherlands', 'AN': 'Netherlands Antilles', 'NC': 'New Caledonia', 'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria', 'NU': 'Niue', 'NF': 'Norfolk Island', 'MP': 'Northern Mariana Islands', 'NO': 'Norway', 'OM': 'Oman', 'PK': 'Pakistan', 'PW': 'Palau', 'PS': 'Palestinian Territory, Occupied', 'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru', 'PH': 'Philippines', 'PN': 'Pitcairn', 'PL': 'Poland', 'PT': 'Portugal', 'PR': 'Puerto Rico', 'QA': 'Qatar', 'RE': 'Reunion', 'RO': 'Romania', 'RU': 'Russian Federation', 'RW': 'Rwanda', 'BL': 'Saint Barthelemy', 'SH': 'Saint Helena', 'KN': 'Saint Kitts And Nevis', 'LC': 'Saint Lucia', 'MF': 'Saint Martin', 'PM': 'Saint Pierre And Miquelon', 'VC': 'Saint Vincent And Grenadines', 'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'Sao Tome And Principe', 'SA': 'Saudi Arabia', 'SN': 'Senegal', 'RS': 'Serbia', 'SC': 'Seychelles', 'SL': 'Sierra Leone', 'SG': 'Singapore', 'SK': 'Slovakia', 'SI': 'Slovenia', 'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa', 'GS': 'South Georgia And Sandwich Isl.', 'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan', 'SR': 'Suriname', 'SJ': 'Svalbard And Jan Mayen', 'SZ': 'Swaziland', 'SE': 'Sweden', 'CH': 'Switzerland', 'SY': 'Syrian Arab Republic', 'TW': 'Taiwan', 'TJ': 'Tajikistan', 'TZ': 'Tanzania', 'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo', 'TK': 'Tokelau', 'TO': 'Tonga', 'TT': 'Trinidad And Tobago', 'TN': 'Tunisia', 'TR': 'Turkey', 'TM': 'Turkmenistan', 'TC': 'Turks And Caicos Islands', 'TV': 'Tuvalu', 'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'US': 'United States', 'UM': 'United States Outlying Islands', 'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VU': 'Vanuatu', 'VE': 'Venezuela', 'VN': 'Viet Nam', 'VG': 'Virgin Islands, British', 'VI': 'Virgin Islands, U.S.', 'WF': 'Wallis And Futuna', 'EH': 'Western Sahara', 'YE': 'Yemen', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
    };

    /* ------------------------------------------------------------------ */
    /* state                                                               */
    /* ------------------------------------------------------------------ */

    var nodes = [];
    var map = null;
    var tileLayer = null;
    var cluster = null;
    var charts = { country: null, continent: null, version: null };
    var markerIcon = L.icon({
        iconUrl: 'img/marker-nerva.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    /* ------------------------------------------------------------------ */
    /* theme                                                               */
    /* ------------------------------------------------------------------ */

    function isDark() {
        return document.documentElement.classList.contains('dark-mode');
    }

    /* The theme is resolved before first paint by the inline <head> script
     * of each page (URL parameter, then saved choice, then OS). This file
     * only reacts to the resolved state. */

    function applyPageTheme(dark, persist) {
        document.documentElement.classList.toggle('dark-mode', dark);
        /* Mirror of --clr-bg in dark mode: read from the stylesheet rather
         * than hardcoding the hex again (the inline <head> scripts keep a
         * literal because they must not depend on the CSS having loaded). */
        var darkBg = getComputedStyle(document.documentElement).getPropertyValue('--clr-bg').trim() || '#0b111b';
        document.documentElement.style.backgroundColor = dark ? darkBg : '';
        if (persist) {
            try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
        }
        syncThemeButtons();
        refreshCharts();
    }

    function syncThemeButtons() {
        document.querySelectorAll('.theme-toggle').forEach(function (button) {
            button.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
        });
    }

    /* ------------------------------------------------------------------ */
    /* data                                                                */
    /* ------------------------------------------------------------------ */

    var FETCH_TIMEOUT = 15000;

    function fetchNodes() {
        /* Abort a hanging request instead of leaving the spinner up forever. */
        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT);
        var settled = false;
        function clearTimer() {
            if (!settled) { settled = true; clearTimeout(timer); }
        }
        return fetch(API_URL, {
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        })
            .then(function (res) {
                clearTimer();
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (data) {
                var result = data && data.result;
                if (!Array.isArray(result)) throw new Error('unexpected payload');
                return result;
            })
            .catch(function (error) {
                clearTimer();
                if (error && error.name === 'AbortError') {
                    throw new Error('timed out');
                }
                throw error;
            });
    }

    function statusOverlay() {
        return document.getElementById('map-status');
    }

    function showStatus(message, isError) {
        var el = statusOverlay();
        if (!el) return;
        if (message) {
            /* The dashboard ships with the loading text already in the DOM,
             * so skip the rewrite (and the duplicate live-region
             * announcement) when the same status is already showing. */
            if (!el.classList.contains('hidden') && el.textContent === message) return;
            el.innerHTML = '';
            el.classList.toggle('error', Boolean(isError));
            if (!isError) {
                var spinner = document.createElement('div');
                spinner.className = 'spinner';
                spinner.setAttribute('aria-hidden', 'true');
                el.appendChild(spinner);
            }
            var text = document.createElement('span');
            text.textContent = message;
            el.appendChild(text);
            if (isError) {
                var retry = document.createElement('button');
                retry.type = 'button';
                retry.className = 'retry-btn';
                retry.textContent = 'Retry';
                retry.addEventListener('click', loadNodes);
                el.appendChild(retry);
            }
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
            el.classList.remove('error');
            /* Clear the stale text out of the live region once the fade-out
             * is done, so the next status starts from a clean region. */
            setTimeout(function () {
                if (el.classList.contains('hidden')) el.innerHTML = '';
            }, 400);
        }
    }

    /* ------------------------------------------------------------------ */
    /* map                                                                 */
    /* ------------------------------------------------------------------ */

    function initMap() {
        map = L.map('map', {
            center: [25, 15],
            zoom: 2,
            minZoom: 1,
            maxZoom: 15,
            worldCopyJump: true,
            maxBounds: L.latLngBounds([-85, -540], [85, 540]),
            maxBoundsViscosity: 0.8,
            zoomControl: false,   /* added below; the default top-left position sits under .map-overlay */
            attributionControl: true
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        /* The world is 256 * 2^z px wide, so zoom from the card width: a
         * fixed zoom 2 showed under half the world on a phone. Round, not
         * floor, or mid-width cards repeat the world; not fitBounds(), which
         * also fits the height and zooms out far enough to repeat it. */
        var fitZoom = Math.round(Math.log(map.getSize().x / 256) / Math.LN2);
        map.setView([25, 15], Math.max(map.getMinZoom(), fitZoom), { animate: false });

        tileLayer = L.tileLayer(TILE_URL, TILE_OPTIONS);
        tileLayer.addTo(map);

        cluster = L.markerClusterGroup({
            maxClusterRadius: 24,
            showCoverageOnHover: false,
            spiderfyDistanceMultiplier: 1.4
        });
        map.addLayer(cluster);
    }

    function addMarkers(list) {
        list.forEach(function (node) {
            var lat = parseFloat(node.lat);
            var lng = parseFloat(node.long);
            if (!isFinite(lat) || !isFinite(lng)) return;

            var marker = L.marker([lat, lng], { icon: markerIcon, riseOnHover: true });
            marker.bindPopup(buildPopup(node));
            cluster.addLayer(marker);
        });
    }

    function buildPopup(node) {
        var version = node.version === '0.0.0.0' ? '<=0.1.6.8 (peerlist import)' : node.version;
        var wrapper = document.createElement('div');
        wrapper.className = 'node-popup';

        var title = document.createElement('p');
        title.className = 'popup-title';
        title.textContent = 'NERVA node';
        wrapper.appendChild(title);

        var grid = document.createElement('dl');
        [
            ['IP', node.ip || 'unknown'],
            ['Version', version],
            ['Last seen', node.time || 'unknown']
        ].forEach(function (pair) {
            var dt = document.createElement('dt');
            dt.textContent = pair[0];
            var dd = document.createElement('dd');
            dd.textContent = pair[1];
            grid.appendChild(dt);
            grid.appendChild(dd);
        });
        wrapper.appendChild(grid);

        return wrapper;
    }

    /* ------------------------------------------------------------------ */
    /* statistics                                                          */
    /* ------------------------------------------------------------------ */

    /* Counts values, most frequent first. Falsy values are skipped: the
     * API reports empty cc/cn/lat/long when geolocation fails, and such
     * nodes must not become a phantom country or a nameless chart slice
     * (the map already skips them, since parseFloat('') is NaN). */
    function statify(values) {
        var counts = Object.create(null);
        values.forEach(function (value) {
            if (!value) return;
            counts[value] = (counts[value] || 0) + 1;
        });
        return Object.keys(counts)
            .map(function (key) { return [key, counts[key]]; })
            .sort(function (a, b) { return b[1] - a[1]; });
    }

    function renderCounts() {
        var nodesEl = document.querySelectorAll('[data-count="nodes"]');
        var countriesEl = document.querySelectorAll('[data-count="countries"]');
        var countryCount = statify(nodes.map(function (n) { return n.cc; })).length;

        nodesEl.forEach(function (el) { el.textContent = String(nodes.length); });
        countriesEl.forEach(function (el) { el.textContent = String(countryCount); });
    }

    function chartColors(steps) {
        /* teal to violet, the brand gradient */
        var from = isDark() ? [47, 179, 203] : [23, 139, 160];
        var to = isDark() ? [139, 134, 232] : [95, 91, 199];
        var colors = [];
        for (var i = 0; i < steps; i++) {
            var t = steps === 1 ? 0 : i / (steps - 1);
            colors.push('rgba(' +
                Math.round(from[0] + (to[0] - from[0]) * t) + ',' +
                Math.round(from[1] + (to[1] - from[1]) * t) + ',' +
                Math.round(from[2] + (to[2] - from[2]) * t) + ', ' + (isDark() ? '0.92' : '0.88') + ')');
        }
        return colors;
    }

    function chartTheme() {
        var style = getComputedStyle(document.documentElement);
        return {
            text: style.getPropertyValue('--clr-text').trim() || '#3b4756',
            muted: style.getPropertyValue('--clr-muted').trim() || '#64748b',
            grid: isDark() ? 'rgba(148, 163, 184, 0.14)' : 'rgba(15, 23, 42, 0.07)',
            surface: isDark() ? '#121b29' : '#ffffff',
            border: isDark() ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.1)'
        };
    }

    function tooltipPercent(context) {
        var label = context.label || '';
        var value = context.parsed !== undefined ? context.parsed : context.raw;
        var total = context.chart.data.datasets[0].data.reduce(function (a, b) { return a + b; }, 0);
        var percent = total ? Math.round((value / total) * 100) : 0;
        return label + ': ' + value + ' (' + percent + '%)';
    }

    function renderCharts() {
        if (typeof Chart === 'undefined') return;
        var countryCanvas = document.getElementById('chart-countries');
        var continentCanvas = document.getElementById('chart-continents');
        var versionCanvas = document.getElementById('chart-versions');
        if (!countryCanvas && !continentCanvas && !versionCanvas) return;

        destroyCharts();

        var theme = chartTheme();
        Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = theme.muted;

        var countryStats = statify(nodes.map(function (n) { return n.cc; })).slice(0, 10);
        var continentStats = statify(nodes.map(function (n) { return n.cn; }));
        var versionStats = statify(nodes.map(function (n) {
            return n.version === '0.0.0.0' ? '<=0.1.6.8' : n.version;
        }));

        if (countryCanvas) {
            charts.country = new Chart(countryCanvas, {
                type: 'bar',
                data: {
                    labels: countryStats.map(function (row) { return countryName(row[0]); }),
                    datasets: [{
                        data: countryStats.map(function (row) { return row[1]; }),
                        backgroundColor: chartColors(countryStats.length),
                        borderRadius: 5,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: theme.grid },
                            ticks: { precision: 0, color: theme.muted }
                        },
                        y: {
                            grid: { display: false },
                            /* autoSkip would hide every other country label
                             * at the one-screen chart height. */
                            ticks: { color: theme.text, autoSkip: false }
                        }
                    }
                }
            });
        }

        if (continentCanvas) {
            charts.continent = new Chart(continentCanvas, {
                type: 'doughnut',
                data: {
                    labels: continentStats.map(function (row) { return continentName(row[0]); }),
                    datasets: [{
                        data: continentStats.map(function (row) { return row[1]; }),
                        backgroundColor: chartColors(continentStats.length),
                        borderColor: theme.surface,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '58%',
                    plugins: {
                        legend: { position: 'right', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, padding: 10 } },
                        tooltip: { callbacks: { label: tooltipPercent } }
                    }
                }
            });
        }

        if (versionCanvas) {
            charts.version = new Chart(versionCanvas, {
                type: 'doughnut',
                data: {
                    labels: versionStats.map(function (row) { return row[0]; }),
                    datasets: [{
                        data: versionStats.map(function (row) { return row[1]; }),
                        backgroundColor: chartColors(versionStats.length),
                        borderColor: theme.surface,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '58%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: theme.text, boxWidth: 10, boxHeight: 10, padding: 8,
                                font: { family: "'JetBrains Mono', monospace", size: 11 }
                            }
                        },
                        tooltip: { callbacks: { label: tooltipPercent } }
                    }
                }
            });
        }
    }

    function destroyCharts() {
        Object.keys(charts).forEach(function (key) {
            if (charts[key]) {
                charts[key].destroy();
                charts[key] = null;
            }
        });
    }

    function refreshCharts() {
        if (nodes.length > 0 && typeof Chart !== 'undefined') {
            renderCharts();
        }
    }

    function countryName(cc) {
        return COUNTRIES[cc] || cc;
    }

    function continentName(cn) {
        return CONTINENTS[cn] || cn;
    }

    /* ------------------------------------------------------------------ */
    /* boot                                                                */
    /* ------------------------------------------------------------------ */

    function loadNodes() {
        showStatus('Loading node list…', false);
        fetchNodes()
            .then(function (result) {
                nodes = result;
                addMarkers(nodes);
                renderCounts();
                renderCharts();
                showStatus(null, false);
            })
            .catch(function (error) {
                console.error('nodemap: node list unavailable', error);
                var detail = error && error.message === 'timed out'
                    ? 'The request timed out.'
                    : 'Please retry in a moment.';
                showStatus('The node list is unavailable right now. ' + detail, true);
            });
    }

    function onReady() {
        var toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(function (button) {
            button.addEventListener('click', function () {
                applyPageTheme(!isDark(), true);
            });
        });
        syncThemeButtons();

        initMap();
        loadNodes();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();
