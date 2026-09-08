import React from "react";
import { injectIntl } from "react-intl";
import { formatAmount, formatMessageWithValues, Searcher, useModulesManager } from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchInvoiceLineItems } from "../actions";
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "../constants";
import { Tooltip } from "@material-ui/core";
import InvoiceLineItemsFilter from "./InvoiceLineItemsFilter";

const InvoiceLineItemsSearcher = ({
  intl,
  invoice,
  fetchInvoiceLineItems,
  fetchingInvoiceLineItems,
  fetchedInvoiceLineItems,
  errorInvoiceLineItems,
  invoiceLineItems,
  invoiceLineItemsPageInfo,
  invoiceLineItemsTotalCount,
}) => {
  const modulesManager = useModulesManager();
  const fetch = (params) => fetchInvoiceLineItems(params);

  const headers = () => [
    "invoiceLineItem.code",
    "invoiceLineItem.description",
    "invoiceLineItem.ledgerAccount",
    "invoiceLineItem.quantity",
    "invoiceLineItem.unitPrice",
    "invoiceLineItem.discount",
    "invoiceLineItem.deduction",
    "invoiceLineItem.amountTotal",
    "invoiceLineItem.amountNet",
  ];

  const itemFormatters = () => [
    (invoiceLineItem) => invoiceLineItem.code,
    (invoiceLineItem) => invoiceLineItem.description,
    (invoiceLineItem) => invoiceLineItem.ledgerAccount,
    (invoiceLineItem) => invoiceLineItem.quantity,
    (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.unitPrice),
    (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.discount),
    (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.deduction),
    (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.amountTotal),
    (invoiceLineItem) => (
      <Tooltip
        title={formatMessageWithValues(intl, "invoice", "invoiceLineItem.amountNetTooltip", {
          value: !!invoiceLineItem?.taxAnalysis ? JSON.parse(invoiceLineItem.taxAnalysis)?.["total"] : null,
        })}
        placement="right"
      >
        <div>{formatAmount(modulesManager, intl, invoiceLineItem.amountNet)}</div>
      </Tooltip>
    ),
  ];

  const sorts = () => [
    ["code", true],
    ["description", true],
    ["ledgerAccount", true],
    ["quantity", true],
    ["unitPrice", true],
    ["discount", true],
    ["deduction", true],
    ["amountTotal", true],
    ["amountNet", true],
  ];

  const defaultFilters = () => ({
    invoice_Id: {
      value: invoice?.id,
      filter: `invoice_Id: "${invoice?.id}"`,
    },
    isDeleted: {
      value: false,
      filter: "isDeleted: false",
    },
  });

  return (
    !!invoice?.id && (
      <Searcher
        module="invoice"
        FilterPane={InvoiceLineItemsFilter}
        fetch={fetch}
        items={invoiceLineItems}
        itemsPageInfo={invoiceLineItemsPageInfo}
        fetchingItems={fetchingInvoiceLineItems}
        fetchedItems={fetchedInvoiceLineItems}
        errorItems={errorInvoiceLineItems}
        tableTitle={formatMessageWithValues(intl, "invoice", "invoiceLineItems.searcherResultsTitle", {
          invoiceLineItemsTotalCount,
        })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="code"
        defaultFilters={defaultFilters()}
      />
    )
  );
};

const mapStateToProps = (state) => ({
  fetchingInvoiceLineItems: state.invoice.fetchingInvoiceLineItems,
  fetchedInvoiceLineItems: state.invoice.fetchedInvoiceLineItems,
  errorInvoiceLineItems: state.invoice.errorInvoiceLineItems,
  invoiceLineItems: state.invoice.invoiceLineItems,
  invoiceLineItemsPageInfo: state.invoice.invoiceLineItemsPageInfo,
  invoiceLineItemsTotalCount: state.invoice.invoiceLineItemsTotalCount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchInvoiceLineItems }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(InvoiceLineItemsSearcher));
