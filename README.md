# openIMIS Frontend Invoice reference module
This repository holds the files of the openIMIS Frontend Invoice reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
* **Legal and Finance** (invoice.mainMenu translation key)

  **Invoices** (invoice.menu.invoices key), displayed if user has the right `155101`

  **Bills** (invoice.menu.bills key), displayed if user has the right `156101`

## Other Contributions
* `core.Router`: registering `invoices`, `invoice`, `bills`, `bill` routes in openIMIS client-side router

## Available Contribution Points
* `invoice.SubjectAndThirdpartyPicker` used to provide pickers for both Invoice/Bill Subject and Invoice/Bill Thirdparty; required structure:
  ```js
  [
    {
      type: <subject/thirdparty type name: string>,
      picker: <subject/thirdparty picker: picker component>,
      pickerProjection: <subject/thirdparty picker projection: Array<string>>,
    },
    ...
  ]
  ```
* `invoice.TabPanel.label` ability to extend Invoice tab panel with a tab label
* `invoice.TabPanel.panel` ability to extend Invoice tab panel with a panel displayed on click on an appropriate tab label
* `bill.TabPanel.label` ability to extend Bill tab panel with a tab label
* `bill.TabPanel.panel` ability to extend Bill tab panel with a panel displayed on click on an appropriate tab label

## Published Components
* `invoice.InvoiceStatusPicker` picker for Invoice Status
* `invoice.SubjectTypePickerBill` picker for bill Subject Type
* `invoice.ThirdPartyTypePickerBill` picker for bill Subject Type
* `bill.util.getSubjectAndThirdpartyTypePicker` util function for getting subject and thirdparty type picker

## Dispatched Redux Actions
* `INVOICE_INVOICES_{REQ|RESP|ERR}` fetching Invoices (as triggered by the searcher)
* `INVOICE_INVOICE_{REQ|RESP|ERR}` fetching Invoice
* `INVOICE_INVOICE_LINE_ITEMS_{REQ|RESP|ERR}` fetching Invoice Line Items (as triggered by the searcher)
* `INVOICE_INVOICE_PAYMENTS_{REQ|RESP|ERR}` fetching Invoice Payments (as triggered by the searcher)
* `INVOICE_INVOICE_EVENTS_{REQ|RESP|ERR}` fetching Invoice Events (as triggered by the searcher)
* `INVOICE_MUTATION_{REQ|ERR}`, sending a mutation
* `INVOICE_DELETE_INVOICE_RESP` receiving a result of delete Invoice mutation
* `INVOICE_CREATE_INVOICE_PAYMENT_RESP` receiving a result of create Invoice Payment mutation
* `INVOICE_UPDATE_INVOICE_PAYMENT_RESP` receiving a result of update Invoice Payment mutation
* `INVOICE_DELETE_INVOICE_PAYMENT_RESP` receiving a result of delete Invoice Payment mutation
* `INVOICE_CREATE_INVOICE_EVENT_MESSAGE_RESP` receiving a result of create Invoice Event Message mutation
* `SEARCH_BILLS_{REQ|RESP|ERR}` fetching Bills (as triggered by the searcher)
* `BILL_BILL_{REQ|RESP|ERR}` fetching Bill
* `BILL_BILL_LINE_ITEMS_{REQ|RESP|ERR}` fetching Bill Line Items (as triggered by the searcher)
* `BILL_BILL_PAYMENTS_{REQ|RESP|ERR}` fetching Bill Payments (as triggered by the searcher)
* `BILL_DELETE_BILL_RESP` receiving a result of delete Bill mutation
* `BILL_CREATE_BILL_PAYMENT_RESP` receiving a result of create Bill Payment mutation
* `BILL_UPDATE_BILL_PAYMENT_RESP` receiving a result of update Bill Payment mutation
* `BILL_DELETE_BILL_PAYMENT_RESP` receiving a result of delete Bill Payment mutation
* `BILL_BILL_EVENTS_{REQ|RESP|ERR}` fetching Bill Events (as triggered by the searcher)
* `BILL_CREATE_BILL_EVENT_MESSAGE_RESP` receiving a result of create Bill Event Message mutation

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
None
