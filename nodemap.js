// NERVA nodemap by syzygy
// map.nerva.one

let node_count = 0, node_cc = [], node_cn = [], node_vers = [], node_ips = [],
    chart_cc = null, chart_cn = null, chart_vers = null,
    continents = {'AF' : 'Africa','NA' : 'North America','SA' : 'South America','EU' : 'Europe','OC' : 'Oceania','AS' : 'Asia'},
    countries = {'AF' : 'Afghanistan','AX' : 'Aland Islands','AL' : 'Albania','DZ' : 'Algeria','AS' : 'American Samoa','AD' : 'Andorra','AO' : 'Angola','AI' : 'Anguilla','AQ' : 'Antarctica','AG' : 'Antigua And Barbuda','AR' : 'Argentina','AM' : 'Armenia','AW' : 'Aruba','AU' : 'Australia','AT' : 'Austria','AZ' : 'Azerbaijan','BS' : 'Bahamas','BH' : 'Bahrain','BD' : 'Bangladesh','BB' : 'Barbados','BY' : 'Belarus','BE' : 'Belgium','BZ' : 'Belize','BJ' : 'Benin','BM' : 'Bermuda','BT' : 'Bhutan','BO' : 'Bolivia','BA' : 'Bosnia And Herzegovina','BW' : 'Botswana','BV' : 'Bouvet Island','BR' : 'Brazil','IO' : 'British Indian Ocean Territory','BN' : 'Brunei Darussalam','BG' : 'Bulgaria','BF' : 'Burkina Faso','BI' : 'Burundi','KH' : 'Cambodia','CM' : 'Cameroon','CA' : 'Canada','CV' : 'Cape Verde','KY' : 'Cayman Islands','CF' : 'Central African Republic','TD' : 'Chad','CL' : 'Chile','CN' : 'China','CX' : 'Christmas Island','CC' : 'Cocos (Keeling) Islands','CO' : 'Colombia','KM' : 'Comoros','CG' : 'Congo','CD' : 'Congo, Democratic Republic','CK' : 'Cook Islands','CR' : 'Costa Rica','CI' : 'Cote D\'Ivoire','HR' : 'Croatia','CU' : 'Cuba','CY' : 'Cyprus','CZ' : 'Czech Republic','DK' : 'Denmark','DJ' : 'Djibouti','DM' : 'Dominica','DO' : 'Dominican Republic','EC' : 'Ecuador','EG' : 'Egypt','SV' : 'El Salvador','GQ' : 'Equatorial Guinea','ER' : 'Eritrea','EE' : 'Estonia','ET' : 'Ethiopia','FK' : 'Falkland Islands (Malvinas)','FO' : 'Faroe Islands','FJ' : 'Fiji','FI' : 'Finland','FR' : 'France','GF' : 'French Guiana','PF' : 'French Polynesia','TF' : 'French Southern Territories','GA' : 'Gabon','GM' : 'Gambia','GE' : 'Georgia','DE' : 'Germany','GH' : 'Ghana','GI' : 'Gibraltar','GR' : 'Greece','GL' : 'Greenland','GD' : 'Grenada','GP' : 'Guadeloupe','GU' : 'Guam','GT' : 'Guatemala','GG' : 'Guernsey','GN' : 'Guinea','GW' : 'Guinea-Bissau','GY' : 'Guyana','HT' : 'Haiti','HM' : 'Heard Island & Mcdonald Islands','VA' : 'Holy See (Vatican City State)','HN' : 'Honduras','HK' : 'Hong Kong','HU' : 'Hungary','IS' : 'Iceland','IN' : 'India','ID' : 'Indonesia','IR' : 'Iran, Islamic Republic Of','IQ' : 'Iraq','IE' : 'Ireland','IM' : 'Isle Of Man','IL' : 'Israel','IT' : 'Italy','JM' : 'Jamaica','JP' : 'Japan','JE' : 'Jersey','JO' : 'Jordan','KZ' : 'Kazakhstan','KE' : 'Kenya','KI' : 'Kiribati','KR' : 'Korea','KW' : 'Kuwait','KG' : 'Kyrgyzstan','LA' : 'Lao People\'s Democratic Republic','LV' : 'Latvia','LB' : 'Lebanon','LS' : 'Lesotho','LR' : 'Liberia','LY' : 'Libyan Arab Jamahiriya','LI' : 'Liechtenstein','LT' : 'Lithuania','LU' : 'Luxembourg','MO' : 'Macao','MK' : 'Macedonia','MG' : 'Madagascar','MW' : 'Malawi','MY' : 'Malaysia','MV' : 'Maldives','ML' : 'Mali','MT' : 'Malta','MH' : 'Marshall Islands','MQ' : 'Martinique','MR' : 'Mauritania','MU' : 'Mauritius','YT' : 'Mayotte','MX' : 'Mexico','FM' : 'Micronesia, Federated States Of','MD' : 'Moldova','MC' : 'Monaco','MN' : 'Mongolia','ME' : 'Montenegro','MS' : 'Montserrat','MA' : 'Morocco','MZ' : 'Mozambique','MM' : 'Myanmar','NA' : 'Namibia','NR' : 'Nauru','NP' : 'Nepal','NL' : 'Netherlands','AN' : 'Netherlands Antilles','NC' : 'New Caledonia','NZ' : 'New Zealand','NI' : 'Nicaragua','NE' : 'Niger','NG' : 'Nigeria','NU' : 'Niue','NF' : 'Norfolk Island','MP' : 'Northern Mariana Islands','NO' : 'Norway','OM' : 'Oman','PK' : 'Pakistan','PW' : 'Palau','PS' : 'Palestinian Territory, Occupied','PA' : 'Panama','PG' : 'Papua New Guinea','PY' : 'Paraguay','PE' : 'Peru','PH' : 'Philippines','PN' : 'Pitcairn','PL' : 'Poland','PT' : 'Portugal','PR' : 'Puerto Rico','QA' : 'Qatar','RE' : 'Reunion','RO' : 'Romania','RU' : 'Russian Federation','RW' : 'Rwanda','BL' : 'Saint Barthelemy','SH' : 'Saint Helena','KN' : 'Saint Kitts And Nevis','LC' : 'Saint Lucia','MF' : 'Saint Martin','PM' : 'Saint Pierre And Miquelon','VC' : 'Saint Vincent And Grenadines','WS' : 'Samoa','SM' : 'San Marino','ST' : 'Sao Tome And Principe','SA' : 'Saudi Arabia','SN' : 'Senegal','RS' : 'Serbia','SC' : 'Seychelles','SL' : 'Sierra Leone','SG' : 'Singapore','SK' : 'Slovakia','SI' : 'Slovenia','SB' : 'Solomon Islands','SO' : 'Somalia','ZA' : 'South Africa','GS' : 'South Georgia And Sandwich Isl.','ES' : 'Spain','LK' : 'Sri Lanka','SD' : 'Sudan','SR' : 'Suriname','SJ' : 'Svalbard And Jan Mayen','SZ' : 'Swaziland','SE' : 'Sweden','CH' : 'Switzerland','SY' : 'Syrian Arab Republic','TW' : 'Taiwan','TJ' : 'Tajikistan','TZ' : 'Tanzania','TH' : 'Thailand','TL' : 'Timor-Leste','TG' : 'Togo','TK' : 'Tokelau','TO' : 'Tonga','TT' : 'Trinidad And Tobago','TN' : 'Tunisia','TR' : 'Turkey','TM' : 'Turkmenistan','TC' : 'Turks And Caicos Islands','TV' : 'Tuvalu','UG' : 'Uganda','UA' : 'Ukraine','AE' : 'United Arab Emirates','GB' : 'United Kingdom','US' : 'United States','UM' : 'United States Outlying Islands','UY' : 'Uruguay','UZ' : 'Uzbekistan','VU' : 'Vanuatu','VE' : 'Venezuela','VN' : 'Viet Nam','VG' : 'Virgin Islands, British','VI' : 'Virgin Islands, U.S.','WF' : 'Wallis And Futuna','EH' : 'Western Sahara','YE' : 'Yemen','ZM' : 'Zambia','ZW' : 'Zimbabwe'},
    map_markers = L.markerClusterGroup({maxClusterRadius: 20});
    
