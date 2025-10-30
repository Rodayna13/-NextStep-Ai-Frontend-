import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiAiGenerate2 } from "react-icons/ri";
import AIPromptPopover from "../AIPromptPopover";
import HintSuggestion from "../HintSuggestion";
import PopUpSuggestions from "../HintSuggestion/PopUpSuggestions";
import UseSuggestionsHook from "../HintSuggestion/UseSuggestionsHook";
import "./style.css";

const FormInput = (props) => {

    const {
        autoComplete = false,
        autoCompleteSortBy = "",
        name,
        type = "text",
        placeholder,
        register,
        rules,
        style,
        label,
        logo,
        ...rest
    } = props;
    const { watch } = useFormContext();
    const [showAIPrompt, setShowAIPrompt] = useState(false);

    const inputValue = watch(name) || "";




    const {
        inputPorps,
        isAltClicked,
        setIsAltClicked,
        suggestionHintIndex,
        suggestionHints,
    } = UseSuggestionsHook({
        autoComplete,
        autoCompleteSortBy,
        register,
        name,
        rules,

    });
    // Prepare input props as an object
    const inputFieldProps = {
        dir: "auto",
        id: name,
        name,
        type,
        ...rest,
        autoComplete: "off",
        placeholder,
        ...(register ? register(name, rules) : {}),
        ...inputPorps,
        
    };



    return (
        <div className="form-input-wrapper" style={style}>
            {label && <label htmlFor={name} className="form-label">{label}</label>}
            <div className="form-input" >
                {logo && <img src={logo} className="form-input-logo" alt="" />}

                {type === 'text' ? (
                    <input
                        {...inputFieldProps}
                    />
                ) : (
                    <textarea
                        {...inputFieldProps}
                    />
                )}


                <HintSuggestion
                    suggestionHints={suggestionHints}
                    suggestionHintIndex={suggestionHintIndex}
                    InputValue={inputValue}
                />

                <PopUpSuggestions
                    suggestionHints={suggestionHints}
                    suggestionHintIndex={suggestionHintIndex}
                    isAltClicked={isAltClicked}
                    setIsAltClicked={setIsAltClicked}
                    inputName={name}
                />

                <button
                    className="ai-gen-btn"
                    type="button"
                    onClick={() => setShowAIPrompt(!showAIPrompt)}
                    title="Generate with AI"
                >
                    <RiAiGenerate2
                        className={`ai-gen-icon ${showAIPrompt ? 'ai-icon-animate' : ''}`}
                        size={16}
                        color={showAIPrompt ? "#f97316" : "#6b7280"}
                    />
                </button>

                <AIPromptPopover
                    inputValue={inputValue}
                    label={label}
                    showPopover={showAIPrompt}
                    setShowAIPrompt={setShowAIPrompt}
                    name={name}
                />
            </div>
        </div>
    );
};

export default FormInput;
