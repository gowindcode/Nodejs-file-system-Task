const express = require("express");
const fs = require("fs").promises; // we can use fs.promises for async operations
const path = require("path");
const app = express();
const port = 5000;

app.use(express.json());

const filesFolderPath = path.join(__dirname, "files");

// under the file-api the 'files' directory create once (This is file folder)
fs.mkdir(filesFolderPath, { recursive: true })
  .then(() => {
    console.log("files' directory created successfully 👍");
  })
  .catch((err) => {
    console.error("Failed to create 'files' directory:", err);
  });

// Create a new file with current date and time.txt as file name inside the files directory... when the server starts.
const createNewFile = async () => {
  try {
    const currentDateTime = new Date();
    // console.log(currentDateTime);
    const dateNow = currentDateTime.toLocaleDateString().replace(/\//g, "-");
    const timeNow = currentDateTime.toLocaleTimeString().replace(/:/g, "-");
    const fileName = `${dateNow}_${timeNow}.txt`;
    const fileMessage = `I am a new file created successfully at time ${timeNow} (H:M:S) on dated ${dateNow} (D-M-Y), device located in India, (time standard is IST). Happy coding 👨‍💻`;

    const filePath = path.join(filesFolderPath, fileName);

    await fs.writeFile(filePath, fileMessage);
    console.log(
      "File created successfully with current date and time using index.js filesystem"
    );
  } catch (err) {
    console.error("Failed to create new file:", err);
  }
};

createNewFile();

// local host port 5000 kick start, we can use node index.js then hit enter button
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  try {
    res.send(
      `I am express server running successfylly ✔ on local port at ${port} 🤖`
    );
  } catch (err) {
    console.error("Failed to retrieve files:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve path you are looking...😒" });
  }
});

// This is file directory path we can see the all created files in this folder.

// api endpoint retrive all created text files in particulatr folder(http://localhost:5000/files)
app.get("/files", async (req, res) => {
  try {
    const files = await fs.readdir(filesFolderPath);
    res.json({ files }).toArray();
  } catch (err) {
    console.error("Failed to retrieve files:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve files you are looking...😒" });
  }
});

//from postman we can create new file using post
app.post("/files", async (req, res) => {
  const newFile = req.body;
  console.log(newFile);
  const createNewFile = async () => {
    try {
      const currentDateTime = new Date();
      const dateNow = currentDateTime.toLocaleDateString().replace(/\//g, "-");
      const timeNow = currentDateTime.toLocaleTimeString().replace(/:/g, "-");
      const fileName = `${dateNow}_${timeNow}.txt`;
      const fileMessage = `I am a new file created successfully at time ${timeNow} (H:M:S) on dated ${dateNow} (D-M-Y), device located in India, (time standard is IST). Happy coding 👨‍💻`;

      const filePath = path.join(filesFolderPath, fileName);

      await fs.writeFile(filePath, fileMessage);
      console.log(
        "File created successfully with current date and time using postman🦺"
      );
    } catch (err) {
      console.error("Failed to create new file:", err);
    }
  };
  res.json(createNewFile());
  // console.log("new file created successfully using postman.")
  // res.status(200).json({ message: `New file ${fileName} created successfully using postman.🎫`})
});

//delete the file directly from the filesystem while we're not using a database in this scenario

app.delete("/files/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(filesFolderPath, fileName);

  try {
    await fs.unlink(filePath);
    console.log(`File '${fileName}' deleted successfully.`);
    res
      .status(200)
      .json({ message: `File '${fileName}' deleted successfully.` });
  } catch (err) {
    console.error(`Failed to delete file '${fileName}':`, err);
    res.status(500).json({ error: `Failed to delete file '${fileName}'.` });
  }
});
