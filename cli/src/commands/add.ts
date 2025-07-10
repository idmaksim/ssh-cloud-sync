import { Command } from "commander";
import inquirer from "inquirer";
import { getConfig } from "../utils";
import axios from "axios";
import chalk from "chalk";

export const add = new Command("add")
  .description("Add a new SSH host")
  .action(async () => {
    const data = await inquirer.prompt([
      {
        type: "input",
        name: "address",
        message: "Enter the address of the SSH host",
      },
      {
        type: "input",
        name: "port",
        message: "Enter the port of the SSH host",
        default: "22",
      },
      {
        type: "input",
        name: "password",
        message: "Enter the password of the SSH host",
      },
      {
        type: "input",
        name: "alias",
        message: "Enter the alias of the SSH host",
      },
      {
        type: "input",
        name: "username",
        message: "Enter the username of the SSH host",
        default: "root",
      },
    ]);
    data.port = Number(data.port);
    const config = await getConfig();
    try {
      await axios.post(`${config.host}/hosts`, data, {
        headers: {
          "X-Secret-Key": config.secretKey,
        },
      });
      console.log(chalk.green("✓ Host added successfully"));
    } catch (error: any) {
      console.error(chalk.red("✗ Failed to add host"));
      console.error(chalk.red(error.response.data.message));
      return;
    }
  });
