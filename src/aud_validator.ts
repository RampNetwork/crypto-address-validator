import { TAddress } from "./types/validators.types"

function isValidLiskAddress (address: TAddress) {
  let regex = /^[0-9]{6,10}$/g // Must be numbers only for the first 1 - 20 charactors with a capital L at the end
  if (address.search(regex) !== -1) {
    return true
  } else {
    return false
  }
}

export const audValidator = {
  isValidAddress: function (address) {
    return isValidLiskAddress(address)
  }
}

export default audValidator