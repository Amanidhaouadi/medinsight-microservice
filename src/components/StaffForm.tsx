import { Button, Grid, TextField, MenuItem, Card } from "@mui/material";
import { Staff } from "../api/staffApi";

interface Props {
  onSubmit: (data: Staff) => void;
  initialData?: Staff;
}

export default function StaffForm({ onSubmit, initialData }: Props) {

  const toLocalDateTime = (date: any) => {
    if (!date) return null;
    return `${date}T00:00:00`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const data: Staff = {
      id: initialData?.id,
      nom: form.get("nom") as string,
      prenom: form.get("prenom") as string,
      email: form.get("email") as string,
      telephone: form.get("telephone") as string,
      type: form.get("type") as string,
      specialite: form.get("specialite") as string,
      numeroLicence: form.get("numeroLicence") as string,
      actif: form.get("actif") === "true",
      dateEmbauche: toLocalDateTime(form.get("dateEmbauche")),
    };

    onSubmit(data);
  };

  return (
    <Card sx={{ p: 4 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          <Grid item xs={6}>
            <TextField name="nom" label="Nom" fullWidth required defaultValue={initialData?.nom} />
          </Grid>

          <Grid item xs={6}>
            <TextField name="prenom" label="Prénom" fullWidth required defaultValue={initialData?.prenom} />
          </Grid>

          <Grid item xs={6}>
            <TextField name="email" label="Email" fullWidth required defaultValue={initialData?.email} />
          </Grid>

          <Grid item xs={6}>
            <TextField name="telephone" label="Téléphone" fullWidth required defaultValue={initialData?.telephone} />
          </Grid>

          <Grid item xs={6}>
            <TextField name="type" label="Type" select fullWidth defaultValue={initialData?.type}>
              <MenuItem value="MEDECIN">Médecin</MenuItem>
              <MenuItem value="INFIRMIER">Infirmier</MenuItem>
              <MenuItem value="AIDE_SOIGNANT">Aide-soignant</MenuItem>
              <MenuItem value="TECHNICIEN">Technicien</MenuItem>
              <MenuItem value="SECRETAIRE">Secrétaire</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField name="specialite" label="Spécialité" fullWidth defaultValue={initialData?.specialite} />
          </Grid>

          <Grid item xs={6}>
            <TextField name="numeroLicence" label="Numéro de licence" fullWidth defaultValue={initialData?.numeroLicence} />
          </Grid>

          <Grid item xs={6}>
            <TextField name="dateEmbauche" type="date" label="Date d'embauche"
              fullWidth
              defaultValue={initialData?.dateEmbauche?.substring(0, 10)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField name="actif" label="Actif" select fullWidth defaultValue={initialData?.actif ? "true" : "false"}>
              <MenuItem value="true">Actif</MenuItem>
              <MenuItem value="false">Non Actif</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button type="submit" variant="contained">Enregistrer</Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