const map_icon = new L.Icon({ iconUrl: 'img/marker-nerva.png', shadowUrl: 'img/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

function isDark() { return document.documentElement.classList.contains('dark-mode'); }
function getChartFontColor() { return isDark() ? '#D4D7D9' : '#000'; }

function updateThemeIcons() {
    document.querySelectorAll('.theme-icon').forEach(function(icon) {
        icon.className = (isDark() ? 'fas fa-sun' : 'fas fa-moon') + ' theme-icon';
    });
}

function toggleTheme() {
    var dark = document.documentElement.classList.toggle('dark-mode');
    document.documentElement.style.backgroundColor = dark ? '#1a1d20' : '';
    localStorage.setItem('nerva-nodemap-theme', dark ? 'dark' : 'light');
    updateThemeIcons();

    if (typeof map !== 'undefined' && typeof map_tiles !== 'undefined') {
        map.removeLayer(map_tiles);
        map_tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 10,
            id: dark ? 'mapbox/dark-v10' : 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoicjBiYzBkM3IiLCJhIjoiY2t3em9vYWhkMHd3MDJwcW9tNnN4NGhpNyJ9.OlqG06vAc_7QwbKI2CeuTA'
        }).addTo(map);
    }

    var fc = getChartFontColor();
    if (chart_cc) { chart_cc.options.scales.yAxes[0].ticks.fontColor = fc; chart_cc.update(); }
    if (chart_cn) { chart_cn.options.scales.xAxes[0].ticks.fontColor = fc; chart_cn.update(); }
    if (chart_vers) { chart_vers.options.legend.labels.fontColor = fc; chart_vers.update(); }
}

