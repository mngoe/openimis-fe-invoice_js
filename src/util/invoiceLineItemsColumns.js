// Columns hidden by default in the invoice line items panel and in its search criteria.
// The ids are the column labels (i18n keys), also used by the matching search criterion, and can be
// overridden from the "fe-invoice" module configuration, e.g. `invoiceLineItems.hiddenColumns: []`
// to display every column again.
export const DEFAULT_HIDDEN_INVOICE_LINE_ITEM_COLUMNS = [
  "invoiceLineItem.description",
  "invoiceLineItem.ledgerAccount",
  "invoiceLineItem.discount",
  "invoiceLineItem.deduction",
  "invoiceLineItem.amountNet",
];

// Reads the configured hidden columns, falling back on the defaults when the configuration is missing
// or is not an array (a hand-written instance configuration must not break the rendering).
export const getHiddenInvoiceLineItemColumns = (modulesManager) => {
  const configured = modulesManager?.getConf(
    "fe-invoice",
    "invoiceLineItems.hiddenColumns",
    DEFAULT_HIDDEN_INVOICE_LINE_ITEM_COLUMNS,
  );
  return Array.isArray(configured) ? configured : DEFAULT_HIDDEN_INVOICE_LINE_ITEM_COLUMNS;
};
