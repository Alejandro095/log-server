const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const morgan = require('morgan');
const nocache = require('nocache');
const cors = require('cors');

let NUMERO_DE_SOLICITUD = 0;

app.use(express.json())
app.use(nocache());
app.use(cors({ origin: "*" }));

app.use(morgan(function (tokens, req, res) {
    return [
        `\n<<--`,
        `SOLICITUD NUM. ${NUMERO_DE_SOLICITUD++}`, '-',
        tokens.date(req, res, 'clf'), '-',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res), '-',
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        `-->>`,
    ].join(' ')
  }, {
    immediate: true
}));

app.all('*', (req, res) => {
    let headersClean = Object.assign({}, req.headers);
    delete headersClean['connection'];
    delete headersClean['sec-ch-ua'];
    delete headersClean['cache-control'];
    delete headersClean['upgrade-insecure-requests'];
    delete headersClean['accept'];
    delete headersClean['sec-fetch-site'];
    delete headersClean['sec-fetch-mode'];
    delete headersClean['sec-fetch-user'];
    delete headersClean['sec-fetch-dest'];
    delete headersClean['accept-encoding'];
    delete headersClean['accept-language'];
    delete headersClean['if-none-match'];
    delete headersClean['postman-token'];

    if (headersClean) console.log('[HEADERS]::', JSON.stringify(headersClean, null, 2));
    if (req.query) console.log('[QUERY]::', JSON.stringify(req.query, null, 2));
    if (req.params) console.log('[PARAMS]::', JSON.stringify(req.params, null, 2));
    if (req.body) console.log('[BODY]::', JSON.stringify(req.body, null, 2));
    console.log('\n');

    res.contentType('application/json');
    res.send({
        ok: true,
        message: '¡Hola mundo!',
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
    }
);
