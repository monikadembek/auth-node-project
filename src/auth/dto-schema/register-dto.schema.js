export const registerSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string"
    },
    password: {
      type: "string",
      minLength: 8
    },
    name: {
      type: "string",
      minLength: 2
    }
  }
};
