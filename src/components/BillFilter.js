import React from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { withModulesManager, formatMessage, TextInput, NumberInput, PublishedComponent } from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import ThirdPartyTypePickerBill from "../pickers/ThirdPartyTypePickerBill";
import SubjectTypePickerBill from "../pickers/SubjectTypePickerBill";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

const BillFilter = ({ intl, classes, filters, onChangeFilters }) => {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFUALT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => (filters[filterName] ? filters[filterName].value : "");

  const onChangeDecimalFilter = (filterName) => (value) => {
    const decimalValue = Number(value).toFixed(2);
    debouncedOnChangeFilters([
      {
        id: filterName,
        value: !!decimalValue ? decimalValue : null,
        filter: `${filterName}: "${decimalValue}"`,
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
        <SubjectTypePickerBill
          label="subject"
          withNull
          nullLabel={formatMessage(intl, "bill", "any")}
          value={filterValue("subjectType")}
          onChange={onChangeStringFilter("subjectType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <ThirdPartyTypePickerBill
          label="thirdparty"
          withNull
          nullLabel={formatMessage(intl, "bill", "any")}
          value={filterValue("thirdpartyType")}
          onChange={onChangeStringFilter("thirdpartyType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="bill"
          label="code"
          value={filterTextFieldValue("code")}
          onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="bill"
          label="dateBill"
          value={filterValue("dateBill")}
          onChange={(v) =>
            onChangeFilters([
              {
                id: "dateBill",
                value: v,
                filter: `dateBill: "${v}"`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <InvoiceStatusPicker
          label="status.label"
          withNull
          nullLabel={formatMessage(intl, "bill", "any")}
          value={filterValue("status")}
          onChange={(value) =>
            onChangeFilters([
              {
                id: "status",
                value: value,
                // probably won't work on mssql https://openimis.atlassian.net/browse/OP-1546
                filter: `status: A_${value}`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="bill"
          label="amountTotal"
          min={0}
          value={filterValue("amountTotal")}
          onChange={onChangeDecimalFilter("amountTotal")}
        />
      </Grid>
    </Grid>
  );
};

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(BillFilter))));
