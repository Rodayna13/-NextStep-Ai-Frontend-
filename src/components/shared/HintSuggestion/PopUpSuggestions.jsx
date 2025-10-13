
import { useFormContext } from 'react-hook-form';

const PopUpSuggestions = ({ suggestionHints, suggestionHintIndex, isAltClicked, setIsAltClicked, inputName }) => {
    const { setValue } = useFormContext();
    return (
        isAltClicked &&
        <ul className="hint-suggestion-list">
            {suggestionHints?.map((hint, idx) => (
                <li
                    key={idx}
                    className={idx === suggestionHintIndex ? "text-white" : ""}
                    onClick={() => {
                        setIsAltClicked(false);
                        setValue(inputName, hint);
                    }}
                >
                    {hint}
                </li>
            ))}
        </ul>

    )
}

export default PopUpSuggestions