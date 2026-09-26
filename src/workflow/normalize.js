const {config} = require('../utils');

const keys = config.get('XLSX.FINAL_FIELDNAMES', []);

const emptyPerson = keys.reduce(
  (prev, next) => ({
    ...prev,
    [next]: '',
  }),
  {}
);

const rowSeparator = [
  keys.reduce(
    (prev, next) => ({
      ...prev,
      [next]: '**',
    }),
    {}
  ),
];

const getPhoneState = phone =>
  phone && phone.isCurrent ? 'current' : phone && phone.isMobile ? 'mobile' : '';

const normalizeProfileMatches = (person, profile) => {
  const phones = profile.phone || [];
  const emails = profile.email || [];
  const maxloop = Math.max(phones.length, emails.length, 1);

  return Array.from(Array(maxloop).keys()).reduce((prev, i) => {
    const phone = phones[i];
    const nextJsonFormat = i
      ? {
          ...emptyPerson,
          Phone: phone ? phone.phone : '',
          PhoneState: getPhoneState(phone),
          Email: emails.length > i ? emails[i] : '',
        }
      : {
          ...person,
          Phone: phone ? phone.phone : 'none',
          PhoneState: getPhoneState(phone),
          Email: emails.length > i ? emails[i] : 'none',
        };
    return [...prev, nextJsonFormat];
  }, []);
};

module.exports = {
  emptyPerson,
  normalizeProfileMatches,
  rowSeparator,
};
