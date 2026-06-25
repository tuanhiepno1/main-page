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
