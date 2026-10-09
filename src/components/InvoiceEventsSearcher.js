import React, { useRef, useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { formatMessageWithValues, formatDateFromISO, Searcher, withModulesManager } from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchInvoiceEvents } from "../actions";
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "../constants";
import InvoiceEventsFilter from "./InvoiceEventsFilter";
import InvoiceEventTypePicker from "../pickers/InvoiceEventTypePicker";
import { ACTION_TYPE } from "../reducer";

const InvoiceEventsSearcher = ({
  intl,
  modulesManager,
  invoice,
  submittingMutation,
  mutation,
  fetchInvoiceEvents,
  fetchingInvoiceEvents,
  fetchedInvoiceEvents,
  errorInvoiceEvents,
  invoiceEvents,
  invoiceEventsPageInfo,
  invoiceEventsTotalCount,
}) => {
  const [queryParams, setQueryParams] = useState([]);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    if (
      prevSubmittingMutationRef.current &&
      !submittingMutation &&
      mutation?.actionType === ACTION_TYPE.CREATE_INVOICE_EVENT_MESSAGE
    ) {
      refetch();
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const fetch = (params) => fetchInvoiceEvents(params);

  const refetch = () => fetch(queryParams);

  const filtersToQueryParams = ({ filters, pageSize, beforeCursor, afterCursor, orderBy }) => {
    const queryParams = Object.keys(filters)
      .filter((f) => !!filters[f]["filter"])
      .map((f) => filters[f]["filter"]);
    !beforeCursor && !afterCursor && queryParams.push(`first: ${pageSize}`);
    if (afterCursor) {
      queryParams.push(`after: "${afterCursor}"`);
      queryParams.push(`first: ${pageSize}`);
    }
    if (beforeCursor) {
      queryParams.push(`before: "${beforeCursor}"`);
      queryParams.push(`last: ${pageSize}`);
    }
    orderBy && queryParams.push(`orderBy: ["${orderBy}"]`);
    setQueryParams(queryParams);
    return queryParams;
  };

  const headers = () => ["invoiceEvent.eventType.label", "invoiceEvent.dateCreatedAt", "invoiceEvent.message"];

  const itemFormatters = () => [
    (invoiceEvent) => <InvoiceEventTypePicker value={invoiceEvent?.eventType} readOnly />,
    (invoiceEvent) => formatDateFromISO(modulesManager, intl, invoiceEvent?.dateCreated),
    (invoiceEvent) => invoiceEvent.message,
  ];

  const sorts = () => [
    ["eventType", true],
    ["message", true],
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
        FilterPane={InvoiceEventsFilter}
        fetch={fetch}
        items={invoiceEvents}
        itemsPageInfo={invoiceEventsPageInfo}
        fetchingItems={fetchingInvoiceEvents}
        fetchedItems={fetchedInvoiceEvents}
        errorItems={errorInvoiceEvents}
        tableTitle={formatMessageWithValues(intl, "invoice", "invoiceEvents.searcherResultsTitle", {
          invoiceEventsTotalCount,
        })}
        filtersToQueryParams={filtersToQueryParams}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="eventType"
        defaultFilters={defaultFilters()}
      />
    )
  );
};

const mapStateToProps = (state) => ({
  fetchingInvoiceEvents: state.invoice.fetchingInvoiceEvents,
  fetchedInvoiceEvents: state.invoice.fetchedInvoiceEvents,
  errorInvoiceEvents: state.invoice.errorInvoiceEvents,
  invoiceEvents: state.invoice.invoiceEvents,
  invoiceEventsPageInfo: state.invoice.invoiceEventsPageInfo,
  invoiceEventsTotalCount: state.invoice.invoiceEventsTotalCount,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchInvoiceEvents }, dispatch);

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(InvoiceEventsSearcher)));
