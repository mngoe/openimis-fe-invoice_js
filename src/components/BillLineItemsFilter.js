import React from "react";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { TextInput, NumberInput } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

const BillLineItemsFilter = ({ classes, filters, onChangeFilters }) => {
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
          module="bill"
          label="billItem.code"
          value={filterTextFieldValue("code")}
          onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="bill"
          label="billItem.description"
          value={filterTextFieldValue("description")}
          onChange={onChangeStringFilter("description", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="bill"
          label="billItem.ledgerAccount"
          value={filterTextFieldValue("ledgerAccount")}
          onChange={onChangeStringFilter("ledgerAccount", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="billItem.quantity"
          min={0}
          value={filterValue("quantity")}
          onChange={onChangeFilter("quantity")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="billItem.unitPrice"
          min={0}
          value={filterValue("unitPrice")}
          onChange={onChangeFilter("unitPrice")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="billItem.discount"
          min={0}
          value={filterValue("discount")}
          onChange={onChangeFilter("discount")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="billItem.deduction"
          min={0}
          value={filterValue("deduction")}
          onChange={onChangeFilter("deduction")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="billItem.amountTotal"
          min={0}
          value={filterValue("amountTotal")}
          onChange={onChangeFilter("amountTotal")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="billItem.amountNet"
          min={0}
          value={filterValue("amountNet")}
          onChange={onChangeFilter("amountNet")}
        />
      </Grid>
    </Grid>
  );
};

export default withTheme(withStyles(styles)(BillLineItemsFilter));
