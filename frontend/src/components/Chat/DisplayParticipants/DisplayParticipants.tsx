import "./DisplayParticipants.css";
import { PublicUser } from "../../../types/types";
import ParticipantItem from "./ParticipantItem/ParticipantItem";
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
                        <ParticipantItem
                            key={participant.id}
                            participant={participant}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DisplayParticipants;
