declare namespace Express {
  export interface Request {
    locals: {
      web3Provider: import("ethers").providers.BaseProvider;
      contracts: { [key: string]: import("ethers").BaseContract };
      [key:string]:any;
    };
    auth: { address: string };
  }
}
