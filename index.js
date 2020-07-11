const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

app.get("/", function(req, res) {
    var options = {
        root: __dirname + "/public/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }    
    };

    res.sendFile("index.html", options);
});
app.use(express.static('public'))
app.listen(PORT);