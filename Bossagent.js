// bossAgent.js
import chalk from "chalk";

export default {
  name: "bossAgent",
  description: "Super Agent Orchestrator",
  version: "1.0.0",

  actions: {
    async runTask(input, { agents, logger }) {
      logger.info(chalk.green(`Boss received task: ${input.task || "(no task provided)"}`));

      if (!input.agent) {
        return "No agent specified.";
      }

      if (!agents[input.agent]) {
        return `Agent '${input.agent}' does not exist yet.`;
      }

      // standardized call pattern: agent.run({task, data})
      try {
        const result = await agents[input.agent].run({ task: input.task, data: input.data || {} });
        return result;
      } catch (e) {
        return { error: e.message };
      }
    }
  }
};
