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
const DEFAULT_INVOICE_MENUS_ENABLED = {
  bills: false,
  paymentPoints: false,
  payrolls: false,
  payrollsApproved: false,
  payrollsPending: false,
  payrollsReconciled: false,
  contracts: false,
  paymentCycles: false,
  paymentPlans: false,
};

const DoubleArrowFlipped = withStyles({
  root: {
    transform: "scaleX(-1)",
  },
})(DoubleArrow);

const ROUTE_PAYMENT_POINTS = '/paymentPoints';
const ROUTE_PAYROLLS = '/payrolls';
const ROUTE_PAYROLLS_APPROVED = '/payrollsApproved';
const ROUTE_PAYROLLS_PENDING = '/payrollsPending';
const ROUTE_PAYROLLS_RECONCILED = '/payrollsReconciled';
const ROUTE_PAYMENT_CYCLES = '/paymentCycles';
const ROUTE_PAYMENT_PLANS = '/paymentPlans';
const ROUTE_CONTRACTS = '/contracts';

// Maps each contributed menu route to its configuration key in DEFAULT_INVOICE_MENUS_ENABLED.
const ROUTE_TO_MENU_CONFIG_KEY = {
  [ROUTE_PAYMENT_POINTS]: "paymentPoints",
  [ROUTE_PAYROLLS]: "payrolls",
  [ROUTE_PAYROLLS_APPROVED]: "payrollsApproved",
  [ROUTE_PAYROLLS_PENDING]: "payrollsPending",
  [ROUTE_PAYROLLS_RECONCILED]: "payrollsReconciled",
  [ROUTE_PAYMENT_CYCLES]: "paymentCycles",
  [ROUTE_PAYMENT_PLANS]: "paymentPlans",
  [ROUTE_CONTRACTS]: "contracts",
};


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

  const invoiceMenusEnabled = props.modulesManager.getConf(
    "fe-invoice",
    "invoice.menusEnabled",
    DEFAULT_INVOICE_MENUS_ENABLED,
  );

  if (
    invoiceMenusEnabled.bills === true &&
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
      .filter((c) => {
        const configKey = ROUTE_TO_MENU_CONFIG_KEY[c.route];
        // Keep entries that are not configurable (no matching route).
        if (!configKey) return true;
        // Only display a menu when its key is explicitly enabled (true) in the config.
        // If the config exists but doesn't contain the key, it is hidden by default.
        return invoiceMenusEnabled[configKey] === true;
      })
      .filter((c) => !c.filter || c.filter(props.rights, props.modulesManager)),
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
