import React, { use } from 'react';
import TitleCard from "../atoms/TitleCard";
import BarGraph from '../atoms/BarGraph';
import PieGraph from '../atoms/PieGraph';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { fetchAiMessagesClassData, fetchAiMessagesStudentData } from '../../../services/communicationManager';
import { fetchQuizzesClassData, fetchQuizzesStudentData } from '../../../services/communicationManager';
import ButtonCollection from '../molecules/ButtonCollection';
import ContentWrapper from '../atoms/ContentWrapper';



const StatsContent = ({ classId, mode, index }) => {

    // raw data from the server
    const [classStats, setClassStats] = useState([]);
    const [quizzStats, setQuizzStats] = useState([]);

    // filtered data through date filter for the graphs
    const [filteredClassData, setFilteredClassData] = useState([]);
    const [filteredQuizzData, setFilteredQuizzData] = useState([]);

    //these 2 are used in the message graphs
    const [languageStats, setLanguageStats] = useState([]);
    const [messageCountByDate, setMessageCountByDate] = useState([]);

    //this is used in the quizz graphs
    const [quizzAnswered, setQuizzAnswered] = useState(0);
    const [quizzNotAnswered, setQuizzNotAnswered] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    
    const class_info = useAuthStore((state) => state.class_info);

    useEffect(() => {
        if (mode === "alumne") {
            fetchAiMessagesStudentData(classId)
                .then((data) => { setClassStats(data); setFilteredClassData(data) })
                .catch((error) => console.error('Error fetching class data:', error));

            fetchQuizzesStudentData(classId)
                .then((data) => { setQuizzStats(data); setFilteredQuizzData(data) })
                .catch((error) => console.error('Error fetching class data:', error));
        } else {
            fetchAiMessagesClassData(classId)
                .then((data) => { setClassStats(data); setFilteredClassData(data) })
                .catch((error) => console.error('Error fetching class data:', error));

            fetchQuizzesClassData(classId)
                .then((data) => { setQuizzStats(data); setFilteredQuizzData(data) })
                .catch((error) => console.error('Error fetching class data:', error));
        }
    }, [mode, classId]);

    useEffect(() => {
        if (classStats && class_info?.[index]?.language_info && filteredClassData) {
            const result = filterMessageCount(filteredClassData, class_info[index].language_info);
            setLanguageStats(result);
            const messageCountByDate = filterDate(filteredClassData);
            setMessageCountByDate(messageCountByDate);

        }
    }, [classStats, class_info, filteredClassData]);

    useEffect(() => {
        if(quizzStats && class_info?.[index]?.classmate_info && filteredQuizzData) {
            const { totalQuizzes, answeredQuizzes } = checkAnsweredQuizzes(filteredQuizzData);
            setQuizzAnswered(answeredQuizzes);
            setQuizzNotAnswered(totalQuizzes - answeredQuizzes);

            const correctAnswers = countCorrectQuizzAnswers(filteredQuizzData);
            setCorrectAnswers(correctAnswers);
            setIncorrectAnswers(totalQuizzes * 5 - correctAnswers);

        }
    }, [quizzStats, class_info, filteredQuizzData]);

    //-------------------------------------------------
    // THE FOLLOWING FUNCTIONS FILTER THE MESSAGES DATA
    //-------------------------------------------------

    // Function to filter and count messages by languageId
    const filterMessageCount = (data, languageInfo) => {
        // Create a map of message counts grouped by languageId
        const messageCountMap = data.reduce((acc, curr) => {
            acc[curr.languageId] = (acc[curr.languageId] || 0) + 1;
            return acc;
        }, {});

        // Generate the final array based on language_info
        const result = languageInfo.map((language) => ({
            languageId: language.id,
            languageName: language.name,
            messageCount: messageCountMap[language.id] || 0,
        }));

        return result;
    };

    // Function to filter and count messages by date
    const filterDate = (data) => {
        // Create a map of message counts grouped by date
        const messageCountMap = data.reduce((acc, curr) => {
            const date = new Date(curr.createdAt).toISOString().split("T")[0]; // Format the date as needed
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Convert the map to an array of objects
        const result = Object.entries(messageCountMap).map(([date, count]) => ({
            date,
            count,
        }));

        result.sort((a, b) => new Date(a.date) - new Date(b.date));


        return result;
    }

    //------------------------------------
    // THE FOLLOWING FUNCTIONS FILTER THE QUIZZES DATA
    //------------------------------------

    // Function to check if quizzes are answered
    const checkAnsweredQuizzes = (data) => {
        
        const totalQuizzes = data.length;

        const answeredQuizzes = data.reduce((acc, curr) => {
            if (curr.questions && curr.questions[0]?.isAnswered) {
                acc[curr.quizId] = (acc[curr.quizId] || 0) + 1;
            }
            return acc;
        }
        , {});

        return { totalQuizzes, answeredQuizzes: answeredQuizzes.undefined };
    }

    const countCorrectQuizzAnswers = (data) => {
        let correctAnswers = 0;

        data.forEach((quiz) => {
            if (quiz.correctAnswers) {
                correctAnswers += quiz.correctAnswers
            }
        });
        return correctAnswers;
    }

    //------------------------------------
    // THE FOLLOWING FUNCTION FILTERS ALL THE DATA BY DATE RANGE
    //------------------------------------

    const filterByDateRange = (days, classStats, quizzStats) => {
        // Get today's date and the date `days` prior
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        // Filter the classStats array
        const filteredClassData = classStats.filter((item) => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= startDate;
        });

        // Filter the quizzStats array
        const filteredQuizzData = quizzStats.filter((item) => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= startDate;
        });

        return {filteredClassData, filteredQuizzData};
    };

    const modifyCurrentData = (data) => {
        setFilteredClassData(data.filteredClassData);
        setFilteredQuizzData(data.filteredQuizzData);
    }

    return (
        <div className="h-full">
            <TitleCard >Estadístiques</TitleCard>

            <div>
                <div className='w-[80%] mx-auto'>
                    <ButtonCollection
                        buttons={
                            [
                                { label: "7d", onClick: () => modifyCurrentData(filterByDateRange(7, classStats, quizzStats)) },
                                { label: "30d", onClick: () => modifyCurrentData(filterByDateRange(30, classStats, quizzStats)) },
                                { label: "365d", onClick: () => modifyCurrentData(filterByDateRange(365, classStats, quizzStats)) },
                                { label: "Tots", onClick: () => modifyCurrentData({filteredClassData: classStats, filteredQuizzData: quizzStats}) },
                            ]
                        }
                    />
                </div>
                <br />

                <div className="w-[90%] mx-auto grid grid-cols-2 gap-4 py-4">
                    <div className="w-full mx-auto min-[300px]:max-w-full">
                        <ContentWrapper className="w-full md:w-1/2 lg:w-1/3">
                            {mode === "alumne" ? (
                                <BarGraph
                                    labels={languageStats.map((item) => item.languageName)}
                                    dataValues={languageStats.map((item) => item.messageCount)}
                                    title={"Missatges totals d'aquest alumne"}
                                    legend={"Missatges per llenguatge"}
                                    barColor={"rgba(54, 162, 235, 0.5)"}
                                    borderColor={"rgba(54, 162, 235, 1)"}
                                />
                            ) : (
                                <BarGraph
                                    labels={languageStats.map((item) => item.languageName)}
                                    dataValues={languageStats.map((item) => item.messageCount)}
                                    title={"Missatges totals d'aquesta classe"}
                                    legend={"Missatges per llenguatge"}
                                    barColor={"rgba(54, 162, 235, 0.5)"}
                                    borderColor={"rgba(54, 162, 235, 1)"}
                                />
                            )}
                        </ContentWrapper>
                    </div>
                    <div className="w-full mx-auto min-[300px]:max-w-full">
                        <ContentWrapper className="w-full md:w-1/2 lg:w-1/3">
                            {mode === "alumne" ? (
                                <BarGraph
                                    labels={messageCountByDate.map((item) => item.date)}
                                    dataValues={messageCountByDate.map((item) => item.count)}
                                    title={"Missatges totals d'aquest alumne"}
                                    legend={"Missatges per llenguatge"}
                                    barColor={"rgba(54, 162, 235, 0.5)"}
                                    borderColor={"rgba(54, 162, 235, 1)"}
                                />
                            ) : (
                                <BarGraph
                                    labels={messageCountByDate.map((item) => item.date)}
                                    dataValues={messageCountByDate.map((item) => item.count)}
                                    title={"Missatges totals d'aquesta classe"}
                                    legend={"Missatges per llenguatge"}
                                    barColor={"rgba(54, 162, 235, 0.5)"}
                                    borderColor={"rgba(54, 162, 235, 1)"}
                                />
                            )}
                        </ContentWrapper>
                    </div>

                    <div className="w-full mx-auto min-[300px]:max-w-full">
                        <ContentWrapper className="w-full md:w-1/2 lg:w-1/3">
                            {mode === "alumne" ? (
                                <PieGraph
                                    labels={["Correcte", "Incorrecte"]}
                                    dataValues={[correctAnswers, incorrectAnswers]}
                                    title={"Respostes correctes d'aquest alumne"}
                                    legend={"Nº de respostes"}
                                    barColor={["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"]}
                                    borderColor={["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"]}
                                />
                            ) : (
                                <PieGraph
                                    labels={["Correcte", "Incorrecte"]}
                                    dataValues={[correctAnswers, incorrectAnswers]}
                                    title={"Respostes correctes d'aquesta classe"}
                                    legend={"Nº de respostes"}
                                    barColor={["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"]}
                                    borderColor={["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"]}
                                />
                            )}
                        </ContentWrapper>
                    </div>

                    <div className="w-full mx-auto min-[300px]:max-w-full">
                        <ContentWrapper className="w-full md:w-1/2 lg:w-1/3">
                            {mode === "alumne" ? (
                                <PieGraph
                                    labels={["Contestat", "No contestat"]}
                                    dataValues={[quizzAnswered, quizzNotAnswered]}
                                    title={"Qüestionaris contestats d'aquest alumne"}
                                    legend={"Nº de qüestionaris"}
                                    barColor={["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"]}
                                    borderColor={["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"]}
                                />
                            ) : (
                                <PieGraph
                                    labels={["Contestat", "No contestat"]}
                                    dataValues={[quizzAnswered, quizzNotAnswered]}
                                    title={"Qüestionaris contestats d'aquesta classe"}
                                    legend={"Nº de qüestionaris"}
                                    barColor={["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"]}
                                    borderColor={["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"]}
                                />
                            )}
                        </ContentWrapper>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StatsContent;