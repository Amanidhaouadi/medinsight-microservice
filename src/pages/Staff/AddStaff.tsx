import { Grid, Typography } from "@mui/material";
import { createStaff, Staff } from "../../api/staffApi";
import StaffForm from "../../components/StaffForm";
import { useNavigate } from "react-router-dom";

export default function AddStaff() {
  const navigate = useNavigate();

  const handleSubmit = (data: Staff) => {
    createStaff(data).then(() => navigate("/staff"));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={600}>Ajouter un Staff</Typography>
      </Grid>

      <Grid item xs={12}>
        <StaffForm onSubmit={handleSubmit} />
      </Grid>
    </Grid>
  );
}
