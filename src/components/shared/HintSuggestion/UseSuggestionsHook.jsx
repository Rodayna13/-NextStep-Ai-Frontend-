import React, { useState } from 'react'
import { apiEndpoints } from '../../../api/endpoints';
import axios from 'axios';
import { useFormContext } from 'react-hook-form';

const UseSuggestionsHook = ({ autoComplete, autoCompleteSortBy, register, name, rules }) => {

    const [suggestionHints, setSuggestionHints] = useState([]);
    const [suggestionHintIndex, setSuggestionHintIndex] = useState(0);

    const { setValue } = useFormContext();

    const [isAltClicked, setIsAltClicked] = useState("");


    const fetchSuggestions = async (v) => {
        if (!v) return [];
        const res = await axios.get(
            `${apiEndpoints.autoComplete}?q=${v}&sortBy=${autoCompleteSortBy}`
        );
        return res.data.suggestions || [];
    }


    const inputPorps = {
        onChange: e => {
            if (register) {
                register(name, rules).onChange(e);
            }
            if (autoComplete) {
                fetchSuggestions(e.target.value).then(setSuggestionHints);
                setSuggestionHintIndex(0);
            }
        },


        onKeyDown: (e) => {
            if (suggestionHints.length === 0) return;

            if (e.key === "Tab") {
                e.preventDefault();
                console.log("setvalue", suggestionHints[suggestionHintIndex]);
                setValue(name, suggestionHints[suggestionHintIndex]);
                setSuggestionHints([]);
            }

            if (e.key === 'Alt') {
                e.preventDefault();
                setIsAltClicked(true);
            } else {
                setIsAltClicked(false);
            }

            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                setSuggestionHintIndex(
                    (prevIndex) => (prevIndex + 1) % suggestionHints.length
                );
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                setSuggestionHintIndex(
                    (prevIndex) =>
                        (prevIndex - 1 + suggestionHints.length) %
                        suggestionHints.length
                );
            }
        }



    }
    return (
        {
            inputPorps, isAltClicked, setIsAltClicked,
            suggestionHints, setSuggestionHints,
            suggestionHintIndex, setSuggestionHintIndex
        }
    )
}

export default UseSuggestionsHook