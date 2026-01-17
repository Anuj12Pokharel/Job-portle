type LoginValues = {
  email?: string;
  password?: string;
};

function Validation(values: LoginValues) {
  const error: Record<string, string> = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const password_pattern = /^(?=.\d)(?=.[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  const email = values.email ?? "";
  const password = values.password ?? "";

  if (email === "") {
    error.email = "Name should not be empty";
  } else if (!email_pattern.test(email)) {
    error.email = "Email Didn't match";
  } else {
    error.email = "";
  }

  if (password === "") {
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(password)) {
    error.password = "Password didn't match";
  } else {
    error.password = "";
  }
  return error;
}
export default Validation;
