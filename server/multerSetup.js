import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "" + Math.round(Math.random() * 1e2);
    const fileName = file.originalname.trim().toLowerCase().replace(/\s+/g, "-");
    cb(null, `${uniqueSuffix}-${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ["jpg", "jpeg", "png", "xlsx", "pdf"];
    const extension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export default upload;
