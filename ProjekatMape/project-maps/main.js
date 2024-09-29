import { Map, View } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import KML from "ol/format/KML.js";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, transform } from "ol/proj";
import { citanjeFajla, pisanjeFajla } from "./radSafajlovima.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import MultiPoint from "ol/geom/MultiPoint.js";
import GeoJSON from "ol/format/GeoJSON.js";
import {
  kreiranjeSideBarPolygon,
  kreiranjeSideBarMarker,
  kreiranjeSideBarTermoSlike,
} from "./sidebar.js";
import { dodajPolygon, setPolygonId, getPolygonId } from "./polygonFunkcije.js";
import { getMarkerId, setMarkerId, dodajMarker } from "./markerFunkcije.js";
import { openPopup } from "./popUp.js";
//deklarisanje objekta za prikaz termo slika
const TeritorijeGrad = {
  Kragujevac: {
    Teritorije: {
      A_Aerodrom_1_Termo: {
        imeTeritorije: "A_Aerodrom_1_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/Aerodrom/A_Aerodrom_1_Termo",
        SlikaBounds: [
          20.903812377307499, // west
          44.027251901540822, // south
          20.919602316584747, // east
          44.032269131201694, // north
        ],
      },
      A_Aerodrom_2_Termo: {
        imeTeritorije: "A_Aerodrom_2_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/Aerodrom/A_Aerodrom_2_Termo",
        SlikaBounds: [
          20.898550721277399, // west
          44.028625505530457, // south
          20.904372316088708, // east
          44.029929419651118, // north
        ],
      },
      C_Centar_Termo: {
        imeTeritorije: "C_Centar_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/Centar/C_Centar_Termo",
        SlikaBounds: [
          20.904956217430129, // west
          44.008363136797925, // south
          20.919558996767478, // east
          44.020983185342118, // north
        ],
      },
      C_Institut_za_fiziku_Termo: {
        imeTeritorije: "C_Institut_za_fiziku_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/Centar/C_Institut_za_fiziku_Termo",
        SlikaBounds: [
          20.905525481352807, // west
          44.017741364383717, // south
          20.907110164490891, // east
          44.019033791650472, // north
        ],
      },
      C_Mihaila_Milovana_Termo: {
        imeTeritorije: "C_Mihaila_Milovana_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/Centar/C_Mihaila_Milovana_Termo",
        SlikaBounds: [
          20.913561321111196, // west
          44.014881041013631, // south
          20.915492752870968, // east
          44.016448073002671, // north
        ],
      },
      CR_Babovic_Termo: {
        imeTeritorije: "CR_Babovic_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/CentralnaRadionica/CR_Babovic_Termo",
        SlikaBounds: [
          20.889084972355164, // west
          44.006299352848991, // south
          20.89657982230511, // east
          44.007565611611, // north
        ],
      },
      CR_Josifa_Ilindenska_Termo: {
        imeTeritorije: "CR_Josifa_Ilindenska_Termo",
        MaxZoom: 20,
        MinZoom: 14,
        imeFoldera: "kml/CentralnaRadionica/CR_Josifa_Ilindenska_Termo",
        SlikaBounds: [
          20.886719920304316, // west
          44.003010531072235, // south
          20.895169758812351, // east
          44.007819392371154, // north
        ],
      },
      E_Erdoglija_1_Termo: {
        imeTeritorije: "E_Erdoglija_1_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/E_Erdoglija_1_Termo",
        SlikaBounds: [
          20.90392993336086, // west
          44.005682948799624, // south
          20.909078324230382, // east
          44.011097371647026, // north
        ],
      },
      E_Erdoglija_2_Termo: {
        imeTeritorije: "E_Erdoglija_2_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/E_Erdoglija_2_Termo",
        SlikaBounds: [
          20.897551836812447, // west
          44.005977014780015, // south
          20.904833838322002, // east
          44.007369874900583, // north
        ],
      },
      E_Erdoglija_3_Termo: {
        imeTeritorije: "E_Erdoglija_3_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/E_Erdoglija_3_Termo",
        SlikaBounds: [
          20.900669812806822, // west
          44.00904763455479, // south
          20.902928097840363, // east
          44.011574750784561, // north
        ],
      },
      E_Erdoglija_4_Termo: {
        imeTeritorije: "E_Erdoglija_4_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/E_Erdoglija_4_Termo",
        SlikaBounds: [
          20.894870087660767, // west
          44.009568271440557, // south
          20.899709796467921, // east
          44.012452860596198, // north
        ],
      },
      KE_Erdoglija_5_Termo: {
        imeTeritorije: "KE_Erdoglija_5_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/KE_Erdoglija_5_Termo",
        SlikaBounds: [
          20.900273674002324, // west
          44.014525235971014, // south
          20.901716410030449, // east
          44.015566069453961, // north
        ],
      },
      KE_Erdoglija_6_Termo: {
        imeTeritorije: "KE_Erdoglija_6_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/KE_Erdoglija_6_Termo",
        SlikaBounds: [
          20.898542230491167, // west
          44.013977271692639, // south
          20.900227643339022, // east
          44.015060131687854, // north
        ],
      },
      KE_Erdoglija_7_Termo: {
        imeTeritorije: "KE_Erdoglija_7_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/KE_Erdoglija_7_Termo",
        SlikaBounds: [
          20.897920754867204, // west
          44.0133498886984, // south
          20.899622030166348, // east
          44.014475227681608, // north
        ],
      },
      KE_Erdoglija_8_Termo: {
        imeTeritorije: "KE_Erdoglija_8_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Erdoglija/KE_Erdoglija_8_Termo",
        SlikaBounds: [
          20.893869249180405, // west
          44.012822003525145, // south
          20.896863888642233, // east
          44.014862915683089, // north
        ],
      },
      KBC_1_Termo: {
        imeTeritorije: "KBC_1_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/KBC/KBC_1_Termo",
        SlikaBounds: [
          20.916632487962247, // west
          44.016669716573922, // south
          20.921096046378292, // east
          44.021815056346185, // north
        ],
      },
      KBC_2_Termo: {
        imeTeritorije: "KBC_2_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/KBC/KBC_2_Termo",
        SlikaBounds: [
          20.917009636291802, // west
          44.022030396920194, // south
          20.922863072157856, // east
          44.029106051353473, // north
        ],
      },
      KBC_3_Termo: {
        imeTeritorije: "KBC_3_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/KBC/KBC_3_Termo",
        SlikaBounds: [
          20.916218503226318, // west
          44.018584915245278, // south
          20.91950550622456, // east
          44.021236365821586, // north
        ],
      },
      KBC_4_Termo: {
        imeTeritorije: "KBC_4_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/KBC/KBC_4_Termo",
        SlikaBounds: [
          20.913519636497238, // west
          44.018751905102363, // south
          20.917218046875025, // east
          44.021684796984083, // north
        ],
      },
      KBC_5_Termo: {
        imeTeritorije: "KBC_5_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/KBC/KBC_5_Termo",
        SlikaBounds: [
          20.914455139608666, // west
          44.020412055095129, // south
          20.915790726745662, // east
          44.021003683046821, // north
        ],
      },
      L_Lepenica_1_Termo: {
        imeTeritorije: "L_Lepenica_1_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/lepenica/L_Lepenica_1_Termo",
        SlikaBounds: [
          20.911116641315587, // west
          44.007254496979037, // south
          20.913442105510175, // east
          44.008816339643047, // north
        ],
      },
      L_Lepenica_2_Termo: {
        imeTeritorije: "L_Lepenica_2_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/lepenica/L_Lepenica_2_Termo",
        SlikaBounds: [
          20.913028847151988, // west
          44.009878252072177, // south
          20.914782065735807, // east
          44.010522968565759, // north
        ],
      },
      L_Lepenica_3_Termo: {
        imeTeritorije: "L_Lepenica_3_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/lepenica/L_Lepenica_3_Termo",
        SlikaBounds: [
          20.915644962963555, // west
          44.007515901771811, // south
          20.917022872608189, // east
          44.008587020444374, // north
        ],
      },
      L_Lepenica_4_Termo: {
        imeTeritorije: "L_Lepenica_4_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/lepenica/L_Lepenica_4_Termo",
        SlikaBounds: [
          20.918203243440498, // west
          44.009068535866149, // south
          20.924513876061919, // east
          44.016168404538412, // north
        ],
      },
      S_Stanovo_Termo: {
        imeTeritorije: "S_Stanovo_Termo",
        MaxZoom: 20,
        MinZoom: 15,
        imeFoldera: "kml/Stanovo/S_Stanovo_Termo",
        SlikaBounds: [
          20.883802325301993, // west
          43.998947748605524, // south
          20.888437378393981, // east
          44.002285579647832, // north
        ],
      },
    },
  },
};
//Deklaracija stila za polygon
const styles = [
  new Style({
    stroke: new Stroke({
      color: "blue",
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.3)",
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 3,
      fill: new Fill({
        color: "blue",
      }),
    }),
    geometry: function (feature) {
      const coordinates = feature.getGeometry().getCoordinates()[0];
      return new MultiPoint(coordinates);
    },
  }),
];
//Deklaracija niza za markere i polygon i njihovi id brojaci
let nizMarkera = [];
let nizPolygon = [];
//Deklarisanje vector sourc-a i vector layer-a

