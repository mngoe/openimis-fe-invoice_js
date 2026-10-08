import React from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { formatMessage, TextInput } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import { defaultFilterStyles } from "../util/styles";
import InvoiceEventTypePicker from "../pickers/InvoiceEventTypePicker";

const BillEventsFilter = ({ intl, classes, filters, onChangeFilters }) => {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFUALT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => (filters[filterName] ? filters[filterName].value : "");

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
        <InvoiceEventTypePicker
          label="billEvent.eventType.label"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("eventType")}
          onChange={onChangeStringFilter("eventType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="billEvent.message"
          value={filterTextFieldValue("message")}
          onChange={onChangeStringFilter("message", CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
};

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(BillEventsFilter)));
