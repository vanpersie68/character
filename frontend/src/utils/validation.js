import * as Yup from "yup";

export const signUpSchema = Yup.object({
    firstname: Yup.string().required("firstname is required")
        .matches(/^[a-zA-Z_ ]*$/, "No special characters allowed.")
        .min(2, "firstname must be between 2 and 16 characters.")
        .max(16, "firstname must be between 2 and 16 characters."),
    lastname: Yup.string().required("lastname is required")
        .matches(/^[a-zA-Z_ ]*$/, "No special characters allowed.")
        .min(2, "lastname must be between 2 and 16 characters.")
        .max(16, "lastname must be between 2 and 16 characters."),
    email: Yup.string().required("Email address is required.")
        .email("Invalid email address."),
    password: Yup.string().required("Password is required.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character."
        ),
});

export const signInSchema = Yup.object({
    email: Yup.string().required("Email address is required.")
        .email("Invalid email address."),
    password: Yup.string().required("Password is required."),
});
