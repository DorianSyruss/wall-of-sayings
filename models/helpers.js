'use strict';

function pick(props = []) {
  const include = props.map(prop => `${prop}`).join(' ');
  return this.select(include);
}

function omit(props = []) {
  const discard = props.map(prop => `-${prop}`).join(' ');
  return this.select(discard);
}

module.exports = { omit, pick };
