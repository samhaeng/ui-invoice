import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import AddInvoiceLinesAction from './AddInvoiceLinesAction';
import styles from './InvoiceLines.css';

const InvoiceLinesActions = ({ addLines, createLine }) => (
  <IfPermission perm="invoice.invoice-lines.item.post">
    <div className={styles.invoiceLinesActions}>
      <AddInvoiceLinesAction addLines={addLines} />

      <Button
        data-test-button-create-line
        onClick={createLine}
      >
        <FormattedMessage id="ui-invoice.button.createLine" />
      </Button>
    </div>
  </IfPermission>
);

InvoiceLinesActions.propTypes = {
  addLines: PropTypes.func.isRequired,
  createLine: PropTypes.func.isRequired,
};

export default InvoiceLinesActions;
