import Draw from "ol/interaction/Draw.js";
import { kreiranjeSideBarPolygon } from "./sidebar";
///////////////   POLYGON   //////////////////
let polygonID = 0;
export function setPolygonId(value) {
  polygonID = value;
}
export function getPolygonId() {
  return polygonID;
}
//f-ja za dodavanje polygona
export function dodajPolygon(
  map,
  vectorSourcePolygon,
  nizPolygon,
  imeElementa,
  opisElementa
) {
  let imePolygon = imeElementa;
  console.log(imeElementa, opisElementa);
  if (imePolygon == "" || imePolygon == null) imePolygon = "Polygon";
  let draw = new Draw({
    source: vectorSourcePolygon,
    type: "Polygon",
    geometryName: imePolygon,
  });

  map.addInteraction(draw);

  draw.on("drawend", (event) => {
    map.removeInteraction(draw);
    event.feature.setId(polygonID);
    nizPolygon.push({
      name: imePolygon,
      id: polygonID,
      FlCoord: event.feature.values_[imePolygon].flatCoordinates,
      opis: opisElementa,
    });
    polygonID++;
    document.getElementById("btnMarker").disabled = false;
    document.getElementById("btnPolygon").disabled = false;
    kreiranjeSideBarPolygon(nizPolygon, vectorSourcePolygon);
  });
}
//funkcija za brisanje poligona
export function deletePolygon(polygonIndex, vectorSourcePolygon, nizPolygon) {
  const polygonFeature = vectorSourcePolygon.getFeatureById(polygonIndex);

  let pozicijaPolyUNiz = nizPolygon.findIndex(
    (poly) => poly.id === polygonIndex
  );

  nizPolygon.splice(pozicijaPolyUNiz, 1);

  vectorSourcePolygon.removeFeature(polygonFeature);
  kreiranjeSideBarPolygon(nizPolygon, vectorSourcePolygon);
}
export function editPolygon(
  nizPolygon,
  vectorSourcePolygon,
  ime,
  opis,
  index,
  slikaFile
) {
  console.log(nizPolygon[index]);
  nizPolygon[index].name = ime;
  nizPolygon[index].opis = opis;
  if (slikaFile != null) nizPolygon[index].slika = slikaFile;

  kreiranjeSideBarPolygon(nizPolygon, vectorSourcePolygon);
}
