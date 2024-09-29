import { deletePolygon, editPolygon } from "./polygonFunkcije";
import { deleteMarker } from "./markerFunkcije";
import { prikazTermoSlika } from "./termoTileSlike.js";
import { openPopup, popupDisplayInfo } from "./popUp.js";

// sidebar f-ja za polygon
export function kreiranjeSideBarPolygon(nizPolygon, vectorSourcePolygon) {
  const existingList = document.getElementById("sidebarListaPolygon");
  if (existingList) {
    existingList.parentNode.removeChild(existingList);
  }

  const sidebarDivPolygon = document.getElementById("sidebarMenuPolygon");
  const listPolygon = document.createElement("ul");
  listPolygon.id = "sidebarListaPolygon";
  listPolygon.style.listStyleType = "none";
  let index = 0;
  for (let polygon of nizPolygon) {
    const listItem = document.createElement("li");
    listItem.classList.add("elementList");

    // Kreirajte dugme "Edit"
    const DugmeZaEdit = document.createElement("button");
    let Edit = document.createTextNode("Edit");
    DugmeZaEdit.appendChild(Edit);
    DugmeZaEdit.value = index;
    index++;
    DugmeZaEdit.classList.add("btnEditPoligona");
    // Kreirajte dugme "X" za brisanje poligona
    const DugmeZaBrisanjePolygon = document.createElement("button");
    let X = document.createTextNode("X");
    DugmeZaBrisanjePolygon.appendChild(X);
    DugmeZaBrisanjePolygon.value = polygon["id"];
    DugmeZaBrisanjePolygon.classList.add("btnBrisanjePolygon");

    const polygonText = document.createElement("span");
    polygonText.classList.add("spanElement");
    polygonText.textContent = polygon["name"];
    polygonText.addEventListener("click", function () {
      popupDisplayInfo("Polygon", nizPolygon, DugmeZaEdit.value);
    });
    // Dodajte event listener za dugme "Edit"
    DugmeZaEdit.addEventListener("click", function () {
      openPopup(
        "Polygon",
        map,
        nizPolygon,
        vectorSourcePolygon,
        DugmeZaEdit.value
      ); /* const novoImePoligona = prompt(
        "Unesite novi naziv poligona:",
        polygon["name"]
      );
      if (novoImePoligona !== null && novoImePoligona !== "") {
        // Ažurirajte naziv poligona u nizu poligona
        polygon["name"] = novoImePoligona;

        // Osvježite sidebar za poligone
        kreiranjeSideBarPolygon(nizPolygon, vectorSourcePolygon);
      }*/
    });
    listItem.appendChild(DugmeZaEdit);
    listItem.appendChild(DugmeZaBrisanjePolygon);
    listItem.appendChild(polygonText);

    listPolygon.appendChild(listItem);
  }
  sidebarDivPolygon.appendChild(listPolygon);

  document.querySelectorAll(".btnBrisanjePolygon").forEach((btnPolygon) => {
    btnPolygon.addEventListener("click", function (event) {
      const polygonIndex = parseInt(event.target.value);
      deletePolygon(polygonIndex, vectorSourcePolygon, nizPolygon);
    });
  });
}

