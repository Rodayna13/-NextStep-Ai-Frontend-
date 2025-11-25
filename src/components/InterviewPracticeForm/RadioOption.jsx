import PropTypes from 'prop-types';

const RadioOption = ({ value, label, checked, onChange }) => {
    return (
        <label className="radio-label">
            <input
                type="radio"
                name="cv-option"
                checked={checked}
                onChange={onChange}
                value={value}
            />

            <span className='radio-text'>{label}</span>

        </label>
    );
};

RadioOption.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default RadioOption;
