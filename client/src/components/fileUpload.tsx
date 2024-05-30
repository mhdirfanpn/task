import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Stack, Typography } from "@mui/material";


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function FileUpload() {
  const api = "http://localhost:3000";
  const [files, setFiles] = useState([]);
  const [docs, setDocs] = useState<string[]>([]);

  const handleChange = async (event: any) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      await axios.post(`${api}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get<{ files: string[] }>(`${api}/files`);
      setDocs(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [files]);

  return (
    <Stack p={3} gap={3}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography fontSize={22} fontWeight={"bold"}>
          Files
        </Typography>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" multiple onChange={handleChange} />
        </Button>
      </Stack>

      <Stack
        display="grid"
        sx={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1 }}
      >
        {docs.map((fileName, index) => (
          <Stack
            gap={2}
            sx={{
              backgroundColor: "white",
              color: "black",
              borderRadius: 2,
              p: 2,
            }}
          >
            <img
              key={index}
              style={{
                maxHeight: 500,
                objectFit: "scale-down",
                width: "100%",
                borderRadius: 5,
              }}
              src={`${api}/uploads/${fileName}`}
              // alt={fileName}
            />
            <Stack>{fileName}</Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default FileUpload;
