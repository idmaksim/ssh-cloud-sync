import { Command } from "commander";
import inquirer from "inquirer";
import axios from "axios";
import { writeFile } from "fs/promises";
import { CONFIG_DIR } from "../constants";
import { join } from "path";

export const auth = new Command("auth")
  .description("Authenticate with the API")
  .action(async () => {
    let tempHost = "";
    const data = await inquirer.prompt([
      {
        type: "input",
        name: "host",
        message: "Enter your host (e.g. ssh.example.com)",
        validate: async (value) => {
          try {
            tempHost = value;
            await axios.get(`${value}/health`);
            return true;
          } catch (error) {
            return "Invalid host";
          }
        },
      },
      {
        type: "input",
        name: "secretKey",
        message: "Enter your secret key (e.g. 1234567890)",
        validate: async (value) => {
          try {
            await axios.get(`${tempHost}/auth/verify`, {
              headers: {
                "X-Secret-Key": value,
              },
            });
            return true;
          } catch (error) {
            return "Invalid secret key";
          }
        },
      },
    ]);

    const configPath = join(CONFIG_DIR, "config.json");
    await writeFile(configPath, JSON.stringify(data, null, 2));
  });
