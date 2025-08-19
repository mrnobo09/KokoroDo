import React from "react"
import type { Workers } from "../../types/Workers";

const WorkerStatus: React.FC<{ workers: Workers }> = ({ workers }) => {

    console.log("WorkerStatus component rendered with workers:", workers);
    return (
        <div>
            <h2>Worker Status</h2>
            <ul>
                {Object.entries(workers).map(([id, worker]) => (
                    <li key={id}>
                        Host: {worker.host_name}, IP: {worker.ip_address}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkerStatus;