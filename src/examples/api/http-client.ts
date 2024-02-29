import { AxiosError } from "axios";
import { ref, type Ref } from "vue";
import type { AxiosInstance, AxiosResponse } from "axios";
import type {
  RequestConfig,
  HttpClientConfig,
  ErrorResponse,
  OnStartHandler,
  OnSuccessHandler,
  OnErrorHandler,
  RequestMethod,
} from "./types";

export class HttpClientError extends Error implements ErrorResponse {
  code: number;
  exception: Error;
  data?: object;

  constructor(response: ErrorResponse) {
    super(response.message);
    this.code = response.code;
    this.exception = response.exception;
    this.data = response.data;
  }
}

export class HttpClient {
  CODE_NETWORK_ERROR = 1;
  CODE_UNKNOWN_ERROR = 2;

  private axios: AxiosInstance;
  private processCounter: Ref<number> = ref(0);
  private config: HttpClientConfig;

  constructor(axios: AxiosInstance, config: HttpClientConfig = {}) {
    this.axios = axios;
    this.config = config;
  }

  async get<T>(config: RequestConfig): Promise<T> {
    try {
      this.specifyMethod('get', config);
      await this.handleStart(config);
      const response = await this.axios.get<T>(
        config.path,
        {params: config.params, ...config.config}
      );
      await this.handleSuccess(response, config);
      return response.data;
    } catch (err) {
      throw new HttpClientError(await this.handleError(err as Error, config));
    }
  }

  async post<T>(config: RequestConfig): Promise<T> {
    try {
      this.specifyMethod('post', config);
      await this.handleStart(config);
      const response = await this.axios.post<T>(config.path, config.data, config.config);
      await this.handleSuccess(response, config);
      return response.data;
    } catch (err) {
      throw new HttpClientError(await this.handleError(err as Error, config));
    }
  }

  async put<T>(config: RequestConfig): Promise<T> {
    try {
      this.specifyMethod('put', config);
      await this.handleStart(config);
      const response = await this.axios.put<T>(config.path, config.data, config.config);
      await this.handleSuccess(response, config);
      return response.data;
    } catch (err) {
      throw new HttpClientError(await this.handleError(err as Error, config));
    }
  }

  async patch<T>(config: RequestConfig): Promise<T> {
    try {
      this.specifyMethod('patch', config);
      await this.handleStart(config);
      const response = await this.axios.patch<T>(config.path, config.data, config.config);
      await this.handleSuccess(response, config);
      return response.data;
    } catch (err) {
      throw new HttpClientError(await this.handleError(err as Error, config));
    }
  }

  async delete<T>(config: RequestConfig): Promise<T> {
    try {
      this.specifyMethod('delete', config);
      await this.handleStart(config);
      const response = await this.axios.delete<T>(
        config.path,
        {params: config.params, ...config.config}
      );
      await this.handleSuccess(response, config);
      return response.data;
    } catch (err) {
      throw new HttpClientError(await this.handleError(err as Error, config));
    }
  }

  async request<T>(config: RequestConfig): Promise<T> {
    if (!config.method) {
      throw new Error("no method specified");
    }

    const action = this[config.method as keyof HttpClient] as <T>(config: RequestConfig) => Promise<T>;
    return await action<T>(config);
  }

  attachCounter(counter: Ref<number>): void {
    this.processCounter = counter;
  }

  onStart(handler: OnStartHandler): void {
    this.config.onStart = handler;
  }

  onSuccess(handler: OnSuccessHandler): void {
    this.config.onSuccess = handler;
  }

  onError(handler: OnErrorHandler): void {
    this.config.onError = handler;
  }

  private specifyMethod(method: RequestMethod, config: RequestConfig): void {
    if (!config.method) {
      config.method = method;
    }
    if (config.method !== method) {
      throw new Error(`wrong method "${config.method}" with calling action ${method}()`);
    }
  }

  private async handleStart(config: RequestConfig): Promise<void> {
    if (this.needAffectCounter(config)) {
      this.processCounter.value += 1;
    }
    await this.handle(config.onStart, this.config.onStart, config, this.processCounter.value);
  }

  private async handleSuccess(response: AxiosResponse, config: RequestConfig): Promise<void> {
    if (this.needAffectCounter(config) && this.processCounter.value > 0) {
      this.processCounter.value -= 1;
    }
    const resp = {
      data: response.data,
      code: response.status,
    };
    await this.handle(config.onSuccess, this.config.onSuccess, resp, config, this.processCounter.value);
  }

  private async handleError(error: Error, config: RequestConfig): Promise<ErrorResponse> {
    if (this.needAffectCounter(config) && this.processCounter.value > 0) {
      this.processCounter.value -= 1;
    }

    const response = (error instanceof AxiosError)
      ? {
        message: error.message,
        exception: error,
        code: error.response?.status ?? this.CODE_NETWORK_ERROR,
        data: error.response?.data
      }
      : {
        message: error.message,
        exception: error,
        code: this.CODE_UNKNOWN_ERROR
      };

    await this.handle(config.onError, this.config.onError, response, config, this.processCounter.value);

    return response;
  }

  private needAffectCounter(config: RequestConfig): boolean {
    return config.affectCounter === undefined || config.affectCounter;
  }

  private async handle(
    customHandler: ((...args: any) => Promise<void> | void) | undefined,
    defaultHandler: ((...args: any) => Promise<void> | void) | undefined,
    ...args: any
  ): Promise<void> {
    try {
      if (customHandler !== undefined) {
        await customHandler(...args);
      } else if (defaultHandler !== undefined) {
        await defaultHandler(...args);
      }
    } catch (err) {
      if (defaultHandler !== undefined) {
        await defaultHandler(...args);
      } else {
        throw err;
      }
    }
  }
}
