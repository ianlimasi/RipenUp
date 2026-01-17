import "./Header.css";
import Link from "next/link";

export default function Header(){
    return (
        <div className="hd-box">
            <div className="hd-box-inner">
                <Link href="../Storage" className="strg-btn">
                </Link>
                <Link href="/" className="hm-btn">
                </Link>
            </div>
        </div>
    );
}