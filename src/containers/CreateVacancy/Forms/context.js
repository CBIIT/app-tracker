import React from 'react';
const defaulfFormData = {
  applicant: {},
  references: [],
  documents: {},
  questions: {},
};

const FormContext = React.createContext({
  currentFormInstance: null,
  setCurrentFormInstance: () => { },
});

export { defaulfFormData };

export default FormContext;
