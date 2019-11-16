const express = require('express');
const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 1337;

app.use('/dist', express.static(`${__dirname}/dist`));

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

app.listen(PORT, () => console.log(`Listening at ${HOST}:${PORT}`));
