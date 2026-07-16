import api from "./api";

/**
 * Downloads a PDF report from the backend and triggers a browser save.
 * Uses axios with responseType 'blob' so the auth token (attached by the
 * shared api interceptor) is sent - a plain <a href> can't do that.
 */
const downloadBlob = async (url, filename) => {
  const res = await api.get(url, { responseType: "blob" });

  const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export const downloadInterviewReportPDF = (interviewId) =>
  downloadBlob(`/report/interview/${interviewId}`, `interview-report-${interviewId}.pdf`);

export const downloadAdaptiveReportPDF = (sessionId) =>
  downloadBlob(`/report/adaptive/${sessionId}`, `adaptive-interview-report-${sessionId}.pdf`);
