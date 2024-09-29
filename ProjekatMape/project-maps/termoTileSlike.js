import TileLayer from "ol/layer/Tile";
import TileImage from "ol/source/TileImage";
import TileGrid from "ol/tilegrid/TileGrid";
import { transform } from "ol/proj";

//f-ja za dodavanje termo slika na mapi
function createTermoTile(
  procenat,
  MaxZoom,
  MinZoom,
  imeFoldera,
  SlikaBounds,
  imeTeritorije,
  map
) {
  const overlay = new TileLayer({
    name: imeTeritorije,
    source: new TileImage({
      tileUrlFunction: function (tileCoord, pixelRatio, projection) {
        //TSM koordinate tile-a
        const z = tileCoord[0];
        const x = tileCoord[1];
        const y = tileCoord[2];
        //konvertovanje koordinata u dati projection
        let arr = this.tileGrid.getTileCoordExtent(tileCoord);
        //prva tacka tile-a(njene koordinate)
        let latlon1 = transform([arr[0], arr[1]], projection, "EPSG:4326");
        //druga tacka tile-a(njene koordinate)
        let latlon2 = transform([arr[2], arr[3]], projection, "EPSG:4326");
        //uslov za prikaz slika na mapi
        if (
          latlon2[0] >= SlikaBounds[0] &&
          latlon1[0] <= SlikaBounds[2] &&
          latlon2[1] >= SlikaBounds[1] &&
          latlon1[1] <= SlikaBounds[3] &&
          MinZoom <= z &&
          MaxZoom >= z
        ) {
          //putanja do date slike
          const tileUrl = `${imeFoldera}/${z}/${x}/${
            Math.pow(2, z) - y - 1
          }.png`;

          return tileUrl;
        } else {
          return "";
        }
      },
      projection: "EPSG:3857",
      tileGrid: new TileGrid({
        resolutions: [
          156543.03392804097, 78271.51696402048, 39135.75848201024,
          19567.87924100512, 9783.93962050256, 4891.96981025128,
          2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705,
          152.8740565703525, 76.43702828517625, 38.21851414258813,
          19.109257071294063, 9.554628535647032, 4.777314267823516,
          2.388657133911758, 1.194328566955879, 0.5971642834779395,
          0.29858214173896974, 0.14929107086948487, 0.07464553543474244,
          0.03732276771737122, 0.01866138385868561, 0.009330691929342804,
        ],
        tileSize: [256, 256],
        origin: [-20037508.34, 20037508.34],
      }),
    }),
    opacity: parseFloat(procenat) / 100.0,
  });
  map.addLayer(overlay);
}
//f-ja za brisanje Termo Tile(Slike)
function delTermoTile(name, map) {
  let nizTile = map.getLayers().array_;

  for (let index = 0; index < nizTile.length; index++) {
    if (nizTile[index].values_["name"] == name) {
      map.removeLayer(nizTile[index]);
    }
  }
}
//f-ja za prikaz termo slika
export function prikazTermoSlika(name, TermoCheckBox, map, TeritorijeGrad) {
  if (TermoCheckBox == true) {
    createTermoTile(
      "100",
      TeritorijeGrad.Kragujevac.Teritorije[name].MaxZoom,
      TeritorijeGrad.Kragujevac.Teritorije[name].MinZoom,
      TeritorijeGrad.Kragujevac.Teritorije[name].imeFoldera,
      TeritorijeGrad.Kragujevac.Teritorije[name].SlikaBounds,
      TeritorijeGrad.Kragujevac.Teritorije[name].imeTeritorije,
      map
    );
  } else {
    delTermoTile(name, map);
  }
}
