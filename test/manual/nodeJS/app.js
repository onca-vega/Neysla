import Neysla from "../../../build/module/neysla.min.js";

Neysla.get({
  url: "https://api.github.com/users",
})
  .then((success) => {
    console.log("All users from core", success);
    if (success.data.length) {
      Neysla.get({
        url: `https://api.github.com/users/${success.data[0].login}`,
      })
        .then((success2) => console.log("First user from core", success2))
        .catch((error2) => console.log(error2));
    }
  })
  .catch((error) => console.log(error));

let users;
new Neysla()
  .init({
    name: "github",
    url: "https://api.github.com/",
  })
  .then((modeler) => {
    users = modeler.github.setModel("users");
    users
      .get()
      .then((success) => {
        console.log("All users", success);
        if (success.data.length) {
          users
            .get({ delimiters: success.data[0].login })
            .then((success2) => console.log("First user", success2))
            .catch((error2) => console.log(error2));
        }
      })
      .catch((error) => console.log(error));
  });
