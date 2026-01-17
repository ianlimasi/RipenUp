import "./Save.css";
import Link from "next/link";
import {useState} from "react";

export default function Save(){
    const [click, setClick] = useState<boolean>(false);
    return(
    <div className="sv-main-box">
        <div className="sv-box-inner">
            <div className="tmp-box" style={{transform: click ? "translateY(109%)" : "translateY(0%)"}}>
                <div className="tmp-box-inner">
                    <p className="sv-text">Enter The Temperature You Store It In</p>
                    <input type="number" className="inp-num">
                    </input>
                    <button className="circle" style={{right: "10%"}}>

                    </button>
                    <button className="circle" style={{right: "25%"}}>

                    </button>
                    <button className="circle" style={{right: "40%"}}>

                    </button>
                    <button className="sv-final-btn">
                        Save to Storage
                    </button>
                </div>
            </div>
            <div className="sv-box">
                <button className="sv-btn" onClick={(e) => setClick(!click)}>
                </button>
            </div>
        </div>
    </div>
    
);
}