function onPageLoad()
{
    $.when(jQuery.getJSON("https://api.nerva.one/analytics/fetch/", function(){}).done(function(data) {
        let nodes = data.result;
        for (let i = 0; i <= nodes.length; i++)
        {
            if (typeof nodes[i] !== 'undefined') {
                let time = nodes[i]["time"],
                    latlng = [nodes[i]["lat"], nodes[i]["long"]],
                    marker = L.marker(latlng, {riseOnHover: true}, {title: i});
                node_count ++;
                node_ips[i] = nodes[i]["ip"];
                node_vers[i] = (nodes[i]["version"] == "0.0.0.0" /*Peerlist import*/ ? "<=0.1.6.8" : nodes[i]["version"]); 
                node_cc[i] = nodes[i]["cc"];
                node_cn[i] = nodes[i]["cn"];

                marker.setIcon(map_icon);
                marker.bindPopup("IP: <strong>" + node_ips[i] + "</strong><br />Version: <strong>" + node_vers[i] + "</strong><br />Connected: <strong>" + time + "</strong><br />");
                map_markers.addLayer(marker);
            }
        }
    })).then(function () {
        map_render();
        stats_render();
    });
}

function map_render()
{
    let latlng = [25, 15], zoom = 2, bounds = L.latLngBounds([-90, -9000], [90, 9000]);

    map = L.map('map', {'worldCopyJump': true}).setView(latlng, zoom);
    map.setMaxBounds(bounds);
    map.on('drag', function() { map.panInsideBounds(bounds, { animate: false }); });
    
    map_tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
     maxZoom: 10,
     id: isDark() ? 'mapbox/dark-v10' : 'mapbox/streets-v11',
     accessToken: 'pk.eyJ1IjoicjBiYzBkM3IiLCJhIjoiY2t3em9vYWhkMHd3MDJwcW9tNnN4NGhpNyJ9.OlqG06vAc_7QwbKI2CeuTA'
    }).addTo(map);
    
    map.addLayer(map_markers);
}

