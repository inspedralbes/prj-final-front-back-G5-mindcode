import React from 'react';
import TitleCard from "../atoms/TitleCard";
import ImageWithSubtitle from '../molecules/ImageWithSubtitle';

const StatsContent = () => {
    return (
        <div className="">
            <TitleCard >Statistics Overview</TitleCard>
            <div className='w-full max-w-[80%] mx-auto'>
                <ImageWithSubtitle
                    subtitleContent="AI use for all 2DAM"
                    imageSource="/booboo.png"
                    imageAlt="Placeholder Image"

                />
            </div>
        </div>
    );
};

export default StatsContent;