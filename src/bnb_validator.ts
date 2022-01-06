import { TBaseValidator } from "./types/validators.types"

let regexp = new RegExp('^(bnb)([a-z0-9]{39})$') // bnb + 39 a-z0-9

const bnbValidator: TBaseValidator = {
  isValidAddress: function (address) {
    let match = regexp.exec(address)
    return match !== null
  }
}

export default bnbValidator