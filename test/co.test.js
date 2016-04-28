"use strict";

var util = require('../lib/util');
if (util.isGeneratable()) {
  require('mocha-generators').install();

  const mysql = require('../');
  const alpha0 = mysql.obtainCo('alpha0');
  const alpha1 = mysql.obtainCo('alpha1');
  const beta0 = mysql.obtainCo('beta0');
  const beta1 = mysql.obtainCo('beta1');

  const userDataMap = {
    username: 'TDSam',
    nickname: 'Sam',
    gender: "male",
    age: 18
  };

  const userDataArray = [
    'Allen123', // username
    'Allen', // nickname
    'female',// gender
    21 // age
  ];

  const updateNicknameData = {
    where: 'id',
    whereValue: 1,
    nickname: 'New Name'
  };

  describe('test in generator mode', function () {
    it('drop and create table in database alpha0', function *() {
      yield dropAndCreate(alpha0);
    });

    it('drop and create table in database alpha1', function *() {
      yield dropAndCreate(alpha1);
    });

    it('drop and create table in database beta0', function *() {
      yield dropAndCreate(beta0);
    });

    it('drop and create table in database beta1', function *() {
      yield dropAndCreate(beta1);
    });


    it('query insert with template in alpha0', function *() {
      yield alpha0.queryTemplate('insert_new_user_map', userDataMap);
    });

    it('query insert array-data with template in alpha1', function *() {
      yield alpha1.queryTemplate('insert_new_user_array', userDataArray);
    });

    it('query insert map-data with template in beta0', function *() {
      yield beta0.queryTemplate('insert_new_user_map_1', userDataMap);
    });

    it('query update with sub-template in beta0', function *() {
      beta0.queryTemplate('sub.update_user_name', updateNicknameData);
    });


    function *dropAndCreate(client) {
      let rows = yield client.queryTemplate('drop_user_table');
      console.log('drop result: ', rows);
      rows = yield client.queryTemplate('create_user_table');
      console.log('create result: ', rows);
    }
  });
}