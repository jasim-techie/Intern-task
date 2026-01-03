$(document).ready(function() {
    $("#loginBtn").click(function() {
        const email = $("#email").val();
        const password = $("#password").val();

        if(!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        $.post("assets/php/login.php", {
            email: email,
            password: password
        }, function(res) {
            if (res.status) {
                localStorage.setItem("token", res.token);
                window.location = "profile.html";
            } else {
                alert(res.message || "Login failed");
            }
        }, "json").fail(function() {
            alert("Server error");
        });
    });
});
