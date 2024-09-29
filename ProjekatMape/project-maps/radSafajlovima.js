export async function citanjeFajla(filePath) {
  let objNiz = [];
  const response = await fetch(
    `http://localhost:3000/read-file?path=${encodeURIComponent(filePath)}`
  );
  const data = await response.json();
  objNiz = konvertFajlUNizObjekat(data.content);
  return objNiz;
}

function konvertFajlUNizObjekat(content) {
  let objNiz = [];
  let str = "";
  let brojac = 0;

  for (let character of content) {
    str = str + character;
    if (brojac == 1 && character == "#") {
      //proverava razmak izmedju objekata
      str = str.slice(0, -1);
      objNiz.push(JSON.parse(str));
      str = "";
      brojac = 0;
    } else {
      brojac = 0;
    }
    if (character == "}") brojac++;
  }

  return objNiz;
}

export async function pisanjeFajla(filePath, objNiz) {
  let stringZaFajl = " ";

  for (let i = 0; i < objNiz.length; i++) {
    let strPom = JSON.stringify(objNiz[i]);
    stringZaFajl = stringZaFajl + strPom + "#"; //dodaje # kao razmak izmedju objekata
  }

  const fileContent = stringZaFajl;
  const response = await fetch(
    `http://localhost:3000/write-file?path=${encodeURIComponent(filePath)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileContent }),
    }
  );

  const data = await response.json();
  console.log("File has been written:", data.success);
}
