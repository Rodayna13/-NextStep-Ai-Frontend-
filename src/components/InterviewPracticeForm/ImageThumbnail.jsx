import PropTypes from 'prop-types';

const ImageThumbnail = ({ image, onRemove }) => {
    if (!image) return null;

    return (
        <div className="image-thumbnail">
            <img src={image.url} alt={image.name} />
            <button
                className="remove-image-btn"
                onClick={onRemove}
                aria-label="Remove image"
                type="button"
            >
                ×
            </button>
        </div>
    );
};

ImageThumbnail.propTypes = {
    image: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
    onRemove: PropTypes.func.isRequired,
};

export default ImageThumbnail;
