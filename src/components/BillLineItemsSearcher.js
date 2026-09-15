import React from "react";
import { injectIntl } from "react-intl";
import { formatAmount, formatMessageWithValues, Searcher, withHistory, useModulesManager } from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchBillLineItems } from "../actions";
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "../constants";
import { Tooltip } from "@material-ui/core";
import BillLineItemsFilter from "./BillLineItemsFilter";

const BillLineItemsSearcher = ({
  intl,
  bill,
  fetchBillLineItems,
  fetchingBillLineItems,
  fetchedBillLineItems,
  errorBillLineItems,
  billLineItems,
  billLineItemsPageInfo,
  billLineItemsTotalCount,
}) => {
  const modulesManager = useModulesManager();
  const fetch = (params) => fetchBillLineItems(params);

  const headers = () => [
    "billItem.code",
    "billItem.description",
    "billItem.ledgerAccount",
    "billItem.quantity",
    "billItem.unitPrice",
    "billItem.discount",
    "billItem.deduction",
    "billItem.amountTotal",
    "billItem.amountNet",
  ];

  const itemFormatters = () => [
    (billItem) => billItem.code,
    (billItem) => billItem.description,
    (billItem) => billItem.ledgerAccount,
    (billItem) => billItem.quantity,
    (billItem) => formatAmount(modulesManager, intl, billItem.unitPrice),
    (billItem) => formatAmount(modulesManager, intl, billItem.discount),
    (billItem) => formatAmount(modulesManager, intl, billItem.deduction),
    (billItem) => formatAmount(modulesManager, intl, billItem.amountTotal),
    (billItem) => (
      <Tooltip
        title={formatMessageWithValues(intl, "invoice", "billItem.amountNetTooltip", {
          value: !!billItem?.taxAnalysis ? JSON.parse(billItem.taxAnalysis)?.["total"] : null,
        })}
        placement="right"
      >
        <div>{formatAmount(modulesManager, intl, billItem.amountNet)}</div>
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
    bill_Id: {
      value: bill?.id,
      filter: `bill_Id: "${bill?.id}"`,
    },
    isDeleted: {
      value: false,
      filter: "isDeleted: false",
    },
  });
  return (
    !!bill?.id && (
      <Searcher
        module="bill"
        FilterPane={BillLineItemsFilter}
        fetch={fetch}
        items={billLineItems}
        itemsPageInfo={billLineItemsPageInfo}
        fetchingItems={fetchingBillLineItems}
        fetchedItems={fetchedBillLineItems}
        errorItems={errorBillLineItems}
        tableTitle={formatMessageWithValues(intl, "invoice", "billItems.searcher.resultsTitle", {
          billLineItemsTotalCount,
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
  fetchingBillLineItems: state.invoice.fetchingBillLineItems,
  fetchedBillLineItems: state.invoice.fetchedBillLineItems,
  errorBillLineItems: state.invoice.errorBillLineItems,
  billLineItems: state.invoice.billLineItems,
  billLineItemsPageInfo: state.invoice.billLineItemsPageInfo,
  billLineItemsTotalCount: state.invoice.billLineItemsTotalCount,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchBillLineItems,
    },
    dispatch,
  );
};

export default withHistory(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BillLineItemsSearcher)));
