import { Command } from "commander";
import { getConfig } from "../utils";
import axios from "axios";
import inquirer from "inquirer";
import { Host } from "../shared/host";
import { spawn } from "child_process";
import chalk from "chalk";

export const connect = new Command("connect")
  .description("Connect to an SSH host")
  .action(async () => {
    try {
      const config = await getConfig();

      const { query } = await inquirer.prompt([
        {
          type: "input",
          name: "query",
          message:
            "Enter search query to filter hosts (leave empty to show all):",
        },
      ]);

      const response = await axios.get<{ data: Host[]; count: number }>(
        `${config.host}/hosts`,
        {
          headers: {
            "X-Secret-Key": config.secretKey,
          },
          params: query ? { query } : undefined,
        }
      );

      const hosts = response.data.data;

      if (hosts.length === 0) {
        console.log(chalk.yellow("No hosts found matching your query."));
        return;
      }

      const { selectedHost } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedHost",
          message: "Select a host to connect to:",
          choices: hosts.map((host) => ({
            name: `${host.alias} (${host.username}@${host.address}:${host.port})`,
            value: host,
          })),
        },
      ]);

      console.log(chalk.blue(`Connecting to ${selectedHost.alias}...`));

      // Функция для обработки SSH процесса
      const handleSSHProcess = (sshProcess: any) => {
        sshProcess.on("error", (error: any) => {
          console.error(chalk.red(`SSH connection failed: ${error.message}`));
          console.error(
            chalk.red("Make sure SSH is installed and accessible in your PATH.")
          );
        });

        sshProcess.on("exit", (code: any) => {
          if (code === 0) {
            console.log(chalk.green("SSH session ended successfully."));
          } else {
            console.log(chalk.yellow(`SSH session ended with code ${code}.`));
          }
        });
      };

      // Если есть пароль, пытаемся использовать sshpass
      if (selectedHost.password) {
        console.log(chalk.green("Using saved password for authentication..."));

        // Проверяем наличие sshpass
        const sshpassCheck = spawn("sshpass", ["-V"], { stdio: "pipe" });

        sshpassCheck.on("error", () => {
          console.log(
            chalk.yellow(
              "sshpass not found. You'll need to enter the password manually."
            )
          );

          // Показываем инструкции по установке
          if (process.platform === "win32") {
            console.log(chalk.cyan("To install sshpass on Windows:"));
            console.log(
              chalk.cyan("1. Install via Chocolatey: choco install sshpass")
            );
            console.log(
              chalk.cyan("2. Or use WSL: sudo apt-get install sshpass")
            );
          } else if (process.platform === "darwin") {
            console.log(
              chalk.cyan("To install sshpass on macOS: brew install sshpass")
            );
          } else {
            console.log(
              chalk.cyan(
                "To install sshpass on Linux: sudo apt-get install sshpass"
              )
            );
          }

          console.log(
            chalk.yellow(
              `Password for ${selectedHost.alias}: ${selectedHost.password}`
            )
          );

          // Запускаем обычный SSH
          const sshArgs = [
            `${selectedHost.username}@${selectedHost.address}`,
            "-p",
            selectedHost.port.toString(),
          ];

          const sshProcess = spawn("ssh", sshArgs, {
            stdio: "inherit",
            shell: true,
          });

          handleSSHProcess(sshProcess);
        });

        sshpassCheck.on("exit", (code) => {
          if (code === 0) {
            // sshpass доступен, используем его
            const sshpassArgs = [
              "-p",
              selectedHost.password!,
              "ssh",
              "-o",
              "StrictHostKeyChecking=no",
              `${selectedHost.username}@${selectedHost.address}`,
              "-p",
              selectedHost.port.toString(),
            ];

            const sshProcess = spawn("sshpass", sshpassArgs, {
              stdio: "inherit",
              shell: true,
            });

            handleSSHProcess(sshProcess);
          } else {
            // sshpass недоступен, показываем пароль и используем обычный SSH
            console.log(
              chalk.yellow(
                "sshpass not available. You'll need to enter the password manually."
              )
            );
            console.log(
              chalk.yellow(
                `Password for ${selectedHost.alias}: ${selectedHost.password}`
              )
            );

            const sshArgs = [
              `${selectedHost.username}@${selectedHost.address}`,
              "-p",
              selectedHost.port.toString(),
            ];

            const sshProcess = spawn("ssh", sshArgs, {
              stdio: "inherit",
              shell: true,
            });

            handleSSHProcess(sshProcess);
          }
        });
      } else {
        // Нет пароля, используем обычный SSH (возможно, с ключами)
        const sshArgs = [
          `${selectedHost.username}@${selectedHost.address}`,
          "-p",
          selectedHost.port.toString(),
        ];

        const sshProcess = spawn("ssh", sshArgs, {
          stdio: "inherit",
          shell: true,
        });

        handleSSHProcess(sshProcess);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(chalk.red(`API Error: ${error.message}`));
        if (error.response?.status === 401) {
          console.error(
            chalk.red("Authentication failed. Please run 'auth' command first.")
          );
        }
      } else {
        console.error(
          chalk.red(
            `Error: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }
  });
