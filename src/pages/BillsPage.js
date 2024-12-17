import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { injectIntl } from "react-intl";

import { withTheme, withStyles } from "@material-ui/core/styles";

import { Helmet, withModulesManager, formatMessage, clearCurrentPaginationPage } from "@openimis/fe-core";
import { RIGHT_BILL_SEARCH } from "../constants";
import BillSearcher from "../components/BillSearcher";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

const BILL_SEARCHER_ACTION_CONTRIBUTION_KEY = "invoice.bill.SelectionAction";

const BillsPage = (props) => {
  const { classes, rights } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCurrentPaginationPage());
  }, []);

  let actions = [];

  return (
    rights.includes(RIGHT_BILL_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessage(props.intl, "bill", "bills.pageTitle")} />
        <BillSearcher
          rights={rights}
          actions={actions}
          actionsContributionKey={BILL_SEARCHER_ACTION_CONTRIBUTION_KEY}
        />
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps)(BillsPage)))));