// sidebar f-ja za markere
export function kreiranjeSideBarMarker(nizMarkera, vectorSourceMarker) {
  const existingList = document.getElementById("sidebarListaMarkera");
  if (existingList) {
    existingList.parentNode.removeChild(existingList);
  }

  const sidebarDivMarker = document.getElementById("sidebarMenuMarker");
  const listMarker = document.createElement("ul");
  listMarker.id = "sidebarListaMarkera";
  listMarker.style.listStyleType = "none";
  let index = 0;
  for (let marker of nizMarkera) {
    const listItem = document.createElement("li");
    listItem.classList.add("elementList");
    // Kreirajte dugme "Edit"
    const DugmeZaEdit = document.createElement("button");
    let Edit = document.createTextNode("Edit");
    DugmeZaEdit.appendChild(Edit);
    DugmeZaEdit.value = index;
    DugmeZaEdit.classList.add("btnEditMarkera");
    // Kreirajte dugme "X" za brisanje markera
    const DugmeZaBrisanjeMarkera = document.createElement("button");
    let X = document.createTextNode("X");
    DugmeZaBrisanjeMarkera.appendChild(X);
    DugmeZaBrisanjeMarkera.value = parseInt(marker["id"]);
    DugmeZaBrisanjeMarkera.classList.add("btnBrisanjeMarkera");

    const markerTekst = document.createElement("span");
    markerTekst.classList.add("spanElement");
    markerTekst.textContent = marker["name"];
    /**/
    markerTekst.addEventListener("click", function () {
      console.log(nizMarkera);
      console.log(DugmeZaEdit.value);
      popupDisplayInfo("Marker", nizMarkera, DugmeZaEdit.value);
    });
    // Dodajte event listener za dugme "Edit"
    DugmeZaEdit.addEventListener("click", function () {
      openPopup(
        "Marker",
        map,
        nizMarkera,
        vectorSourceMarker,
        DugmeZaEdit.value
      );
      /* const novoImeMarkera = prompt(
        "Unesite novi naziv markera:",
        marker["name"]
      );
      if (novoImeMarkera !== null && novoImeMarkera !== "") {
        // Ažurirajte naziv markera u nizu markera
        marker["name"] = novoImeMarkera;

        // Ažurirajte naziv markera na mapi
        const markerFeature = vectorSourceMarker.getFeatureById(marker["id"]);
        if (markerFeature) {
          markerFeature.set("name", novoImeMarkera);
        }
        // Osvježite sidebar za markere
        kreiranjeSideBarMarker(nizMarkera, vectorSourceMarker);
      }*/
    });
    listItem.appendChild(DugmeZaEdit);
    listItem.appendChild(DugmeZaBrisanjeMarkera);
    listItem.appendChild(markerTekst);

    listMarker.appendChild(listItem);
    index++;
  }
  sidebarDivMarker.appendChild(listMarker);

  document.querySelectorAll(".btnBrisanjeMarkera").forEach((btnMarker) => {
    btnMarker.addEventListener("click", function (event) {
      const markerIndex = parseInt(event.target.value);
      deleteMarker(markerIndex, vectorSourceMarker, nizMarkera);
    });
  });
}
//Termo Slike Side Bar
export function kreiranjeSideBarTermoSlike(TeritorijeGrad, map) {
  const sidebarDivTermo = document.getElementById("sidebarMenuTermo");
  const list = document.createElement("ul");
  list.id = "sidebarLista";
  list.style.listStyleType = "none";

  for (const grad in TeritorijeGrad) {
    if (TeritorijeGrad.hasOwnProperty(grad)) {
      const gradItem = document.createElement("li");

      const gradContent = document.createElement("div");
      gradContent.classList.add("grad-content");

      const gradCheckbox = document.createElement("input");
      gradCheckbox.type = "checkbox";
      gradCheckbox.setAttribute("data-grad", grad);
      gradCheckbox.classList.add("grad-checkbox");

      const gradText = document.createElement("span");
      gradText.textContent = grad;

      const arrowIcon = document.createElement("div");
      arrowIcon.classList.add("arrow-icon");
      arrowIcon.innerHTML = "&#9654;";

      const gradDiv = document.createElement("div");
      gradDiv.appendChild(gradCheckbox);
      gradDiv.appendChild(gradText);
      gradContent.appendChild(gradDiv);
      // gradContent.appendChild(gradCheckbox);
      // gradContent.appendChild(gradText);
      gradContent.appendChild(arrowIcon);

      gradItem.appendChild(gradContent);

      const teritorije = TeritorijeGrad[grad].Teritorije;

      const teritorijeList = document.createElement("ul");
      teritorijeList.style.listStyleType = "none";

      for (const teritorija in teritorije) {
        if (teritorije.hasOwnProperty(teritorija)) {
          const listItem = document.createElement("li");

          const teritorijaCheckbox = document.createElement("input");
          teritorijaCheckbox.type = "checkbox";
          teritorijaCheckbox.dataset.index = teritorija;
          teritorijaCheckbox.setAttribute("data-grad", grad);
          teritorijaCheckbox.checked = false;
          teritorijaCheckbox.classList.add("teritorija-checkbox");

          const teritorijaText = document.createElement("span");
          teritorijaText.textContent = teritorija;

          listItem.appendChild(teritorijaCheckbox);
          listItem.appendChild(teritorijaText);

          teritorijeList.appendChild(listItem);
        }
      }

      teritorijeList.style.display = "none";

      gradItem.appendChild(teritorijeList);

      list.appendChild(gradItem);

      arrowIcon.addEventListener("click", function () {
        if (teritorijeList.style.display === "none") {
          teritorijeList.style.display = "block";
          arrowIcon.style.transform = "rotate(90deg)";
        } else {
          teritorijeList.style.display = "none";
          arrowIcon.style.transform = "rotate(0deg)";
        }
      });
    }
  }

  sidebarDivTermo.appendChild(list);

  //event za checked teritorije
  document
    .querySelectorAll(".teritorija-checkbox")
    .forEach((teritorijaCheckbox) => {
      teritorijaCheckbox.addEventListener("change", function () {
        let atributGrad = teritorijaCheckbox.getAttribute("data-grad");
        let teritorijeCheckboxesGrad = document.querySelectorAll(
          '.teritorija-checkbox[data-grad="' + atributGrad + '"]'
        );
        prikazTermoSlika(
          teritorijaCheckbox.dataset.index,
          teritorijaCheckbox.checked,
          map,
          TeritorijeGrad
        );

        let brojac = 0;
        for (let i = 0; i < teritorijeCheckboxesGrad.length; i++) {
          if (teritorijeCheckboxesGrad[i].checked != teritorijaCheckbox.checked)
            brojac++;
        }
        let gradCheckbox = document.querySelector(
          '.grad-checkbox[data-grad="' + atributGrad + '"]'
        );

        if (brojac == 0) {
          gradCheckbox.checked = teritorijaCheckbox.checked;
        } else {
          gradCheckbox.checked = false;
        }
      });
    });
  //event za checked grad
  document.querySelectorAll(".grad-checkbox").forEach((gradCheckbox) => {
    gradCheckbox.addEventListener("change", function () {
      const grad = gradCheckbox.getAttribute("data-grad");
      const teritorijeCheckboxes = document.querySelectorAll(
        '.teritorija-checkbox[data-grad="' + grad + '"]'
      );

      teritorijeCheckboxes.forEach((teritorijaCheckbox) => {
        if (
          !(teritorijaCheckbox.checked == true && gradCheckbox.checked == true) //if uslov za sprecavanje kreiranja duplh layera za termo slike
        ) {
          teritorijaCheckbox.checked = gradCheckbox.checked;

          prikazTermoSlika(
            teritorijaCheckbox.dataset.index,
            teritorijaCheckbox.checked,
            map,
            TeritorijeGrad
          );
        }
      });
    });
  });
}
