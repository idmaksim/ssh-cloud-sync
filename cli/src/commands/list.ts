import { Command } from "commander";
import { getConfig } from "../utils";
import axios from "axios";

export const list = new Command("list")
  .description("List all SSH hosts")
  .action(async () => {
    const config = await getConfig();
    const keys = await axios.get(`${config.host}/hosts`, {
      headers: {
        "X-Secret-Key": config.secretKey,
      },
    });
    console.log(keys);
  });
