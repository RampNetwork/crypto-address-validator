import utils from './crypto/utils'
import { TChecksumValidator } from './types/validators.types'

const ALLOWED_CHARS = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const regexp = new RegExp('^(cosmos)1([' + ALLOWED_CHARS + ']+)$') // cosmos + bech32 separated by '1'

const atomValidator: TChecksumValidator = {
  isValidAddress: function(address) {
    let match = regexp.exec(address)
    if (match !== null) {
      return this.verifyChecksum(address)
    } else {
      return false
    }
  },

  verifyChecksum: function(address) {
    let decoded = utils.bech32.decode(address)
    if (decoded !== null) {
      return decoded.data.length === 32
    } else {
      return false
    }
  }
}

export default atomValidator