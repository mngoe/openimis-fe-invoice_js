import React, { useMemo } from "react";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { NumberInput, TextInput, useModulesManager } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import { getHiddenInvoiceLineItemColumns } from "../util/invoiceLineItemsColumns";
import { defaultFilterStyles } from "../util/styles";

const InvoiceLineItemsFilter = ({ classes, filters, onChangeFilters }) => {
  const modulesManager = useModulesManager();
  const hiddenColumns = useMemo(() => getHiddenInvoiceLineItemColumns(modulesManager), [modulesManager]);
  const isHidden = (header) => hiddenColumns.includes(header);

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
      {!isHidden("invoiceLineItem.code") && (
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="invoiceLineItem.code"
            value={filterTextFieldValue("code")}
            onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.description") && (
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="invoiceLineItem.description"
            value={filterTextFieldValue("description")}
            onChange={onChangeStringFilter("description", CONTAINS_LOOKUP)}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.ledgerAccount") && (
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="invoiceLineItem.ledgerAccount"
            value={filterTextFieldValue("ledgerAccount")}
            onChange={onChangeStringFilter("ledgerAccount", CONTAINS_LOOKUP)}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.quantity") && (
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoiceLineItem.quantity"
            min={0}
            value={filterValue("quantity")}
            onChange={onChangeFilter("quantity")}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.unitPrice") && (
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoiceLineItem.unitPrice"
            min={0}
            value={filterValue("unitPrice")}
            onChange={onChangeFilter("unitPrice")}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.discount") && (
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoiceLineItem.discount"
            min={0}
            value={filterValue("discount")}
            onChange={onChangeFilter("discount")}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.deduction") && (
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoiceLineItem.deduction"
            min={0}
            value={filterValue("deduction")}
            onChange={onChangeFilter("deduction")}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.amountTotal") && (
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoiceLineItem.amountTotal"
            min={0}
            value={filterValue("amountTotal")}
            onChange={onChangeFilter("amountTotal")}
          />
        </Grid>
      )}
      {!isHidden("invoiceLineItem.amountNet") && (
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoiceLineItem.amountNet"
            min={0}
            value={filterValue("amountNet")}
            onChange={onChangeFilter("amountNet")}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default withTheme(withStyles(defaultFilterStyles)(InvoiceLineItemsFilter));
