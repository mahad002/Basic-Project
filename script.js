document.addEventListener("DOMContentLoaded", () => {
    let b = document.getElementById("sub");
  
    b.addEventListener("click", () => {
      let email = document.getElementById("email").value;
      let password = document.getElementById("pass").value;
  
      fetch("http://localhost:3000/login", {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.text();
        })
        .then((data) => {
          if (data) {
            console.log(data);
            localStorage.setItem("token", data);
            window.location.replace("/Home.html");
            
          } else {
            console.error("No token found in the response.");
            // You may want to display an error message to the user.
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          // You may want to display an error message to the user.
        });
    });
  });
  