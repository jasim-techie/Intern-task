$(document).ready(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location = "login.html";
    return;
  }

  // Load Profile Data
  $.post("assets/php/profile.php", {
    token: token,
    action: "get"
  }, function (res) {
    if (res.status && res.data) {
      $("#age").val(res.data.age);
      $("#dob").val(res.data.dob);
      $("#contact").val(res.data.contact);
    } else {
      // If session invalid or other error
      if (res.message === "Unauthorized") {
        localStorage.removeItem("token");
        window.location = "login.html";
      }
    }
  }, "json");

  // Update Profile Data
  $("#save").click(function () {
    const age = $("#age").val();
    const dob = $("#dob").val();
    const contact = $("#contact").val();

    $.post("assets/php/profile.php", {
      token: token,
      action: "update",
      age: age,
      dob: dob,
      contact: contact
    }, function (res) {
      alert(res.message);
    }, "json").fail(function () {
      alert("Server error");
    });
  });

  // Logout helper (optional but good to have logic ready)
  $("#logoutBtn").click(function () {
    localStorage.removeItem("token");
    window.location = "login.html";
  });
});
