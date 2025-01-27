import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import {
  invoiceLinesResource,
} from '../../../common/resources';
import styles from './InvoiceLines.css';

const visibleColumns = ['description', 'invoiceLineNumber', 'quantity', 'adjustmentsTotal', 'total'];
const columnMapping = {
  description: <FormattedMessage id="ui-invoice.invoice.details.lines.list.description" />,
  invoiceLineNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.number" />,
  quantity: <FormattedMessage id="ui-invoice.invoice.details.lines.list.quantity" />,
  adjustmentsTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.adjustments" />,
  total: <FormattedMessage id="ui-invoice.invoice.details.lines.list.total" />,
};
const columnWidths = {
  description: '40%',
  invoiceLineNumber: '15%',
  quantity: '15%',
  adjustmentsTotal: '15%',
  total: '15%',
};

class InvoiceLines extends Component {
  static manifest = Object.freeze({
    invoiceLines: {
      ...invoiceLinesResource,
      GET: {
        params: {
          query: (queryParams, pathComponents, resourceValues) => {
            if (resourceValues.invoiceId && resourceValues.invoiceId.length) {
              return `(invoiceId==${resourceValues.invoiceId}) sortBy metadata.createdDate invoiceLineNumber`;
            }

            return null;
          },
        },
      },
    },
    invoiceId: {},
    query: {},
  });

  static propTypes = {
    invoiceId: PropTypes.string.isRequired,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    currency: PropTypes.string.isRequired,
  };

  componentDidUpdate() {
    const { invoiceId, resources, mutator } = this.props;

    if (invoiceId !== resources.invoiceId) {
      mutator.invoiceId.replace(invoiceId);
    }
  }

  openLineDetails = (e, invoiceLine) => {
    const _path = `/invoice/view/${invoiceLine.invoiceId}/line/${invoiceLine.id}/view`;

    this.props.mutator.query.update({ _path });
  }

  render() {
    const { resources, currency } = this.props;
    const invoiceLinesItems = get(resources, 'invoiceLines.records.0.invoiceLines', []);
    const resultsFormatter = {
      adjustmentsTotal: ({ adjustmentsTotal }) => (
        <AmountWithCurrencyField
          amount={adjustmentsTotal}
          currency={currency}
        />
      ),
      total: ({ total }) => (
        <AmountWithCurrencyField
          amount={total}
          currency={currency}
        />
      ),
    };

    return (
      <Fragment>
        <div className={styles.invoiceLinesTotal}>
          <FormattedMessage
            id="ui-invoice.invoiceLine.total"
            values={{ total: invoiceLinesItems.length }}
          />
        </div>

        <MultiColumnList
          id="invoice-lines-list"
          contentData={invoiceLinesItems}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          onRowClick={this.openLineDetails}
          formatter={resultsFormatter}
        />
      </Fragment>
    );
  }
}

export default stripesConnect(InvoiceLines);
