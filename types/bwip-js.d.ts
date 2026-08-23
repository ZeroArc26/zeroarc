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

  function toBuffer(options: ToBufferOptions): Promise<Buffer>;

  const bwipjs: {
    toBuffer: typeof toBuffer;
  };

  export default bwipjs;
}
