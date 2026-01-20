"use client";

import "./home.css"
import {useState, useRef} from "react";
import RipeBar from "./components/RipeBar";
import Header from "./components/Header";
import Save from "./components/Save";

import { motion, AnimatePresence } from "framer-motion";

interface GeminiResponse {
    predicted_ripeness: number;
    confidence: number;
    note: string;
}

export default function Home() {
    //File obj has name, size, type, and last modified
    const [img, setImg] = useState<File | null>(null);
    const [res, setRes] = useState<GeminiResponse | null>({predicted_ripeness: 45, confidence: 80, note: "The mango shows a mix of green, yellow, and red. While the red blush is present, a significant portion is still green, suggesting it is in the process of ripening but not yet fully ripe. Visual ripeness alone can be unreliable for mangoes; a truly ripe mango will often be soft to the touch and have a sweet, fruity aroma, which cannot be determined from an image."});
    const [click, setClick] = useState<boolean>(false);

    //useRef stores a reference to a DOM node or js mutable value
    const inpRef = useRef<HTMLInputElement | null>(null);
    return (
        <div className="screen">
            <div className="main-box">
                <div className="main-box-inner">
                    <div className="img-box">
                        { img && <img src={URL.createObjectURL(img)} className="img"></img>}
                    </div>
                    <input
                        className="inp"
                        type="file"
                        accept="image/*"
                        onChange = {(e)=>setImg(e.target.files ? e.target.files[0] : null)}
                    ></input>
                    <button className="submit" onClick = {(e) => {upload()}}>
                        Submit
                    </button>

                    <div className="sv-box">
                        <button className="sv-btn" onClick={(e) => setClick(!click)}>
                        </button>
                    </div>

                    <div className="scnd-main-box">
                        {res && <RipeBar num={res.predicted_ripeness}/>}
                        {res && <div className="res-box">
                            <p><strong>Predicted Ripeness:</strong> {res.predicted_ripeness}</p>
                            <p><strong>Confidence:</strong> {res.confidence}%</p>
                            <p><strong>Note:</strong> {res.note}</p>
                        </div>}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {click && <Save setClick={setClick} click={click}/>}
            </AnimatePresence>
            
        </div>
    )

    async function upload() {
        if(!img){
            return;
        }
        const formImg = new FormData();
        formImg.append("img", img);

        const res = await fetch("api/upload", {
            body: formImg,
            method: "POST",
        })

        const data = await res.json();
        console.log(data);

        const parsed = parseSummary(data.summary)
        setRes(parsed)
    }
}

function parseSummary(summary: string) {
    try {
      // Remove the backticks and optional "json"
      const cleaned = summary.replace(/```json\s*|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse summary:", err);
      return null;
    }
  }
  