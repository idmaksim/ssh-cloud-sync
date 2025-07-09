import { homedir } from "os";
import { join } from "path";

export const CONFIG_DIR = join(homedir(), ".ssh-cloud-sync");
export const CONFIG_PATH = join(CONFIG_DIR, "config.json");
