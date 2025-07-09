import { Command } from "commander";
import { getConfig } from "../utils";
import axios from "axios";
import inquirer from "inquirer";
import Table from "cli-table3";

interface Host {
  id: number;
  address: string;
  port: number;
  password: string | null;
  sshKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export const list = new Command("list")
  .description("List all SSH hosts")
  .action(async () => {
    const { query } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message: "Enter search query (leave empty to show all):",
      },
    ]);

    const config = await getConfig();
    const response = await axios.get<{ data: Host[]; count: number }>(
      `${config.host}/hosts`,
      {
        headers: {
          "X-Secret-Key": config.secretKey,
        },
        params: query ? { query } : undefined,
      }
    );

    const table = new Table({
      head: [
        "ID",
        "Address",
        "Port",
        "Password",
        "SSH Key",
        "Created At",
        "Updated At",
      ],
      style: {
        head: ["cyan"],
        border: ["gray"],
      },
    });

    response.data.data.forEach((host: Host) => {
      table.push([
        host.id.toString(),
        host.address,
        host.port.toString(),
        host.password ? "***" : "-",
        host.sshKey ? "Yes" : "No",
        new Date(host.createdAt).toLocaleString(),
        new Date(host.updatedAt).toLocaleString(),
      ]);
    });

    console.log(`\nTotal hosts: ${response.data.count}`);
    console.log(table.toString());
  });
