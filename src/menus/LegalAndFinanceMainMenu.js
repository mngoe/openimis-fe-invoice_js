import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { DoubleArrow } from "@material-ui/icons";
import { formatMessage, MainMenuContribution, withModulesManager } from "@openimis/fe-core";
import {
  LEGAL_AND_FINANCE_MAIN_MENU_CONTRIBUTION_KEY,
  RIGHT_INVOICE_SEARCH,
  RIGHT_BILL_SEARCH,
  RIGHT_BILL_AMEND,
  RIGHT_INVOICE_AMEND,
  DEFAULT,
} from "../constants";
import { withStyles } from "@material-ui/core/styles";

const DoubleArrowFlipped = withStyles({
  root: {
    transform: "scaleX(-1)",
  },
})(DoubleArrow);

const LegalAndFinanceMainMenu = (props) => {
  const { modulesManager, rights, intl } = props;
  const isWorker = modulesManager.getConf("fe-core", "isWorker", DEFAULT.IS_WORKER);

  const entries = [];

  if (isWorker) {
    if (rights.includes(RIGHT_BILL_SEARCH || RIGHT_BILL_AMEND)) {
      entries.push({
        text: formatMessage(intl, "invoice", "menu.bills"),
        icon: <DoubleArrowFlipped />,
        route: "/bills",
      });
    }

    if (!entries.length) return null;

    return <MainMenuContribution {...props} header={formatMessage(intl, "invoice", "mainMenu")} entries={entries} />;
  }

  if (rights.filter((r) => r >= RIGHT_INVOICE_SEARCH && r <= RIGHT_INVOICE_AMEND).length) {
    // RIGHT_SEARCH is shared by HF & HQ staff)
    entries.push({
      text: formatMessage(intl, "invoice", "menu.invoices"),
      icon: <DoubleArrow />,
      route: "/invoices",
    });
  }
  if (rights.filter((r) => r >= RIGHT_BILL_SEARCH && r <= RIGHT_BILL_AMEND).length) {
    // RIGHT_SEARCH is shared by HF & HQ staff)
    entries.push({
      text: formatMessage(intl, "invoice", "menu.bills"),
      icon: <DoubleArrowFlipped />,
      route: "/bills",
    });
  }
  entries.push(
    ...modulesManager
      .getContribs(LEGAL_AND_FINANCE_MAIN_MENU_CONTRIBUTION_KEY)
      .filter((c) => !c.filter || c.filter(rights)),
  );
  if (!entries.length) return null;

  if (!entries.length) return null;

  return <MainMenuContribution {...props} header={formatMessage(intl, "invoice", "mainMenu")} entries={entries} />;
};

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default injectIntl(withModulesManager(connect(mapStateToProps)(LegalAndFinanceMainMenu)));
