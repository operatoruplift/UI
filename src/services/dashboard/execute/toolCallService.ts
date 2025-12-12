import {
  RelayResponse,
  relayService,
} from "./relayService";
import { getOrCreateDeviceId } from "../devices/deviceService";
import { getAgentById } from "../hub/agentService";
import { isAgentInstalled } from "../workspace/installedAgentsService";
import { readAgentFilesWithCommands } from "../workspace/installAgentCommandService";
import { showNotification } from "../../electron-services/notificationService";

/**
 * Main entry point for processing a tool call event
 */
export const processToolCall = async (response: RelayResponse): Promise<void> => {

  try {
    if (response.error) return sendDoneResponse(response, response.error);

    if (response.type === "intent" && response.data) {
      const { tool_id: agentId, user_intent: query } = response.data;
      if (!agentId || !query) {
        showNotification("Invalid Tool Call", "Missing tool_id or user_intent");
        return sendDoneResponse(response, "Tool call processed");
      }
      console.log("Getting agent by ID", agentId);
      const agent = await getAgentById(agentId);
      console.log("Agent", agentId, agent);

      if (!agent) {
        return sendDoneResponse(response, `Invalid Agent Call`);
      }
      // Step 2: Ensure agent is installed
      if (!(await isAgentInstalled(agentId))) {
        showNotification("Agent Not Installed", `Agent ${agent.name} is not installed`);
        return sendDoneResponse(response, `Agent ${agent.name} is not installed`);
      }

      showNotification("Executing Agent Command", `Running ${agent.name}...`);

      // Step 3: Read agent commands
      const fileData = await readAgentFilesWithCommands(agentId);

      if (!fileData.commands?.run) {
        showNotification("Command Not Configured", `${agent.name} has no run command`);
        return sendDoneResponse(response, `${agent.name} has no run command`);
      }

      // Step 4: Execute the command
      const result = await executeAgentRunCommand(fileData.commands.run, "", query);
      showNotification("Extracted", `${agent.name} completed successfully`);
      await sendDoneResponse(response, result);
    } else if (response.action) {
      await sendDoneResponse(response, "Action completed");
    } else {
      await sendDoneResponse(response, "Tool call processed");
    }
  } catch (error) {
    const errorMessage = parseError(error);
    showNotification("Tool Call Error", `Error: ${errorMessage}`);
    await sendDoneResponse(response, errorMessage);
  }
};


/**
 * Execute agent run command and capture output
 */
const executeAgentRunCommand = async (
  runCommand: (accessToken?: string, query?: string) => Promise<any>,
  accessToken: string,
  query: string
): Promise<string> => {
  try {
    const result = await runCommand(accessToken, query);
    if (result?.stdout) {
      const out = result.stdout.trim();
      const err = result.stderr ? `\n\nWarnings: ${result.stderr.trim()}` : "";
      return out + err;
    }

    if (result?.error) return result.error.trim();
    if (result?.success) return `Command executed successfully with query: "${query}"`;

    return `Command executed successfully with query: "${query}"`;
  } catch (error) {
    throw new Error(`Command execution failed: ${parseError(error)}`);
  }
};

/**
 * Send a "done" response back through relay
 */
const sendDoneResponse = async (originalResponse: RelayResponse, resultData?: string) => {
  try {
    if (!relayService.isConnected()) {
      showNotification("Response Failed", "WebSocket connection lost");
      return;
    }
    const message = {
      type: "response",
      request_id: originalResponse.request_id,
      device_id: getOrCreateDeviceId(),
      target_id: "system_sender",
      data: resultData || "Tool execution completed",
    };
    if (!relayService.sendMessage(message)) {
      showNotification("Response Failed", "Failed to send via WebSocket");
    }
  } catch (error) {
    showNotification("Response Error", `Error sending response: ${parseError(error)}`);
  }
};

/**
 * Normalize and extract readable error messages
 */
const parseError = (error: any): string => {
  if (!error) return "Unknown error";
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return error.message || error.error || JSON.stringify(error);
};
