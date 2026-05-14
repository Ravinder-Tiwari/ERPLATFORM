import { pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (pdfjs.GlobalWorkerOptions.workerSrc !== pdfWorker) {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
}
