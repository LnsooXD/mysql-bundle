#mysql-bundle
***
mysql-bundle is extended from [felixge/node-mysql] but more easy to use. Besides the basic functions of [mysql], it has file template sql and ES5 generator-supporting.

##Features

###1. File Template Sql
You can put sql in *.sql file under your project (default is in ${project}/mysql-bundle/sql/). The mysql-bundle will load them into memory when startup. Then, you can reference them by their
names.

###2. ES5 Generator Supporting
This feature can makes you away from complex callbacks and use this module in [koa]

###3. All Configs Via [config]

##Installation

```shell
$ npm install mysql-bundle
```

##Example

```js
var bundle = require('mysql-bundle');

// get a common client (use callback)
var client = bundle.obtain('cluster-selector');

// get a generator-supporting client 
var coClient = bundle.obtainCo('cluster-selector');

var userData = {
    nickname: 'Jim Hanks',
    username: 'Jim0455',
    age: 21
};

// callback-like query vio template (name without suffix ".sql" )
client.queryTemplate('insert_user_name', userData, function(err, rows){ ... });
var sql = 'update `user` set `nickname` = :nickname, `username` = :username, `age` = :age'
client.query(sql, userData, function(err, rows){ ... });

// generator-supporting query
co(function*(){
    var rows1 = yield coClient.queryTemplate('insert_user_name', userData);
    var sql = 'update `user` set `nickname` = :nickname, `username` = :username, `age` = :age';
    var rows2 = yield client.query(sql, userData);
}).catch(function(err){ ... });
```

##Guide

###1. Configure
All configs are under 'mysql-bundle' node of [config]. For example:

```json
{
  "mysql-bundle": {
    "config": {
      "canRetry": true,
      "restoreNodeTimeout": 10000,
      "defaultSelector": "RANDOM",
      "templateDir": "mysql-bundle/sql"
    },
    "cluster": {
      "alpha0": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "12345678",
        "database": "alpha0"
      },
      "alpha1": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "12345678",
        "database": "alpha1"
      },
      "beta0": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "12345678",
        "database": "beta0"
      },
      "beta1": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "12345678",
        "database": "beta1"
      }
    }
  }
}
```

config['mysql-bundle']['config'] is the cluster init config, used by  require('mysql').createPoolCluster. The details info is: [PoolCluster Option].
Every node in config['mysql-bundle']['cluster'] is the connection config. The details info is: [Connection options].

###2. Sql File
The default template dir is "mysql-bundle/sql", this can be configured by change the value of config['mysql-bundle']['config']['templateDir']. This value
is relative to cwd. 
###3 Template Formate
```js
// 1. array format, this is the same as node-mysql
var sql = 'update `tab` set a = ?, b = ?, c = ?';
client.query(sql, ['a', 'b', 'c'], function(){});
// when sql content in template file upate_tab.sql under template dir
client.queryTemplate('upate_tab', ['a', 'b', 'c'], function(){});

// 2. object/map format
var sql = 'update `tab` set a = :a, b = :b, ::col_c = :c';
var map = {
    a: 'a',
    b: 'b',
    c: 'c',
    col_c: 'c' 
    // the 'col_c' is start '::' not ':', that means , it's a col-name, will be wrap by `...` 
};
client.query(sql, map, function(){});
// also, this sql can be put into a template file and well-formated. If it in upate_tab_map.sql
client.queryTemplate('upate_tab_map', map, function(){});

// 3. all example above in generator 
var rows1 = yield client.query(sql, ['a', 'b', 'c']);
var rows2 = yield client.queryTemplate('upate_tab', ['a', 'b', 'c']);
var rows3 = yield client.query(sql, map);
var rows4 = yield client.queryTemplate('upate_tab_map', map);

// 4. If there is a sub-dir in template dir such as ${template dir}/subdir, 
// then the sql file under it can be access by 'subdir.${name}'. 
// For example: upate_tab_map.sql under  ${template dir}/subdir:

var rows4 = yield client.queryTemplate('subdir.upate_tab_map', map)

// This feature is a simple modularized design.

```

##Authors

- [LnsooXD](https://github.com/LnsooXD)

## License

- [MIT](http://spdx.org/licenses/MIT)


[felixge/node-mysql]: https://github.com/felixge/node-mysql#mysql
[mysql]: https://github.com/felixge/node-mysql#mysql
[koa]: https://github.com/koajs/koa
[config]: https://github.com/lorenwest/node-config#configure-your-nodejs-applications
[PoolCluster Option]: https://github.com/felixge/node-mysql#poolcluster-option
[Connection options]: https://github.com/felixge/node-mysql#connection-options
