import BCH from "bchaddrjs-slp";

import { NetTypes } from "./types/net.types";
import {
  AddressFormats,
  TAddress,
  TAddressFormats,
  TBaseValidator,
  TIsValidAddress,
  TNetType,
} from "./types/validators.types";

const DEFAULT_ADDRESS_FORMAT = AddressFormats.legacy;
const DEFAULT_NETWORK_TYPE = NetTypes.prod;

const isAValidAddress: TIsValidAddress = (address) => {
  try {
    BCH.decodeAddress(address);
    return true;
  } catch (error) {
    return false;
  }
};

const isValidAddressFormat = (addressFormat: TAddress): boolean => {
  return [
    "all",
    BCH.Format.Legacy,
    BCH.Format.Cashaddr,
    BCH.Format.Slpaddr,
  ].includes(addressFormat as BCH.Format);
};

const isValidNetworkType = (address: TAddress, networkType: TNetType) => {
  if (networkType === NetTypes.prod || networkType === NetTypes.testnet) {
    if (networkType === NetTypes.prod) {
      return BCH.isMainnetAddress(address);
    }

    return BCH.isTestnetAddress(address);
  }

  // TODO: check if this is okay? Defaults to true if not prod or testnet? Probably 'both'?
  return true;
};

const validateAddressByFormat = (addressFormat: string, address: string) => {
  switch (addressFormat) {
    case "all":
      return isAValidAddress(address);
    case BCH.Format.Legacy:
      return BCH.isLegacyAddress(address);
    case BCH.Format.Bitpay:
      BCH.isBitpayAddress(address);
    case BCH.Format.Cashaddr:
      return BCH.isCashAddress(address);
    case BCH.Format.Slpaddr:
      return BCH.isSlpAddress(address);
  }
};

const normalizeAddressFormat = (addressFormat: string) =>
  addressFormat.toLowerCase().trim();

const isValidBitcoinCashAddress: TIsValidAddress = (
  address,
  _currency,
  networkType,
  addressFormats
): boolean => {
  for (let i = 0; i < addressFormats.length; i++) {
    const addressFormat = normalizeAddressFormat(addressFormats[i]);
    if (!isValidAddressFormat(addressFormat)) {
      continue;
    }

    try {
      return (
        validateAddressByFormat(addressFormat, address) &&
        isValidNetworkType(address, networkType)
      );
    } catch {
      continue;
    }
  }

  return false;
};

export const bitcoincashValidator: TBaseValidator = {
  isValidAddress(
    address,
    currency,
    networkType = DEFAULT_NETWORK_TYPE,
    addressFormats
  ) {
    const isInAddressFormat =
      !addressFormats.length || !Array.isArray(addressFormats);

    const checkedAddress = isInAddressFormat
      ? [DEFAULT_ADDRESS_FORMAT]
      : addressFormats;

    return isValidBitcoinCashAddress(
      address,
      currency,
      networkType,
      checkedAddress
    );
  },
};

export default bitcoincashValidator;
