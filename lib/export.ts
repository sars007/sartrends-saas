import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export async function exportMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${filename}.md`);
}

export async function exportPDF(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
}

export async function exportDocx(content: string, filename: string) {
  const doc = new Document({
    sections: [{
      children: content.split('\n').map(line => new Paragraph({
        children: [new TextRun(line)]
      }))
    }]
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

export async function exportAll(content: string, htmlContent: string, filename: string) {
  const zip = new JSZip();
  zip.file(`${filename}.md`, content);
  const pdfCanvas = document.getElementById('preview') as HTMLElement;
  const pdfBlob = await new Promise<Blob>((resolve) => pdfCanvas && exportPDF(pdfCanvas, filename).then(() => resolve(new Blob([]))));
  zip.file(`${filename}.pdf`, pdfBlob);
  const docxBlob = await Packer.toBlob(new Document({ /*...*/ }));
  zip.file(`${filename}.docx`, docxBlob);
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${filename}-all.zip`);
}

