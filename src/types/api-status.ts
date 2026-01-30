export type BaselineStatus =
  | 'widely-available'
  | 'newly-available'
  | 'limited'
  | 'not-available';

export interface BrowserSupport {
  chrome?: string;
  firefox?: string;
  safari?: string;
  edge?: string;
}

export interface ApiInfo {
  id: string;
  name: string;
  description: string;
  baselineStatus: BaselineStatus;
  mdnUrl: string;
  caniuseUrl?: string;
  browsers: BrowserSupport;
  path: string;
}
