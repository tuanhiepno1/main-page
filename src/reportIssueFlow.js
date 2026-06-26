export function validateIssueReport(report) {
  const { projectId, description } = report;
  if (!projectId) return { projectId: "Select a project to report." };

  const errors = {};
  if (!report.fullName?.trim()) errors.fullName = "Enter your full name.";
  if (!report.email?.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(report.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!description?.trim()) {
    errors.description = "Describe the issue before confirming.";
  }
  return errors;
}

export function createIssueReport(report) {
  return {
    projectId: report.projectId,
    description: report.description.trim(),
    reporter: {
      fullName: report.fullName.trim(),
      email: report.email.trim(),
    },
    delivery: "preview",
  };
}

/**
 * Build the API payload for the Ticket System public endpoint.
 *
 * @param {{ projectTitle: string, reporter: { email: string }, description: string }} report
 * @param {string} priority - Selected priority (critical/high/medium/low)
 * @returns {{ email: string, subject: string, priority: string, description: string }}
 */
export function buildTicketPayload(report, priority) {
  const subject = `${report.projectTitle} issue`.trim();
  return {
    email: report.reporter.email,
    subject,
    priority,
    description: report.description,
  };
}
