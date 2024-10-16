import React from 'react';
import * as ReactDOM from 'react-dom';
// @ts-ignore
import reactToWebComponent from 'react-to-webcomponent';
import { UiSearch } from '@catalogue/ui/search';
import SearchResultsTableWc from './app/search-results-table-wc/search-results-table-wc';
import SearchResultsCardWc from './app/search-results-card-wc/search-results-card-wc';
import SearchResultsGraphWc from './app/search-results-graph-wc/search-results-graph-wc';

export const convertReact2WebComponent = (
  Component: Parameters<typeof reactToWebComponent>[0],
  options?: Parameters<typeof reactToWebComponent>[1]
) => {
  const WebComponent = reactToWebComponent(Component, React, ReactDOM, options);

  class WebComponentWithStyle extends WebComponent {
    connectedCallback() {
      super.connectedCallback();
      ['main.css', 'styles.css'].forEach((style) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `${style}`);
        // link.setAttribute("href", `https://metawal.wallonie.be/geonetwork/catalog/lib/icho/${style}`);
        // @ts-ignore
        this.shadowRoot?.append(link);
      });
    }
  }
  return WebComponentWithStyle;
};

const catalogueSearch = convertReact2WebComponent(UiSearch, {
  shadow: 'open',
});
// @ts-ignore
customElements.define('catalogue-search', catalogueSearch);

const searchResultTableReactivelist = convertReact2WebComponent(
  SearchResultsTableWc,
  {
    shadow: 'open',
  }
);

// @ts-ignore
customElements.define('catalogue-results-table', searchResultTableReactivelist);

const searchResultCardReactivelist = convertReact2WebComponent(
  SearchResultsCardWc,
  {
    shadow: 'open',
  }
);
// @ts-ignore
customElements.define('catalogue-results-card', searchResultCardReactivelist);

const searchResultGraphReactivelist = convertReact2WebComponent(
  SearchResultsGraphWc,
  {
    shadow: 'open',
  }
);
// @ts-ignore
customElements.define('catalogue-results-graph', searchResultGraphReactivelist);
