declare module 'formidable' {
    import { IncomingForm, File, Fields } from 'formidable';
  
    interface FormidableOptions {
      uploadDir?: string;
      keepExtensions?: boolean;
      multiples?: boolean;
    }
  
    export class IncomingForm {
      constructor(options?: FormidableOptions);
      parse(req: any, callback: (err: any, fields: Fields, files: { [key: string]: File | File[] }) => void): void;
      uploadDir: string;
      keepExtensions: boolean;
      multiples: boolean;
    }
  
    export default IncomingForm;
  }
  