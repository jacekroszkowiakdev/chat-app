import { PublicUser } from "../../../types/types";
import React from "react";

interface DisplayParticipantsProps {
    participants: PublicUser[];
}

const DisplayParticipants: React.FC<DisplayParticipantsProps> = ({
    participants,
}) => {
    if (!participants || participants.length === 0) {
        return <div>No participants yet.</div>;
    }

    return (
        <div>
            <ul>
                {participants.map((participant: PublicUser) => (
                    <li key={participant.id}>{participant.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default DisplayParticipants;
