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
client.query('update `user` set `nickname` = :nickname, `username` = :username, `age` = :age', userData, function(err, rows){ ... });

// generator-supporting query
co(function*(){
    var rows1 = yield coClient.queryTemplate('insert_user_name', userData);
    var rows2 = yield client.query('update `user` set `nickname` = :nickname, `username` = :username, `age` = :age', userData);
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