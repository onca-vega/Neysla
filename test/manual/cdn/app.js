var neysla = new Neysla();
neysla.init({
  name: "github",
  url: "https://api.github.com/"
}).then(function (modeler) {
  var users = modeler.github.setModel("users");
  users.get().then(function (success) {
    console.log("All users", success);
    if(success.data.length){
      users.get({ delimiters: success.data[0].login }).then(function (success2) {
        console.log("First user", success2);
      });
    }
  });
});
