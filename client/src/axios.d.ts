import * as axios from "axios";

declare module "axios" {
  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}
