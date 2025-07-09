import { Command } from "commander";
import inquirer from "inquirer";
import axios from "axios";
import { writeFile } from "fs/promises";
import { CONFIG_PATH } from "../constants";

export const auth = new Command("auth")
  .description("Authenticate with the API")
  .action(async () => {
    const { host } = await inquirer.prompt([
      {
        type: "input",
        name: "host",
        message: "Enter your host (e.g. ssh.example.com)",
        validate: async (value) => {
          try {
            await axios.get(`${value}/health`);
            return true;
          } catch (error) {
            return "Invalid host";
          }
        },
      },
    ]);

    const { secretKey } = await inquirer.prompt([
      {
        type: "input",
        name: "secretKey",
        message: "Enter your secret key (e.g. 1234567890)",
        validate: async (value) => {
          try {
            await axios.get(`${host}/auth/verify`, {
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

    await writeFile(CONFIG_PATH, JSON.stringify({ host, secretKey }, null, 2));
  });
