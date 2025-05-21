import React from 'react';
import TitleCard from "../atoms/TitleCard"
import SubtitleCard from "../atoms/SubtitleCard"
import ImageContainer from "../atoms/ImageContainer"

const ImageWithSubtitle = ({subtitleContent, imageSource, imageAlt}) => {
    return (
        <div>
            
                <SubtitleCard>{subtitleContent}</SubtitleCard>

                <ImageContainer src={imageSource} alt={imageAlt} />
            
        </div>
    );
};

export default ImageWithSubtitle;
