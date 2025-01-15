import React from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { TextInput, NumberInput, PublishedComponent, formatMessage } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME, STARTS_WITH_LOOKUP } from "../constants";
import { defaultFilterStyles } from "../util/styles";
import PaymentInvoiceStatusPicker from "../pickers/PaymentInvoiceStatusPicker";

const InvoicePaymentsFilter = ({ intl, classes, filters, onChangeFilters }) => {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFUALT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => (filters[filterName] ? filters[filterName].value : "");

  const onChangeFilter = (filterName) => (value) => {
    debouncedOnChangeFilters([
      {
        id: filterName,
        value: !!value ? value : null,
        filter: `${filterName}: ${value}`,
      },
    ]);
  };

  const onChangeStringFilter =
    (filterName, lookup = null) =>
    (value) => {
      lookup
        ? debouncedOnChangeFilters([
            {
              id: filterName,
              value,
              filter: `${filterName}_${lookup}: "${value}"`,
            },
          ])
        : onChangeFilters([
            {
              id: filterName,
              value,
              filter: `${filterName}: "${value}"`,
            },
          ]);
    };

  return (
    <Grid container className={classes.form}>
      <Grid item xs={2} className={classes.item}>
        <PaymentInvoiceStatusPicker
          label="paymentInvoice.reconciliationStatus.label"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("reconciliationStatus")}
          onChange={(value) =>
            onChangeFilters([
              {
                id: "reconciliationStatus",
                value: value,
                filter: `reconciliationStatus: "${value}"`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="paymentInvoice.codeExt"
          value={filterTextFieldValue("codeExt")}
          onChange={onChangeStringFilter("codeExt", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="paymentInvoice.label"
          value={filterTextFieldValue("label")}
          onChange={onChangeStringFilter("label", STARTS_WITH_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="paymentInvoice.codeTp"
          value={filterTextFieldValue("codeTp")}
          onChange={onChangeStringFilter("codeTp", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="paymentInvoice.codeReceipt"
          value={filterTextFieldValue("codeReceipt")}
          onChange={onChangeStringFilter("codeReceipt", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="paymentInvoice.fees"
          min={0}
          value={filterValue("fees")}
          onChange={onChangeFilter("fees")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="paymentInvoice.amountReceived"
          min={0}
          value={filterValue("amountReceived")}
          onChange={onChangeFilter("amountReceived")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="invoice"
          label="paymentInvoice.datePayment"
          value={filterValue("datePayment")}
          onChange={onChangeStringFilter("datePayment")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="paymentInvoice.paymentOrigin"
          value={filterTextFieldValue("paymentOrigin")}
          onChange={onChangeStringFilter("paymentOrigin", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="paymentInvoice.payerRef"
          value={filterTextFieldValue("payerRef")}
          onChange={onChangeStringFilter("payerRef", CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
};

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(InvoicePaymentsFilter)));
