import { Command } from "commander";
import { getConfig } from "../utils";
import axios from "axios";
import chalk from "chalk";

export const check = new Command("check")
  .description("Check the connection to the API")
  .action(async () => {
    const config = await getConfig();

    try {
      await axios.get(`${config.host}/auth/verify`, {
        headers: {
          "X-Secret-Key": config.secretKey,
        },
      });
      console.log(chalk.green("✓ Connection to the API is successful"));
    } catch (error) {
      console.error(chalk.red("✗ Connection to the API is failed"));
      console.error(chalk.red("Use sync auth to authenticate"));
      return;
    }
  });
