const http = require('http')

const api = http.createServer((req, res) => {
    switch (req.url) {
	    case '/':
		    returnJson(res, 200, {})
		    break
	    default:
            returnJson(res, 404, {error: 'Unknown request '+req.url})
    }
})

function returnJson(res, statusCode, jsonData) {
        res.writeHead(statusCode, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(jsonData))
}

api.listen(39640, 'localhost')