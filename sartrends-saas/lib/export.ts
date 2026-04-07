import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export async function exportMarkdown(content: string, filename: string) {
  console.log('START MARKDOWN EXPORT');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${filename}.md`);
  console.log('DONE MARKDOWN EXPORT');
}

export async function exportPDF(element: HTMLElement, filename: string) {
  console.log('START PDF EXPORT');
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
  console.log('DONE PDF EXPORT');
}

export async function exportDocx(content: string, filename: string) {
  console.log('START DOCX EXPORT');
  let doc = new Document({
    sections: [{
      children: []
    }]
  });

  try {
    const data = JSON.parse(content);
    if (data.title) {
      doc.sections[0].children.push(new Paragraph({
        children: [new TextRun({
          text: data.title,
          bold: true,
          size: 28
        })]
      }));
    }
    if (data.sections) {
      data.sections.forEach((section: any) => {
        doc.sections[0].children.push(new Paragraph({
          children: [new TextRun({
            text: section.title,
            bold: true,
            size: 24
          })]
        }));
        doc.sections[0].children.push(new Paragraph({
          children: [new TextRun(section.content)]
        }));
      });
    }
    if (data.hazards) {
      doc.sections[0].children.push(new Paragraph({
        children: [new TextRun('Hazards:', { bold: true })]
      }));
      data.hazards.forEach((h: string) => {
        doc.sections[0].children.push(new Paragraph(h));
      });
    }
    // risks, controls, ppe, emergency, responsibilities similar
  } catch {
    // fallback
    content.split('\n').forEach(line => {
      if (line.trim()) {
        doc.sections[0].children.push(new Paragraph({
          children: [new TextRun(line)]
        }));
      }
    });
  }
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
  console.log('DONE DOCX EXPORT');
}

export async function exportZip(content: string, element: HTMLElement | null, filename: string) {
  console.log('START ZIP EXPORT');
  const zip = new JSZip();
  zip.file(`${filename}.md`, content);
  
  if (element) {
    const pdfBlob = await new Promise<Blob>((resolve) => {
      html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = (imgProps.height * pdfWidth) / imgProps.width;
        let position = 0;

        // Add first page
        const heightOnFirstPage = Math.min(heightLeft, pageHeight);
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, heightOnFirstPage);
        heightLeft -= pageHeight;

        // Add additional pages
        let pageCount = 1;
        while (heightLeft > 0 && pageCount < 50) {
          position = -pageCount * pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, heightLeft);
          heightLeft -= pageHeight;
          pageCount++;
        }

        resolve(pdf.output('blob'));
      }).catch((err) => {
        console.error('PDF gen failed:', err);
        resolve(new Blob([]));
      });
    });
    zip.file(`${filename}.pdf`, pdfBlob);
  }
  
  const docBlob = await Packer.toBlob(new Document({
    sections: [{
      children: content.split('\n').map(line => new Paragraph(line))
    }]
  }));
  zip.file(`${filename}.docx`, docBlob);
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${filename}-bundle.zip`);
  console.log('DONE ZIP EXPORT');
}

