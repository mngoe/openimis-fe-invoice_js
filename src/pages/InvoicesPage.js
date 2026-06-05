import React, { useEffect } from "react";
import { Helmet, withModulesManager, formatMessage, clearCurrentPaginationPage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect, useDispatch } from "react-redux";
import { RIGHT_INVOICE_SEARCH } from "../constants";
import InvoiceSearcher from "../components/InvoiceSearcher";
import { defaultPageStyles } from "../util/styles";

const InvoicesPage = ({ intl, classes, rights }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCurrentPaginationPage());
  }, []);

  return (
    rights.includes(RIGHT_INVOICE_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessage(intl, "invoice", "invoices.pageTitle")} />
        <InvoiceSearcher cacheFiltersKey="invoiceInvoicesPageFiltersCache" rights={rights} />
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default withModulesManager(
  injectIntl(withTheme(withStyles(defaultPageStyles)(connect(mapStateToProps)(InvoicesPage)))),
);
