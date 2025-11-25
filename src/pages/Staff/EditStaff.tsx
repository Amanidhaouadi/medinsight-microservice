import { Grid, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffById, updateStaff, Staff } from "../../api/staffApi";
import StaffForm from "../../components/StaffForm";
import { useEffect, useState } from "react";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    getStaffById(Number(id)).then((res) => setStaff(res.data));
  }, [id]);

  const handleSubmit = (data: Staff) => {
    updateStaff(Number(id), data).then(() => navigate("/staff"));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={600}>Modifier Staff</Typography>
      </Grid>

      <Grid item xs={12}>
        {staff && <StaffForm onSubmit={handleSubmit} initialData={staff} />}
      </Grid>
    </Grid>
  );
}
