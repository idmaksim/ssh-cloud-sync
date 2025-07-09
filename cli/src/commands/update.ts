import { Command } from "commander";
import inquirer from "inquirer";
import { getConfig } from "../utils";
import axios from "axios";
import { Host } from "../shared/host";
import chalk from "chalk";

type UpdatableFields = "address" | "port" | "password";

export const update = new Command("update")
  .description("Update an SSH host")
  .action(async () => {
    const config = await getConfig();

    const { query } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message: "Enter the query for search host",
        validate: async (value) => {
          try {
            const response = await axios.get(`${config.host}/hosts`, {
              headers: {
                "X-Secret-Key": config.secretKey,
              },
              params: value ? { query: value } : undefined,
            });

            if (!response.data.data || response.data.data.length === 0) {
              return "No hosts found with this query";
            }

            return true;
          } catch (error: any) {
            return (
              "Error fetching hosts: " +
              (error.response?.data?.message || error.message)
            );
          }
        },
      },
    ]);

    const response = await axios.get(`${config.host}/hosts`, {
      headers: {
        "X-Secret-Key": config.secretKey,
      },
      params: query ? { query } : undefined,
    });

    const { host } = await inquirer.prompt([
      {
        type: "list",
        name: "host",
        message: "Select the host to update",
        choices: response.data.data.map((host: Host) => ({
          name: `${host.id} - ${host.address}:${host.port}`,
          value: host,
        })),
      },
    ]);

    const { fieldsToUpdate } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "fieldsToUpdate",
        message: "Select fields to update",
        choices: [
          { name: "Address", value: "address" },
          { name: "Port", value: "port" },
          { name: "Password", value: "password" },
        ],
      },
    ]);

    if (fieldsToUpdate.length === 0) {
      console.log("No fields selected for update");
      return;
    }

    const updates: Partial<Host> = {};

    for (const field of fieldsToUpdate as UpdatableFields[]) {
      const { value } = await inquirer.prompt([
        {
          type: field === "password" ? "password" : "input",
          name: "value",
          message: `Enter new ${field}`,
          default: field === "password" ? undefined : host[field],
          validate: (value: string) => {
            if (field === "port") {
              const port = parseInt(value);
              if (isNaN(port) || port < 1 || port > 65535) {
                return "Port must be a number between 1 and 65535";
              }
            }
            return true;
          },
        },
      ]);

      updates[field] = field === "port" ? parseInt(value) : value;
    }

    console.log(updates);

    try {
      await axios.patch(`${config.host}/hosts/${Number(host.id)}`, updates, {
        headers: {
          "X-Secret-Key": config.secretKey,
        },
      });
      console.log(chalk.green("Host updated successfully"));
    } catch (error: any) {
      console.error(chalk.red("Failed to update host"));
      console.error(chalk.red(error.response?.data?.message || error.message));
    }
  });
