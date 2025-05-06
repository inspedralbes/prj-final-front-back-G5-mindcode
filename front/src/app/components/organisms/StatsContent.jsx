import React, { use } from 'react';
import TitleCard from "../atoms/TitleCard";
import BarGraph from '../atoms/BarGraph';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { fetchAiMessagesClassData, fetchAiMessagesStudentData } from '../../../services/communicationManager';
import { fetchQuizzesClassData, fetchQuizzesStudentData } from '../../../services/communicationManager';
import ButtonCollection from '../molecules/ButtonCollection';
import ContentWrapper from '../atoms/ContentWrapper';



const StatsContent = ({ classId, classPosition, mode }) => {

    const [classStats, setClassStats] = useState([]);
    const [filteredClassData, setFilteredClassData] = useState([]);
    const [quizzStats, setQuizzStats] = useState([]);
    const [filteredQuizzData, setFilteredQuizzData] = useState([]);
    const [languageStats, setLanguageStats] = useState([]);
    const [messageCountByDate, setMessageCountByDate] = useState([]);
    
    const class_info = useAuthStore((state) => state.class_info);

    useEffect(() => {
        if (mode === "alumne") {
            fetchAiMessagesStudentData(classId) // CHANGE WHEN MULTIPLE CLASSES
                .then((data) => { setClassStats(data); setFilteredClassData(data) })
                .catch((error) => console.error('Error fetching class data:', error));

            fetchQuizzesStudentData(classId) // CHANGE WHEN MULTIPLE CLASSES
                .then((data) => { setQuizzStats(data); setFilteredQuizzData(data) })
                .catch((error) => console.error('Error fetching class data:', error));
        } else {
            fetchAiMessagesClassData(classId) // CHANGE WHEN MULTIPLE CLASSES
                .then((data) => { setClassStats(data); setFilteredClassData(data) })
                .catch((error) => console.error('Error fetching class data:', error));

            fetchQuizzesClassData(classId) // CHANGE WHEN MULTIPLE CLASSES
                .then((data) => { setQuizzStats(data); setFilteredQuizzData(data) })
                .catch((error) => console.error('Error fetching class data:', error));
        }
    }, [mode, classId]);

    useEffect(() => {
        if (classStats && class_info?.[0]?.language_info && filteredClassData) {
            const result = filterMessageCount(filteredClassData, class_info[0].language_info);
            setLanguageStats(result);
            const messageCountByDate = filterDate(filteredClassData);
            setMessageCountByDate(messageCountByDate);

        }
    }, [classStats, class_info, filteredClassData]);

    useEffect(() => {
        if(quizzStats && class_info?.[0]?.classmate_info && filteredQuizzData) {
            const result = filterQuizzCount(filteredQuizzData, class_info[0].classmate_info);
            setFilteredQuizzData(result);
        }
    }, []);


    const filterMessageCount = (data, languageInfo) => {
        // Create a map of message counts grouped by userId
        const messageCountMap = data.reduce((acc, curr) => {
            acc[curr.userId] = (acc[curr.userId] || 0) + 1;
            return acc;
        }, {});

        // Generate the final array based on language_info
        const result = languageInfo.map((language) => ({
            userId: language.id,
            languageName: language.name,
            messageCount: messageCountMap[language.id] || 0,
        }));

        // console.log(result);
        return result;
    };

    const filterQuizzCount = (data, languageInfo) => {
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

        // console.log(result);
        return result;
    };

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


        // console.log("Date results: ", result);
        return result;
    }

    const filterByDateRange = (days, classStats) => {
        // Get today's date and the date `days` prior
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        // Filter the classStats array
        const filteredClassData = classStats.filter((item) => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= startDate;
        });

        return filteredClassData;
    };

    return (
        <div className="h-full">
            <TitleCard >Estadístiques</TitleCard>

            <div>
                <div className='w-full max-w-[80%] mx-auto'>
                    <ButtonCollection
                        buttons={
                            [
                                { label: "7d", onClick: () => setFilteredClassData(filterByDateRange(7, classStats)) },
                                { label: "30d", onClick: () => setFilteredClassData(filterByDateRange(30, classStats)) },
                                { label: "365d", onClick: () => setFilteredClassData(filterByDateRange(365, classStats)) },
                                { label: "Tots", onClick: () => setFilteredClassData(classStats) },
                            ]
                        }
                    />
                </div>
                <br />

                <div className="flex flex-row flex-wrap gap-4 min-[300px]:flex-col py-4">
                    <div className="w-full max-w-[80%] mx-auto min-[300px]:max-w-full">
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
                    <div className="w-full max-w-[80%] mx-auto min-[300px]:max-w-full">
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

                    <div className="w-full max-w-[80%] mx-auto min-[300px]:max-w-full">
                        <ContentWrapper className="w-full md:w-1/2 lg:w-1/3">
                            {mode === "alumne" ? (
                                <BarGraph
                                    labels={filteredQuizzData.map((item) => item.date)}
                                    dataValues={filteredQuizzData.map((item) => item.count)}
                                    title={"Quizz totals d'aquest alumne"}
                                    legend={"Nº de quizz totals"}
                                    barColor={"rgba(54, 162, 235, 0.5)"}
                                    borderColor={"rgba(54, 162, 235, 1)"}
                                />
                            ) : (
                                <BarGraph
                                    labels={filteredQuizzData.map((item) => item.date)}
                                    dataValues={filteredQuizzData.map((item) => item.count)}
                                    title={"Quizz totals d'aquesta classe"}
                                    legend={"Nº de quizz totals"}
                                    barColor={"rgba(54, 162, 235, 0.5)"}
                                    borderColor={"rgba(54, 162, 235, 1)"}
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