var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')

module.exports = function (db) {
  const collection = db.collection('breads');

  router.get('/', async (req, res) => {

    const page = req.query.page || 1
    const limit = 3
    const wheres = {}
    var sortBy = req.query.sortBy == undefined ? 'string' : req.query.sortBy;
    var sortMode = req.query.sortMode == undefined ? 1 : req.query.sortMode;
    var sortMongo = JSON.parse(`{"${sortBy}" : ${sortMode}}`);

    const offset = limit == 'all' ? 0 : (page - 1) * limit

    if (req.query.string) {
     wheres["string"] = new RegExp(`${req.query.string}`, 'i')
    }

    if (req.query.integer) {
     wheres["integer"] = parseInt(req.query.integer)
    }

    if (req.query.float) {
     wheres["float"] = JSON.parse(req.query.float)
    }


    if (req.query.startDate && req.query.endDate) {
     wheres["date"] = {
        $gte: new Date(`${req.query.startDate}`),
        $lte: new Date(`${req.query.endDate}`)
      }
    } else if (req.query.startDate) {
     wheres["date"] = { $gte: new Date(`${req.query.startDate}`) }
    } else if (req.query.endDate) {
     wheres["date"] = { $lte: new Date(`${req.query.endDate}`) }
    }


    if (req.query.boolean) {
     wheres["boolean"] = (req.query.boolean)
    }

    try {

      const collection = db.collection('breads');

      const totalData = await collection.find(wheres).count();
      const totalPages = limit == 'all' ? 1 : Math.ceil(totalData / limit)
      const limitation = limit == 'all' ? {} : { limit: parseInt(limit), skip: offset }
      
      const breads = await collection.find(wheres, limitation).toArray()
      console.log('whereas',wheres)

      res.status(200).json({
        data: breads,
        totalData,
        totalPages,
        display: limit,
        page: parseInt(page)
      })
    } catch (e) {
      res.json(e)
    }
  });
  //CREATE
  router.post('/', async function (req, res, next) {
    try {                                              //string: req.body.string, integer: parseInt(req.body.integer), float: JSON.parse(req.body.float), date: new Date(req.body.date), boolean: req.body.boolean
      const insertResult = await collection.insertOne({ string: `${req.body.string}`, integer: parseInt(req.body.integer), float: JSON.parse(req.body.float), data: new Date(`${req.body.date}`), boolean: req.body.boolean });
      res.status(201).json(insertResult)
    } catch (e) {
      res.json(e)
    }
  });
  //EDIT
  router.put('/:id', async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne({ _id: ObjectId(req.params.id) }, { $set: { string: `${req.body.string}`, integer: parseInt(req.body.integer), float: JSON.parse(req.body.float), data: new Date(`${req.body.date}`), boolean: req.body.boolean } });
      res.status(201).json(updateResult)
    } catch (e) {
      res.json(e)
    }
  });
  //DELETE
  router.delete('/:id', async function (req, res, next) {
    try {
      const deleteResult = await collection.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(201).json(deleteResult)
    } catch (e) {
      res.json(e)
    }
  });

  return router;
}