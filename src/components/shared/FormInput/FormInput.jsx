import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiAiGenerate2 } from "react-icons/ri";
import AIPromptPopover from "../AIPromptPopover/AIPromptPopover";
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
        logo
    } = props;
    const { watch } = useFormContext();
    const [showAIPrompt, setShowAIPrompt] = useState(false);

    const inputValue = watch(name) || "";



    const popoverRef = useRef(null);

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

    return (
        <div className="form-input-wrapper" style={style}>
            {label && <label htmlFor={name} className="form-label">{label}</label>}
            <div className="form-input" >
                {logo && <img src={logo} className="form-input-logo" alt="" />}
                <input
                    dir="auto"
                    id={name}
                    name={name}
                    type={type}
                    autoComplete="off"
                    placeholder={placeholder}
                    {...(register ? register(name, rules) : {})}
                    {...inputPorps}
                />

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
                    showPopover={showAIPrompt}
                    prompt={""}
                    onPromptChange={() => { }}
                    onPromptSubmit={() => { }}
                    ref={popoverRef}
                />
            </div>
        </div>
    );
};

export default FormInput;
