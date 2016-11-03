const cluster = require('cluster');
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const https = require('https');
const db = require('./db.json');
const populateIndex = require('./public/populateIndex.js');
const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;
const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8'
};
const index = {};
const userDb = {};

function createIndex(listItem, index) {
  const data = listItem.domain || `id${listItem.user_id}`;

  return populateIndex(data.split(''), listItem.user_id, index);
};

if (cluster.isMaster) {
  for (var i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
else {
  http.createServer((req, res) => {
    const urlParsed = url.parse(req.url);
    const uri = urlParsed.pathname;
    const queryString = urlParsed.query || '';
    const query = queryString.split('&')
      .reduce((result, query) => {
        const array = query.split('=');

        result[array[0]] = array[1];

        return result;
      }, {});
    let filename = path.join(process.cwd(), 'public', uri);

    if (uri === '/list') {
      if (parseInt(query.user_id)) {
        if (userDb.hasOwnProperty(query.user_id)) {
          res.writeHead(200, {
            'Content-Type': CONTENT_TYPES['.json']
          });
          res.write(JSON.stringify(userDb[query.user_id]));
          res.end();
        }
        else {
          https.get(`https://api.vk.com/method/friends.get?fields=photo_50,domain&user_id=${query.user_id}`, result => {
            let rawData = '';

            result.on('data', chunk => rawData += chunk);
            result.on('end', () => {
              const data = JSON.parse(rawData);

              if (data.response) {
                userDb[query.user_id] = data.response;
              }

              const list = userDb[query.user_id] || db;

              res.writeHead(200, {
                'Content-Type': CONTENT_TYPES['.json']
              });
              res.write(JSON.stringify(list));
              res.end();
            });
          })
          .on('error', e => {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.write(`${e.message}\n`);
            res.end();
          });
        }
      }
      else {
        res.writeHead(200, {
          'Content-Type': CONTENT_TYPES['.json']
        });
        res.write(JSON.stringify(db));
        res.end();
      }
    }
    else if (uri === '/search') {
      const userId = query.user_id || 0;

      index[userId] = index[userId] || {};

      const userIndex = index[userId];

      if (JSON.stringify(userIndex) === JSON.stringify({})) {
        if (userId && userDb[userId]) {
          userDb[userId].forEach((value) => {
            return createIndex(value, userIndex);
          });
        }
        else {
          db.forEach((value) => {
            return createIndex(value, userIndex);
          });
        }
      }

      res.writeHead(200, {
        'Content-Type': CONTENT_TYPES['.json']
      });
      res.write(JSON.stringify(index[userId][decodeURI(query.q)] || []));
      res.end();
    }
    else {
      fs.exists(filename, exists => {
        if (!exists) {
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          });
          res.write('404 Not Found\n');
          res.end();

          return;
        }

        if (fs.statSync(filename).isDirectory()) {
          filename += '/index.html';
        }

        fs.readFile(filename, 'binary', (err, file) => {
          if (err) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.write(`${err}\n`);
            res.end();

            return;
          }

          const headers = {};
          const contentType = CONTENT_TYPES[path.extname(filename)];

          if (contentType) {
            headers['Content-Type'] = contentType;
          }

          res.writeHead(200, headers);
          res.write(file, 'binary');
          res.end();
        });
      });
    }
  })
  .listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}
