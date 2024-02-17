// 1) Install http-server
// 2) Run "http-server --port [YOUR_PREFERENCE_PORT]"
// 3) Access in browser to http://localhost:[YOUR_PREFERENCE_PORT]/test/manual/cdn

Neysla.get({
  url: "https://api.github.com/users",
})
  .then(function (success) {
    console.log("All users from core", success);
    if (success.data.length) {
      Neysla.get({
        url: "https://api.github.com/users/" + success.data[0].login,
      })
        .then(function (success2) {
          console.log("First user from core", success2);
        })
        .catch(function (error2) {
          console.log(error2);
        });
    }
  })
  .catch(function (error) {
    console.log(error);
  });

var neysla = new Neysla();
neysla
  .init({
    name: "github",
    url: "https://api.github.com/",
  })
  .then(function (modeler) {
    var users = modeler.github.setModel("users");
    users
      .get()
      .then(function (success) {
        console.log("All users", success);
        if (success.data.length) {
          users
            .get({ delimiters: success.data[0].login })
            .then(function (success2) {
              console.log("First user", success2);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
