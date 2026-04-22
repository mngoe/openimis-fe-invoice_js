import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { Grid, Paper, Divider, Typography } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  formatAmount,
  formatDateFromISO,
  formatMessageWithValues,
  historyPush,
  PagedDataHandler,
  Table,
  withModulesManager,
  decodeId,
  graphql,
  formatPageQueryWithCount,
  parseData,
} from "@openimis/fe-core";
import { fetchInvoices } from "../actions";
import { RIGHT_INVOICE_SEARCH } from "../constants";

const styles = (theme) => ({
  paper: theme.paper.paper,
  paperHeader: theme.paper.header,
  tableTitle: theme.table.title,
});

class FamilyInvoicesPaymentsOverview extends PagedDataHandler {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      localInvoicePayments: [],
      fetchingLocalInvoicePayments: false,
      errorLocalInvoicePayments: null,
    };
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-invoice",
      "familyInvoicesPaymentsOverview.rowsPerPageOptions",
      [5, 10, 20],
    );
    this.defaultPageSize = props.modulesManager.getConf(
      "fe-invoice",
      "familyInvoicesPaymentsOverview.defaultPageSize",
      5
    );
  }

  componentDidMount() {
    this.setState({ orderBy: "-dateInvoice" }, () => this.query());
  }

  componentDidUpdate(prevProps) {
    if (this.familyChanged(prevProps)) {
      this.setState(
        { localInvoicePayments: [], fetchingLocalInvoicePayments: false, errorLocalInvoicePayments: null },
        () => this.query(),
      );
      return;
    }
    if (this.props.fetchedInvoices && this.props.fetchedInvoices !== prevProps.fetchedInvoices) {
      this.fetchFamilyInvoicePayments();
    }
  }

  familyChanged = (prevProps) =>
    (!prevProps.family && !!this.props.family) ||
    (!!prevProps.family &&
      !!this.props.family &&
      (prevProps.family.uuid == null || prevProps.family.uuid !== this.props.family.uuid));

  queryPrms = () => {
    const { family } = this.props;
    const headInsureeId = family?.headInsuree?.id ? decodeId(family.headInsuree.id) : null;
    if (!headInsureeId) {
      return null;
    }
    return [
      `orderBy: "${this.state?.orderBy || "-dateInvoice"}"`,
      `subjectType: "insuree"`,
      `subjectId: "${headInsureeId}"`,
      "isDeleted: false",
    ];
  };

  fetchFamilyInvoicePayments = async () => {
    const invoiceIds = (this.props.invoices || []).map((i) => i?.id).filter((id) => !!id);
    if (!invoiceIds.length) {
      this.setState({ localInvoicePayments: [], fetchingLocalInvoicePayments: false, errorLocalInvoicePayments: null });
      return;
    }
    this.setState({ fetchingLocalInvoicePayments: true, errorLocalInvoicePayments: null });
    try {
      const paymentBatches = await Promise.all(
        invoiceIds.map((invoiceId) => this.props.fetchInvoicePaymentsByInvoiceId(invoiceId)),
      );
      this.setState({
        localInvoicePayments: paymentBatches.flatMap((batch) => batch || []),
        fetchingLocalInvoicePayments: false,
        errorLocalInvoicePayments: null,
      });
    } catch (e) {
      this.setState({
        localInvoicePayments: [],
        fetchingLocalInvoicePayments: false,
        errorLocalInvoicePayments: e,
      });
    }
  };

  onDoubleClick = (item, newTab = false) => {
    if (!item?.invoiceId) return;
    historyPush(this.props.modulesManager, this.props.history, "invoice.route.invoice", [item.invoiceId], newTab);
  };

  headers = [
    "invoice.familyInvoicesPayments.coveredPeriod",
    "invoice.familyInvoicesPayments.invoiceNumber",
    "invoice.familyInvoicesPayments.amountDue",
    "invoice.familyInvoicesPayments.paymentAmount",
    "invoice.familyInvoicesPayments.paymentDate",
    "invoice.familyInvoicesPayments.balance",
  ];

  formatPeriod = (invoice) => {
    const from = formatDateFromISO(this.props.modulesManager, this.props.intl, invoice?.dateValidFrom);
    const to = formatDateFromISO(this.props.modulesManager, this.props.intl, invoice?.dateValidTo);
    if (!invoice?.dateValidFrom && !invoice?.dateValidTo) {
      return "";
    }
    return `${from || ""} - ${to || ""}`.trim();
  };

  getTableItems = () => {
    const { invoices } = this.props;
    const { localInvoicePayments } = this.state;

    if (!invoices?.length) return [];

    const paymentsByInvoiceId = localInvoicePayments.reduce((acc, payment) => {
      const paymentInvoiceId = payment?.__invoiceId;
      if (!paymentInvoiceId) return acc;
      acc[paymentInvoiceId] = [...(acc[paymentInvoiceId] || []), payment];
      return acc;
    }, {});

    return invoices.flatMap((invoice) => {
      const invoiceTotal = Number(invoice?.amountTotal || 0);

      let linkedPayments = paymentsByInvoiceId?.[invoice?.id] || [];

      const sortedPayments = [...linkedPayments].sort(
        (a, b) => new Date(a.datePayment).getTime() - new Date(b.datePayment).getTime()
      );

      let cumulativePaid = 0;

      const balanceByPaymentId = {};

      sortedPayments.forEach((payment) => {
        const amount = Number(payment?.amountReceived || 0);
        cumulativePaid += amount;

        balanceByPaymentId[payment.id] = invoiceTotal - cumulativePaid;
      });

      if (!linkedPayments.length) {
        return [
          {
            rowId: `invoice-${invoice.id}`,
            invoiceId: invoice.id,
            invoice,
            payment: null,
            balance: invoiceTotal,
          },
        ];
      }

      return linkedPayments.map((payment) => ({
        rowId: `invoice-${invoice.id}-payment-${payment.id}`,
        invoiceId: invoice.id,
        invoice,
        payment,
        balance: balanceByPaymentId[payment.id],
      }));
    });
  };

  formatters = [
    (item) => this.formatPeriod(item.invoice),
    (item) => item?.invoice?.code || "",
    (item) =>
      formatAmount(this.props.intl, item?.invoice?.amountTotal || 0),
    (item) =>
      item?.payment
        ? formatAmount(
            this.props.intl,
            item?.payment?.amountPayed ?? item?.payment?.amountReceived ?? 0,
          )
        : "",
    (item) =>
      item?.payment?.datePayment
        ? formatDateFromISO(this.props.modulesManager, this.props.intl, item?.payment?.datePayment)
        : "",
    (item) =>
      formatAmount(
        this.props.intl,
        item?.balance ?? 0
      ),
  ];

  render() {
    const { family, rights, invoicesPageInfo, fetchingInvoices, errorInvoices } = this.props;
    const { fetchingLocalInvoicePayments, errorLocalInvoicePayments } = this.state;

    if (!family?.headInsuree?.id || !rights.includes(RIGHT_INVOICE_SEARCH)) {
      return null;
    }

    const items = this.getTableItems();

    return (
      <Paper className={this.props.classes.paper}>
        <Grid container alignItems="center" direction="row" className={this.props.classes.paperHeader}>
          <Grid item xs={12}>
            <Typography className={this.props.classes.tableTitle}>
              {formatMessageWithValues(this.props.intl, "invoice", "familyInvoicesPayments.title", {
                count: items.length,
              })}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Table
          module="invoice"
          headers={this.headers}
          itemFormatters={this.formatters}
          items={items}
          fetching={fetchingInvoices || fetchingLocalInvoicePayments}
          error={errorInvoices || errorLocalInvoicePayments}
          onDoubleClick={this.onDoubleClick}
          withPagination
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          page={this.currentPage()}
          pageSize={this.currentPageSize()}
          count={invoicesPageInfo?.totalCount || 0}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core?.user?.i_user ? state.core.user.i_user.rights : [],
  family: state.insuree.family || {},
  fetchingInvoices: state.invoice.fetchingInvoices,
  fetchedInvoices: state.invoice.fetchedInvoices,
  invoices: state.invoice.invoices || [],
  invoicesPageInfo: state.invoice.invoicesPageInfo || {},
  errorInvoices: state.invoice.errorInvoices,
});

const mapDispatchToProps = (dispatch) => ({
  fetch: (_modulesManager, params) => dispatch(fetchInvoices(params)),
  fetchInvoicePaymentsByInvoiceId: async (invoiceId) => {
    const projection = [
      "id",
      "reconciliationStatus",
      "codeExt",
      "label",
      "codeTp",
      "codeReceipt",
      "fees",
      "amountReceived",
      "datePayment",
      "paymentOrigin",
      "payerRef",
    ];
    const payload = formatPageQueryWithCount(
      "paymentInvoice",
      [`subjectIds: ["${invoiceId}"]`, "isDeleted: false", 'orderBy: ["-datePayment"]', "first: 100"],
      projection,
    );
    const response = await dispatch(graphql(payload));
    if (response?.error || response?.payload?.errors) {
      return [];
    }
    const payments = parseData(response?.payload?.data?.paymentInvoice) || [];
    return payments.map((payment) => ({ ...payment, __invoiceId: invoiceId }));
  },
});

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyInvoicesPaymentsOverview)))),
);