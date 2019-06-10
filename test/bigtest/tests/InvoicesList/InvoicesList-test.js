import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoicesListInteractor from '../../interactors/InvoicesList';
import InvoiceEdit from '../../interactors/InvoiceEdit';

const INVOICES_COUNT = 15;

describe('Invoices list', () => {
  setupApplication();

  const invoicesList = new InvoicesListInteractor();

  beforeEach(async function () {
    const invocies = this.server.createList('invoice', INVOICES_COUNT);

    invocies.forEach(invoice => this.server.create('vendor', {
      id: invoice.vendorId,
    }));

    this.visit('/invoice');
    await invoicesList.whenLoaded();
  });

  it('shows the list of organization items', () => {
    expect(invoicesList.isPresent).to.equal(true);
  });

  it('renders row for each invoice from the response', () => {
    expect(invoicesList.invocies().length).to.be.equal(INVOICES_COUNT);
  });

  it('displays create the new invoice button', () => {
    expect(invoicesList.newInvoiceButton.isPresent).to.be.true;
  });

  describe('Create new invoice', () => {
    const invoiceEdit = new InvoiceEdit();

    beforeEach(async function () {
      await invoicesList.newInvoiceButton.click();
      await invoiceEdit.whenLoaded();
    });

    it('displays create invoice form', () => {
      expect(invoiceEdit.isVisible).to.be.true;
    });
  });
});
