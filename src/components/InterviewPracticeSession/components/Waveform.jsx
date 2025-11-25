import PropTypes from 'prop-types';

/**
 * Waveform animation component
 */
const Waveform = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="waveform">
            {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className={`waveform-bar i-${i + 1}`}></div>
            ))}
        </div>
    );
};

Waveform.propTypes = {
    isVisible: PropTypes.bool.isRequired
};

export default Waveform;
