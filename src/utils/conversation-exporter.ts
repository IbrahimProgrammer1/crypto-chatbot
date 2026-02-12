import type { Message } from "@/types";

/**
 * Export chat conversations in various formats
 */
export class ConversationExporter {
  /**
   * Export as JSON
   */
  static exportAsJSON(messages: Message[]): void {
    const data = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    this.downloadFile(blob, `crypto-chat-${Date.now()}.json`);
  }

  /**
   * Export as plain text
   */
  static exportAsText(messages: Message[]): void {
    let text = `CryptoAI Chat Export\n`;
    text += `Exported: ${new Date().toLocaleString()}\n`;
    text += `Total Messages: ${messages.length}\n`;
    text += `${"=".repeat(60)}\n\n`;

    messages.forEach((msg) => {
      const timestamp = new Date(msg.timestamp).toLocaleString();
      const role = msg.role === "user" ? "You" : "CryptoAI";
      text += `[${timestamp}] ${role}:\n${msg.content}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    this.downloadFile(blob, `crypto-chat-${Date.now()}.txt`);
  }

  /**
   * Export as Markdown
   */
  static exportAsMarkdown(messages: Message[]): void {
    let markdown = `# CryptoAI Chat Export\n\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}  \n`;
    markdown += `**Total Messages:** ${messages.length}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((msg) => {
      const timestamp = new Date(msg.timestamp).toLocaleString();
      const role = msg.role === "user" ? "👤 You" : "🤖 CryptoAI";
      markdown += `### ${role}\n`;
      markdown += `*${timestamp}*\n\n`;
      markdown += `${msg.content}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    this.downloadFile(blob, `crypto-chat-${Date.now()}.md`);
  }

  /**
   * Export as HTML
   */
  static exportAsHTML(messages: Message[]): void {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoAI Chat Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: #3b82f6;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .message {
            background: white;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .message.user {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
        }
        .message.assistant {
            background: #f9fafb;
            border-left: 4px solid #10b981;
        }
        .role {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .timestamp {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 10px;
        }
        .content {
            white-space: pre-wrap;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CryptoAI Chat Export</h1>
        <p>Exported: ${new Date().toLocaleString()}</p>
        <p>Total Messages: ${messages.length}</p>
    </div>
    ${messages
      .map(
        (msg) => `
    <div class="message ${msg.role}">
        <div class="role">${msg.role === "user" ? "👤 You" : "🤖 CryptoAI"}</div>
        <div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>
        <div class="content">${this.escapeHtml(msg.content)}</div>
    </div>
    `
      )
      .join("")}
</body>
</html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    this.downloadFile(blob, `crypto-chat-${Date.now()}.html`);
  }

  /**
   * Helper to trigger file download
   */
  private static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
