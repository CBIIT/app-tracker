import { Slider } from 'antd';
import './ScoringWidgetSlider.css';

const scoringWidgetSlider = (props) => (
	<div className='ScoringWidgetSliderContent'>
		<h2>{props.title}</h2>
		<div className='ScoringWidgetSlider'>
			<Slider
				marks={props.sliderMarks}
				min={props.sliderMin}
				max={props.sliderMax}
				onChange={props.onChange}
				value={props.value}
				defaultValue={0}
			/>
		</div>
	</div>
);

export default scoringWidgetSlider;
