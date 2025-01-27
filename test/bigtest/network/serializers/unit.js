import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.units)) {
      return {
        acquisitionsUnits: json.units,
        totalRecords: json.units.length,
      };
    }

    return json.units;
  },
});
