import React, { use } from 'react';
import TitleCard from "../atoms/TitleCard";
import BarGraph from '../atoms/BarGraph';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { fetchAiMessagesClassData, fetchAiMessagesStudentData } from '../../../services/communicationManager';




const StatsContent = ({ classId, mode }) => {

    const [classStats, setClassStats] = useState([]);
    const [languageStats, setLanguageStats] = useState([]);
    const [messageCountByDate, setMessageCountByDate] = useState([]);

    const class_info = useAuthStore((state) => state.class_info);

    useEffect(() => {
        if (mode === "alumne") {
            fetchAiMessagesStudentData(classId) // CHANGE WHEN MULTIPLE CLASSES
                .then((data) => setClassStats(data))
                .catch((error) => console.error('Error fetching class data:', error));
        } else {
            fetchAiMessagesClassData(classId) // CHANGE WHEN MULTIPLE CLASSES
                .then((data) => setClassStats(data))
                .catch((error) => console.error('Error fetching class data:', error));
        }
    }, [mode, classId]);

    useEffect(() => {
        if (classStats && class_info?.[0]?.language_info) {
            const result = filterMessageCount(classStats, class_info[0].language_info);
            setLanguageStats(result);
            const messageCountByDate = filterDate(classStats);
            setMessageCountByDate(messageCountByDate);

        }
    }, [classStats, class_info]);


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

        console.log(result);
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

        console.log("Date results: ", result);
        return result;
    }

    return (
        <div className="">
            <TitleCard >Estadístiques</TitleCard>
            <div className='w-full max-w-[80%] mx-auto'>
                {mode === "alumne" ? 
                <BarGraph 
                labels={languageStats.map(item => item.languageName)}
                dataValues={languageStats.map(item => item.messageCount)} 
                title={"Missatges totals d'aquest alumne"} 
                legend={"Missatges per llenguatge"}
                barColor={"rgba(54, 162, 235, 0.5)"}
                borderColor={'rgba(54, 162, 235, 1)'} /> 
                : 
                <BarGraph 
                labels={languageStats.map(item => item.languageName)}
                dataValues={languageStats.map(item => item.messageCount)} 
                title={"Missatges totals d'aquesta classe"} 
                legend={"Missatges per llenguatge"} 
                barColor={"rgba(54, 162, 235, 0.5)"} 
                borderColor={'rgba(54, 162, 235, 1)'} />
                }
                
            </div>
            <div className='w-full max-w-[80%] mx-auto'>
                {mode === "alumne" ? 
                <BarGraph 
                labels={messageCountByDate.map(item => item.date)}
                dataValues={messageCountByDate.map(item => item.count)}  
                title={"Missatges totals d'aquest alumne"} 
                legend={"Missatges per llenguatge"}
                barColor={"rgba(54, 162, 235, 0.5)"}
                borderColor={'rgba(54, 162, 235, 1)'} /> 
                : 
                <BarGraph 
                labels={messageCountByDate.map(item => item.date)}
                dataValues={messageCountByDate.map(item => item.count)}   
                title={"Missatges totals d'aquesta classe"} 
                legend={"Missatges per llenguatge"} 
                barColor={"rgba(54, 162, 235, 0.5)"} 
                borderColor={'rgba(54, 162, 235, 1)'} />
                }
                </div>
        </div>
    );
};

export default StatsContent;