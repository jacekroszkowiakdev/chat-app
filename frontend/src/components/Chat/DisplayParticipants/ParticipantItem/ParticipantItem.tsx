import "./ParticipantItem.css";
import React from "react";
import { PublicUser } from "../../../../types/types";

interface ParticipantItemProps {
    participant: PublicUser;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({ participant }) => {
    return (
        <li className="participant-item">
            <p>{participant.name}</p>
        </li>
    );
};

export default ParticipantItem;
