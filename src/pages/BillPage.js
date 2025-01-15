import React, { useState, useRef, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { withTheme, withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  Form,
  Helmet,
  withHistory,
  formatMessage,
  formatMessageWithValues,
  coreConfirm,
  journalize,
  useModulesManager,
} from "@openimis/fe-core";
import { fetchBill, deleteBill } from "../actions";
import { STATUS, RIGHT_BILL_SEARCH, DEFAULT, WORKER_VOUCHER_HEAD_PANEL_CONTRIB } from "../constants";
import BillHeadPanel from "../components/BillHeadPanel";
import BillTabPanel from "../components/BillTabPanel";
import { ACTION_TYPE } from "../reducer";
import { getEnumValue } from "../util/enum";

const styles = (theme) => ({
  page: theme.page,
});

const BillPage = ({
  intl,
  classes,
  rights,
  history,
  billUuid,
  bill,
  fetchBill,
  deleteBill,
  coreConfirm,
  confirmed,
  submittingMutation,
  mutation,
  journalize,
}) => {
  const modulesManager = useModulesManager();
  const [editedBill, setEditedBill] = useState({});
  const [confirmedAction, setConfirmedAction] = useState(() => null);
  const prevSubmittingMutationRef = useRef();
  const isWorker = modulesManager.getConf("fe-core", "isWorker", DEFAULT.IS_WORKER);

  useEffect(() => {
    if (!!billUuid) {
      fetchBill([`id: "${billUuid}"`]);
    }
  }, [billUuid]);

  useEffect(() => confirmed && confirmedAction(), [confirmed]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      mutation?.actionType === ACTION_TYPE.DELETE_BILL && back();
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  useEffect(() => setEditedBill(bill), [bill]);

  const back = () => history.goBack();

  const onChange = (bill) => setEditedBill(bill);

  const titleParams = (bill) => ({ label: bill?.code });

  const deleteBillCallback = () => deleteBill(
    bill,
    formatMessageWithValues(intl, "invoice", "bill.delete.mutationLabel", {
      code: bill?.code,
    }),
  );

  const openDeleteBillConfirmDialog = () => {
    setConfirmedAction(() => deleteBillCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "bill.delete.confirm.title", {
        code: bill?.code,
      }),
      formatMessage(intl, "invoice", "bill.delete.confirm.message"),
    );
  };

  const actions = [
    !!bill && 
      getEnumValue(bill?.status) !== STATUS.PAID && {
        doIt: openDeleteBillConfirmDialog,
        icon: <DeleteIcon />,
        tooltip: formatMessage(intl, "invoice", "deleteButtonTooltip"),
      },
  ];

  const VoucherHeadPanel = modulesManager.getContribs(WORKER_VOUCHER_HEAD_PANEL_CONTRIB)?.[0];

  return (
    rights.includes(RIGHT_BILL_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessageWithValues(intl, "bill", "pageTitle", titleParams(bill))} />
        <Form
          module="bill"
          title="pageTitle"
          titleParams={titleParams(bill)}
          bill={editedBill}
          back={back}
          onChange={onChange}
          HeadPanel={isWorker && VoucherHeadPanel ? VoucherHeadPanel : BillHeadPanel}
          Panels={[BillTabPanel]}
          rights={rights}
          actions={actions}
          setConfirmedAction={setConfirmedAction}
        />
      </div>
    )
  );
};

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  billUuid: props.match.params.bill_uuid,
  confirmed: state.core.confirmed,
  fetchingBill: state.invoice.fetchingBill,
  fetchedBill: state.invoice.fetchedBill,
  bill: state.invoice.bill,
  errorBill: state.invoice.errorBill,
  confirmed: state.core.confirmed,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchBill, deleteBill, coreConfirm, journalize }, dispatch);
};

export default withHistory(
  injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BillPage)))),
);