const vectorSourceMarker = new VectorSource({
  format: new KML(),
});
const vectorSourcePolygon = new VectorSource({
  format: new KML(),
});

const vectorLayerMarker = new VectorLayer({
  source: vectorSourceMarker,
  zIndex: 100,
});
const vectorLayerPolygon = new VectorLayer({
  source: vectorSourcePolygon,
  zIndex: 100,
  style: styles,
});
//Deklarisanje mape
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayerPolygon,
    vectorLayerMarker,
  ],
  view: new View({
    center: fromLonLat([20.91111, 44.00725447]),
    zoom: 12,
    minZoom: 12,
    maxZoom: 20,
  }),
});
//pozivanje funkcije za kreiranje sidebar-a za termo slike
kreiranjeSideBarTermoSlike(TeritorijeGrad, map);

//Dodavanje dogadjaja

//marker dogadjaj
let DugmeMarker = document.getElementById("btnMarker");
let DugmePolygon = document.getElementById("btnPolygon");
const dodajMarkerHandler = () => {
  DugmeMarker.disabled = true;
  DugmePolygon.disabled = true;
  openPopup("Marker", map, nizMarkera, vectorSourceMarker, null);
};

DugmeMarker.addEventListener("click", dodajMarkerHandler);

//polygon dogadjaj

