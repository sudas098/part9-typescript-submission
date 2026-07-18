import {NonSensitiveDiagnoseEntry,  DiagnoseEntry } from "../type.ts";
import diagnoseEntries from "../data/diagnoses.ts";

const getAll = ():DiagnoseEntry[] => {
    return diagnoseEntries;
};

const getNonSensitiveDiagnosesEntries = ():NonSensitiveDiagnoseEntry[] => {
    return diagnoseEntries.map(({code, name}) => ({
        code,
        name
    }));
};



export default {
    getAll,
    getNonSensitiveDiagnosesEntries
}