# nerva-nodemap
Interactive map of NERVA full nodes: [map.nerva.one](https://map.nerva.one)

Join us on discord: https://discord.gg/jsdbEns

## About

Two pages are served from this repository:

- `index.html` is the dashboard: the world map of active nodes, the node
  count, and charts of nodes by country, by continent, and by daemon
  version.
- `nodemap.html` is the bare map, embedded in an iframe on
  [nerva.one](https://nerva.one). It follows the parent site theme through
  the `?theme=dark` or `?theme=light` query parameter, and it does not load
  the chart library at all.

Node positions and versions come from `https://api.nerva.one/analytics/fetch/`,
which lists the nodes seen by the seed nodes during the last 48 hours. Only
nodes running version 0.1.7.4 or newer are detected. Nodes whose geolocation
fails (empty coordinates) still count towards the node total, but they never
appear on the map, as a country, or as a continent.

## Design

The visual language follows the nerva.one theme: the same color tokens, the
teal to violet brand gradient on marker clusters and charts, Space Grotesk
for headings, Inter for text, and JetBrains Mono for numbers.

Everything is self-hosted, so a visitor's browser only ever talks to two
remote services: the Mapbox tile server, and NERVA's own
`api.nerva.one`. No third-party script, tracker or CDN is involved.

Dark mode keeps the same streets basemap and dims the tile pane, so the
geography stays readable while markers, clusters and controls keep full
contrast; every surface, chart and control re-themes around it.

## Vendored libraries and fonts

The `vendor/` and `fonts/` directories are pinned, self-hosted copies of
official releases, so anyone can verify them with `sha256sum`:

| File                          | Version | License                                       |
| ----------------------------- | ------- | --------------------------------------------- |
| `vendor/leaflet.js`           | 1.9.4   | BSD-2-Clause (`LICENSE-leaflet`)              |
| `vendor/leaflet.css`          | 1.9.4   | BSD-2-Clause (`LICENSE-leaflet`)              |
| `vendor/leaflet.markercluster.js` | 1.5.3 | MIT (`LICENSE-leaflet.markercluster`)       |
| `vendor/MarkerCluster.css`    | 1.5.3   | MIT (`LICENSE-leaflet.markercluster`)         |
| `vendor/MarkerCluster.Default.css` | 1.5.3 | MIT (`LICENSE-leaflet.markercluster`)    |
| `vendor/chart.umd.js`         | 4.4.9   | MIT (`LICENSE-chart.js`)                      |

All of them are byte-identical to the files served by
`https://cdn.jsdelivr.net/npm/<package>@<version>/dist/...`, with one
exception: `leaflet.markercluster.js` carries a 340-byte MIT notice banner
above the official dist, because the upstream build ships without any
license notice. Stripping the leading comment block reproduces the jsdelivr
file exactly. The license texts are kept alongside the files in `vendor/`.

The fonts in `fonts/` are latin subsets of the variable fonts Inter,
Space Grotesk and JetBrains Mono (one file per family, covering every
weight in use), licensed under the SIL Open Font License 1.1; the full
license and the copyright lines for each family are in `fonts/OFL.txt`.

The Mapbox token in `nodemap.js` is a publishable key by design, scoped to
`styles:tiles` and `styles:read`, and restricted to the `nerva.one` origin.
It is committed as a plain literal on purpose; if your tooling flags it,
treat it as a false positive rather than obfuscating it.

## Development

The site is plain HTML, CSS and JavaScript with no build step. Serve the
repository root locally, for example with `python3 -m http.server`, and open
`index.html`. The theme is controlled three ways, in order of precedence:
the `?theme` query parameter, the `nerva-nodemap-theme` local storage key
(set by the toggle button), and the operating system preference.

When updating a vendored library, download the official dist from jsdelivr
at the pinned version, verify it, update the sha256 expectations and the
version table above, and keep the license files in sync.
