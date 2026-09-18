import React from "react";
import { Grid, Divider, Typography } from "@material-ui/core";
import { withModulesManager, TextInput, FormattedMessage, PublishedComponent, NumberInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import SubjectTypePicker from "../pickers/SubjectTypePicker";
import ThirdpartyTypePicker from "../pickers/ThirdpartyTypePicker";
import { getSubjectAndThirdpartyTypePicker } from "../util/subject-and-thirdparty-picker";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import { defaultHeadPanelStyles } from "../util/styles";

// Fields hidden by default in the invoice head panel.
// Nomenclature follows the claim form ids (e.g. "Claim.healthFacility") and can be
// overridden from the "fe-invoice" module configuration, e.g. `invoiceHeadPanel.hiddenFields: []`
// to display every field again or `["Invoice.note"]` to only hide the note.
const DEFAULT_HIDDEN_FIELDS = [
  "Invoice.subject",
  "Invoice.codeTp",
  "Invoice.codeExt",
  "Invoice.amountDiscount",
  "Invoice.taxAnalysis",
  "Invoice.note",
  "Invoice.terms",
  "Invoice.paymentReference",
];

const InvoiceHeadPanel = ({ modulesManager, classes, invoice, mandatoryFieldsEmpty }) => {
  const taxAnalysisTotal = !!invoice?.taxAnalysis ? JSON.parse(invoice.taxAnalysis)?.["total"] : null;
  const configuredHiddenFields = modulesManager.getConf(
    "fe-invoice",
    "invoiceHeadPanel.hiddenFields",
    DEFAULT_HIDDEN_FIELDS,
  );
  const hiddenFields = Array.isArray(configuredHiddenFields) ? configuredHiddenFields : DEFAULT_HIDDEN_FIELDS;
  const isHidden = (id) => hiddenFields.includes(id);
  return (
    <>
      <Grid container className={classes.tableTitle}>
        <Grid item>
          <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
            <Grid item>
              <Typography>
                <FormattedMessage module="invoice" id="headPanelTitle" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      {mandatoryFieldsEmpty && (
        <>
          <div className={classes.item}>
            <FormattedMessage module="invoice" id="mandatoryFieldsEmptyError" />
          </div>
          <Divider />
        </>
      )}
      <Grid container className={classes.item}>
        {!isHidden("Invoice.subject") && (
          <Grid item xs={3} className={classes.item}>
            <SubjectTypePicker label="invoice.subject" withNull value={invoice?.subjectTypeName} readOnly />
          </Grid>
        )}
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, invoice?.subjectTypeName, invoice?.subject)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <ThirdpartyTypePicker label="invoice.thirdparty" withNull value={invoice?.thirdpartyTypeName} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, invoice?.thirdpartyTypeName, invoice?.thirdparty)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.code" value={invoice?.code} readOnly />
        </Grid>
        {!isHidden("Invoice.codeTp") && (
          <Grid item xs={3} className={classes.item}>
            <TextInput module="invoice" label="invoice.codeTp" value={invoice?.codeTp} readOnly />
          </Grid>
        )}
        {!isHidden("Invoice.codeExt") && (
          <Grid item xs={3} className={classes.item}>
            <TextInput module="invoice" label="invoice.codeExt" value={invoice?.codeExt} readOnly />
          </Grid>
        )}
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateDue"
            value={invoice?.dateDue}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateInvoice"
            value={invoice?.dateInvoice}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateValidFrom"
            value={invoice?.dateValidFrom}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateValidTo"
            value={invoice?.dateValidTo}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.datePayed"
            value={invoice?.datePayed}
            readOnly
          />
        </Grid>
        {!isHidden("Invoice.amountDiscount") && (
          <Grid item xs={3} className={classes.item}>
            <NumberInput
              module="invoice"
              label="invoice.amountDiscount"
              displayZero
              value={invoice?.amountDiscount}
              readOnly
            />
          </Grid>
        )}
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="invoice.amountNet" displayZero value={invoice?.amountNet} readOnly />
        </Grid>
        {!isHidden("Invoice.taxAnalysis") && (
          <Grid item xs={3} className={classes.item}>
            <TextInput module="invoice" label="invoice.taxAnalysis" value={taxAnalysisTotal} readOnly />
          </Grid>
        )}
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="invoice.amountTotal" displayZero value={invoice?.amountTotal} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <InvoiceStatusPicker label="invoice.status.label" withNull value={invoice?.status} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.currencyTpCode" value={invoice?.currencyTpCode} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.currencyCode" value={invoice?.currencyCode} readOnly />
        </Grid>
        {!isHidden("Invoice.note") && (
          <Grid item xs={3} className={classes.item}>
            <TextInput module="invoice" label="invoice.note" value={invoice?.note} readOnly />
          </Grid>
        )}
        {!isHidden("Invoice.terms") && (
          <Grid item xs={3} className={classes.item}>
            <TextInput module="invoice" label="invoice.terms" value={invoice?.terms} readOnly />
          </Grid>
        )}
        {!isHidden("Invoice.paymentReference") && (
          <Grid item xs={3} className={classes.item}>
            <TextInput module="invoice" label="invoice.paymentReference" value={invoice?.paymentReference} readOnly />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default withModulesManager(injectIntl(withTheme(withStyles(defaultHeadPanelStyles)(InvoiceHeadPanel))));
