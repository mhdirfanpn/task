import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { promises as fsPromises } from "fs";
import upload from "./multerSetup.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//upload files
app.post("/upload", upload.array("files", 10), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  } else if (!req.files) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedFiles = req.files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
  }));

  res.status(200).json({
    message: "Files uploaded successfully!",
    uploadedFiles,
  });
});


//get all files
app.get("/files", async (req, res) => {
  try {
    const files = await fsPromises.readdir(path.join(process.cwd(), "uploads"));
    return res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
