/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l6th7pgzr2h2o8x")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ht4mmtxm",
    "name": "cancel_at",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l6th7pgzr2h2o8x")

  // remove
  collection.schema.removeField("ht4mmtxm")

  return dao.saveCollection(collection)
})
