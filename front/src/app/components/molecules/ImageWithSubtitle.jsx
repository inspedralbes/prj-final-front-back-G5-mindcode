import React from 'react';
import TitleCard from "../atoms/TitleCard"
import SubtitleCard from "../atoms/SubtitleCard"
import ImageContainer from "../atoms/ImageContainer"

const ImageWithSubtitle = () => {
  return (
    <div>
      <TitleCard>Estadístiques de classe</TitleCard>
      <SubtitleCard>Gràfic general d'us a la classe 2DAM</SubtitleCard>
      
      <ImageContainer src="/booboo.png" />
    </div>
  );
};

export default ImageWithSubtitle;
