$(document).ready(function () {
  $("#reg-form").submit(function (event) {
    event.preventDefault();
    console.log("Registered");
  });
  $("#login-form").submit(function (event) {
    event.preventDefault();
    console.log("Pressed Login button");
    const formData = new FormData(event.target);
    const plainFormData = Object.fromEntries(formData.entries());
    console.log(plainFormData);
    fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plainFormData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.accessToken);
        window.location.href = "/";
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
