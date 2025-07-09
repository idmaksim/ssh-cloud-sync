import { CONFIG_PATH } from "./constants";
import { readFile } from "fs/promises";

export async function getConfig() {
  const config = await readFile(CONFIG_PATH, "utf8");
  return JSON.parse(config);
}
