import { generateAddon } from "../../lib/generator";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await generateAddon(req.body, res);
  } else {
    res.status(405).end();
  }
}
