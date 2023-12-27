/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "qqmfafsw74u0t0c",
    "created": "2023-12-26 16:46:04.176Z",
    "updated": "2023-12-26 16:46:04.176Z",
    "name": "transactions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zfew5mja",
        "name": "session_id",
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
        "id": "nweqp3v1",
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
        "id": "czt7soyb",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "open",
            "complete",
            "expired"
          ]
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_ZJEqbjE` ON `transactions` (`session_id`)"
    ],
    "listRule": "@request.auth = user.id && @request.auth.id != ''",
    "viewRule": "@request.auth = user.id && @request.auth.id != ''",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qqmfafsw74u0t0c");

  return dao.deleteCollection(collection);
})
