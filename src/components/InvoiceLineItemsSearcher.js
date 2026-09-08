import React, { useMemo } from "react";
import { injectIntl } from "react-intl";
import { formatAmount, formatMessageWithValues, Searcher, useModulesManager } from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchInvoiceLineItems } from "../actions";
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "../constants";
import { getHiddenInvoiceLineItemColumns } from "../util/invoiceLineItemsColumns";
import { Tooltip } from "@material-ui/core";
import InvoiceLineItemsFilter from "./InvoiceLineItemsFilter";

// taxAnalysis is a raw JSON column: never let a corrupted value break the row rendering.
const parseTaxAnalysisTotal = (taxAnalysis) => {
  if (!taxAnalysis) {
    return null;
  }
  try {
    return JSON.parse(taxAnalysis)?.["total"] ?? null;
  } catch (error) {
    return null;
  }
};

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

  // Hidden columns are filtered out of a single columns list so that headers, formatters and sorts stay aligned.
  const columns = useMemo(() => {
    const hiddenColumns = getHiddenInvoiceLineItemColumns(modulesManager);
    return [
      { header: "invoiceLineItem.code", sort: ["code", true], formatter: (invoiceLineItem) => invoiceLineItem.code },
      {
        header: "invoiceLineItem.description",
        sort: ["description", true],
        formatter: (invoiceLineItem) => invoiceLineItem.description,
      },
      {
        header: "invoiceLineItem.ledgerAccount",
        sort: ["ledgerAccount", true],
        formatter: (invoiceLineItem) => invoiceLineItem.ledgerAccount,
      },
      {
        header: "invoiceLineItem.quantity",
        sort: ["quantity", true],
        formatter: (invoiceLineItem) => invoiceLineItem.quantity,
      },
      {
        header: "invoiceLineItem.unitPrice",
        sort: ["unitPrice", true],
        formatter: (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.unitPrice),
      },
      {
        header: "invoiceLineItem.discount",
        sort: ["discount", true],
        formatter: (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.discount),
      },
      {
        header: "invoiceLineItem.deduction",
        sort: ["deduction", true],
        formatter: (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.deduction),
      },
      {
        header: "invoiceLineItem.amountTotal",
        sort: ["amountTotal", true],
        formatter: (invoiceLineItem) => formatAmount(modulesManager, intl, invoiceLineItem.amountTotal),
      },
      {
        header: "invoiceLineItem.amountNet",
        sort: ["amountNet", true],
        formatter: (invoiceLineItem) => (
          <Tooltip
            title={formatMessageWithValues(intl, "invoice", "invoiceLineItem.amountNetTooltip", {
              value: parseTaxAnalysisTotal(invoiceLineItem?.taxAnalysis),
            })}
            placement="right"
          >
            <div>{formatAmount(modulesManager, intl, invoiceLineItem.amountNet)}</div>
          </Tooltip>
        ),
      },
    ].filter((column) => !hiddenColumns.includes(column.header));
  }, [modulesManager, intl]);

  const headers = () => columns.map((column) => column.header);

  const itemFormatters = () => columns.map((column) => column.formatter);

  const sorts = () => columns.map((column) => column.sort);

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
