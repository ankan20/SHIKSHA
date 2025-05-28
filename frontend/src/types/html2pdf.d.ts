// types/html2pdf.d.ts
declare module 'html2pdf.js' {
  
  
    export default function html2pdf(): {
      from(element: HTMLElement): {
        set(options: any): {
          save(): void;
        };
      };
    };
  }