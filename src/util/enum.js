import { ENUM_PREFIX_LENGTH } from "../constants";

export const getEnumValue = (enumElement, prefixLength = ENUM_PREFIX_LENGTH) => enumElement?.substring(prefixLength);
