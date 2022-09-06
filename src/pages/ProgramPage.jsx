import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import UniversalBlock from "../components/UniversalBlock";
import api from "../api/api";

const ProgramPage = () => {
    const effectRan = useRef(false);
    const { auth } = useAuth();
    const location = useLocation();
    const { program } = location.state;
    const { programId } = useParams();

    const [exercises, setExercises] = useState([]);

    const [exerciseName, setExerciseName] = useState("");
    const [difficulty, setDifficulty] = useState("EASY");
    const [muscle, setMuscle] = useState("");
    const [instructions, setInstructions] = useState("");

    const [infoMessage, setInfoMessage] = useState("");
    const [success, setSuccess] = useState(undefined);
    const [errMessage, setErrMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [overlay, setOverlay] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setInfoMessage("");
        }, 3000);
    }, [infoMessage]);

    useEffect(() => {
        if (effectRan.current === false) {
            const fetchExercises = async () => {
                try {
                    const { data } = await api.get(
                        `/exercises?programID=${programId}`
                    );

                    setExercises(data.data);
                } catch (err) {
                    setErrMessage("Error: Did not receive expected data");
                    console.log(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchExercises();

            return () => {
                effectRan.current = true;
            };
        }
    }, [programId]);

    // add Exercise to database
    const createExercise = async (e) => {
        e.preventDefault();

        const url = "/exercises";
        const data = {
            difficulty: difficulty,
            name: exerciseName,
            muscle: muscle,
            instructions: instructions,
            programID: programId,
        };
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        };

        try {
            const res = await api.post(url, data, headers);

            // add exercise to UI
            setExercises((prev) => [...prev, res.data.exercise]);

            // set message
            setInfoMessage("exercise was succesfully created");
            setSuccess(true);

            // clear inputs
            setExerciseName("");
            setMuscle("");
            setInstructions("");
        } catch (err) {
            setInfoMessage("Error: exercise was not created");
            setSuccess(false);
            console.log(err);
        }
    };

    // delete Exercise from database
    const deleteExercise = async (e, id) => {
        e.preventDefault();

        try {
            await api.delete(`/exercises/${id}/`);

            // remove exercise from UI
            setExercises(exercises.filter((exercise) => exercise.id !== id));

            // success message
            setInfoMessage("exercise was succesfuly deleted");
            setSuccess(true);
        } catch (err) {
            setSuccess(false);
            setInfoMessage("exercise was not deleted successfuly");
            console.log(err);
        }
    };

    const handleOverlayClose = (e) => {
        if (e.target === e.currentTarget) {
            setOverlay(false);
        }

        if (e.key === "Escape") {
            setOverlay(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleOverlayClose);

        return () => {
            document.removeEventListener("keydown", handleOverlayClose);
        };
    }, []);

    const ExerciseList = exercises.map((exercise) => {
        return (
            <UniversalBlock
                key={exercise.id.toString()}
                item={exercise}
                deleteItem={deleteExercise}
                url="/exercise/"
                itemName="exrcs"
            />
        );
    });

    return (
        <>
            <Header text={program.name} backButton={true} />
            <main>
                <div className="container">
                    {isLoading && <p>Loading...</p>}
                    {errMessage && <p>{errMessage}</p>}
                    {!isLoading && !errMessage && (
                        <ul className="exercises-wrapper">
                            {exercises.length !== 0 ? (
                                ExerciseList
                            ) : (
                                <p>no exercises available</p>
                            )}
                        </ul>
                    )}

                    {auth.role === "ADMIN" && (
                        <div className="button-wrapper">
                            <button onClick={() => setOverlay(true)}>
                                add new exercise
                            </button>
                        </div>
                    )}

                    {auth.role === "ADMIN" && overlay === true && (
                        <div
                            className="overlay"
                            onClick={(e) => handleOverlayClose(e)}
                        >
                            <div className="form new-exercise">
                                <h3>create a new Exercise</h3>
                                <form onSubmit={createExercise}>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={exerciseName}
                                        placeholder="enter name of the exercise"
                                        onChange={(e) => {
                                            setExerciseName(e.target.value);
                                        }}
                                    />
                                    <input
                                        type="text"
                                        id="muscle"
                                        name="muscle"
                                        required
                                        value={muscle}
                                        placeholder="enter muscle"
                                        onChange={(e) => {
                                            setMuscle(e.target.value);
                                        }}
                                    />
                                    <textarea
                                        type="text"
                                        id="instructions"
                                        name="instructions"
                                        required
                                        value={instructions}
                                        placeholder="enter instructions"
                                        onChange={(e) => {
                                            setInstructions(e.target.value);
                                        }}
                                    />
                                    <label
                                        htmlFor="difficulty"
                                        className="select-difficulty"
                                    >
                                        Choose a difficulty:
                                        <select
                                            name="difficulty"
                                            id="difficulty"
                                            onChange={(e) =>
                                                setDifficulty(e.target.value)
                                            }
                                        >
                                            <option value="EASY">Easy</option>
                                            <option value="MEDIUM">
                                                Medium
                                            </option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                    </label>

                                    <div className="button-wrapper">
                                        <button>create Exercise</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {infoMessage !== "" && (
                    <p
                        className="info-message"
                        style={{
                            background: success ? "#59f750" : "#c4090a",
                        }}
                    >
                        {infoMessage}
                    </p>
                )}
            </main>
        </>
    );
};

export default ProgramPage;
