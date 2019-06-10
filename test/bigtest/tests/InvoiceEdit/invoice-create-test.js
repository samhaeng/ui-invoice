import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceEdit from '../../interactors/InvoiceEdit';

describe('Invoice create', () => {
  setupApplication();

  const invoiceEdit = new InvoiceEdit();

  beforeEach(async function () {
    this.visit('/invoice?layer=create');
    await invoiceEdit.whenLoaded();
  });

  it('displays an create invoice form', () => {
    expect(invoiceEdit.isPresent).to.be.true;
  });

  describe('Add data and save invoice', () => {
    beforeEach(async function () {
      await invoiceEdit.termsInput.fill('test value');
      await invoiceEdit.saveButton.click();
    });

    it('closes edit form', () => {
      expect(invoiceEdit.isPresent).to.be.true;
    });
  });

  describe('Invoice information accordion could be collapsed', () => {
    beforeEach(async function () {
      await invoiceEdit.invoiceInformation.click();
    });

    it('displays the form', () => {
      expect(invoiceEdit.isPresent).to.be.true;
    });
  });
});
