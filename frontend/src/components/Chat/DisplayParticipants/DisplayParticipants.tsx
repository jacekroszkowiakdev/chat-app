import "./DisplayParticipants.css";
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
        <div className="display-participants-wrapper">
            <div className="display-participants">
                <ul className="participants-list">
                    {participants.map((participant: PublicUser) => (
                        <li className="participant-item" key={participant.id}>
                            <p>{participant.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DisplayParticipants;
