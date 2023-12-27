/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "l6th7pgzr2h2o8x",
    "created": "2023-12-26 23:07:49.161Z",
    "updated": "2023-12-26 23:07:49.161Z",
    "name": "subscriptions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uhgty0qz",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "bhgcyo3i",
        "name": "stripe_id",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "7tsdy3y0",
        "name": "level",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "basic"
          ]
        }
      },
      {
        "system": false,
        "id": "v92ffh07",
        "name": "current_period_end",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "tnvrmjhz",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "incomplete",
            "incomplete_expired",
            "trialing",
            "active",
            "past_due",
            "canceled",
            "unpaid"
          ]
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_vl0WvQR` ON `subscriptions` (`stripe_id`)"
    ],
    "listRule": "@request.auth.id = user && @request.auth.id != ''",
    "viewRule": "@request.auth.id = user && @request.auth.id != ''",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("l6th7pgzr2h2o8x");

  return dao.deleteCollection(collection);
})
