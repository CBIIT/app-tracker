import './EditableFocusArea.css';
import { Form, Select } from 'antd';

const focusAreaMenu = [
	{ label: 'Bachelors', value: 'Bachelors' },
	{ label: 'Biochemistry/Proteomics/Metabolomics', value: 'Biochemistry/Proteomics/Metabolomics' },
	{ label: 'Biomedical Engineering/Biophysics/Physics', value: 'Biomedical Engineering/Biophysics/Physics' },
	{ label: 'Cancer Biology', value: 'Cancer Biology' },
	{ label: 'Cell Biology', value: 'Cell Biology' },
	{ label: 'Chemistry/Chemical Biology/Toxicology', value: 'Chemistry/Chemical Biology/Toxicology' },
	{ label: 'Chromosome Biology/Epigenetics/Transcription', value: 'Chromosome Biology/Epigenetics/Transcription' },
	{ label: 'Computational Biology/Bioinformatics/Biostatistics/Mathematics', value: 'Computational Biology/Bioinformatics/Biostatistics/Mathematics' },
	{ label: 'Developmental Biology', value: 'Developmental Biology' },
	{ label: 'Epidemiology/Population Sciences', value: 'Epidemiology/Population Sciences' },
	{ label: 'Genetics/Genomics', value: 'Genetics/Genomics' },
	{ label: 'Health Disparities', value: 'Health Disparities' },
	{ label: 'Immunology', value: 'Immunology' },
	{ label: 'Microbiology/Infectious diseases (non-viral)', value: 'Microbiology/Infectious diseases (non-viral)' },
	{ label: 'Molecular and Cellular Neuroscience', value: 'Molecular and Cellular Neuroscience' },
	{ label: 'Molecular Biology', value: 'Molecular Biology' },
	{ label: 'Molecular Pharmacology/Cell Signaling', value: 'Molecular Pharmacology/Cell Signaling' },
	{ label: 'Neurodevelopment', value: 'Neurodevelopment' },
	{ label: 'Physiology /Systems Biology', value: 'Physiology /Systems Biology' },
	{ label: 'RNA Biology', value: 'RNA Biology' },
	{ label: 'Social and Behavioral Sciences', value: 'Social and Behavioral Sciences' },
	{ label: 'Stem Cells/Induced Pluripotent Stem Cells', value: 'Stem Cells/Induced Pluripotent Stem Cells' },
	{ label: 'Structural Biology', value: 'Structural Biology' },
	{ label: 'Synapses and Circuits', value: 'Synapses and Circuits' },
	{ label: 'Systems and Cognitive Neuroscience', value: 'Systems and Cognitive Neuroscience' },
	{ label: 'Translation from Pre-clinical to Clinical Research/Clinical Informatics', value: 'Translation from Pre-clinical to Clinical Research/Clinical Informatics' },
	{ label: 'Virology', value: 'Virology' },
];

const editableFocusArea = (props) => (
	<Form.Item
		label='Focus Area'
		name='focusArea'
		rules={[{ required: props.required, message: 'Please make a selection' }]}
	>
		<div style={{ margin: '10px' }}>{props.directions}</div>
		<Select
			mode= {props.mode}
			options={focusAreaMenu.map((option) => ({ label: option.label, value: option.value }))}
		/>
	</Form.Item>
);

export default editableFocusArea;
