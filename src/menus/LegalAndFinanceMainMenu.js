import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { DoubleArrow } from "@material-ui/icons";
import { formatMessage, MainMenuContribution, withModulesManager } from "@openimis/fe-core";
import { LEGAL_AND_FINANCE_MAIN_MENU_CONTRIBUTION_KEY } from "../constants";
import { withStyles } from "@material-ui/core/styles";
import { RIGHT_INVOICE_SEARCH, RIGHT_BILL_SEARCH, RIGHT_BILL_AMEND, RIGHT_INVOICE_AMEND } from "./../constants"

// Whether the "bills" menu entry is displayed. Can be overridden from the "fe-invoice" module
// configuration, e.g. `invoice.billsMenuEnabled: true` to show the menu even without the bill rights.
const DEFAULT_BILLS_MENU_ENABLED = false;

const DoubleArrowFlipped = withStyles({
  root: {
    transform: "scaleX(-1)",
  },
})(DoubleArrow);


const LegalAndFinanceMainMenu = (props) => {
  const entries = []

  if (!!props.rights.filter((r) => r >= RIGHT_INVOICE_SEARCH && r <= RIGHT_INVOICE_AMEND).length) {
    // RIGHT_SEARCH is shared by HF & HQ staff)
    entries.push({
      text: formatMessage(props.intl, "invoice", "menu.invoices"),
      icon: <DoubleArrow />,
      route: "/invoices",
    });
  }

  const billsMenuEnabled = props.modulesManager.getConf(
    "fe-invoice",
    "invoice.billsMenuEnabled",
    DEFAULT_BILLS_MENU_ENABLED,
  );
  if (
    billsMenuEnabled &&
    !!props.rights.filter((r) => r >= RIGHT_BILL_SEARCH && r <= RIGHT_BILL_AMEND).length
  ) {
    // RIGHT_SEARCH is shared by HF & HQ staff)
    entries.push({
      text: formatMessage(props.intl, "invoice", "menu.bills"),
      icon: <DoubleArrowFlipped />,
      route: "/bills",
    });
  }
  
  entries.push(
    ...props.modulesManager
      .getContribs(LEGAL_AND_FINANCE_MAIN_MENU_CONTRIBUTION_KEY)
      .filter((c) => !c.filter || c.filter(props.rights)),
  );
  if (!entries.length) return null;

  return (
    <MainMenuContribution {...props} header={formatMessage(props.intl, "invoice", "mainMenu")} entries={entries} />
  );
};

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default injectIntl(withModulesManager(connect(mapStateToProps)(LegalAndFinanceMainMenu)));
