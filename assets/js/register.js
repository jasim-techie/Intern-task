$(document).ready(function () {
  $("#registerBtn").click(function () {
    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    $.post("assets/php/register.php", {
      name: name,
      email: email,
      password: password
    }, function (res) {
      alert(res.message);
      if (res.status) {
        window.location = "login.html";
      }
    }, "json").fail(function () {
      alert("Server error");
    });
  });
});
