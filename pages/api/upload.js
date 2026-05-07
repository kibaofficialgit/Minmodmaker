import formidable from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        error: "Upload failed"
      });
    }

    const file = files.file[0];

    const data = fs.readFileSync(file.filepath);

    const fileName = `${uuidv4()}.png`;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    );

    fs.writeFileSync(uploadPath, data);

    return res.status(200).json({
      path: `/uploads/${fileName}`
    });
  });
}
