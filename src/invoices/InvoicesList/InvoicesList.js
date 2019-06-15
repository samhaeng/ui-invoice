import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { Callout } from '@folio/stripes/components';
import { SearchAndSort } from '@folio/stripes/smart-components';

import packageInfo from '../../../package';
import {
  // api
  INVOICE_API,
} from '../../common/constants';
import {
  getInvoiceStatusLabel,
  formatAmount,
  formatDate,
  showToast,
} from '../../common/utils';
import {
  configAddress,
  VENDORS,
} from '../../common/resources';

import Invoice from './Invoice';
import InvoiceForm from '../InvoiceForm';

const filterConfig = [];
const visibleColumns = ['vendorInvoiceNo', 'vendor', 'invoiceDate', 'status', 'total'];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.invoice.list.vendorInvoiceNo" />,
  vendor: <FormattedMessage id="ui-invoice.invoice.list.vendor" />,
  invoiceDate: <FormattedMessage id="ui-invoice.invoice.list.invoiceDate" />,
  status: <FormattedMessage id="ui-invoice.invoice.list.status" />,
  total: <FormattedMessage id="ui-invoice.invoice.list.total" />,
};
const columnWidths = {
  vendorInvoiceNo: '18%',
  vendor: '35%',
  invoiceDate: '18%',
  status: '18%',
  total: '11%',
};
const baseResultsFormatter = {
  invoiceDate: invoice => formatDate(invoice.invoiceDate),
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  total: invoice => formatAmount(invoice.total),
};

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class InvoicesList extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    disableRecordCreation: PropTypes.bool,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    packageInfo: PropTypes.object,
  };

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  };

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'invoices',
      recordsRequired: '%{resultCount}',
      path: INVOICE_API,
      perRequest: RESULT_COUNT_INCREMENT,
      throwErrors: false,
    },
    vendors: VENDORS,
    configAddress,
  });

  constructor(props, context) {
    super(props, context);
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
  }

  // eslint-disable-next-line consistent-return
  onCreate = async (invoice) => {
    const { mutator } = this.props;
    const mutatorMethod = invoice.id ? 'PUT' : 'POST';

    try {
      const { id } = await mutator.records[mutatorMethod](invoice);

      this.showToast('ui-invoice.invoice.invoiceHasBeenCreated');
      mutator.query.update({
        _path: `/invoice/view/${id}`,
        layer: null,
      });
    } catch (response) {
      this.showToast('ui-invoice.errors.invoiceHasNotBeenCreated', 'error');

      return { id: 'Unable to create invoice' };
    }
  }

  render() {
    const {
      browseOnly,
      disableRecordCreation,
      mutator,
      onSelectRow,
      resources,
      showSingleResult,
      stripes,
    } = this.props;

    const vendors = get(resources, 'vendors.records', []);

    const resultsFormatter = {
      ...baseResultsFormatter,
      vendor: ({ vendorId }) => get(vendors.find(({ id }) => id === vendorId), 'name', ''),
    };

    return (
      <div data-test-invoices-list>
        <SearchAndSort
          packageInfo={this.props.packageInfo || packageInfo}
          objectName="invoice"
          baseRoute={packageInfo.stripes.route}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Invoice}
          onSelectRow={onSelectRow}
          viewRecordPerms="invoice.invoices.item.get"
          newRecordPerms="invoice.invoices.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={{ showToast: this.showToast }}
          stripes={stripes}
          disableRecordCreation={disableRecordCreation}
          browseOnly={browseOnly}
          showSingleResult={showSingleResult}
          editRecordComponent={InvoiceForm}
          newRecordInitialValues={{
            chkSubscriptionOverlap: true,
            currency: 'USD',
            source: '024b6f41-c5c6-4280-858e-33fba452a334',
          }}
          massageNewRecord={() => null}
          onCreate={this.onCreate}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default InvoicesList;
