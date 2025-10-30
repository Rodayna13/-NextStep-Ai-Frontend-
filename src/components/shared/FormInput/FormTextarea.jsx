
import { RiAiGenerate2 } from "react-icons/ri";

// Accepts optional `register` and `name` props for react-hook-form
const FormTextarea = ({ id, name, placeholder, register, rules, rows, label }) => {
    return (
        <div className="form-input-wrapper">
            {label && <label htmlFor={name} className="form-label">{label}</label>}
            <div className="form-input">
                <textarea
                    id={id}
                    name={name}
                    rows={rows}
                    placeholder={placeholder}
                    {...(register ? register(name, rules) : {})}
                />
                <button className="ai-gen-btn" type="button">
                    <RiAiGenerate2 className="ai-gen-icon" size={18} color="grey" />
                </button>

                
            </div>
        </div>
    )
}

export default FormTextarea