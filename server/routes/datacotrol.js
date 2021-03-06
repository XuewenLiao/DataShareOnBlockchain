var { data, calcuQod, qodArray, calcuReward } = require('./functiontools.js')
const { UserCollectData } = require('../model/models')
var express = require('express');
var router = express.Router();


//查找所有
router.get('/findallindb', async (req, res) => {
  const userCollectData = await UserCollectData.find()
  res.send(userCollectData);
});

//更新ipfsdatahash字段
router.post('/updatehashdata', async (req, res) => {
  var data = req.body.data

  //更新数据库
  for (var i in data) {
    var id = data[i]._id;
    var updateObj = { ipfsdatahash: data[i].ipfsdatahash };
    UserCollectData.findByIdAndUpdate(id, updateObj, { new: true }, function (err, model) {
      if (err) {
        res.send({ result: 'UpdateDbFail' })
      } else {
        console.log("更新后的数据==", model)
      }
    })
  }

  res.send({ result: 'UpdateDbSuccess' })
});


//更改卖出状态
router.post('/soldOut', async (req, res) => {
  var data = req.body.data

  //更新数据库
  for (var i in data) {
    var id = data[i];
    var updateObj = { hassell: true };
    UserCollectData.findByIdAndUpdate(id, updateObj, { new: true }, function (err, model) {
      if (err) {
        res.send({ result: 'UpdateDbFail' })
      } else {
        console.log("更新后stauts数据==", model)
      }
    })
  }

  res.send({ result: 'UpdateStatusSuccess' })
});



//算qod
router.post('/calcuqod', async (req, res) => {
  //接收前端id集合
  var dataIdArray = req.body.data
  // var dataArray = []
  //查库:Model.find({ _id: { $in: ['aID', 'bID'] } });
  UserCollectData.find({ _id: { $in: dataIdArray } }, function (err, result) {
    if (err) {
      res.send({ result: 'FindDbByIdFail' })
    } else {
      //算qod
      var alldata = result;
      qodArray = calcuQod(alldata);
      res.send(qodArray)
      console.log("data==", alldata);
    }
  })
 
});

//算激励金额
router.post('/calcureward', async (req, res) => {
  var theqodArray = qodArray;
  var rewardValue = req.body.data
  var rewardArray = calcuReward(theqodArray, rewardValue);
  console.log("rewardArray==", JSON.stringify(rewardArray))
  res.send(rewardArray)
});



//批量插入数据(临时导入数据时用)
router.post('/allinserttodb', async (req, res) => {

  var testData = [{ "uaddress": "u1", "datadate": "d1", "dataplace": "p1", "datacontent": { "placedata": 63.0, "collectdata": 75.2 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "u2", "datadate": "d2", "dataplace": "p2", "datacontent": { "placedata": 63.0, "collectdata": 63.0 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "u3", "datadate": "d3", "dataplace": "p3", "datacontent": { "placedata": 63.0, "collectdata": 80.2 }, "ipfsdatahash": "", "hassell": false }];
  UserCollectData.insertMany(data, function (error, docs) {
    if (error) {
      console.error("error", error)
    } else {
      console.log("docs:", docs)
    }
  });

  res.send(testuser);
});

module.exports = router;
