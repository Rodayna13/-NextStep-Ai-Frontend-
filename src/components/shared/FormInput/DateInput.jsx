import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RiAiGenerate2 } from "react-icons/ri";

// Accepts optional `register` function and `name` so parent can wire react-hook-form
const DateInput = ({ name, value, type = "date", placeholder, register, rules, style }) => {
    const { setValue } = useFormContext();

    useEffect(() => {
        setValue(name, value);
    }, [value, name, setValue]);

    return (
        <div className="form-input" style={style}>
            <input
                id={name}
                name={name}
                type={type}
                onClick={(e) => e.target.showPicker?.()}
                placeholder={placeholder}
                {...(register ? register(name, rules) : {})}
            />
            <button className="ai-gen-btn" type="button">
                <RiAiGenerate2 className="ai-gen-icon" size={18} color="grey" />
            </button>
        </div>
    )
}

export default DateInput