export type Response = {
  code: number;
};

export type SuccessResponse = Response & {
  data: object;
};

export type ErrorResponse = Response & {
  message: string;
  exception: Error;
  data?: object;
};

export type OnStartHandler = (
  config: RequestConfig,
  processCounter: number
) => Promise<void> | void;

export type OnSuccessHandler = (
  response: SuccessResponse,
  config: RequestConfig,
  processCounter: number
) => Promise<void> | void;

export type OnErrorHandler = (
  response: ErrorResponse,
  config: RequestConfig,
  processCounter: number
) => Promise<void> | void;

export type HandlersConfig = {
  onStart?: OnStartHandler;
  onSuccess?: OnSuccessHandler;
  onError?: OnErrorHandler;
};

export type RequestMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch';

export type RequestConfig = HandlersConfig & {
  path: string;
  method?: RequestMethod;
  affectCounter?: boolean;
  params?: object;
  data?: object;
  config?: object;
};

export type HttpClientConfig = HandlersConfig & {};
