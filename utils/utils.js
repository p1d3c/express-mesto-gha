// eslint-disable-next-line prefer-regex-literals
const urlRegExp = new RegExp(/https?:\/\/(www\.)?[a-zA-Z0-9._/#]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9():%_/+.~#?&=]*)/);

// eslint-disable-next-line prefer-regex-literals
const emailRegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

module.exports = {
  urlRegExp,
  emailRegExp,
};
