/// <reference path="../../../types/index.d.ts" />
import { Request, Response, Express } from "express";

export type Cacher = (r: Request, d: any) => void;
export type Checker = (r: Request) =>
  | {
      shouldCache: boolean;
      [key: string]: any;
    }
  | Promise<{ shouldCache: boolean; [key: string]: any }>;

export default class CacheMiddleware {
  private cachers: Cacher[] = [];
  private checkers: { [key: string]: Checker } = {};
  static _instance;
  registerApp(app: Express) {
    app.set("cacheOps", {});
  }

  registerCacher(cacher: Cacher) {
    this.cachers.push(cacher);
  }

  registerChecker(key: string, checker: Checker) {
    this.checkers[key] = checker;
  }

  getCheckerMiddleware(key: string) {
    return async function (request: Request, response: Response, next) {
      if (request.method !== "GET") return next();

      const checker = this.checkers[key];
      console.log("checker", checker);
      if (!checker) return next();

      const cacheData = await checker(request);

      if (cacheData.shouldCache) {
        request.locals.cacheData = {
          ...cacheData,
        };
        return next();
      }

      return response.status(200).json(JSON.parse(cacheData.body));
    }.bind(this);
  }

  cacheIfShould(request: Request, data) {
    const cacheOps = request.app.locals.settings.cacheOps;
    // if there is no valid cache
    // and response is not an error
    // and there is not a caching operation running for this request

    if (
      request.locals.cacheData?.shouldCache &&
      data.error === undefined &&
      !cacheOps[request.originalUrl]
    ) {
      cacheOps[request.originalUrl] = true;
      Promise.all(this.cachers.map((fn) => fn(request, data))).then(
        (response) => {
          cacheOps[request.originalUrl] = false;
        }
      );
    }
  }

  getMiddleware() {
    return this.interceptor.bind(this);
  }

  interceptor(request: Request, response: Response, next) {
    try {
      const responseJson = response.json;
      response.json = (data) => {
        this.cacheIfShould(request, data);
        response.json = responseJson;
        return responseJson.call(response, data);
      };
    } catch (error) {
      next(error);
    }
    next();
  }

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new CacheMiddleware();
    return this._instance;
  }

  static destroy() {
    this._instance = null;
  }

}