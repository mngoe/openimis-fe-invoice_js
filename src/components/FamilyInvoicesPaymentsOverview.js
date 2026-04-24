import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { Grid, Paper, Divider, Typography, CircularProgress } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  formatAmount,
  formatDateFromISO,
  formatMessage,
  formatMessageWithValues,
  historyPush,
  PagedDataHandler,
  Table,
  withModulesManager,
  decodeId,
} from "@openimis/fe-core";
import { fetchFamilyInvoicePaymentOverview, fetchInvoicePaymentsDetails } from "../actions";
import { RIGHT_INVOICE_SEARCH } from "../constants";

const styles = (theme) => ({
  paper: theme.paper.paper,
  paperHeader: theme.paper.header,
  tableTitle: theme.table.title,
  loadingContainer: {
    minHeight: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    fontWeight: 500,
  },
  summaryRow: {
    width: "100%",
  },
  summaryCell: {
    textAlign: "right",
  },
  expandedBlock: {
    padding: theme.spacing(1, 2, 2, 2),
  },
  expandedTitle: {
    marginBottom: theme.spacing(1),
  },
});

class FamilyInvoicesPaymentsOverview extends PagedDataHandler {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      expandedInvoiceId: null,
      selectedInvoiceId: null,
    };
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-invoice",
      "familyInvoicesPaymentsOverview.rowsPerPageOptions",
      [5, 10, 20],
    );
    this.defaultPageSize = props.modulesManager.getConf("fe-invoice", "familyInvoicesPaymentsOverview.defaultPageSize", 5);
  }

  componentDidMount() {
    this.query();
  }

  componentDidUpdate(prevProps) {
    if (this.familyChanged(prevProps)) {
      this.setState({ page: 0, afterCursor: null, beforeCursor: null, expandedInvoiceId: null }, () => this.query());
    }
  }

  familyChanged = (prevProps) =>
    (!prevProps.family && !!this.props.family) ||
    (!!prevProps.family && !!this.props.family && (prevProps.family.uuid == null || prevProps.family.uuid !== this.props.family.uuid));

  queryPrms = () => {
    const headInsureeId = this.props.family?.headInsuree?.id ? decodeId(this.props.family.headInsuree.id) : null;
    if (!headInsureeId) return null;
    return [`headInsureeId: "${headInsureeId}"`];
  };

  onToggleInvoiceDetails = async (selectedRows) => {
    const invoiceRow = selectedRows?.[0];
    const invoiceId = invoiceRow?.invoiceId;
    if (!invoiceId) {
      if (this.state.selectedInvoiceId && this.state.expandedInvoiceId === this.state.selectedInvoiceId) {
        this.setState({ expandedInvoiceId: null });
      }
      return;
    }
    if (this.state.expandedInvoiceId === invoiceId) {
      this.setState({ expandedInvoiceId: null, selectedInvoiceId: invoiceId });
      return;
    }

    this.setState({ expandedInvoiceId: invoiceId, selectedInvoiceId: invoiceId });

    const cachedInvoicePayments = this.props.invoicePaymentsByInvoiceId?.[invoiceId];
    if (!cachedInvoicePayments) {
      await this.props.fetchInvoicePaymentsDetails(invoiceId);
    }
  };

  onDoubleClick = (invoiceRow, newTab = false) => {
    if (!invoiceRow?.invoiceId) return;
    historyPush(this.props.modulesManager, this.props.history, "invoice.route.invoice", [invoiceRow.invoiceId], newTab);
  };

  invoiceHeaders = [
    "invoice.familyInvoicesPayments.coveredPeriod",
    "invoice.familyInvoicesPayments.invoiceNumber",
    "invoice.familyInvoicesPayments.amountDue",
    "invoice.familyInvoicesPayments.totalInvoicePayments",
    "invoice.familyInvoicesPayments.invoiceBalance",
  ];

  invoiceFormatters = [
    (invoiceRow) => this.formatCoveredPeriod(invoiceRow),
    (invoiceRow) => invoiceRow?.invoiceCode || "",
    (invoiceRow) => formatAmount(this.props.intl, invoiceRow?.amountDue || 0),
    (invoiceRow) => formatAmount(this.props.intl, invoiceRow?.totalInvoicePayments || 0),
    (invoiceRow) => formatAmount(this.props.intl, invoiceRow?.invoiceBalance || 0),
  ];

  invoicePaymentHeaders = [
    "invoice.familyInvoicesPayments.invoicePaymentDate",
    "invoice.familyInvoicesPayments.invoicePaymentAmount",
    "invoice.familyInvoicesPayments.invoicePaymentReference",
  ];

  invoicePaymentFormatters = [
    (invoicePayment) =>
      invoicePayment?.paymentDate
        ? formatDateFromISO(this.props.modulesManager, this.props.intl, invoicePayment.paymentDate)
        : "",
    (invoicePayment) => formatAmount(this.props.intl, invoicePayment?.paymentAmount || 0),
    (invoicePayment) => invoicePayment?.paymentReference || "",
  ];

  formatCoveredPeriod = (invoiceRow) => {
    const coveredFrom = formatDateFromISO(this.props.modulesManager, this.props.intl, invoiceRow?.coveredFrom);
    const coveredTo = formatDateFromISO(this.props.modulesManager, this.props.intl, invoiceRow?.coveredTo);
    if (!invoiceRow?.coveredFrom && !invoiceRow?.coveredTo) return "";
    return `${coveredFrom || ""} - ${coveredTo || ""}`.trim();
  };

  renderExpandedInvoiceDetails() {
    const { expandedInvoiceId } = this.state;
    if (!expandedInvoiceId) return null;

    const invoicePayments = this.props.invoicePaymentsByInvoiceId?.[expandedInvoiceId] || [];
    const isFetchingInvoicePayments = this.props.isFetchingInvoicePaymentsByInvoiceId?.[expandedInvoiceId];
    const invoicePaymentsError = this.props.errorInvoicePaymentsByInvoiceId?.[expandedInvoiceId];

    return (
      <div className={this.props.classes.expandedBlock}>
        <Typography className={this.props.classes.expandedTitle}>
          {formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.invoicePaymentsSectionTitle")}
        </Typography>
        <Table
          module="invoice"
          headers={this.invoicePaymentHeaders}
          itemFormatters={this.invoicePaymentFormatters}
          items={invoicePayments}
          fetching={isFetchingInvoicePayments}
          error={invoicePaymentsError}
        />
      </div>
    );
  }

  render() {
    const {
      family,
      rights,
      invoiceRows,
      invoiceRowsTotalCount,
      isFetchingInvoiceRows,
      invoiceRowsError,
      totalInvoiceAmount,
      totalPaidAmount,
      globalBalance,
    } = this.props;

    if (!family?.headInsuree?.id || !rights.includes(RIGHT_INVOICE_SEARCH)) {
      return null;
    }

    return (
      <Paper className={this.props.classes.paper}>
        <Grid container alignItems="center" justifyContent="space-between" className={this.props.classes.paperHeader}>
          <Grid item>
            <Typography className={this.props.classes.tableTitle}>
              {formatMessageWithValues(this.props.intl, "invoice", "familyInvoicesPayments.title", {
                count: invoiceRowsTotalCount,
              })}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Grid container className={this.props.classes.summaryRow}>
              <Grid item xs={4} className={this.props.classes.summaryCell}>
                <Typography className={this.props.classes.summaryText}>
                  <strong>
                    {`${formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.totalInvoiceAmount")}: ${formatAmount(this.props.intl, totalInvoiceAmount || 0)}`}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={4} className={this.props.classes.summaryCell}>
                <Typography className={this.props.classes.summaryText}>
                  <strong>
                    {`${formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.totalPaidAmount")}: ${formatAmount(this.props.intl, totalPaidAmount || 0)}`}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={4} className={this.props.classes.summaryCell}>
                <Typography className={this.props.classes.summaryText}>
                  <strong>
                    {`${formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.globalBalance")}: ${formatAmount(this.props.intl, globalBalance || 0)}`}
                  </strong>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />

        {isFetchingInvoiceRows ? (
          <div className={this.props.classes.loadingContainer}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Table
              module="invoice"
              headers={this.invoiceHeaders}
              itemFormatters={this.invoiceFormatters}
              items={invoiceRows}
              error={invoiceRowsError}
              withSelection="single"
              onChangeSelection={this.onToggleInvoiceDetails}
              onDoubleClick={this.onDoubleClick}
              withPagination
              rowsPerPageOptions={this.rowsPerPageOptions}
              defaultPageSize={this.defaultPageSize}
              page={this.currentPage()}
              pageSize={this.currentPageSize()}
              count={invoiceRowsTotalCount}
              onChangePage={this.onChangePage}
              onChangeRowsPerPage={this.onChangeRowsPerPage}
            />
            {this.renderExpandedInvoiceDetails()}
          </>
        )}
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core?.user?.i_user ? state.core.user.i_user.rights : [],
  family: state.insuree.family || {},
  isFetchingInvoiceRows: state.invoice.fetchingFamilyInvoicePaymentOverview,
  invoiceRowsError: state.invoice.errorFamilyInvoicePaymentOverview,
  invoiceRows: state.invoice.familyInvoicePaymentOverviewItems || [],
  invoiceRowsTotalCount: state.invoice.familyInvoicePaymentOverviewTotalCount || 0,
  pageInfo: state.invoice.familyInvoicePaymentOverviewPageInfo || {},
  totalInvoiceAmount: state.invoice.totalInvoiceAmount || 0,
  totalPaidAmount: state.invoice.totalPaidAmount || 0,
  globalBalance: state.invoice.globalBalance || 0,
  invoicePaymentsByInvoiceId: state.invoice.invoicePaymentsByInvoiceId || {},
  isFetchingInvoicePaymentsByInvoiceId: state.invoice.isFetchingInvoicePaymentsByInvoiceId || {},
  errorInvoicePaymentsByInvoiceId: state.invoice.errorInvoicePaymentsByInvoiceId || {},
});

const mapDispatchToProps = (dispatch) => ({
  fetch: (_modulesManager, params) => dispatch(fetchFamilyInvoicePaymentOverview(params)),
  fetchInvoicePaymentsDetails: async (invoiceId) => dispatch(fetchInvoicePaymentsDetails(invoiceId)),
});

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyInvoicesPaymentsOverview)))),
);
