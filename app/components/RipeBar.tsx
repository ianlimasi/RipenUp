import "./RipeBar.css"

type Props = {
    num: number
}
export default function RipeBar({num = 0} : Props) {
    return (
        <div className= "ripe-box">
            <div className="bar-box">
                <div className = "bar">
                </div>
                <div className = "mark" style={{left: `${num}%`}}>
                </div>
            </div>
        </div>
    );
}