const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  login();
});

const login = async () => {
  try {
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log(email);

    const response = await axios.post("http://localhost:3000/api/users/login", {
      email: email,
      password: password,
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
