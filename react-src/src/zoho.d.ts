export interface ZohoCreatorRecord {
  ID: string;
  [key: string]: any;
}

export interface ZohoGetRecordsResponse {
  code: number;
  data: ZohoCreatorRecord[];
}

export interface ZohoInitData {
  [key: string]: any;
}

declare global {
  interface Window {
    ZOHO: {
      CREATOR: {
        /**
         * Widget SDK v2 promise-based init — resolves once the widget
         * has a live connection to the Creator page. No separate
         * embeddedApp.on('PageLoad', ...) / embeddedApp.init() pair
         * needed.
         */
        init: () => Promise<ZohoInitData>;
        DATA: {
          getRecords: (config: {
            appName: string;
            reportName: string;
            maxRecords?: number;
            criteria?: string;
          }) => Promise<ZohoGetRecordsResponse>;
        };
      };
    };
  }
}

export {};
