var Joi    = require("joi");
var Dynamo = require("dynamodb");

Dynamo.AWS.config.loadFromPath("credentials.json");

var Account = Dynamo.define("Account", {
  hashKey: "email",
  timestamps: true,

  schema: {
    id: Dynamo.types.uuid(),
    email: Joi.string().email(),
    password: Joi.string(),
  }
});

Dynamo.createTables(function(err) {
  if (err) {
    console.log("Error creating DynamoDB tables: ", err);
  } else {
    console.log("DynamoDB tables have been created!");
  }
});

module.exports = Account;
