import React, { useState, useEffect } from "react";
import WorkerStatus from "../components/Workers/WorkerStatus";
import type { Workers } from "../types/Workers";


const Workers: React.FC = () => {

    // State to hold worker data
    const [workers, setWorkers] = useState<Workers>({});




    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/get_workers");
        ws.onopen = () => {
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setWorkers(data);
            console.log("Received workers data:", data);
            
        }
        ws.onclose = () => {
            console.log("WebSocket connection closed");
        }
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        }
    },[]);





  return (
    <div>
        <WorkerStatus workers={workers}/>
    </div>
  );
}


export default Workers;