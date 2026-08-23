declare module "bwip-js" {
  interface ToBufferOptions {
    bcid: string;
    text: string;
    scale?: number;
    width?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
    textsize?: number;
    [key: string]: unknown;
  }

  const bwipjs: {
    toBuffer: (options: ToBufferOptions) => Promise<Buffer>;
  };

  export default bwipjs;
}
