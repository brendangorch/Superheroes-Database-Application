import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRef } from "react";

const CreateRequestForm = ({verificationToken}) => {
    // state to manage the selected value (request, dispute, notice), and status
    const [selectedType, setSelectedType] = useState("requests");
    const [selectedStatus, setSelectedStatus] = useState("status");

    // define refs for input
    const dateRef = useRef();
    const notesRef = useRef();

    // function to handle select change for type
    const onTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    // function to handle select change for status
    const onStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };
 
    // function when create is clicked
    const onCreateClick = async () => {
        // get values of refs
        const date = dateRef.current.value;
        const notes = notesRef.current.value;

        // make sure date and notes are entered
        if (date && notes) {
            try {
                // call the backend function to create a dcma request
                const res = await axios.post('/api/admin/logdcmarequest', {
                    adminToken: verificationToken,
                    type: selectedType,
                    dateReceived: date,
                    notes: notes,
                    status: selectedStatus
                });

                alert(res.data.message);
            } catch (error) {
                console.log("Error:", error)
            }
        } else {
            alert("Please fill in all fields.");
        }
    }


    return (
        <div>
            <label><b>Select a Type:</b></label>
            <select className="select" value={selectedType} onChange={onTypeChange}>
                <option value="Request">Request</option>
                <option value="Dispute">Dispute</option>
                <option value="Notice">Notice</option>
            </select>
            <label><b>Enter Date Received:</b></label>
            <input ref={dateRef} type="text"></input>
            <label><b>Enter Notes:</b></label>
            <input ref={notesRef} type="text"></input>
            <label><b>Select Status:</b></label>
            <select className="select" value={selectedStatus} onChange={onStatusChange}>
                <option value="Active">Active</option>
                <option value="Processed">Processed</option>
                
            </select>
            <div>
                <button className="button" onClick={onCreateClick}>Create</button>
            </div>
            
            
        </div>
    )
}

export default CreateRequestForm;