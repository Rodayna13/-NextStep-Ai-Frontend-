import { useEffect, useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import useSpeak from './../../hooks/useSpeak';
import useTranscription from './handleTranscription';

const DemoPage = () => {
    const speechRecognition = useSpeechRecognition();
    const { handleSpeak, currentText, isPlaying, audioRef, handleAudioEnd } = useSpeak();
    const [history, setHistory] = useState([`act as interviewer coach in arabic language and egypt accent` , `you're assistant ask your first question`]);
    const { transcribeAudioSimple } = useTranscription();


    useEffect(() => {
        handleSpeak(history.join("\n"), 'nova').then(audioBlob => {
            transcribeAudioSimple(audioBlob).then(bootResponse => {
                setHistory(prev => [...prev, "\n assistant said: " + bootResponse])
            })
        })
    }, [])




    if (speechRecognition.isRecording && speechRecognition.transcript && !speechRecognition.isSpeaking) {

        const newHistory = [...history, "user said" + speechRecognition.transcript];
        setHistory(newHistory);
        handleSpeak(newHistory.join("\n"), 'nova').then(audioBlob => {
            transcribeAudioSimple(audioBlob).then(bootResponse => {
                setHistory(prev => [...prev, "\n assistant said: " + bootResponse])
            })
        })
        speechRecognition.stopRecognition();
        // handleSpeak(history.join("\n"), 'nova');
    }



    return (
        <div>
            <h1>Demo Page</h1>
            <h3>
                {JSON.stringify(history.join("\n"))}
            </h3>
            <small>{speechRecognition?.interim}</small>

            {speechRecognition.transcript && (
                <div className="demo-page__transcript">
                    <p><strong>Transcript:</strong> {speechRecognition.transcript}</p>
                </div>
            )}


            {/* Your question */}
            {currentText && (
                <div className="demo-page__question">
                    <p><strong>You asked:</strong> {currentText}</p>
                    <p><strong>Audio Status:</strong> {isPlaying ? 'Playing...' : 'Stopped'}</p>
                </div>
            )}









            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                className="demo-page__audio"
            />


            <button className={`${speechRecognition.isSpeaking ? 'bg-danger' : ''}`} onClick={
                () => {
                    audioRef.current.playbackRate = 0;
                    speechRecognition.startRecognition();
                    // const newHistory = [...history, 'how many days are there in a year?'];
                    // setHistory(newHistory);
                    // handleSpeak(newHistory.join("\n"), 'nova');
                }
            }>record button 🔴</button>


        </div>
    )
}

export default DemoPage