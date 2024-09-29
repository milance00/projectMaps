const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer"); // for handling file uploads

const app = express();
const port = 3000;
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "dist/korisnik/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/read-file", async (req, res) => {
  const filePath = req.query.path;

  if (!filePath) {
    return res
      .status(400)
      .json({ error: "File path is missing in the request query" });
  }
  try {
    const content = await fs.readFile(filePath, "utf8");
    res.json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/write-file", async (req, res) => {
  const { fileContent } = req.body;

  if (!fileContent) {
    return res
      .status(400)
      .json({ error: "File content is missing in the request body" });
  }

  const filePath = req.query.path;

  if (!filePath) {
    return res
      .status(400)
      .json({ error: "File path is missing in the request query" });
  }

  try {
    await fs.writeFile(filePath, fileContent, "utf8");
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/upload", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  res.json({ filename: req.file.filename });
});
app.delete("/delete-image", (req, res) => {
  const imagePath = req.query.path;
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      if (err.code === "ENOENT") {
        // File not found error (404)
        return res.status(404).json({ error: "Image not found" });
      }
      // Other error (500)
      return res.status(500).json({ error: "Failed to delete image" });
    }
    // Success (200)
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
