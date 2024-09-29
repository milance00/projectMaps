import { dodajMarker, editMarker } from "./markerFunkcije";
import { dodajPolygon, editPolygon } from "./polygonFunkcije.js";
const spanPopup = document.getElementById("spanPopup");
const nameModal = document.getElementById("nameModal");
const descriptionModal = document.getElementById("descriptionModal");
const fileInput = document.getElementById("fileInput");
const slikaModal = document.getElementById("slikaModal");
const popupModal = document.getElementById("popup");
const overlayModal = document.getElementById("overlayModal");
const delImageModalBtn = document.getElementById("delImageModal");
const CloseModalBtn = document.getElementById("CloseModal");
const CloseModalSaveBtn = document.getElementById("CloseModalSave");
const DugmeMarker = document.getElementById("btnMarker");
const DugmePolygon = document.getElementById("btnPolygon");
let btnDelSlika = false;

export async function openPopup(elementMap, map, niz, source, index) {
  //f-ja za prikaz popup-a
  let editBoolean = false;
  console.log(niz[index]);

  console.log("openPopup");
  spanPopup.innerHTML = elementMap;
  popupModal.style.display = "block";
  overlayModal.style.display = "block";
  CloseModalSaveBtn.style.display = "block";
  fileInput.style.display = "block";
  editBoolean = await editModalOption(index, niz);
  CloseModalBtn.addEventListener("click", CloseModalBtnHandle);
  CloseModalSaveBtn.addEventListener("click", SaveButtonHandle);

  function CloseModalBtnHandle() {
    //handler za dugme close
    console.log("CloseModalBtnHandle");

    CloseModalFunction();
    CloseModalBtn.removeEventListener("click", CloseModalBtnHandle);
    CloseModalSaveBtn.removeEventListener("click", SaveButtonHandle);
  }

  async function SaveButtonHandle() {
    //handler za dugme save
    console.log("SaveButtonHandle");
    console.log(niz[index]);
    if (btnDelSlika == true) {
      console.log(niz);
      await ImageFileDeleteFunction(niz, index);
      console.log(niz);
      btnDelSlika = false;
    }
    addElementPopUp(elementMap, map, niz, source, editBoolean, index);
    CloseModalFunction();
    CloseModalSaveBtn.removeEventListener("click", SaveButtonHandle);
  }
}

function CloseModalFunction() {
  //f-ja za zatvaranje modala
  console.log("CloseModalFunction");

  popupModal.style.display = "none";
  overlayModal.style.display = "none";
  DugmeMarker.disabled = false;
  DugmePolygon.disabled = false;
  clearInputFields();
}

function addElementPopUp(elementMap, map, niz, source, editBoolean, index) {
  console.log("addElementPopUp");
  console.log(niz[index]);

  let imeElementa = nameModal.value;
  let opisElementa = descriptionModal.value;
  let slikaFile = ImageFileUploadFunction();
  addOrEditElement(
    map,
    niz,
    source,
    index,
    imeElementa,
    opisElementa,
    slikaFile,
    elementMap,
    editBoolean
  );
}

