import React from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { formatMessage, TextInput, NumberInput, PublishedComponent } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import { defaultFilterStyles } from "../util/styles";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import ThirdpartyTypePicker from "../pickers/ThirdpartyTypePicker";
import SubjectTypePicker from "../pickers/SubjectTypePicker";

const InvoiceFilter = ({ intl, classes, filters, onChangeFilters }) => {
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
        <SubjectTypePicker
          label="invoice.subject"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("subjectType")}
          onChange={onChangeStringFilter("subjectType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <ThirdpartyTypePicker
          label="invoice.thirdparty"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("thirdpartyType")}
          onChange={onChangeStringFilter("thirdpartyType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="invoice.code"
          value={filterTextFieldValue("code")}
          onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="invoice"
          label="invoice.dateInvoice"
          value={filterValue("dateInvoice")}
          onChange={(v) =>
            onChangeFilters([
              {
                id: "dateInvoice",
                value: v,
                filter: `dateInvoice: "${v}"`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <InvoiceStatusPicker
          label="invoice.status.label"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("status")}
          onChange={onChangeStringFilter("status")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoice.amountTotal"
          min={0}
          value={filterValue("amountTotal")}
          onChange={onChangeFilter("amountTotal")}
        />
      </Grid>
    </Grid>
  );
};

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(InvoiceFilter)));
