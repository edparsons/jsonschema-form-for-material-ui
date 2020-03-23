import update from 'immutability-helper';
import forOwn from 'lodash/forOwn';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import isArray from 'lodash/isArray';
import mapValues from 'lodash/mapValues';
import map from 'lodash/mapValues';
import rules from './rules';

const validationResult = (schema, value, isSubmitted) => {
  const rv = [];
  forOwn(rules, (rule, ruleId) => {
    const result = rule(schema, value, isSubmitted);
    if (result) {
      rv.push({
        rule: ruleId,
        ...result
      });
    }
  });
  return rv;
};

const getFieldSpec = (schema, value, isSubmitted, innerCall = false) => {
  if (value === null) {
    if (innerCall) {
      return [];
    }
    return { $set: [] };
  }
  if (typeof value !== 'object') {
    const ret = validationResult(schema, value, isSubmitted);
    if (innerCall) {
      return ret;
    }
    return { $set: ret };
  }
  const newSchema = clone(schema);
  if (schema.required) {
    if (isArray(schema.required)) {
      forEach(schema.required, val => {
        if (val in schema.properties) {
          newSchema.properties[val].required = true;
        }
      });
    }
  }

  if (
    newSchema.type &&
    newSchema.type === 'array' &&
    newSchema.items &&
    isArray(value)
  ) {
    const ret = map(value, val => {
      return getFieldSpec(newSchema.items, val, isSubmitted, true);
    });
    if (innerCall) {
      return ret;
    }
    return { $set: ret };
  }

  return mapValues(newSchema.properties, (s, p) =>
    getFieldSpec(s, value[p], isSubmitted, innerCall)
  );
};

export default (schema, data, isSubmitted) => {
  const spec = getFieldSpec(schema, data, isSubmitted);
  return update({}, spec);
};