const dodajPolygonHandler = () => {
  DugmeMarker.disabled = true;
  DugmePolygon.disabled = true;

  openPopup("Polygon", map, nizPolygon, vectorSourcePolygon, null);
};
DugmePolygon.addEventListener("click", dodajPolygonHandler);

//////// UNOS U NIZ MARKER I POLYGON IZ FAJLOVA  ///////////////
citanjeFajla("dist/korisnik/markeri.txt")
  .then((result) => {
    nizMarkera = result;
    if (nizMarkera.length != 0) {
      nizMarkera.forEach(function (element) {
        let coordinates = transform(element["coord"], "EPSG:3857", "EPSG:4326");
        const kmlFormat = new KML();
        let kmlData = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
    <Placemark>
    <name>${element["name"]}</name>
    <Point>
    <coordinates>${coordinates[0]},${coordinates[1]},0</coordinates>
    </Point>
    </Placemark>
    </kml>`;

        const features = kmlFormat.readFeatures(kmlData, {
          featureProjection: "EPSG:3857",
        });
        features[0].setId(getMarkerId());
        element["id"] = getMarkerId();
        setMarkerId(element["id"] + 1);
        vectorSourceMarker.addFeature(...features);
      });
      kreiranjeSideBarMarker(nizMarkera, vectorSourceMarker);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
citanjeFajla("dist/korisnik/polygon.txt")
  .then((result) => {
    nizPolygon = result;
    if (nizPolygon.length != 0) {
      nizPolygon.forEach(function (element) {
        let koordinate = [];
        for (let i = 0; i < element["FlCoord"].length; i = i + 2) {
          koordinate.push([element["FlCoord"][i], element["FlCoord"][i + 1]]);
        }
        element["id"] = getPolygonId();
        setPolygonId(element["id"] + 1);

        let geojsonObject = {
          type: "FeatureCollection",
          crs: {
            type: "name",
            properties: {
              name: "EPSG:3857",
            },
          },
          features: [
            {
              type: "Feature",
              id: element["id"],
              geometry: {
                type: "Polygon",
                coordinates: [koordinate],
              },
            },
          ],
        };

        let feature = new GeoJSON().readFeatures(geojsonObject);
        vectorSourcePolygon.addFeature(...feature);
      });

      kreiranjeSideBarPolygon(nizPolygon, vectorSourcePolygon);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

//////// UNOS U FAJL IZ NIZA MARKER I POLYGON  //////
document.getElementById("btnSacuvaj").addEventListener("click", function () {
  pisanjeFajla("dist/korisnik/markeri.txt", nizMarkera);

  pisanjeFajla("dist/korisnik/polygon.txt", nizPolygon);
});
