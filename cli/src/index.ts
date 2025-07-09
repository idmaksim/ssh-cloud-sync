#!/usr/bin/env node

import { Command } from "commander";
import { auth } from "./commands/auth";
import { mkdir } from "fs/promises";
import { CONFIG_DIR } from "./constants";
import { check } from "./commands/check";
import { list } from "./commands/list";
import chalk from "chalk";
import { add } from "./commands/add";
import { update } from "./commands/update";

const program = new Command().action(async () => {
  try {
    await mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating config directory:", error);
  }
  program.help();
});

program
  .version("1.0.0")
  .description("SSH Cloud Sync CLI")
  .addCommand(auth)
  .addCommand(check)
  .addCommand(list)
  .addCommand(add)
  .addCommand(update)
  .parse(process.argv);

process.on("uncaughtException", (error) => {
  console.error(error);
  console.error(chalk.red("✗ Uncaught Exception"));
});
