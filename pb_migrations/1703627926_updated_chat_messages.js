/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("knq3ug3158u9w8p")

  collection.listRule = "@request.auth.id = chat.user.id && @request.auth.id != \"\""
  collection.viewRule = "@request.auth.id = chat.user.id && @request.auth.id != \"\""
  collection.updateRule = "@request.auth.id = chat.user.id && @request.auth.id != \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("knq3ug3158u9w8p")

  collection.listRule = "@request.auth.id = chat.user.id"
  collection.viewRule = "@request.auth.id = chat.user.id"
  collection.updateRule = "@request.auth.id = chat.user.id"

  return dao.saveCollection(collection)
})
