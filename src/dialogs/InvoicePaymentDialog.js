import React, { useState } from "react";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  NumberInput,
  formatMessageWithValues,
  formatMessage,
} from "@openimis/fe-core";
import { Fab, Grid, IconButton, Tooltip } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { createPaymentInvoiceWithDetail, updateInvoicePayment } from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EMPTY_PAYMENT_INVOICE } from "../constants";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker";
import PaymentInvoiceStatusPicker from "../pickers/PaymentInvoiceStatusPicker";
import { defaultDialogStyles } from "../util/styles";

const InvoicePaymentDialog = ({
  intl,
  classes,
  invoice,
  invoicePayment = null,
  disabled,
  createPaymentInvoiceWithDetail,
  updatePaymentInvoice,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] = useState({ invoiceId: invoice.id, ...(invoicePayment ?? EMPTY_PAYMENT_INVOICE) });
  const isNew = !invoicePayment;

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setPayment({ invoiceId: payment.invoiceId, ...(isNew ? EMPTY_PAYMENT_INVOICE : invoicePayment) });
  };

  const handleSave = () => {
    isNew
      ? createPaymentInvoiceWithDetail(
          payment,
          payment.invoiceId, 
          "invoice",
          formatMessageWithValues(intl, "invoice", "paymentInvoice.create.mutationLabel", {
            paymentInvoiceLabel: payment.label,
            code: invoice?.code,
          }),
        )
      : updateInvoicePayment(
          payment,
          formatMessageWithValues(intl, "invoice", "paymentInvoice.update.mutationLabel", {
            paymentInvoiceLabel: payment.label,
            code: invoice?.code,
          }),
        );
    handleClose();
  };

  const onAttributeChange = (attribute) => (value) =>
    setPayment({
      ...payment,
      [attribute]: value,
    });

  const canSave = Object.keys(payment)?.every((key) => !!payment[key]);

  return (
    <>
      {isNew ? (
        <Fab size="small" color="primary" onClick={handleOpen}>
          <AddIcon />
        </Fab>
      ) : (
        <Tooltip title={formatMessage(intl, "invoice", "editButtonTooltip")}>
          <IconButton onClick={handleOpen} disabled={disabled}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>
          <FormattedMessage module="invoice" id={`invoicePayment.${isNew ? "create" : "update"}.label`} />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className={classes.item}>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6} >
                <PaymentInvoiceStatusPicker
                  label="paymentInvoice.reconciliationStatus.label"
                  withNull
                  value={payment?.reconciliationStatus}
                  onChange={onAttributeChange("reconciliationStatus")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <InvoicePaymentStatusPicker
                  label="paymentInvoice.status.label"
                  withNull
                  value={payment?.status}
                  onChange={onAttributeChange("status")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.payerRef"
                  value={payment?.payerRef}
                  onChange={onAttributeChange("payerRef")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.payerName"
                  value={payment?.payerName}
                  onChange={onAttributeChange("payerName")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.codeExt"
                  value={payment?.codeExt}
                  onChange={onAttributeChange("codeExt")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.label"
                  value={payment?.label}
                  onChange={onAttributeChange("label")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.codeTp"
                  value={payment?.codeTp}
                  onChange={onAttributeChange("codeTp")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.codeReceipt"
                  value={payment?.codeReceipt}
                  onChange={onAttributeChange("codeReceipt")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <NumberInput
                  module="invoice"
                  label="paymentInvoice.fees"
                  min={0}
                  value={payment?.fees}
                  onChange={onAttributeChange("fees")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <NumberInput
                  module="invoice"
                  label="paymentInvoice.amountReceived"
                  min={0}
                  value={payment?.amountReceived}
                  onChange={onAttributeChange("amountReceived")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  module="invoice"
                  label="paymentInvoice.datePayment"
                  value={payment?.datePayment}
                  onChange={onAttributeChange("datePayment")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextInput
                  module="invoice"
                  label="paymentInvoice.paymentOrigin"
                  value={payment?.paymentOrigin}
                  onChange={onAttributeChange("paymentOrigin")}
                  required
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            <FormattedMessage module="invoice" id="dialog.cancel" />
          </Button>
          <Button onClick={handleSave} disabled={!canSave} variant="contained" color="primary" autoFocus>
            <FormattedMessage module="invoice" id={`dialog.${isNew ? "create" : "update"}`} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ createPaymentInvoiceWithDetail, updateInvoicePayment }, dispatch);

export default injectIntl(
  withTheme(withStyles(defaultDialogStyles)(connect(null, mapDispatchToProps)(InvoicePaymentDialog))),
);
