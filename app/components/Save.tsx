import "./Save.css";
import Link from "next/link";
import {useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    setClick: React.Dispatch<React.SetStateAction<boolean>>;
    click: boolean;
};

export default function Save({setClick, click} : Props){
    const [active, setActive] = useState<number>(4);
    const preTemps = [72, 37, 0];
    const [temp, setTemp] = useState<number>(0);
    const [customTemp, setCustom] = useState<string>("");
    return(
    <div className="sv-main-box">
        <div className="sv-box-inner">
            <motion.div 
            className="darken" 
            onClick={() => setClick(false)} 
            initial ={{opacity: 0}}
            animate={{opacity: 0.5}}
            exit={{opacity: 0}}
            >

            </motion.div>

            <motion.div 
                className="tmp-box"
                initial={{top: "-100%"}}
                animate={{
                    top: "33%",
                    transition: { duration: 0.4 }
                }}
                exit={{
                    top: "-100%",
                    transition: { duration: 0.7 }
                }}
            >
                <div className="tmp-box-inner">
                    <div className="sv-highlight">
                        <p className="sv-text">Enter The Temperature You Store It In</p>
                    </div>

                    <div className="sv-highlight" style={{height: "60%", marginTop: "4%"}}>
                        <div className="btn-box">
                            <input type="number" className={active !== 3 ? "inp-num" : "inp-num-active"} 
                            onClick={() => setActive(3)} 
                            onChange={(e) => setCustom(e.target.value)
                            }>
                            </input>
                            <button className={active !== 0 ? "tmp-btn" : "tmp-btn-active"} style={{right: "10%"}} onClick={() => setActive(0)}>
                            </button>
                            <button className={active !== 1 ? "tmp-btn" : "tmp-btn-active"} style={{right: "25%"}} onClick={() => setActive(1)}>
                            </button>
                            <button className={active !== 2 ? "tmp-btn" : "tmp-btn-active"} style={{right: "40%"}} onClick={() => setActive(2)}>
                            </button>
                        </div>
                        <button className="sv-final-btn" onClick={() => svDatabase()}>
                            Save to Storage
                        </button>
                    </div>
                </div>
            </motion.div>

        </div>
    </div>
    
);

async function svDatabase(){
    let chosen: number;
    if(active === 3) {
        chosen = Number(customTemp);
    }
    else{
        chosen = preTemps[active];
    }
    setTemp(chosen);
    
    const res = fetch("./api/save", {
        body: JSON.stringify(temp),
        method: "POST"
    })
}
}