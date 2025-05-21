import React from 'react';
import BigButtonCollection from '../molecules/BigButtonCollection.jsx';
import TitleCard from '../atoms/TitleCard.jsx';


const EditRestrictions = ({ buttons, lang }) => {
    return (
        <div className="h-full">
            <TitleCard >Editar Restriccions per al llenguatge</TitleCard>
            <BigButtonCollection buttons={buttons} />
        </div>
    );
};

export default EditRestrictions;