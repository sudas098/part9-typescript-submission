import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import Male from "@mui/icons-material/Male";
import Female from "@mui/icons-material/Female";
import Transgender from "@mui/icons-material/Transgender";
import Work from "@mui/icons-material/Work";
import MedicalServices from "@mui/icons-material/MedicalServices";
import Hospitalized from "@mui/icons-material/LocalHospital";
import Favorite from "@mui/icons-material/Favorite";
import axios from "axios";

import { Patient, Gender, Diagnosis, Entry, EntryWithoutId } from "../../types";
import patientService from "../../services/patients";
import AddEntryForm from "./AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientDetailsPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        const fetchedPatient = await patientService.getOne(id);
        setPatient(fetchedPatient);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) return null;

  const renderGenderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male: return <Male />;
      case Gender.Female: return <Female />;
      default: return <Transgender />;
    }
  };

  const getDiagnosisName = (code: string) => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : "";
  };

  const submitNewEntry = async (values: EntryWithoutId) => {
    if (!id) return;
    try {
      const entry = await patientService.addEntry(id, values);
      setPatient({
        ...patient,
        entries: patient.entries.concat(entry)
      });
      setShowForm(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data) {
          const errorMessage = typeof e.response.data === 'string' 
            ? e.response.data 
            : JSON.stringify(e.response.data.error);
          setError(errorMessage);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return (
          <Box style={{ border: "1px solid black", borderRadius: "5px", padding: "10px", marginBottom: "10px" }}>
            <Typography variant="body2">{entry.date} <Hospitalized /></Typography>
            <Typography variant="body2" fontStyle="italic">{entry.description}</Typography>
            <Typography variant="body2">Discharged: {entry.discharge.date} ({entry.discharge.criteria})</Typography>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>{code} {getDiagnosisName(code)}</li>
              ))}
            </ul>
            <Typography variant="body2">diagnose by {entry.specialist}</Typography>
          </Box>
        );
      case "OccupationalHealthcare":
        return (
          <Box style={{ border: "1px solid black", borderRadius: "5px", padding: "10px", marginBottom: "10px" }}>
            <Typography variant="body2">{entry.date} <Work /> <strong>{entry.employerName}</strong></Typography>
            <Typography variant="body2" fontStyle="italic">{entry.description}</Typography>
            {entry.sickLeave && (
              <Typography variant="body2">Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</Typography>
            )}
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>{code} {getDiagnosisName(code)}</li>
              ))}
            </ul>
            <Typography variant="body2">diagnose by {entry.specialist}</Typography>
          </Box>
        );
      case "HealthCheck":
        const getHealthColor = (rating: number) => {
          switch (rating) {
            case 0: return "green";
            case 1: return "yellow";
            case 2: return "orange";
            case 3: return "red";
            default: return "grey";
          }
        };
        return (
          <Box style={{ border: "1px solid black", borderRadius: "5px", padding: "10px", marginBottom: "10px" }}>
            <Typography variant="body2">{entry.date} <MedicalServices /></Typography>
            <Typography variant="body2" fontStyle="italic">{entry.description}</Typography>
            <Favorite style={{ color: getHealthColor(entry.healthCheckRating) }} />
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>{code} {getDiagnosisName(code)}</li>
              ))}
            </ul>
            <Typography variant="body2">diagnose by {entry.specialist}</Typography>
          </Box>
        );
      default:
        return assertNever(entry);
    }
  };

  return (
    <Box>
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        {patient.name} {renderGenderIcon(patient.gender)}
      </Typography>
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      {patient.dateOfBirth && (
        <Typography variant="body1">date of birth: {patient.dateOfBirth}</Typography>
      )}

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        entries
      </Typography>

      {showForm ? (
        <AddEntryForm 
          onSubmit={submitNewEntry} 
          onCancel={() => { setShowForm(false); setError(undefined); }} 
          error={error} 
          diagnoses={diagnoses}
        />
      ) : (
        <Button variant="contained" onClick={() => setShowForm(true)} style={{ marginBottom: "15px" }}>
          Add New Entry
        </Button>
      )}

      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}
    </Box>
  );
};

export default PatientDetailsPage;