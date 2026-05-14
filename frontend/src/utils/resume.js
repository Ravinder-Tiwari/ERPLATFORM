import { USER_API_END_POINT } from "./constant";

const PDF_MIME_TYPE = "application/pdf";
const WORD_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const WORD_EXTENSIONS = new Set(["doc", "docx"]);

const getLowercaseExtension = (filename = "") => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const isPdfResume = (profile = {}) => {
  if (profile?.resumeMimeType === PDF_MIME_TYPE) {
    return true;
  }

  const extension = getLowercaseExtension(profile?.resumeOriginalName);
  return extension === "pdf" || profile?.resume?.toLowerCase?.().includes(".pdf");
};

export const isWordResume = (profile = {}) => {
  if (WORD_MIME_TYPES.includes(profile?.resumeMimeType)) {
    return true;
  }

  return WORD_EXTENSIONS.has(getLowercaseExtension(profile?.resumeOriginalName));
};

export const getResumeViewUrl = (profile = {}) => {
  if (!profile?.resume) {
    return "";
  }

  if (isWordResume(profile)) {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(profile.resume)}`;
  }

  return profile.resume;
};

export const getResumeDownloadUrl = (userId) => {
  if (!userId) {
    return "";
  }

  return `${USER_API_END_POINT}/resume/${userId}/download`;
};

export const getResumePreviewUrl = (userId) => {
  if (!userId) {
    return "";
  }

  return `${USER_API_END_POINT}/resume/${userId}/view`;
};

export const getResumeFileName = (profile = {}) =>
  profile?.resumeOriginalName || "Resume";
