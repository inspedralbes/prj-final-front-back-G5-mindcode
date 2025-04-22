import React, { use } from 'react';
import TitleCard from "../atoms/TitleCard";
import BarGraph from '../atoms/BarGraph';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { fetchAiMessagesClassData } from '../../../services/communicationManager';




const StatsContent = ({ classId }) => {
    
    const [classStats, setClassStats] = useState([]);
    const [languageStats, setLanguageStats] = useState([]);

    const class_info = useAuthStore((state) => state.class_info);

    useEffect(() => {
        fetchAiMessagesClassData(classId) // CHANGE WHEN MULTIPLE CLASSES
            .then((data) => setClassStats(data))
            .catch((error) => console.error('Error fetching class data:', error));
    }, []);

    useEffect(() => {
        if (classStats.length > 0 && class_info?.[0]?.language_info) {
            const result = filterMessageCount(classStats, class_info[0].language_info);
            setLanguageStats(result);
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

    return (
        <div className="">
            <TitleCard >Statistics Overview</TitleCard>
            <div className='w-full max-w-[80%] mx-auto'>
                {/* <ImageWithSubtitle
                    subtitleContent="AI use for all 2DAM"
                    imageSource="/booboo.png"
                    imageAlt="Placeholder Image"

                /> */}
                <BarGraph rawData={languageStats} title={"Missatges totals d'aquesta classe"} legend={"Missatges per llenguatge"} barColor={"rgba(54, 162, 235, 0.5)"} borderColor={'rgba(54, 162, 235, 1)'} />
            </div>
        </div>
    );
};

export default StatsContent;