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
nodes running version 0.1.7.4 or newer are detected.

## Design

The visual language follows the nerva.one theme: the same color tokens, the
teal to violet brand gradient on marker clusters and charts, Space Grotesk
for headings, Inter for text, and JetBrains Mono for numbers. Fonts and the
Leaflet, MarkerCluster and Chart.js libraries are self-hosted in `fonts/` and
`vendor/`, so no third party sees visitor requests beyond the tile and
analytics services. Dark mode is native rather than a filter: the map
switches to the Mapbox dark tile set, and every surface, chart and control
re-themes.

## Development

The site is plain HTML, CSS and JavaScript with no build step. Serve the
repository root locally, for example with `python3 -m http.server`, and open
`index.html`. The theme is controlled three ways, in order of precedence:
the `?theme` query parameter, the `nerva-nodemap-theme` local storage key
(set by the toggle button), and the operating system preference.
