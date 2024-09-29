import { kreiranjeSideBarMarker } from "./sidebar";
import { transform } from "ol/proj";
import KML from "ol/format/KML.js";
import { DefaultUniform } from "ol/webgl/Helper";

let markerID = 0;
export function setMarkerId(value) {
  markerID = value;
}
export function getMarkerId() {
  return markerID;
}
// Funkcija za dodavanje markera
export function dodajMarker(
  map,
  nizMarkera,
  vectorSourceMarker,
  imeElementa,
  opisElementa,
  slikaFile
) {
  const handleMapClick = function (event) {
    let coordinates = event.coordinate;
    let imeMarkera = imeElementa;
    if (imeMarkera == "" || imeMarkera == null) imeMarkera = "Marker";
    coordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");

    const kmlFormat = new KML();
    let kmlData = `<?xml version="1.0" encoding="UTF-8"?>
          <kml xmlns="http://www.opengis.net/kml/2.2">
          <Placemark>
          <name>${imeMarkera}</name>
          <Point>
          <coordinates>${coordinates[0]},${coordinates[1]},0</coordinates>
          </Point>
          </Placemark>
          </kml>`;

    const features = kmlFormat.readFeatures(kmlData, {
      featureProjection: "EPSG:3857",
    });

    features[0].setId(markerID);
    nizMarkera.push({
      name: imeMarkera,
      id: markerID,
      coord: features[0].getGeometry().getCoordinates(),
      opis: opisElementa,
      slika: slikaFile,
    });
    vectorSourceMarker.addFeature(...features);

    markerID++;
    map.un("click", handleMapClick);

    kreiranjeSideBarMarker(nizMarkera, vectorSourceMarker);

    document.getElementById("btnMarker").disabled = false;
    document.getElementById("btnPolygon").disabled = false;
  };
  map.un("click", handleMapClick);

  map.on("click", handleMapClick);
}

// Funkcija za brisanje markera sa mape
export function deleteMarker(markerIndex, vectorSourceMarker, nizMarkera) {
  // Pronalazak markera u nizu markera
  const Index = nizMarkera.findIndex((marker) => marker.id == markerIndex);

  if (Index !== -1) {
    nizMarkera.splice(Index, 1); // Uklanjanje markera iz niza markera

    // Pronalaženje markera na mapi po ID-u i uklanjanje
    const markerFeature = vectorSourceMarker.getFeatureById(markerIndex);
    if (markerFeature) {
      // Uklanjanje markera iz izvora
      vectorSourceMarker.removeFeature(markerFeature);
    } else {
      console.error("Marker not found with ID:", markerIndex);
    }
    // Osvježavanje side bara
    kreiranjeSideBarMarker(nizMarkera, vectorSourceMarker);
  } else {
    console.error("Marker not found in the array with ID:", markerIndex);
  }
}
export function editMarker(
  nizMarkera,
  vectorSourceMarker,
  ime,
  opis,
  index,
  slikaFile
) {
  nizMarkera[index].name = ime;
  nizMarkera[index].opis = opis;
  if (slikaFile != null) nizMarkera[index].slika = slikaFile;
  console.log(nizMarkera[index].slika);

  kreiranjeSideBarMarker(nizMarkera, vectorSourceMarker);
  console.log("Marker: ", index, nizMarkera[index].name);
}
