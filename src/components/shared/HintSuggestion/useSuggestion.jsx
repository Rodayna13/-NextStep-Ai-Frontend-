import { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

const useSuggestion = (options = {}) => {
    const { setValue, watch } = useFormContext();

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionHintIndex, setSuggestionHintIndex] = useState(0);
    const [isAltClicked, setIsAltClicked] = useState(false);
    // Filtered suggestions based on value
    const suggestionHints = useMemo(
        () => suggestions.filter(sug => sug.toLowerCase().startsWith(inputValue.toLowerCase())),
        [suggestions, inputValue]
    );

    // Fetch suggestions if fetchSuggestions is provided and enabled is not false
    const onChange = async (e) => {
        if (options.enabled === false) {
            // setValue(e.target.value);
            setSuggestions([]);
            return;
        }
        const v = e.target.value;
        setInputValue(v);
        if (options.fetchSuggestions) {
            try {
                const result = await options.fetchSuggestions(v);
                setSuggestions(result || []);
            } catch {
                setSuggestions([]);
            }
        }
    };

    const onKeyDown = (e) => {
        if (options.enabled === false) return;
        if (suggestionHints.length === 0) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            setValue(suggestionHints[suggestionHintIndex]);
            setInputValue(suggestionHints[suggestionHintIndex]);
            setSuggestions([]);
        }
        if (e.key === 'Alt') {
            e.preventDefault();
            setIsAltClicked(true);
        } else {
            setIsAltClicked(false);
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            setSuggestionHintIndex((prevIndex) => (prevIndex + 1) % suggestionHints.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            setSuggestionHintIndex((prevIndex) => (prevIndex - 1 + suggestionHints.length) % suggestionHints.length);
        }
    };


    onkeyup = (e) => {
        if (e.key === 'Alt') {
            setIsAltClicked(false);
        }
    };

    const inputProps = {
        onChange,
        onKeyDown,
        onKeyUp: onkeyup,
    };

    return {
        suggestions,
        setSuggestions,
        suggestionHints,
        suggestionHintIndex,
        setSuggestionHintIndex,
        isAltClicked,
        setIsAltClicked,
        inputProps
    };
};

export default useSuggestion;