function stats_render()
{
    let countries = statify(node_cc), continents = statify(node_cn), versions = statify(node_vers);
    
    document.getElementById("count_nodes").innerHTML = node_count;
    document.getElementById("count_countries").innerHTML = countries.length;
    
    chart_cc = new Chart(document.getElementById("countries").getContext('2d'), {
        type: 'horizontalBar',
        data: { datasets: [{}] },
        options: {
            legend: { display: false },
            scales: {
                xAxes: [{
                    display: false,
                    type: 'logarithmic'
                }],
                yAxes: [{
                    ticks: { fontColor: getChartFontColor() }
                }],
            }
        }
    });
    chart_cc.config.data.datasets[0].backgroundColor = gradify(9);
        
    chart_cn = new Chart(document.getElementById("continents").getContext('2d'), {
        type: 'bar',
        data: { datasets: [{}] },
        options: {
            legend: { display: false },
            scales: {
                xAxes: [{
                    ticks: { fontColor: getChartFontColor() },
                }],
                yAxes: [{
                    display: false,
                    type: 'logarithmic'
                }],
            }
        }
    });
    chart_cn.config.data.datasets[0].backgroundColor = gradify(5);
        
    chart_vers = new Chart(document.getElementById("version").getContext('2d'), {
        type: 'pie',
        data: { datasets: [{ borderWidth: 1 }] },
        options: {
            legend: {
                position: 'left',
                labels: {
                    fontColor: "#000"
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let allData = data.datasets[tooltipItem.datasetIndex].data,
                            tooltipLabel = data.labels[tooltipItem.index],
                            tooltipData = allData[tooltipItem.index],
                            total = 0;
                        for (let i in allData) { total += parseFloat(allData[i]); }
                        let tooltipPercentage = Math.round((tooltipData / total) * 100);
                        return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                    }
                }
            }
        }
    });
    chart_vers.config.data.datasets[0].backgroundColor = gradify(versions.length);
    
    // Import data
    
    for (let i=0; i<=9; i++) {
        countries[i][0] = getCountryName(countries[i][0]);
        addChartData(chart_cc, countries[i][0], countries[i][1]);
    }
    for (let i=0; i<=continents.length - 2; i++) {
        continents[i][0] = getContinentName(continents[i][0]);
        addChartData(chart_cn, continents[i][0], continents[i][1]);
    }
    for (let i=0; i<=versions.length - 2; i++) {
        addChartData(chart_vers, versions[i][0], versions[i][1]);
    }
    chart_cc.update();
    chart_cn.update();
    chart_vers.update();
}

function addChartData(chart, label, value)
{
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => { dataset.data.push(value); });
    chart.update();
}

function deunix(time)
{
    // convert unix stamp to human friendly time
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        date = new Date(time*1000),
        month = months[date.getMonth()],
        day = date.getDate(),
        realtime = month + " " + day;
        
    return realtime;
}

function statify(array)
{
    // order by frequency of values in given array
    let c = {}, s = [];
    for (let i=0; i<=array.length; i++) {
        c[array[i]] = c[array[i]] || 0;
        c[array[i]]++;
    }
    for (let key in c) {
        s.push([key, c[key]])
    }
    s.sort(function(a, b) {return b[1]-a[1];});
    return(s);
}

function gradify(x)
{
    // generate nerva gradient with x color stops
    let color1 = [85, 168, 191, 1],
        color2 = [99, 88, 145, 1],
        array = [];
    for (let i=0; i<=x; i++) {
        let p = 1 / x * i,
            w = p * 2 - 1,
            w1 = (w/1+1) / 2,
            w2 = 1 - w1;
        array[i] = "rgba(" + Math.round(color1[0] * w1 + color2[0] * w2) + "," + Math.round(color1[1] * w1 + color2[1] * w2) + "," + Math.round(color1[2] * w1 + color2[2] * w2) + "," + 1 + ")";
    }
    return array;
}

function getCountryName (cc) {
    if (countries.hasOwnProperty(cc)) {
        return countries[cc];
    } else return cc;
}

function getContinentName (cn) {
    if (continents.hasOwnProperty(cn)) {
        return continents[cn];
    } else return cn;
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    });
    updateThemeIcons();
});
