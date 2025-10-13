import React from "react";
import { detectDirection } from '../../../utils/language';
import "./style.css"

const HintSuggestion = ({ suggestionHints, suggestionHintIndex, InputValue }) => {


    const suggestion = suggestionHints?.[suggestionHintIndex];
    const showSuggestion = InputValue?.length > 0 && suggestion;

    return (
        <div className="form-input-hint" data-dir={detectDirection(InputValue)} >
            <span style={{ opacity: 0 }}>{InputValue}</span>
            <span >
                {showSuggestion && suggestion.slice(InputValue.length)}
            </span>
        </div>
    );
};

export default React.memo(HintSuggestion);