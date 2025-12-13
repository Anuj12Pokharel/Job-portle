type RegisterValues = {
  name?: string;
  email?: string;
  password?: string;
};

const Validate = (values: RegisterValues) => {
  const errors: Record<string, string> = {};
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const name = values.name ?? "";
  if (!name) {
    errors.name = "! Please fill in this field";
  }

  const email = values.email ?? "";
  if (!email) {
    errors.email = "! Please fill in this field";
  } else if (!regex.test(email)) {
    errors.email = "This is not a valid email format!";
  }

  const password = values.password ?? "";
  if (!password) {
    errors.password = "! Please fill in this field";
  } else if (password.length < 4) {
    errors.password = "Password must be more than 4 characters";
  } else if (password.length > 10) {
    errors.password = "Password cannot exceed more than 10 characters";
  } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
    errors.password = "Password must contain at least one special character";
  }
  return errors;
};

export default Validate;
