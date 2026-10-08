import React from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { withModulesManager, TextInput, NumberInput, PublishedComponent } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME, STARTS_WITH_LOOKUP } from "../constants";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

const BillPaymentsFilter = ({ classes, filters, onChangeFilters }) => {
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
        <TextInput
          module="invoice"
          label="billPayment.codeExt"
          value={filterTextFieldValue("codeExt")}
          onChange={onChangeStringFilter("codeExt", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="billPayment.label"
          value={filterTextFieldValue("label")}
          onChange={onChangeStringFilter("label", STARTS_WITH_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="billPayment.codeTp"
          value={filterTextFieldValue("codeTp")}
          onChange={onChangeStringFilter("codeTp", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="billPayment.codeReceipt"
          value={filterTextFieldValue("codeReceipt")}
          onChange={onChangeStringFilter("codeReceipt", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="billPayment.fees"
          min={0}
          value={filterValue("fees")}
          onChange={(fee) =>
            onChangeFilters([
              {
                id: "fees",
                value: !fee ? null : fee,
                filter: fee ? `fees: "${parseFloat(fee)}"` : null,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="billPayment.amountReceived"
          min={0}
          value={filterValue("amountReceived")}
          onChange={(amountReceived) =>
            onChangeFilters([
              {
                id: "amountReceived",
                value: !amountReceived ? null : amountReceived,
                filter: amountReceived ? `amountReceived: "${parseFloat(amountReceived)}"` : null,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="invoice"
          label="billPayment.datePayment"
          value={filterValue("datePayment")}
          onChange={onChangeStringFilter("datePayment")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="billPayment.paymentOrigin"
          value={filterTextFieldValue("paymentOrigin")}
          onChange={onChangeStringFilter("paymentOrigin", CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
};

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(BillPaymentsFilter))));
