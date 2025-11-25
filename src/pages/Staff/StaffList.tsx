import { useEffect, useState } from "react";
import { getAllStaffs, deleteStaff } from "../../api/staffApi";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";

export default function StaffList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const load = () => {
    getAllStaffs().then((res) => setRows(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRows = rows.filter((s: any) =>
    `${s.nom} ${s.prenom} ${s.specialite}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = () => {
    deleteStaff(selectedId!).then(() => {
      setOpenDelete(false);
      load();
    });
  };

  const typeColor = (t: string) => {
    switch (t) {
      case "MEDECIN": return "primary";
      case "INFIRMIER": return "info";
      case "AIDE_SOIGNANT": return "warning";
      case "TECHNICIEN": return "secondary";
      case "SECRETAIRE": return "default";
      default: return "default";
    }
  };

  const columns: any = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "fullName",
      headerName: "Nom complet",
      width: 200,
      valueGetter: (params: any) => `${params.row.nom} ${params.row.prenom}`
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      renderCell: (p: any) => (
        <Chip label={p.row.type} color={typeColor(p.row.type)} variant="outlined" />
      )
    },
    { field: "specialite", headerName: "Spécialité", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "telephone", headerName: "Téléphone", width: 150 },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (p: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => navigate(`/staff/edit/${p.row.id}`)}>
            <EditIcon color="primary" />
          </IconButton>

          <IconButton
            onClick={() => {
              setSelectedId(p.row.id);
              setOpenDelete(true);
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box>

      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={600}>Staff Management</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/staff/add")}
        >
          Ajouter un Staff
        </Button>
      </Stack>

      <TextField
        fullWidth
        placeholder="Rechercher un staff..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <SearchIcon /> }}
        sx={{ mb: 2 }}
      />

<Box sx={{ height: 550 }}>
  <DataGrid
    rows={filteredRows}
    columns={columns}
    pageSize={10}                // ✔ v5 compatible
    rowsPerPageOptions={[5, 10, 20]} 
    disableSelectionOnClick
  />
</Box>


      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Supprimer</DialogTitle>
        <DialogContent>Voulez-vous vraiment supprimer ce staff ?</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Annuler</Button>
          <Button color="error" onClick={handleDelete}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
