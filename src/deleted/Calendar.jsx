import React, { useState } from "react";
import { Calendar } from "ui-io-solutions";

const Playground = () => {
    const [value, setValue] = useState(null);

    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "var(--background2)",
    };

    return (
        <>
            <div style={style}>
                <Calendar
                    min={"1950-01-01"}
                    max={new Date().getFullYear() + 1 + "-01-01"}
                    value={value}
                    onChange={setValue}
                />
            </div>
            <div>
                <b>Value</b>: {JSON.stringify(value)}
            </div>
        </>
    );
};

export default Playground;