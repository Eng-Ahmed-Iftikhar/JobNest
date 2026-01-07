import * as Yup from "yup";

export const editProfileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  location: Yup.string().required("Location is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string()
    .required("Address is required")
    .min(4, "Address must be at least 4 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  phoneNumber: Yup.object().shape({
    countryCode: Yup.string().required("Country code is required"),
    number: Yup.string().required("Phone number is required"),
    isVerified: Yup.boolean().optional().default(true),
  }),
  bio: Yup.string().max(500, "Bio must not exceed 500 characters"),
  experiences: Yup.array()
    .of(
      Yup.object().shape({
        position: Yup.string().required("Position is required"),
        company: Yup.string().required("Company is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().when("current", {
          is: false,
          then: (schema) => schema.required("End date is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    )
    .min(1, "At least one experience is required"),
  educations: Yup.array()
    .of(
      Yup.object().shape({
        degree: Yup.string().required("Degree is required"),
        institution: Yup.string().required("Institution is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().required("End date is required"),
      })
    )
    .min(1, "At least one education is required"),
  skillIds: Yup.array()
    .of(Yup.string())
    .min(1, "At least one skill is required"),
});
