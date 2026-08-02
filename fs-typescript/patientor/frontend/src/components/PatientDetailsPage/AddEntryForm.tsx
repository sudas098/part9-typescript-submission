import { useState, SyntheticEvent } from "react";
import { TextField, Button, Box, Alert, Typography, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Chip } from "@mui/material";
import { EntryWithoutId, Diagnosis, HealthCheckRating } from "../../types";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
  error?: string;
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onSubmit, onCancel, error, diagnoses }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  
  // HealthCheck specific
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // Hospital specific
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // Occupational Healthcare specific
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    switch (type) {
      case "HealthCheck":
        onSubmit({
          type: "HealthCheck",
          description,
          date,
          specialist,
          healthCheckRating,
          diagnosisCodes
        });
        break;
      case "Hospital":
        onSubmit({
          type: "Hospital",
          description,
          date,
          specialist,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          },
          diagnosisCodes
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          type: "OccupationalHealthcare",
          description,
          date,
          specialist,
          employerName,
          sickLeave: sickLeaveStartDate && sickLeaveEndDate ? {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate
          } : undefined,
          diagnosisCodes
        });
        break;
    }
  };

  return (
    <div style={{ border: "1px dashed black", padding: "15px", marginBottom: "20px" }}>
      <Typography variant="h6">New Entry</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={addEntry}>
        <FormControl fullWidth style={{ marginBottom: "10px", marginTop: "10px" }}>
          <InputLabel>Entry type</InputLabel>
          <Select
            value={type}
            label="Entry type"
            onChange={(e) => setType(e.target.value as EntryType)}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Description"
          placeholder="Description"
          fullWidth
          required
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          style={{ marginBottom: "10px" }}
        />
        
        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
          style={{ marginBottom: "10px" }}
        />

        <TextField
          label="Specialist"
          placeholder="Specialist"
          fullWidth
          required
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          style={{ marginBottom: "10px" }}
        />

        {type === "HealthCheck" && (
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>Health Check Rating</InputLabel>
            <Select
              value={healthCheckRating}
              label="Health Check Rating"
              onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
            >
              <MenuItem value={HealthCheckRating.Healthy}>0 — Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>1 — Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>2 — High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>3 — Critical Risk</MenuItem>
            </Select>
          </FormControl>
        )}

        {type === "Hospital" && (
          <>
            <TextField
              label="Discharge Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Discharge Criteria"
              placeholder="Criteria"
              fullWidth
              required
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              style={{ marginBottom: "10px" }}
            />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              placeholder="Employer Name"
              fullWidth
              required
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              style={{ marginBottom: "10px" }}
            />
            <Typography variant="body2" style={{ marginTop: "5px" }}>Sick Leave (optional):</Typography>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              style={{ marginBottom: "10px", marginTop: "5px" }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              style={{ marginBottom: "10px" }}
            />
          </>
        )}

        <FormControl fullWidth style={{ marginBottom: "10px" }}>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={(e) => {
              const value = e.target.value;
              setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
            }}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button color="secondary" variant="contained" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddEntryForm;