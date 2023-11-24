const mongoose = require('mongoose');

const yourDataSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
    
        return typeof value === 'string';
      },
      message: 'value must be a string',
    },
  },
}, {
  collection: 'admin'
});

const YourDataModel = mongoose.model('YourData', yourDataSchema);

module.exports = YourDataModel;