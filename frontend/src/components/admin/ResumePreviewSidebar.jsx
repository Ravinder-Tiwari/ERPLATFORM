import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Document, Page } from 'react-pdf';
import { Button } from '../ui/button';
import { Download, Eye, FileText, Loader2, X } from 'lucide-react';
import '@/utils/pdfWorker';
import {
  getResumeDownloadUrl,
  getResumeFileName,
  getResumePreviewUrl,
  getResumeViewUrl,
  isPdfResume,
  isWordResume,
} from '@/utils/resume';

const ResumePreviewSidebar = ({ applicant, isOpen, onClose }) => {
  const [numPages, setNumPages] = useState(0);
  const [pdfError, setPdfError] = useState('');

  useEffect(() => {
    setNumPages(0);
    setPdfError('');
  }, [applicant]);

  const profile = applicant?.applicant?.profile;
  const applicantId = applicant?.applicant?._id;
  const applicantName = applicant?.applicant?.fullname || 'Applicant';
  const hasPdfResume = isPdfResume(profile);
  const hasWordResume = isWordResume(profile);
  const previewFile = useMemo(() => {
    if (!applicantId) {
      return null;
    }

    return {
      url: getResumePreviewUrl(applicantId),
      withCredentials: true,
    };
  }, [applicantId]);

  return (
    <AnimatePresence>
      {isOpen && applicant ? (
        <>
          <motion.button
            type="button"
            aria-label="Close resume preview"
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                        Resume Preview
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                      {applicantName}
                    </h2>
                    <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                      {getResumeFileName(profile)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={getResumeDownloadUrl(applicantId)}
                    className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-100 px-4 py-5 dark:bg-slate-950/60">
                {hasPdfResume ? (
                  <div className="mx-auto flex max-w-md flex-col gap-4">
                    <Document
                      file={previewFile}
                      loading={
                        <div className="flex min-h-[240px] items-center justify-center rounded-2xl bg-white text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading PDF preview...
                        </div>
                      }
                      onLoadSuccess={({ numPages: totalPages }) => setNumPages(totalPages)}
                      onLoadError={() => {
                        setPdfError('Unable to load this PDF preview.');
                        setNumPages(0);
                      }}
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div
                          key={`page_${index + 1}`}
                          className="overflow-hidden rounded-2xl bg-white p-3 shadow-lg"
                        >
                          <Page
                            pageNumber={index + 1}
                            width={380}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                          />
                          <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                            Page {index + 1}
                          </p>
                        </div>
                      ))}
                    </Document>

                    {pdfError ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                        {pdfError}
                      </div>
                    ) : null}
                  </div>
                ) : hasWordResume ? (
                  <div className="h-full min-h-[70vh] overflow-hidden rounded-2xl bg-white shadow-lg">
                    <iframe
                      title={`${applicantName} resume preview`}
                      src={getResumeViewUrl(profile)}
                      className="h-full min-h-[70vh] w-full"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <FileText className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                      Preview is not available for this file.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      You can still download the resume using the button above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default ResumePreviewSidebar;
