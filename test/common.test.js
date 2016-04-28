var async = require('async');
var mysql = require('../');

var alpha0 = mysql.obtain('alpha0');
var alpha1 = mysql.obtain('alpha1');
var beta0 = mysql.obtain('beta0');
var beta1 = mysql.obtain('beta1');

var userDataMap = {
  username: 'TDSam',
  nickname: 'Sam',
  gender: "male",
  age: 18
};

var userDataArray = [
  'Allen123', // username
  'Allen', // nickname
  'female',// gender
  21 // age
];

var updateNicknameData = {
  where: 'id',
  whereValue: 1,
  nickname: 'New Name'
};

describe('test in common mode', function () {

  after(function *() {
    yield mysql.destroyCo();
  });

  it('drop and create table in database alpha0', function (done) {
    dropAndCreate(alpha0, done);
  });

  it('drop and create table in database alpha1', function (done) {
    dropAndCreate(alpha1, done);
  });

  it('drop and create table in database beta0', function (done) {
    dropAndCreate(beta0, done);
  });

  it('drop and create table in database beta1', function (done) {
    dropAndCreate(beta1, done);
  });

  it('query insert with template in alpha0', function (done) {
    alpha0.queryTemplate('insert_new_user_map', userDataMap, done);
  });

  it('query insert array-data with template in alpha1', function (done) {
    alpha1.queryTemplate('insert_new_user_array', userDataArray, done);
  });

  it('query insert map-data with template in beta0', function (done) {
    beta0.queryTemplate('insert_new_user_map_1', userDataMap, done);
  });

  it('query update with sub-template in beta0', function (done) {
    beta0.queryTemplate('sub.update_user_name', updateNicknameData, done);
  });

});

function dropAndCreate(client, cb) {
  client.queryTemplate('drop_user_table', function (err, rows) {
    if (!err) {
      console.log('drop result: ', rows);
      client.queryTemplate('create_user_table', function (err, rows) {
        if (err) {
          console.log(err);
        } else {
          console.log('create result: ', rows);
        }
        cb(err);
      });
    } else {
      console.log(err);
      cb(err);
    }
  });
}
