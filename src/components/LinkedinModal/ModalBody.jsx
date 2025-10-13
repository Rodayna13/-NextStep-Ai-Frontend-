import { useSelector } from "react-redux";

const ModalBody = ({ setLinkedinUrl }) => {


    const { loading } = useSelector(state => state.linkedin.loading)

    return (
        <div className={loading ? 'd-none' : ''}>
            <p className="custom-modal-desc">
                <strong>Tip:</strong> Open your LinkedIn profile, click "Edit public profile & URL," then copy your custom URL.
            </p>

            <div className="custom-modal-field">
                <input
                    id="linkedin-url"
                    type="text"
                    placeholder="https://www.linkedin.com/in/your-profile"
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                />
            </div>
        </div >
    );
}

export default ModalBody;