import messages_en from "./translations/en.json";
import reducer from "./reducer";
import flatten from "flat";
import LegalAndFinanceMainMenu from "./menus/LegalAndFinanceMainMenu";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceStatusPicker from "./pickers/InvoiceStatusPicker";
import SubjectTypePickerBill from "./pickers/SubjectTypePickerBill";
import ThirdPartyTypePickerBill from "./pickers/ThirdPartyTypePickerBill";
import InvoicePage from "./pages/InvoicePage";
import BillsPage from "./pages/BillsPage";
import BillPage from "./pages/BillPage";
import { InvoiceLineItemsTabLabel, InvoiceLineItemsTabPanel } from "./components/InvoiceLineItemsTab";
import { InvoicePaymentsTabLabel, InvoicePaymentsTabPanel } from "./components/InvoicePaymentsTab";
import { InvoiceEventsTabLabel, InvoiceEventsTabPanel } from "./components/InvoiceEventsTab";
import { BillLineItemsTabLabel, BillLineItemsTabPanel } from "./components/BillLineItemsTab";
import { BillPaymentsTabLabel, BillPaymentsTabPanel } from "./components/BillPaymentsTab";
import { BillEventsTabLabel, BillEventsTabPanel } from "./components/BillEventsTab";
import { getSubjectAndThirdpartyTypePicker } from "./util/subject-and-thirdparty-picker";

const ROUTE_INVOICES = "invoices";
const ROUTE_INVOICE = "invoices/invoice";
const ROUTE_BILLS = "bills";
const ROUTE_BILL = "bills/bill";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: flatten(messages_en) }],
  "reducers": [{ key: "invoice", reducer }],
  //"core.MainMenu": [LegalAndFinanceMainMenu],
  "core.Router": [
    { path: ROUTE_INVOICES, component: InvoicesPage },
    { path: ROUTE_INVOICE + "/:invoice_uuid?", component: InvoicePage },
    { path: ROUTE_BILLS, component: BillsPage },
    { path: ROUTE_BILL + "/:bill_uuid?", component: BillPage },
  ],
  "refs": [
    { key: "invoice.route.invoice", ref: ROUTE_INVOICE },
    { key: "invoice.InvoiceStatusPicker", ref: InvoiceStatusPicker },
    { key: "invoice.SubjectTypePickerBill", ref: SubjectTypePickerBill },
    { key: "invoice.ThirdPartyTypePickerBill", ref: ThirdPartyTypePickerBill },
    { key: "bill.route.bill", ref: ROUTE_BILL },
    { key: "bill.util.getSubjectAndThirdpartyTypePicker", ref: getSubjectAndThirdpartyTypePicker },
  ],
  "invoice.TabPanel.label": [InvoiceLineItemsTabLabel, InvoicePaymentsTabLabel, InvoiceEventsTabLabel],
  "invoice.TabPanel.panel": [InvoiceLineItemsTabPanel, InvoicePaymentsTabPanel, InvoiceEventsTabPanel],
  "bill.TabPanel.label": [BillLineItemsTabLabel, BillPaymentsTabLabel, BillEventsTabLabel],
  "bill.TabPanel.panel": [BillLineItemsTabPanel, BillPaymentsTabPanel, BillEventsTabPanel],
};

export const InvoiceModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
