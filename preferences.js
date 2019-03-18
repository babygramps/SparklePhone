const preferences = Object.freeze({
  SLACK: 'slack',
  SMS: 'sms',
  FACEBOOK: 'facebook',
  EMAIL: 'email'
});

module.exports = preferences;

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental
// export default preferences;
