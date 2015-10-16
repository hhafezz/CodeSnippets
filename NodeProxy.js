// Authenticate user
app.use("*", function(req, res, next){
  // Do your authentication magic
  if(userAuthenticated){
    // if authenticated, proceed to the next middleware handler
    next();
  } else{
    // if not authenticated, terminate request sending unauthorized code
    res.status(401).send("User not authorized");
  }
});

// allowed proxy endpoints
var whitelist = ["/rest/service1", "/rest/service2/:id"];

app.use(whitelist, function(req, res) {
  var options = {
    host: "TARGET_SERVER",
    path: req.originalUrl,
    method: req.method,
    headers: req.headers
  };
  options.headers['host'] = "target_server";

  var jreq = https.request(options, function(jres) {
    res.writeHeader(jres.statusCode, jres.headers);
    jres.pipe(res, {end: true});
  });
  req.pipe(jreq, {end: true});
});

app.all('*', function(req, res) {
  // Every other Endpoint is forbidden
  res.status(403).send("Endpoint " + req.url + " not available");
});
