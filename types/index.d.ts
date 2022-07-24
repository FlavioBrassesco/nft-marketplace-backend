declare namespace Express {
  export interface Request {
    locals: {
      [key: string]: any;
      web3Provider: import("ethers").providers.BaseProvider;
      contracts: { [key: string]: import("ethers").Contract };
    };
  }
}