function ImageFileUploadFunction() {
  //f-ja za upload slike
  console.log("ImageFileUploadFunction");

  console.log(fileInput.files[0]);

  let slikaFile = fileInput.files[0];
  if (!slikaFile) {
    console.error("No file selected.");
    return null;
  }
  let formData = new FormData();
  formData.append("file", slikaFile);
  return fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Upload failed.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Upload successful:", data);
      return slikaFile;
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

function clearInputFields() {
  //f-ja za restartovanje inputa
  console.log("clearInputFields");

  nameModal.value = "";
  descriptionModal.value = "";
  fileInput.value = "";
  slikaModal.style.display = "none";
}
async function editModalOption(index, niz) {
  // funkcija za prikaz edit modala
  console.log(index);

  if (index != null) {
    nameModal.value = niz[index].name;
    descriptionModal.value = niz[index].opis;
    if (niz[index].slika != null) {
      try {
        const file = await niz[index].slika;
        delImageModalBtn.style.display = "block";
        console.log(file);
        slikaModal.style.display = "block";
        const objectURL = URL.createObjectURL(file);
        slikaModal.src = objectURL;
        delImageModalBtn.style.display = "block"; //dugme za brisanje slike(edit)
        delImageModalBtn.addEventListener("click", () =>
          delImageModalBtnHandle(niz, index)
        );
        function delImageModalBtnHandle(niz, index) {
          delImageModalBtn.style.display = "none";
          slikaModal.style.display = "none";
          btnDelSlika = true;
          delImageModalBtn.removeEventListener("click", () =>
            delImageModalBtnHandle(niz, index)
          );
        }
      } catch (error) {
        console.error("Error while getting the file:", error);
      }
    }
    return true;
  }
  return false;
}
/*
function delImageModalBtnHandle() {
  //handler za dugme Izbrisi sliku
  //f-ja za brisanje slike
  delImageModalBtn.style.display = "none";
  slikaModal.style.display = "none";
  delImageModalBtn.removeEventListener("click", delImageModalBtnHandle);
}*/
async function newImage(niz, index, slikaFile) {
  console.log(niz);
  console.log(niz[index]);
  console.log(niz[index].slika);
  if (niz[index].slika != null)
    if (niz[index].slika.name == slikaFile.name) {
      await ImageFileDeleteFunction(niz, index);
    }
}
async function addOrEditElement(
  map,
  niz,
  source,
  index,
  imeElementa,
  opisElementa,
  slikaFile,
  elementMap,
  editBoolean
) {
  //f-ja za dodavanje ili editovanje elementa
  console.log("addOrEditElement");
  if (elementMap == "Marker") {
    console.log(slikaFile);
    if (editBoolean == false) {
      console.log("dodaj");
      dodajMarker(map, niz, source, imeElementa, opisElementa, slikaFile);
    } else {
      console.log("edit");
      await newImage(niz, index, slikaFile);
      editMarker(niz, source, imeElementa, opisElementa, index, slikaFile);
    }
  } else if (elementMap == "Polygon")
    if (editBoolean == false)
      dodajPolygon(map, source, niz, imeElementa, opisElementa);
    else {
      await newImage(niz, index, slikaFile);
      editPolygon(niz, source, imeElementa, opisElementa, index, slikaFile);
    }
}
////////////////////////
async function ImageFileDeleteFunction(niz, index) {
  const file = await niz[index].slika;
  const imagePath = `dist/korisnik/${file.name}`;

  console.log(file);
  console.log(niz);
  console.log(index);
  console.log(niz[index].slika);
  console.log(file.name);

  fetch(`/delete-image?path=${encodeURIComponent(imagePath)}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Success response from the server
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
  niz[index].slika = null;

  console.log(niz);
}
export async function popupDisplayInfo(elementMap, niz, index) {
  console.log(niz[index].name);
  console.log(niz[index].opis);
  CloseModalSaveBtn.style.display = "none";
  fileInput.style.display = "none";
  spanPopup.innerHTML = elementMap;
  popupModal.style.display = "block";
  overlayModal.style.display = "block";
  delImageModalBtn.style.display = "none";
  nameModal.value = niz[index].name;
  descriptionModal.value = niz[index].opis;
  if (niz[index].slika != null) {
    slikaModal.style.display = "block";
    console.log(niz[index].slika);
    slikaModal.src = URL.createObjectURL(await niz[index].slika);
  } else {
    slikaModal.style.display = "none";
  }
  CloseModalBtn.addEventListener("click", CloseModalBtnHandleDisplay);
}
function CloseModalBtnHandleDisplay() {
  CloseModalFunction();
  CloseModalBtn.removeEventListener("click", CloseModalBtnHandleDisplay);
}
