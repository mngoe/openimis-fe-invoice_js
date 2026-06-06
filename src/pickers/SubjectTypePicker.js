import React, { useEffect } from "react";
import { SelectInput } from "@openimis/fe-core";
import { formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { SUBJECT_TYPE_OPTIONS } from "../constants";

const SubjectTypePicker = ({
  intl,
  value,
  label,
  onChange,
  readOnly = false,
  withNull = false,
  nullLabel = null,
  withLabel = true,
}) => {
  const options = [
    ...(withNull
      ? [{
          value: null,
          label: nullLabel || formatMessage(intl, "invoice", "emptyLabel"),
        }]
      : []),
    ...SUBJECT_TYPE_OPTIONS,
  ];

  return (
    <SelectInput
      module="invoice"
      label={withLabel && label}
      options={options}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
};

export default injectIntl(SubjectTypePicker);
