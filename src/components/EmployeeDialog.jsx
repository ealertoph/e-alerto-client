// src/components/EmployeeDialog.jsx
import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

// dropdown options
const districts = [
  "District 1",
  "District 2",
  "District 3",
  "District 4",
  "District 5",
  "District 6",
  "Central Comm",
];

// validation regexes
const nameRx = /^[A-Za-z\s\-\.]+$/; // letters, spaces, hyphens, periods
const emailRx = /^[^\s@]+@gmail\.com$/; // must end with @gmail.com
const phoneRx = /^\+639\d{9}$/; // +63 and 10 digits

export default function EmployeeDialog({
  open,
  onClose,
  onSaved,
  initialData,
  loading,
}) {
  const { userData } = useContext(AppContent);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const resetProfilePicState = () => {
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  // This useEffect hook will run whenever the 'open' prop changes.
  useEffect(() => {
    // Check if the dialog is now closed and if a profile picture was selected
    if (!open) {
      // Reset the profile picture state
      resetProfilePicState();
    }
  }, [open]); // The dependency array ensures this effect only runs when 'open' changes.

  const isEdit = Boolean(initialData && initialData.id);

  // build positionOptions based on logged-in user's role
  const positionOptions =
    userData?.position === "Super Admin"
      ? ["District Engineer", "Admin"]
      : ["District Engineer"];

  // form state
  const [form, setForm] = useState({
    id: "",
    surname: "",
    firstName: "",
    middleName: "",
    suffix: "",
    district: "",
    position: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  // seed/reset when dialog opens or initialData changes
  useEffect(() => {
    if (isEdit) {
      setForm({
        id: initialData.id,
        surname: initialData.surname || "",
        firstName: initialData.firstName || "",
        middleName: initialData.middleName || "",
        suffix: initialData.suffix || "",
        district: initialData.district || "",
        position: initialData.position || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
      });
    } else {
      setForm({
        id: "",
        surname: "",
        firstName: "",
        middleName: "",
        suffix: "",
        district: "",
        position: "",
        email: "",
        phone: "",
      });
    }
    setErrors({});
  }, [initialData, open, isEdit]);

  // validation
  const validate = (f) => {
    const e = {};
    if (!f.surname) e.surname = "Required";
    else if (!nameRx.test(f.surname))
      e.surname = "Letters, spaces, hyphens & periods only";

    if (!f.firstName) e.firstName = "Required";
    else if (!nameRx.test(f.firstName))
      e.firstName = "Letters, spaces, hyphens & periods only";

    if (f.middleName && !nameRx.test(f.middleName))
      e.middleName = "Letters, spaces, hyphens & periods only";

    if (f.suffix && !nameRx.test(f.suffix))
      e.suffix = "Letters, spaces, hyphens & periods only";

    if (!f.district) e.district = "Required";
    if (!f.position) e.position = "Required";

    if (!f.email) e.email = "Required";
    else if (!emailRx.test(f.email))
      e.email = "Must be a valid @gmail.com address";

    if (!f.phone) e.phone = "Required";
    else if (!phoneRx.test(f.phone))
      e.phone = "Must be +63 and 10 digits starting at 9";

    return e;
  };

  // field change handler
  const handleChange = (key) => (e) => {
    setForm((frm) => ({ ...frm, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  // save
  const handleSave = async () => {
    const ve = validate(form);
    if (Object.keys(ve).length) {
      setErrors(ve);
      return;
    }
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${form.id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { ...form, userId: userData.id } : form;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      // ✅ Upload profile picture only when creating new
      if (!isEdit && profilePicFile && json.user?.id) {
        const formData = new FormData();
        formData.append("profile", profilePicFile);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/upload-pic/${json.user.id}`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.message);
      }

      toast.success(isEdit ? "Employee updated" : "Employee created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Employee" : "New Employee"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Button variant="outlined" component="label">
            {profilePicFile
              ? "Change Profile Picture"
              : "Upload Profile Picture"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setProfilePicFile(file);
                setProfilePicPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </Button>

          {profilePicPreview && (
            <img
              src={profilePicPreview}
              alt="Preview"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                marginTop: 8,
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
          )}
          <TextField
            label="Surname"
            value={form.surname}
            onChange={handleChange("surname")}
            error={!!errors.surname}
            helperText={errors.surname}
            fullWidth
          />
          <TextField
            label="First Name"
            value={form.firstName}
            onChange={handleChange("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
          />
          <TextField
            label="Middle Name"
            value={form.middleName}
            onChange={handleChange("middleName")}
            error={!!errors.middleName}
            helperText={errors.middleName}
            fullWidth
          />
          <TextField
            label="Suffix"
            value={form.suffix}
            onChange={handleChange("suffix")}
            error={!!errors.suffix}
            helperText={errors.suffix}
            fullWidth
          />
          <TextField
            select
            label="District"
            value={form.district}
            onChange={handleChange("district")}
            error={!!errors.district}
            helperText={errors.district}
            fullWidth
          >
            {districts.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Position"
            value={form.position}
            onChange={handleChange("position")}
            error={!!errors.position}
            helperText={errors.position}
            fullWidth
          >
            {positionOptions.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label="Phone"
            value={form.phone.replace(/^\+63/, "")}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              handleChange("phone")({ target: { value: `+63${digits}` } });
            }}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+63</InputAdornment>
              ),
            }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {isEdit ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  loading: PropTypes.bool,
};
