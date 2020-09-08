const validate = require('mongoose-validator')

const validators = {}

validators['usernameValidator'] = [
    validate({
      validator: 'isLength',
      arguments: [4, 15],
      message: `Username should be between 4 and 15 characters.`
    }),
    validate({
      validator: 'isAlphanumeric',
      passIfEmpty: true,
      message: 'Username should contain alpha-numeric characters only.'
    })
]

validators['firstNameValidator'] = [
  validate({
    validator: 'isAlpha',
    passIfEmpty: true,
    message: 'First name should contain alpha characters only.'
  })
]

validators['lastNameValidator'] = [
  validate({
    validator: 'isAlpha',
    passIfEmpty: true,
    message: 'First name should contain alpha characters only.'
  })
]

module.exports = validators