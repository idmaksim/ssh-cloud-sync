#!/usr/bin/env node

import { Command } from "commander";
import { auth } from "./commands/auth";
import { mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const CONFIG_DIR = join(homedir(), ".ssh-cloud-sync");

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
  .parse(process.argv);
