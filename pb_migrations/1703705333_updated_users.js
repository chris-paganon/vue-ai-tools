/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2K9Xc23` ON `users` (`stripe_id`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mrjbrbtu",
    "name": "stripe_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.indexes = []

  // remove
  collection.schema.removeField("mrjbrbtu")

  return dao.saveCollection(collection)
})
