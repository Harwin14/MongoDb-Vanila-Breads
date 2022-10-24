var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')

module.exports = function (db) {
  const collection = db.collection('breads');

  router.get('/', async (req, res) => {

    const page = req.query.page || "all"
    const limit = 3
    const offset = page == 'all' ? 0 : parseInt((page - 1) * limit)

    if (req.query.string) {
      let paramsString = {
        string: { $regex: req.query.string, $options: "i" }
      }
    }


    if (req.query.integer) {
      let paramsInteger = {
        integer: { $regex: req.query.integer, $options: "i" }
      }
    }

    if (req.query.float) {
      let paramsFloat = {
        float: { $regex: req.query.float, $options: "i" }
      }
    }


    if (req.query.startDate && req.query.endDate) {
      let paramsDate = {
        date: {
          $gte: new Date(req.query.startDate) ,
          $lte: new Date(req.query.endDate),
        },
      }
    } else if (req.query.startDate) {
      let paramsStartDate = {
       date:{ $gte: new Date(req.query.startDate) },
      }
    } else if (req.query.endDate) {
    let paramsEndDate = {
      date: { $lte: new Date(req.query.endDate) },
    }
  }


  if (req.query.boolean) {
    let paramsBoolean = {
      boolean: req.query.boolean,
    }
  }

  try {
   const finalParams = {
      ...paramsString,
      ...paramsInteger,
      ...paramsFloat,
      ...paramsDate,
      ...paramsStartDate,
      ...paramsEndDate,
      ...paramsBoolean,
   }

    const findResult = await collection.find(finalParams).toArray();
    const pages = Math.ceil(findResult.length / limit)
    const lastResult = await collection
          .find(finalParams)
          .skip(offset)
          .limit(limit)
          .toArray()

          console.log('result parameter', lastResult)
          
    res.status(200).json(findResult) 
  }catch (e) {
    res.json(e)
  }

  //     data: breads,
  //     totalData,
  //     totalPage,
  //     display: limit,
  //     page: parseInt(page)
  //   })
  // } catch (e) {
  //   res.json(e)
  // }
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